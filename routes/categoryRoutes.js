const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// 🔥 GET ALL CATEGORIES
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔥 GET CATEGORY BY ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔥 CREATE CATEGORY
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;

        const newCategory = new Category({ 
            name, 
            status: status || 'active' 
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔥 UPDATE CATEGORY
router.put('/:id', async (req, res) => {
    try {
        const { name, status } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, status },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔥 DELETE CATEGORY
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;