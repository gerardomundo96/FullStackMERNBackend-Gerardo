const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {

        const { customer, products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'La orden debe tener al menos un producto'
            });
        }

        let totalAmount = 0;
        const processedProducts = [];

        for (const item of products) {

            const productDB = await Product.findById(item.product);

            if (!productDB) {
                return res.status(404).json({
                    ok: false,
                    msg: `Producto no encontrado: ${item.product}`
                });
            }

            // 🔥 VALIDAR STOCK
            if (productDB.stock < item.quantity) {
                return res.status(400).json({
                    ok: false,
                    msg: `Stock insuficiente para ${productDB.name}`
                });
            }

            // 🔥 RESTAR STOCK
            productDB.stock -= item.quantity;
            await productDB.save();

            const subtotal = productDB.price * item.quantity;
            totalAmount += subtotal;

            processedProducts.push({
                product: productDB._id,
                quantity: item.quantity
            });
        }

        const newOrder = new Order({
            customer,
            user: req.user.id,
            products: processedProducts,
            totalAmount,
            status: 'pending'
        });

        await newOrder.save();

        const orderPopulated = await Order.findById(newOrder._id)
            .populate('customer', 'nombre apellido email telefono')
            .populate('user', 'nombre email rol')
            .populate({
                path: 'products.product',
                select: 'name price stock'
            });

        res.status(201).json({
            ok: true,
            msg: 'Orden creada correctamente',
            order: orderPopulated
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};

exports.getOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate('customer', 'nombre apellido')
            .populate('user', 'nombre rol')
            .populate({
                path: 'products.product',
                select: 'name price'
            })
            .sort({ createdAt: -1 });

        res.json({
            ok: true,
            total: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id)
            .populate('customer', 'nombre apellido email telefono')
            .populate('user', 'nombre email rol')
            .populate({
                path: 'products.product',
                select: 'name price description stock'
            });

        if (!order) {
            return res.status(404).json({
                ok: false,
                msg: 'Orden no encontrada'
            });
        }

        res.json({
            ok: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};
