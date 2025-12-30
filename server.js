const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();

app.use(express.json());
app.use(cors());


const mongoose = require('mongoose');
mongoose.set('bufferCommands', false); // Fail fast if not connected

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flipzokart';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.warn('⚠️ MongoDB connection error:', err.message));

mongoose.connection.on('error', err => {
  console.error('❌ Mongoose connection error:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected. Attempting to reconnect...');
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Order schema (MongoDB)
const orderSchema = new mongoose.Schema({
  userId: String,
  items: [{ productId: String, name: String, price: Number, quantity: Number, image: String }],
  total: Number,
  status: { type: String, default: 'pending' },
  paymentMethod: { type: String, default: 'COD' },
  shipping: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    locality: String,
    landmark: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// User schema (MongoDB)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Product schema (MongoDB)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

// ===== CONFIGURATION =====
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_flipzokart';

// Razorpay keys (do NOT log secrets)
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn('⚠️ Razorpay keys missing: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env');
}

const razorpay = (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET)
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

// ===== IN-MEMORY STORAGE (For Testing) =====
let users = [
  {
    id: "1",
    email: "admin@flipzokart.com",
    password: "admin123",
    name: "Admin",
    role: "admin"
  }
];

let products = [
  { id: "1", name: "iPhone 15", price: 79999, image: "https://via.placeholder.com/300x300/007bff/ffffff?text=iPhone+15", category: "Electronics", stock: 10 },
  { id: "2", name: "Samsung Galaxy", price: 59999, image: "https://via.placeholder.com/300x300/28a745/ffffff?text=Samsung+Galaxy", category: "Electronics", stock: 15 },
  { id: "3", name: "Nike Shoes", price: 4999, image: "https://via.placeholder.com/300x300/dc3545/ffffff?text=Nike+Shoes", category: "Footwear", stock: 20 },
  { id: "4", name: "Adidas T-Shirt", price: 1999, image: "https://via.placeholder.com/300x300/ffc107/000000?text=Adidas+T-Shirt", category: "Clothing", stock: 25 }
];

// ===== MIDDLEWARE =====
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ===== ROUTES =====

// 🩺 Health
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    db: {
      connected: mongoose.connection.readyState === 1
    }
  });
});

// 🔐 LOGIN — rock solid
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

<<<<<<< HEAD
    // Find user in MongoDB first, fallback to memory
    let user = await User.findOne({ email });
=======
    const newProduct = {
      _id: Date.now().toString(),
      name,
      price: Number(price),
      image,
      category: category || 'General',
      stock: Number(stock) || 0,
      createdAt: new Date()
    };

    products.push(newProduct);
    res.json({ message: "✅ Product Added!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payment/config', (req, res) => {
  return res.json({ keyId: process.env.RAZORPAY_KEY_ID || null });
});

app.post('/api/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Razorpay secret is not configured on server' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Invalid signature' });
    }

    return res.json({ verified: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    products = products.filter(p => p._id !== req.params.id);
    res.json({ message: "✅ Product Deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }
>>>>>>> main
    
    if (!user) {
      // Fallback to memory users
      user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

<<<<<<< HEAD
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Check role only if frontend sends it
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Not authorized as ${role}` });
    }

    // Check password (bcrypt for MongoDB users, plain for memory users)
    let passwordValid = false;
    if (user.password && user.password.startsWith('$2')) {
      // bcrypt password
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (memory users)
      passwordValid = user.password === password;
    }

    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: user.id || user._id, email: user.email, role: user.role || 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: {
        id: user.id || user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
=======
app.post('/api/payment/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay is not configured on server' });
    }

    const { amount } = req.body || {};
    const amountInr = Number(amount);

    if (!Number.isFinite(amountInr) || amountInr <= 0) {
      return res.status(400).json({ error: 'Valid amount (INR) is required' });
    }

    const amountPaise = Math.round(amountInr * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items provided' });

    let customerEmail;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        customerEmail = decoded.email;
      } catch (e) {
        // ignore invalid token
      }
    }

    const line_items = items.map(i => ({
      price_data: {
        currency: 'inr',
        product_data: { name: i.name },
        unit_amount: Math.round((i.price || 0) * 100)
      },
      quantity: i.quantity || 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${CLIENT_URL}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}?checkout=cancel`
>>>>>>> main
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// 🔐 SIGNUP
=======
// Handle checkout success: create order from Stripe session
app.post('/api/checkout-success', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Create order record (MongoDB)
    const userEmail = session.customer_details?.email || 'guest';
    const user = users.find(u => u.email === userEmail);
    const userId = user ? user._id : 'guest';

    const items = session.line_items.data.map(li => ({ productId: '', name: li.description || '', price: (li.price.unit_amount || 0) / 100, quantity: li.quantity }));
    const total = (session.amount_total || 0) / 100;

    const order = new Order({ userId, items, total, status: 'paid' });
    await order.save();

    res.json({ message: 'Order created from checkout', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ORDERS ROUTES (MongoDB) =====

// Create order (requires auth)
app.post('/api/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });
    const decoded = jwt.verify(token, JWT_SECRET);

    const { items, total, shipping, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Order items required' });

    const status = paymentMethod && paymentMethod !== 'COD' ? 'paid' : 'pending';
    const order = new Order({
      userId: decoded.userId,
      items,
      total,
      shipping,
      paymentMethod: paymentMethod || 'COD',
      status
    });
    await order.save();
    res.json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin only)
app.get('/api/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });
    const decoded = jwt.verify(token, JWT_SECRET);

    const query = decoded.role === 'admin' ? {} : { userId: decoded.userId };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order (admin or owner)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });
    const decoded = jwt.verify(token, JWT_SECRET);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (decoded.role !== 'admin' && order.userId !== decoded.userId) return res.status(403).json({ error: 'Forbidden' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin only)
app.put('/api/orders/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = req.body.status || order.status;
    await order.save();
    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order (admin only)
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== AUTHENTICATION ROUTES =====

// SIGNUP
>>>>>>> main
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required!" });
    }

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in MongoDB
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👤 PROFILE (protected)
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
<<<<<<< HEAD
    const userId = req.user.id;
=======
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Check role only if frontend sends it
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Not authorized as ${role}` });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "✅ Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER PROFILE (Protected Route)
app.get('/api/auth/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Token required!" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u._id === decoded.userId);
>>>>>>> main
    
    // Try MongoDB first
    let user = await User.findById(userId);
    
    if (!user) {
      // Fallback to memory users
      user = users.find(u => u.id === userId);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json({
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    // Try MongoDB first
    const mongoProducts = await Product.find();
    if (mongoProducts.length > 0) {
      return res.json(mongoProducts);
    }
    
    // Fallback to memory products
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 CREATE PRODUCT (admin only)
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, price, image, category, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      stock
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💳 PAYMENT CONFIG
app.get('/api/payment/config', (req, res) => {
  return res.json({ keyId: process.env.RAZORPAY_KEY_ID || null });
});

// 💳 PAYMENT VERIFY
app.post('/api/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Razorpay secret is not configured on server' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Invalid signature' });
    }

    return res.json({ verified: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 💳 CREATE RAZORPAY ORDER
app.post('/api/payment/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay is not configured on server' });
    }

    const { amount } = req.body || {};
    const amountInr = Number(amount);

    if (!Number.isFinite(amountInr) || amountInr <= 0) {
      return res.status(400).json({ error: 'Valid amount (INR) is required' });
    }

    const amountPaise = Math.round(amountInr * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// 🚀 START SERVER
const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🔥 Server running on http://localhost:${PORT}`);
      console.log(`📱 Client URL: ${CLIENT_URL}`);
      console.log(`💳 Razorpay: ${razorpay ? '✅ Configured' : '❌ Not configured'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();
