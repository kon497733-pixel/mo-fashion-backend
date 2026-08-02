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

// ১. গ্লোবাল সেটিংস ডাটাবেস থেকে নিয়ে আসার ফাংশন (Get Settings)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    
    // ডাটাবেসে আগে থেকে কোনো সেটিংস না থাকলে প্রথমবার অটোমেটিক তৈরি করবে
    if (!settings) {
      settings = await Settings.create({
        storeName: 'MO FASHION',
        tagline: 'Premium E-Commerce Experience'
      });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error while fetching settings', error: error.message });
  }
};

// ২. গ্লোবাল সেটিংস আপডেট/সেভ করার ফাংশন (Update/Save Settings - 100% Live Cloud Sync)
const updateSettings = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No settings data provided in request body' });
    }

    // ডাটাবেসে থাকলে আপডেট করবে, না থাকলে নতুন সেভ করবে (upsert: true)
    const updatedSettings = await Settings.findOneAndUpdate(
      {}, 
      req.body, 
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};