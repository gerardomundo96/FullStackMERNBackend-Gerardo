const Product = require('../models/Product');
require('dotenv').config();
exports.createProduct = async (req, res) => {
    try {      
        const newProduct = new Product(req.body);
        await newProduct.save();

        res.status(201).json({ msg: 'Producto registrado exitosamente' });
    } catch (error) {
        // 1. Manejar errores de validación (required, enum, match)
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
        const { codigo, nombre } = req.query;
        let query = {};
        if (nombre) query.nombre = { $regex: nombre, $options: 'i' };
        if (codigo) query.codigo = { $regex: codigo, $options: 'i' };

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({msg: 'Producto no encontrado'});
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: false });
        res.json(updatedProduct);
    } catch (error) {
         // 1. Manejar errores de validación (required, enum, match)
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
        res.json({ msg: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
