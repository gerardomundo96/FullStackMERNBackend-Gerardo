const Payment = require('../models/Payment');
const Order = require('../models/Order');

exports.createPayment = async (req, res) => {
    try {

        const { order, amount, paymentMethod } = req.body;

        const orderDB = await Order.findById(order);

        if (!orderDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Orden no encontrada'
            });
        }

        const newPayment = new Payment({
            order,
            amount,
            paymentMethod,
            status: 'completed'
        });

        await newPayment.save();

        const paymentPopulated = await Payment.findById(newPayment._id)
            .populate({
                path: 'order',
                populate: [
                    { path: 'customer', select: 'nombre apellido' },
                    { path: 'user', select: 'nombre email' }
                ]
            });

        res.status(201).json({
            ok: true,
            msg: 'Pago registrado correctamente',
            payment: paymentPopulated
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};

exports.getPayments = async (req, res) => {
    try {

        const payments = await Payment.find()
            .populate({
                path: 'order',
                populate: [
                    { path: 'customer', select: 'nombre apellido' },
                    { path: 'user', select: 'nombre email' }
                ]
            })
            .sort({ createdAt: -1 });

        res.json({
            ok: true,
            total: payments.length,
            payments
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
