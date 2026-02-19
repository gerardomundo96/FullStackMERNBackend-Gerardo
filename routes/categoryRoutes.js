const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// 🔥 PRUEBA SIMPLE
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;

        const newCategory = new Category({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

