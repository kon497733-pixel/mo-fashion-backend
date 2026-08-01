const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// রাউট ফাইলগুলো ইমপোর্ট করা
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const authRoutes = require('./routes/authRoutes'); // 🚀 জিমেইল ইমেইল ভেরিফিকেশন রাউট

// অ্যাপ ইনিশিয়ালাইজ করা
const app = express();

// মিডলওয়্যার (Middleware)
app.use(cors());

// লোগো ও ছবির (Base64) জন্য ডাটা লিমিট 50MB করা হলো
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB ডাটাবেস কানেকশন সেটআপ
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
  });

// API রাউটস (Routes) যুক্ত করা
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes); // 🚀 জিমেইল OTP সিকিউরিটি API যুক্ত করা হলো

// বেসিক রাউট
app.get('/', (req, res) => {
  res.send('MO FASHION Backend Server is Running Perfectly! 🎉');
});

// সার্ভার পোর্ট সেটআপ
const PORT = process.env.PORT || 5000;

// যেকোনো মোবাইল বা পিসি থেকে কানেক্ট হওয়ার জন্য 0.0.0.0 হোস্ট সেটআপ
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running LIVE on port ${PORT}`);
});