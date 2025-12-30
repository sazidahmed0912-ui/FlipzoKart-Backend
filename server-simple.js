const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 7777;
const SECRET = "flipzokart_secret";

// 🔐 Hardcoded stable user (NO bcrypt = NO mismatch)
const users = [
  {
    id: "1",
    email: "admin@flipzokart.com",
    password: "admin123"
  }
];

const products = [
  { id: "1", name: "iPhone 15", price: 79999 },
  { id: "2", name: "Samsung Galaxy", price: 59999 }
];

// 🩺 Health
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    db: {
      connected: mongoose.connection.readyState === 1
    }
  });
});

// 🔐 LOGIN — rock solid
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  const emailNormalized = (email || "").trim().toLowerCase();
  const passwordNormalized = (password || "").trim();

  if (!emailNormalized || !passwordNormalized) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find(u => u.email.toLowerCase() === emailNormalized);
  if (!user) return res.status(401).json({ message: "Invalid email" });

  if (user.password !== passwordNormalized)
    return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, SECRET);
  res.json({ token });
});

// 📦 PRODUCTS
app.get("/api/products", (req, res) => {
  res.json(products);
});

async function start() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🔥 Backend running on http://127.0.0.1:${PORT}`);
  });
}

start();
