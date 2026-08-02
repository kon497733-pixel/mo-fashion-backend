const mongoose = require('mongoose');

// 🚀 Linux/Vercel সার্ভারের কেস-সেন্সিটিভিটি এরর থেকে ১০০% নিরাপদ মডেল লোডার
let Settings;
try {
  Settings = require('../models/Settings');
} catch (e) {
  try {
    Settings = require('../models/settingsModel');
  } catch (err) {
    Settings = mongoose.model('Settings');
  }
}

// ১. গ্লোবাল সেটিংস ডাটাবেস থেকে নিয়ে আসার ফাংশন (Get Settings - Zero Default Data)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    
    // ডাটাবেসে না থাকলে ফাঁকা সেটিং অবজেক্ট তৈরি করবে (কোনো ডামি ডাটা ছাড়া)
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error while fetching settings', error: error.message });
  }
};

// ২. গ্লোবাল সেটিংস আপডেট/সেভ করার ফাংশন (Single Target Document Permanent Save)
const updateSettings = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No settings data provided in request body' });
    }

    // ডাটাবেসের যে ১টি ডকুমেন্ট রিফ্রেশে লোড হয়—ঠিক সেই ১টি নির্দিষ্ট ডকুমেন্টের ওপর টার্গেটেড সেভ
    let settings = await Settings.findOne({});
    
    if (settings) {
      settings = await Settings.findByIdAndUpdate(
        settings._id, 
        { $set: req.body }, 
        { new: true, runValidators: false }
      );
    } else {
      settings = await Settings.create(req.body);
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};