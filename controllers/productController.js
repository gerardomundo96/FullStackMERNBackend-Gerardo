const Product = require('../models/Product');
require('dotenv').config();

exports.createProduct = async (req, res) => {
    try {      
        const newProduct = new Product(req.body);
        await newProduct.save();

        res.status(201).json({ 
            ok: true,
            msg: 'Producto registrado exitosamente' 
        });

    } catch (error) {

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                errores 
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El producto ya está registrado']
            });
        }

        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};

        if (name) query.name = { $regex: name, $options: 'i' };

        const products = await Product.find(query)
            .populate('category', 'name description')
            .populate('supplier', 'name email telefono')
            .sort({ createdAt: -1 });

        res.json({
            ok: true,
            total: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id)
            .populate('category', 'name description')
            .populate('supplier', 'name email telefono');

        if(!product) {
            return res.status(404).json({ 
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        res.json({
            ok: true,
            product
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('category', 'name description')
        .populate('supplier', 'name email telefono');

        res.json({
            ok: true,
            msg: 'Producto actualizado',
            updatedProduct
        });

    } catch (error) {

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                errores 
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El código del producto ya está registrado']
            });
        }

        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({ 
            ok: true,
            msg: 'Producto eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
