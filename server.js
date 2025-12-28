const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // ✅ FIXED
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ================= MONGODB =================
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ================= MODELS =================
const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number,
  status: { type: String, default: 'pending' },
  shipping: Object,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ================= CONFIG =================
const JWT_SECRET = process.env.JWT_SECRET || "flipzokart_secret";

// ================= FAKE DB =================
let users = [{
  _id: "1",
  name: "Admin",
  email: "admin@flipzokart.com",
  password: bcrypt.hashSync("admin123", 10),
  role: "admin"
}];

let products = [
  { _id: "1", name: "iPhone 15", price: 79999 },
  { _id: "2", name: "Samsung Galaxy", price: 59999 }
];

// ================= AUTH =================
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

  if (users.find(u => u.email === email))
    return res.status(400).json({ error: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = { _id: Date.now().toString(), name, email, password: hashed, role: "user" };
  users.push(newUser);

  const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET);
  res.json({ token, user: newUser });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
  res.json({ token, user });
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  const decoded = jwt.verify(token, JWT_SECRET);
  const user = users.find(u => u._id === decoded.userId);
  res.json({ user });
});

// ================= PRODUCTS =================
app.get('/api/products', (req, res) => {
  res.json(products);
});

// ================= ORDERS =================
app.post('/api/orders', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);

  const order = new Order({ userId: decoded.userId, ...req.body });
  await order.save();

  res.json({ message: "Order placed", order });
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// ================= HEALTH =================
app.get('/api/health', (req, res) => {
  res.json({ status: "OK" });
});

// ================= START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running on", PORT));
