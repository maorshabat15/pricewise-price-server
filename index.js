import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;
let productsCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('pricewise');
    productsCollection = db.collection('products');
    console.log('Connected successfully to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}
connectDB();

// ---------------------------------------------------------------------------
// The scrapers write documents in more than one shape:
//   import_to_mongo.py -> { itemCode, itemName, chain, price }
//   stream_to_mongo.py -> { ItemCode, ItemName, ItemPrice, SourceFile }
// Older code searched only `name`, which none of them have, so every search
// came back empty. These helpers read all known shapes.
// ---------------------------------------------------------------------------

// Chain detection: by name/alias (folder or `chain` field) or by the chain's
// official GS1 code, which appears in the gov price file names (SourceFile).
const CHAINS = [
  { key: 'shufersal', label: 'שופרסל', codes: ['7290027600007'], aliases: ['SHUFERSAL', 'שופרסל'] },
  { key: 'ramiLevy', label: 'רמי לוי', codes: ['7290058140886'], aliases: ['RAMI_LEVY', 'RAMILEVY', 'רמי לוי'] },
  { key: 'yohananof', label: 'יוחננוף', codes: ['7290803800003'], aliases: ['YOHANANOF', 'יוחננוף'] },
  { key: 'victory', label: 'ויקטורי', codes: ['7290696200003'], aliases: ['VICTORY', 'ויקטורי'] },
  { key: 'osherAd', label: 'אושר עד', codes: ['7290055700007'], aliases: ['OSHER_AD', 'OSHERAD', 'אושר עד'] },
  { key: 'carrefour', label: 'קרפור', codes: ['7290058179886'], aliases: ['YAYNO_BITAN_AND_CARREFOUR', 'CARREFOUR', 'YAYNO_BITAN', 'קרפור', 'יינות ביתן'] },
];

const normalize = (s) => String(s || '').toUpperCase().replace(/[\s_\-]+/g, '');

function detectChain(doc) {
  const candidates = [doc.chain, doc.Chain, doc.chainName, doc.supermarketName].filter(Boolean);
  for (const c of candidates) {
    const n = normalize(c);
    const hit = CHAINS.find((ch) => ch.aliases.some((a) => normalize(a) === n || n.includes(normalize(a))));
    if (hit) return hit;
  }
  const file = String(doc.SourceFile || doc.sourceFile || '');
  if (file) {
    const hit = CHAINS.find((ch) => ch.codes.some((code) => file.includes(code)));
    if (hit) return hit;
  }
  return null;
}

const readName = (d) => d.name || d.itemName || d.ItemName || '';
const readCode = (d) => d.barcode || d.itemCode || d.ItemCode || '';
const readPrice = (d) => {
  const p = Number(d.price ?? d.ItemPrice ?? d.itemPrice);
  return Number.isFinite(p) && p > 0 ? p : null;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

app.get('/', (req, res) => {
  res.send('PriceWise Supermarket API with MongoDB is running!');
});

app.get('/api/prices', async (req, res) => {
  const item = req.query.item;
  if (!item) {
    return res.status(400).json({ success: false, error: 'חסר שם מוצר לחיפוש (item)' });
  }
  if (!productsCollection) {
    return res.status(503).json({ success: false, error: 'אין חיבור למסד הנתונים' });
  }

  const query = String(item).trim();
  const re = { $regex: escapeRegex(query), $options: 'i' };
  console.log(`Searching MongoDB for: ${query}`);

  try {
    const docs = await productsCollection
      .find({ $or: [{ name: re }, { itemName: re }, { ItemName: re }] })
      .limit(300)
      .toArray();

    // Group identical products (same barcode, else same name) across chains,
    // keeping the lowest price per chain.
    const groups = new Map();
    for (const d of docs) {
      const name = readName(d).trim();
      const price = readPrice(d);
      const chain = detectChain(d);
      if (!name || price === null || !chain) continue;

      const code = readCode(d);
      const groupKey = code || name;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { name, barcode: code || undefined, byChain: {} });
      }
      const g = groups.get(groupKey);
      const prev = g.byChain[chain.key];
      if (!prev || price < prev.price) {
        g.byChain[chain.key] = { chain: chain.label, chainKey: chain.key, price };
      }
    }

    const products = [...groups.values()]
      .map((g) => ({
        name: g.name,
        barcode: g.barcode,
        isEstimated: false,
        prices: Object.values(g.byChain),
      }))
      // Most chains first, then shortest (closest) name
      .sort((a, b) => b.prices.length - a.prices.length || a.name.length - b.name.length)
      .slice(0, 10);

    if (products.length > 0) {
      return res.json({ success: true, query: item, count: products.length, products });
    }

    return res.json({
      success: true,
      query: item,
      count: 0,
      products: [],
      isEstimated: true,
      note: 'לא נמצאו מחירים אמיתיים למוצר זה',
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: 'שגיאה בשליפת נתונים מ-MongoDB' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
