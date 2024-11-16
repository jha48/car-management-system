const express = require('express');
const Car = require('../models/Car');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Add a Car
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map((file) => `/uploads/${file.filename}`);
    const car = new Car({ title, description, tags: tags.split(','), images, user: req.user.id });
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Cars
router.get('/', authMiddleware, async (req, res) => {
  const cars = await Car.find({ user: req.user.id });
  res.json(cars);
});

module.exports = router;
