const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// 🔥 GET ALL SUPPLIERS
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔥 GET SUPPLIER BY ID
router.get('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔥 CREATE SUPPLIER
router.post('/', async (req, res) => {
    try {
        const { name, contact, status } = req.body;

        const newSupplier = new Supplier({
            name,
            contact,
            status: status || 'active'
        });

        await newSupplier.save();
        res.status(201).json(newSupplier);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔥 UPDATE SUPPLIER
router.put('/:id', async (req, res) => {
    try {
        const { name, contact, status } = req.body;

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, contact, status },
            { new: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.json(updatedSupplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔥 DELETE SUPPLIER
router.delete('/:id', async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;