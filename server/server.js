const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
  items: [{ productId: String, name: String, price: Number, quantity: Number }],
  total: Number,
  status: { type: String, default: 'pending' },
  shipping: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
    locality: String,
    landmark: String
  },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Stripe setup
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_replace_me');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_flipzokart';

// ===== IN-MEMORY STORAGE (For Testing) =====
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@flipzokart.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  }
];

let products = [
  {
    _id: '1',
    name: 'iPhone 15',
    price: 79999,
    image: 'https://via.placeholder.com/300x300?text=iPhone+15',
    category: 'Smart Gadgets',
    stock: 50
  },
  {
    _id: '2',
    name: 'Samsung Galaxy',
    price: 59999,
    image: 'https://via.placeholder.com/300x300?text=Samsung',
    category: 'Smart Gadgets',
    stock: 30
  },
  {
    _id: '3',
    name: 'Mens Casual Shirt',
    price: 1299,
    image: 'https://via.placeholder.com/300x300?text=Casual+Shirt',
    category: 'Fashion',
    stock: 100
  },
  {
    _id: '4',
    name: 'Womens Denim Jeans',
    price: 1899,
    image: 'https://via.placeholder.com/300x300?text=Denim+Jeans',
    category: 'Fashion',
    stock: 75
  },
  {
    _id: '5',
    name: 'Face Moisturizer Cream',
    price: 599,
    image: 'https://via.placeholder.com/300x300?text=Moisturizer',
    category: 'Beauty & Personal Care',
    stock: 150
  },
  {
    _id: '6',
    name: 'Hair Shampoo Bottle',
    price: 399,
    image: 'https://via.placeholder.com/300x300?text=Shampoo',
    category: 'Beauty & Personal Care',
    stock: 120
  },
  {
    _id: '7',
    name: '55 inch Smart TV',
    price: 34999,
    image: 'https://via.placeholder.com/300x300?text=Smart+TV',
    category: 'Home Electronics',
    stock: 20
  },
  {
    _id: '8',
    name: 'Washing Machine',
    price: 29999,
    image: 'https://via.placeholder.com/300x300?text=Washing+Machine',
    category: 'Home Electronics',
    stock: 15
  },
  {
    _id: '9',
    name: 'Wireless Bluetooth Speaker',
    price: 2499,
    image: 'https://via.placeholder.com/300x300?text=Bluetooth+Speaker',
    category: 'Smart Gadgets',
    stock: 80
  },
  {
    _id: '10',
    name: 'Kids Building Blocks Set',
    price: 899,
    image: 'https://via.placeholder.com/300x300?text=Building+Blocks',
    category: 'Toys',
    stock: 200
  },
  {
    _id: '11',
    name: 'Remote Control Car',
    price: 1599,
    image: 'https://via.placeholder.com/300x300?text=RC+Car',
    category: 'Toys',
    stock: 60
  },
  {
    _id: '12',
    name: 'Board Game Collection',
    price: 799,
    image: 'https://via.placeholder.com/300x300?text=Board+Game',
    category: 'Toys',
    stock: 90
  }
];

// ===== PRODUCTS ROUTES =====

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Add product
app.post('/api/products', (req, res) => {
  try {
    const { name, price, image, category, stock } = req.body;
    
    if (!name || !price || !image) {
      return res.status(400).json({ error: "Name, Price and Image are required!" });
    }

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
    
    Object.assign(product, req.body);
    res.json({ message: "✅ Product Updated!", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items provided' });

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
      success_url: `${CLIENT_URL}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}?checkout=cancel`
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle checkout success: create order from Stripe session
app.post('/api/checkout-success', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Create order record
    const userEmail = session.customer_details?.email || 'guest';
    const user = users.find(u => u.email === userEmail);
    const userId = user ? user._id : 'guest';

    const items = session.line_items.data.map(li => ({ productId: li.price.product || '', name: li.description || li.price.product, price: (li.price.unit_amount || 0) / 100, quantity: li.quantity }));
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

    const { items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Order items required' });

    const order = new Order({ userId: decoded.userId, items, total, status: 'pending' });
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
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    const orders = await Order.find().sort({ createdAt: -1 });
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
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'user'
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "✅ Signup successful!",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
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
    
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(401).json({ error: "Invalid token!" });
  }
});

// DEV: Promote a user to admin (temporary helper)
app.post('/api/auth/promote', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = 'admin';
    return res.json({ message: 'User promoted to admin', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "✅ Server is running!", users: users.length, products: products.length });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Flipzokart!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
