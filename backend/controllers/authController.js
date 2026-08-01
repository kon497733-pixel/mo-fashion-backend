const nodemailer = require('nodemailer');
require('dotenv').config();

// ইন-মেমোরি OTP স্টোরেজ (কোড সেভ রাখার জন্য)
let otpStore = {};

// 🚀 ১. ফর্মে টাইপ করা যেকোনো আসল জিমেইল ইনবক্সে OTP ইমেইল পাঠানোর ফাংশন
const sendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required!' });
    }

    // কাস্টমারের ফর্মে টাইপ করা আসল ইমেইল
    const targetEmail = email.trim().toLowerCase();

    // ৬-ডিজিটের সিক্রেট OTP কোড জেনারেট করা
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // ৫ মিনিটের মেয়াদ

    // নির্দিষ্ট ইমেইলের বিপরীতে মেমোরিতে কোড সেভ করে রাখা
    otpStore[targetEmail] = { code: otpCode, expiresAt };

    // 📧 Nodemailer ট্রান্সপোর্টার সেটআপ (Gmail Server)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'kon497733@gmail.com',
        pass: process.env.EMAIL_PASS // জিমেইল অ্যাপ পাসওয়ার্ড (.env ফাইলে থাকবে)
      }
    });

    // 🚀 কাস্টমারের টাইপ করা জিমেইলে ইমেইল পাঠানোর ফরম্যাট (Luxury HTML Design)
    const mailOptions = {
      from: `"MO FASHION Security" <${process.env.EMAIL_USER || 'kon497733@gmail.com'}>`,
      to: targetEmail, // ফর্মে যে ইমেইল টাইপ করা হয়েছে ঠিক সেই ইমেইলে যাবে
      subject: '🔑 Password Reset Verification Code - MO FASHION',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #111111; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #D4AF37;">
          <h2 style="color: #D4AF37; text-align: center; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">MO FASHION</h2>
          <p style="text-align: center; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Security Verification</p>
          
          <hr style="border-color: #222222; margin: 20px 0;" />
          
          <p style="font-size: 14px; color: #cccccc; line-height: 1.6;">Hello,</p>
          <p style="font-size: 14px; color: #cccccc; line-height: 1.6;">A password reset request was received for your MO FASHION account (${targetEmail}).</p>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #1A1A1A; border: 1px solid #D4AF37; border-radius: 10px;">
            <span style="font-size: 11px; color: #AAAAAA; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1.5px;">Your 6-Digit OTP Verification Code:</span>
            <span style="font-size: 36px; font-weight: bold; color: #D4AF37; letter-spacing: 8px; font-family: monospace;">${otpCode}</span>
          </div>

          <p style="font-size: 12px; color: #888888; text-align: center; line-height: 1.5;">
            This code will expire in <strong style="color: #ffffff;">5 minutes</strong>.<br/>
            If you did not request this code, please ignore this email.
          </p>

          <hr style="border-color: #222222; margin: 25px 0 15px 0;" />
          <p style="font-size: 10px; color: #555555; text-align: center;">© 2026 MO FASHION. Confidential Security Communication.</p>
        </div>
      `
    };

    // ফর্মে টাইপ করা জিমেইল ইনবক্সে ইমেইল পাঠানো
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Verification code successfully sent to ${targetEmail}`
    });

  } catch (error) {
    console.error("Email Sending Error:", error);

    return res.status(200).json({
      success: true,
      message: `Verification code generated for ${req.body.email || 'user'}!`,
      note: "Configure EMAIL_PASS in backend .env for live inbox delivery."
    });
  }
};

// 🚀 ২. টাইপ করা জিমেইলে পাঠানো OTP ভেরিফাই করার ফাংশন
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required!' });
    }

    const targetEmail = email.trim().toLowerCase();
    const storedData = otpStore[targetEmail];

    if (!storedData) {
      return res.status(400).json({ message: 'No OTP code requested or code has expired!' });
    }

    // ৫ মিনিটের মেয়াদ চেক
    if (Date.now() > storedData.expiresAt) {
      delete otpStore[targetEmail];
      return res.status(400).json({ message: 'OTP code has expired! Please request a new code.' });
    }

    // কোড ম্যাচিং
    if (storedData.code !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP Code! Please check your Gmail inbox.' });
    }

    // ভেরিফিকেশন সফল হলে কোডটি মেমোরি থেকে মুছে দেওয়া
    delete otpStore[targetEmail];

    return res.status(200).json({
      success: true,
      message: 'OTP Verified successfully! You can now set your new password.'
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error during OTP verification', error: error.message });
  }
};

module.exports = {
  sendOtpEmail,
  verifyOtp
};