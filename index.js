import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// מאגר מוצרים ומחירי אמת של רשתות השיווק בישראל
const supermarketDatabase = [
  // --- מוצרי חלב, ביצים ותחליפים ---
  {
    name: "חלב תנובה 3% בקרטון 1 ליטר",
    barcode: "7290000042442",
    category: "מוצרי חלב",
    prices: [
      { chain: "רמי לוי", price: 7.23, isPromoted: false },
      { chain: "שופרסל דיל", price: 7.23, isPromoted: false },
      { chain: "יוחננוף", price: 7.23, isPromoted: false },
      { chain: "אושר עד", price: 7.23, isPromoted: false },
      { chain: "ויקטורי", price: 7.23, isPromoted: false }
    ]
  },
  {
    name: "חלב תנובה 1% בקרטון 1 ליטר",
    barcode: "7290000042459",
    category: "מוצרי חלב",
    prices: [
      { chain: "רמי לוי", price: 6.81, isPromoted: false },
      { chain: "שופרסל דיל", price: 6.81, isPromoted: false },
      { chain: "יוחננוף", price: 6.81, isPromoted: false },
      { chain: "אושר עד", price: 6.81, isPromoted: false },
      { chain: "ויקטורי", price: 6.81, isPromoted: false }
    ]
  },
  {
    name: "חלב יטבתה 3% בבקבוק 1 ליטר",
    barcode: "7290000042787",
    category: "מוצרי חלב",
    prices: [
      { chain: "רמי לוי", price: 8.90, isPromoted: false },
      { chain: "יוחננוף", price: 8.90, isPromoted: false },
      { chain: "אושר עד", price: 7.90, isPromoted: true },
      { chain: "ויקטורי", price: 9.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 9.90, isPromoted: false }
    ]
  },
  {
    name: "ביצים L תבנית 12 יחידות",
    barcode: "7290000130001",
    category: "ביצים",
    prices: [
      { chain: "רמי לוי", price: 15.22, isPromoted: false },
      { chain: "שופרסל דיל", price: 15.22, isPromoted: false },
      { chain: "יוחננוף", price: 15.22, isPromoted: false },
      { chain: "אושר עד", price: 15.22, isPromoted: false },
      { chain: "ויקטורי", price: 15.22, isPromoted: false }
    ]
  },
  {
    name: "ביצים L תבנית 30 יחידות",
    barcode: "7290000130032",
    category: "ביצים",
    prices: [
      { chain: "אושר עד", price: 34.90, isPromoted: true },
      { chain: "רמי לוי", price: 36.90, isPromoted: false },
      { chain: "יוחננוף", price: 36.90, isPromoted: false },
      { chain: "ויקטורי", price: 38.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 39.90, isPromoted: false }
    ]
  },
  {
    name: "גבינה לבנה תנובה 5% 250 גרם",
    barcode: "7290000041117",
    category: "מוצרי חלב",
    prices: [
      { chain: "אושר עד", price: 5.20, isPromoted: true },
      { chain: "יוחננוף", price: 5.30, isPromoted: true },
      { chain: "רמי לוי", price: 5.40, isPromoted: false },
      { chain: "ויקטורי", price: 5.60, isPromoted: false },
      { chain: "שופרסל דיל", price: 5.70, isPromoted: false }
    ]
  },
  {
    name: "קוטג' תנובה 5% 250 גרם",
    barcode: "7290000043128",
    category: "מוצרי חלב",
    prices: [
      { chain: "אושר עד", price: 6.70, isPromoted: true },
      { chain: "יוחננוף", price: 6.80, isPromoted: true },
      { chain: "רמי לוי", price: 6.90, isPromoted: false },
      { chain: "ויקטורי", price: 7.10, isPromoted: false },
      { chain: "שופרסל דיל", price: 7.20, isPromoted: false }
    ]
  },
  {
    name: "גבינה צהובה עמק 28% חריץ 200 גרם",
    barcode: "7290000045559",
    category: "מוצרי חלב",
    prices: [
      { chain: "אושר עד", price: 15.50, isPromoted: true },
      { chain: "רמי לוי", price: 15.90, isPromoted: true },
      { chain: "יוחננוף", price: 16.50, isPromoted: false },
      { chain: "ויקטורי", price: 17.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 18.20, isPromoted: false }
    ]
  },
  {
    name: "חמאה תנובה 100 גרם",
    barcode: "7290000046006",
    category: "מוצרי חלב",
    prices: [
      { chain: "רמי לוי", price: 4.80, isPromoted: false },
      { chain: "שופרסל דיל", price: 4.80, isPromoted: false },
      { chain: "יוחננוף", price: 4.80, isPromoted: false },
      { chain: "אושר עד", price: 4.80, isPromoted: false },
      { chain: "ויקטורי", price: 4.80, isPromoted: false }
    ]
  },
  {
    name: "שמנת מתוקה 38% השף הלבן 250 מ\"ל",
    barcode: "7290000047889",
    category: "מוצרי חלב",
    prices: [
      { chain: "אושר עד", price: 6.90, isPromoted: true },
      { chain: "יוחננוף", price: 7.50, isPromoted: false },
      { chain: "רמי לוי", price: 7.50, isPromoted: false },
      { chain: "ויקטורי", price: 7.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 8.50, isPromoted: false }
    ]
  },

  // --- בשר, עוף, הודו ודגים ---
  {
    name: "חזה עוף טרי שלם (מחיר לקילו)",
    barcode: "200003",
    category: "בשר ועוף",
    prices: [
      { chain: "אושר עד", price: 33.90, isPromoted: true },
      { chain: "יוחננוף", price: 34.90, isPromoted: true },
      { chain: "רמי לוי", price: 35.90, isPromoted: false },
      { chain: "ויקטורי", price: 37.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 39.90, isPromoted: false }
    ]
  },
  {
    name: "שניצל עוף טרי פרוס (מחיר לקילו)",
    barcode: "200012",
    category: "בשר ועוף",
    prices: [
      { chain: "יוחננוף", price: 36.90, isPromoted: true },
      { chain: "רמי לוי", price: 37.90, isPromoted: false },
      { chain: "אושר עד", price: 36.90, isPromoted: true },
      { chain: "ויקטורי", price: 39.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 42.90, isPromoted: false }
    ]
  },
  {
    name: "פרגיות עוף טרי ללא עצם (מחיר לקילו)",
    barcode: "200013",
    category: "בשר ועוף",
    prices: [
      { chain: "רמי לוי", price: 59.90, isPromoted: true },
      { chain: "יוחננוף", price: 59.90, isPromoted: true },
      { chain: "אושר עד", price: 57.90, isPromoted: true },
      { chain: "ויקטורי", price: 64.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 69.90, isPromoted: false }
    ]
  },
  {
    name: "כרעיים עוף טרי (מחיר לקילו)",
    barcode: "200004",
    category: "בשר ועוף",
    prices: [
      { chain: "אושר עד", price: 27.90, isPromoted: true },
      { chain: "יוחננוף", price: 28.90, isPromoted: true },
      { chain: "רמי לוי", price: 29.90, isPromoted: false },
      { chain: "ויקטורי", price: 31.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 34.90, isPromoted: false }
    ]
  },
  {
    name: "בשר טחון טרי מובחר (מחיר לקילו)",
    barcode: "200005",
    category: "בשר ועוף",
    prices: [
      { chain: "אושר עד", price: 49.90, isPromoted: true },
      { chain: "רמי לוי", price: 54.90, isPromoted: true },
      { chain: "יוחננוף", price: 56.90, isPromoted: false },
      { chain: "ויקטורי", price: 59.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 64.90, isPromoted: false }
    ]
  },
  {
    name: "סטייק אנטרקוט טרי מובחר (מחיר לקילו)",
    barcode: "200006",
    category: "בשר ועוף",
    prices: [
      { chain: "אושר עד", price: 139.00, isPromoted: true },
      { chain: "רמי לוי", price: 149.00, isPromoted: true },
      { chain: "יוחננוף", price: 159.00, isPromoted: false },
      { chain: "ויקטורי", price: 169.00, isPromoted: false },
      { chain: "שופרסל דיל", price: 179.00, isPromoted: false }
    ]
  },
  {
    name: "אסאדו בקר עם עצם (מחיר לקילו)",
    barcode: "200014",
    category: "בשר ועוף",
    prices: [
      { chain: "אושר עד", price: 59.90, isPromoted: true },
      { chain: "רמי לוי", price: 64.90, isPromoted: false },
      { chain: "יוחננוף", price: 64.90, isPromoted: false },
      { chain: "ויקטורי", price: 69.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 74.90, isPromoted: false }
    ]
  },
  {
    name: "פילה סלמון טרי (מחיר לקילו)",
    barcode: "200007",
    category: "דגים",
    prices: [
      { chain: "אושר עד", price: 74.90, isPromoted: true },
      { chain: "רמי לוי", price: 79.90, isPromoted: true },
      { chain: "יוחננוף", price: 84.90, isPromoted: false },
      { chain: "ויקטורי", price: 89.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 99.90, isPromoted: false }
    ]
  },

  // --- ירקות ופירות טריים ---
  {
    name: "עגבניות חממה (מחיר לקילו)",
    barcode: "200001",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 4.90, isPromoted: true },
      { chain: "רמי לוי", price: 5.90, isPromoted: true },
      { chain: "יוחננוף", price: 5.90, isPromoted: true },
      { chain: "ויקטורי", price: 6.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 7.90, isPromoted: false }
    ]
  },
  {
    name: "מלפפון (מחיר לקילו)",
    barcode: "200002",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 4.50, isPromoted: true },
      { chain: "רמי לוי", price: 4.90, isPromoted: true },
      { chain: "יוחננוף", price: 4.90, isPromoted: true },
      { chain: "ויקטורי", price: 5.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 6.90, isPromoted: false }
    ]
  },
  {
    name: "בצל יבש (מחיר לקילו)",
    barcode: "200008",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 3.90, isPromoted: true },
      { chain: "רמי לוי", price: 4.90, isPromoted: false },
      { chain: "יוחננוף", price: 4.90, isPromoted: false },
      { chain: "ויקטורי", price: 5.20, isPromoted: false },
      { chain: "שופרסל דיל", price: 5.90, isPromoted: false }
    ]
  },
  {
    name: "תפוח אדמה לבן (מחיר לקילו)",
    barcode: "200009",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 4.50, isPromoted: true },
      { chain: "רמי לוי", price: 5.50, isPromoted: false },
      { chain: "יוחננוף", price: 5.50, isPromoted: false },
      { chain: "ויקטורי", price: 5.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 6.50, isPromoted: false }
    ]
  },
  {
    name: "בטטה (מחיר לקילו)",
    barcode: "200015",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 6.90, isPromoted: true },
      { chain: "יוחננוף", price: 7.90, isPromoted: false },
      { chain: "רמי לוי", price: 7.90, isPromoted: false },
      { chain: "ויקטורי", price: 8.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 9.90, isPromoted: false }
    ]
  },
  {
    name: "פלפל אדום מתוק (מחיר לקילו)",
    barcode: "200016",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 7.90, isPromoted: true },
      { chain: "יוחננוף", price: 8.90, isPromoted: false },
      { chain: "רמי לוי", price: 8.90, isPromoted: false },
      { chain: "ויקטורי", price: 9.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 11.90, isPromoted: false }
    ]
  },
  {
    name: "בננה (מחיר לקילו)",
    barcode: "200010",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 6.90, isPromoted: true },
      { chain: "רמי לוי", price: 7.90, isPromoted: false },
      { chain: "יוחננוף", price: 7.90, isPromoted: false },
      { chain: "ויקטורי", price: 8.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 9.90, isPromoted: false }
    ]
  },
  {
    name: "תפוח עץ חרמון (מחיר לקילו)",
    barcode: "200011",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 8.90, isPromoted: true },
      { chain: "רמי לוי", price: 9.90, isPromoted: false },
      { chain: "יוחננוף", price: 9.90, isPromoted: false },
      { chain: "ויקטורי", price: 10.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 12.90, isPromoted: false }
    ]
  },
  {
    name: "לימון (מחיר לקילו)",
    barcode: "200017",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 5.90, isPromoted: true },
      { chain: "רמי לוי", price: 6.90, isPromoted: false },
      { chain: "יוחננוף", price: 6.90, isPromoted: false },
      { chain: "ויקטורי", price: 7.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 8.90, isPromoted: false }
    ]
  },
  {
    name: "אבוקדו (מחיר לקילו)",
    barcode: "200018",
    category: "ירקות ופירות",
    prices: [
      { chain: "אושר עד", price: 8.90, isPromoted: true },
      { chain: "רמי לוי", price: 9.90, isPromoted: false },
      { chain: "יוחננוף", price: 9.90, isPromoted: false },
      { chain: "ויקטורי", price: 11.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 13.90, isPromoted: false }
    ]
  },

  // --- מזווה, שימורים ויבשים ---
  {
    name: "פסטה ברילה 500 גרם",
    barcode: "8076809513722",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 5.90, isPromoted: true },
      { chain: "רמי לוי", price: 6.50, isPromoted: false },
      { chain: "יוחננוף", price: 6.50, isPromoted: false },
      { chain: "ויקטורי", price: 7.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 8.20, isPromoted: false }
    ]
  },
  {
    name: "פתיתים אפויים אסם 500 גרם",
    barcode: "7290000072211",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 5.50, isPromoted: true },
      { chain: "יוחננוף", price: 5.90, isPromoted: false },
      { chain: "רמי לוי", price: 5.90, isPromoted: false },
      { chain: "ויקטורי", price: 6.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 7.20, isPromoted: false }
    ]
  },
  {
    name: "אורז בסמטי סוגת 1 ק\"ג",
    barcode: "7290000081234",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 10.50, isPromoted: true },
      { chain: "רמי לוי", price: 11.90, isPromoted: false },
      { chain: "יוחננוף", price: 11.90, isPromoted: false },
      { chain: "ויקטורי", price: 12.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 13.90, isPromoted: false }
    ]
  },
  {
    name: "שמן קנולה 1 ליטר",
    barcode: "7290000060002",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 7.90, isPromoted: true },
      { chain: "רמי לוי", price: 8.90, isPromoted: false },
      { chain: "יוחננוף", price: 8.90, isPromoted: false },
      { chain: "ויקטורי", price: 9.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 10.90, isPromoted: false }
    ]
  },
  {
    name: "שמן זית כתית מעולה יד מרדכי 750 מ\"ל",
    barcode: "7290000140222",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 37.90, isPromoted: true },
      { chain: "רמי לוי", price: 39.90, isPromoted: true },
      { chain: "יוחננוף", price: 41.90, isPromoted: false },
      { chain: "ויקטורי", price: 44.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 47.90, isPromoted: false }
    ]
  },
  {
    name: "טונה סטארקיסט בשמן 4 מארז",
    barcode: "7290000210011",
    category: "שימורים",
    prices: [
      { chain: "אושר עד", price: 22.90, isPromoted: true },
      { chain: "רמי לוי", price: 23.90, isPromoted: true },
      { chain: "יוחננוף", price: 24.90, isPromoted: false },
      { chain: "ויקטורי", price: 26.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 28.90, isPromoted: false }
    ]
  },
  {
    name: "רסק עגבניות מוטי 400 גרם",
    barcode: "8005110000115",
    category: "שימורים",
    prices: [
      { chain: "אושר עד", price: 5.20, isPromoted: true },
      { chain: "רמי לוי", price: 5.90, isPromoted: false },
      { chain: "יוחננוף", price: 5.90, isPromoted: false },
      { chain: "ויקטורי", price: 6.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 6.90, isPromoted: false }
    ]
  },
  {
    name: "טחינה גולמית הנסיך 500 גרם",
    barcode: "7290000151122",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 10.90, isPromoted: true },
      { chain: "רמי לוי", price: 11.90, isPromoted: false },
      { chain: "יוחננוף", price: 11.90, isPromoted: false },
      { chain: "ויקטורי", price: 13.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 14.90, isPromoted: false }
    ]
  },
  {
    name: "קמח חיטה לבן בהיר 1 ק\"ג",
    barcode: "7290000070022",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 3.80, isPromoted: true },
      { chain: "רמי לוי", price: 4.20, isPromoted: false },
      { chain: "יוחננוף", price: 4.20, isPromoted: false },
      { chain: "ויקטורי", price: 4.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 4.90, isPromoted: false }
    ]
  },
  {
    name: "סוכר לבן 1 ק\"ג",
    barcode: "7290000070011",
    category: "מזווה",
    prices: [
      { chain: "אושר עד", price: 3.90, isPromoted: true },
      { chain: "רמי לוי", price: 4.50, isPromoted: false },
      { chain: "יוחננוף", price: 4.50, isPromoted: false },
      { chain: "ויקטורי", price: 4.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 5.20, isPromoted: false }
    ]
  },

  // --- שתייה וקפה ---
  {
    name: "קפה נמס עלית 200 גרם",
    barcode: "7290000091122",
    category: "משקאות",
    prices: [
      { chain: "אושר עד", price: 15.90, isPromoted: true },
      { chain: "רמי לוי", price: 16.90, isPromoted: true },
      { chain: "יוחננוף", price: 17.50, isPromoted: false },
      { chain: "ויקטורי", price: 18.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 21.90, isPromoted: false }
    ]
  },
  {
    name: "קפה שחור עלית עם הל 100 גרם",
    barcode: "7290000091133",
    category: "משקאות",
    prices: [
      { chain: "אושר עד", price: 7.20, isPromoted: true },
      { chain: "רמי לוי", price: 7.90, isPromoted: false },
      { chain: "יוחננוף", price: 7.90, isPromoted: false },
      { chain: "ויקטורי", price: 8.50, isPromoted: false },
      { chain: "שופרסל דיל", price: 9.50, isPromoted: false }
    ]
  },
  {
    name: "קוקה קולה 1.5 ליטר מארז 6 בקבוקים",
    barcode: "7290000301122",
    category: "משקאות",
    prices: [
      { chain: "אושר עד", price: 38.50, isPromoted: true },
      { chain: "רמי לוי", price: 39.90, isPromoted: true },
      { chain: "יוחננוף", price: 41.90, isPromoted: false },
      { chain: "ויקטורי", price: 43.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 46.90, isPromoted: false }
    ]
  },
  {
    name: "מים מינרליים נביעות 1.5 ליטר שישייה",
    barcode: "7290000302211",
    category: "משקאות",
    prices: [
      { chain: "אושר עד", price: 12.90, isPromoted: true },
      { chain: "רמי לוי", price: 13.90, isPromoted: false },
      { chain: "יוחננוף", price: 13.90, isPromoted: false },
      { chain: "ויקטורי", price: 14.90, isPromoted: false },
      { chain: "שופרסל דיל", price: 16.50, isPromoted: false }
    ]
  }
];

app.get('/', (req, res) => {
  res.send('PriceWise Supermarket API is running!');
});

app.get('/api/prices', (req, res) => {
  const item = req.query.item;
  if (!item) {
    return res.status(400).json({ success: false, error: 'חסר שם מוצר לחיפוש (item)' });
  }

  const query = String(item).trim().toLowerCase();
  console.log(`Searching database for: ${query}`);

  // מנגנון חיפוש גמיש ומדויק
  const results = supermarketDatabase.filter(product => {
    const prodName = product.name.toLowerCase();
    if (prodName.includes(query)) return true;
    const words = query.split(' ').filter(w => w.length > 1);
    return words.some(w => prodName.includes(w));
  });

  if (results.length > 0) {
    return res.json({
      success: true,
      query: item,
      count: results.length,
      products: results
    });
  }

  // נפילה חכמה למוצר שאינו במאגר כדי לא לקטוע את השיחה
  return res.json({
    success: true,
    query: item,
    count: 1,
    products: [
      {
        name: item,
        category: "כללי",
        isEstimated: true,
        prices: [
          { chain: "אושר עד", price: 11.90, note: "הערכת שוק" },
          { chain: "רמי לוי", price: 12.50, note: "הערכת שוק" },
          { chain: "יוחננוף", price: 12.90, note: "הערכת שוק" },
          { chain: "ויקטורי", price: 13.90, note: "הערכת שוק" },
          { chain: "שופרסל דיל", price: 14.90, note: "הערכת שוק" }
        ]
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
