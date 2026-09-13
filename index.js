import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();
app.use(cors());

// נתיב בדיקת בריאות לשרת
app.get('/', (req, res) => {
  res.send('PriceWise Supermarket API is running!');
});

// נתיב שליפת מחירי סופרים
app.get('/api/prices', (req, res) => {
  const item = req.query.item;
  if (!item) {
    return res.status(400).json({ success: false, error: 'חסר שם מוצר לחיפוש (item)' });
  }

  const cleanItem = String(item).replace(/"/g, '');
  console.log(`Searching prices for: ${cleanItem}`);

  exec(`npx -y @skills-il/supermarket-prices-mcp --search "${cleanItem}"`, { timeout: 25000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('MCP execution error:', error.message);
      return res.status(500).json({ success: false, error: 'שגיאה בשליפת המחירים מה-MCP', details: error.message });
    }

    try {
      const data = JSON.parse(stdout);
      return res.json({ success: true, item: cleanItem, prices: data });
    } catch {
      return res.json({ success: true, item: cleanItem, rawOutput: stdout });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
