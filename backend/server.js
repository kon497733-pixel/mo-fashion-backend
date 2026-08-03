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

// 🚀 এক্সপ্রেস ৫ ক্র্যাশ ফ্রিপারফেক্ট CORS ফিক্স
app.use(cors());

// লোগো ও ছবির (Base64) জন্য ডাটা লিমিট 50MB করা হলো
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 🚀 Vercel Serverless এর জন্য ক্যাশড মঙ্গোডিবি কানেকশন হ্যান্ডলার
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
};

// প্রতিটি রিকোয়েস্টে ডাটাবেস কানেকশন নিশ্চিত করা
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API রাউটস (Routes) যুক্ত করা
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes); // 🚀 জিমেইল OTP সিকিউরিটি API যুক্ত করা হলো

// বেসিক টেস্ট রাউট
app.get('/', (req, res) => {
  res.send('MO FASHION Backend Server is Running Live on Vercel! 🎉');
});

// সার্ভার পোর্ট সেটআপ
const PORT = process.env.PORT || 5000;

// লোকাল ডেভেলপমেন্টের জন্য পোর্ট লিসেন
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running LIVE on port ${PORT}`);
  });
}

// 🚀 Vercel Serverless এপিআই এর জন্য এক্সপ্রেস অ্যাপ এক্সপোর্ট করা
module.exports = app;