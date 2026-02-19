const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

// Crear proveedor
router.post('/', auth, checkRole('ADMIN_ROLE'), async (req, res) => {
    try {
        const { name, contact, status } = req.body;

        const newSupplier = new Supplier({ name, contact, status });
        await newSupplier.save();

        res.status(201).json({
            ok: true,
            supplier: newSupplier
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            error: error.message
        });
    }
});

// Obtener proveedores
router.get('/', auth, async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
