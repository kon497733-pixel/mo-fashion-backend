const express = require('express');
const router = express.Router();

// আমাদের তৈরি করা কন্ট্রোলার থেকে ইমেইল ভেরিফিকেশন ফাংশনগুলো ইমপোর্ট করা হলো
const {
  sendOtpEmail,
  verifyOtp
} = require('../controllers/authController');

// 🚀 ১. জিমেইলে অরিজিনাল OTP পাঠানোর API লিংক: POST /api/auth/send-otp
router.post('/send-otp', sendOtpEmail);

// 🚀 ২. জিমেইল ইনবক্স থেকে পাওয়া OTP ভেরিফাই করার API লিংক: POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

module.exports = router;