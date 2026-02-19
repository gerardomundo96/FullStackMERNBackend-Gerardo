const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/mongoConfig');

const app = express();

console.log("🔥 ESTE ES EL SERVER GERARDO 🔥");

// Conectar base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔥 IMPORTAR RUTAS
const usersRoutes = require('./routes/usersRoutes');
const productsRoutes = require('./routes/productsRoutes');
const customersRoutes = require('./routes/customersRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

// 🔥 USAR RUTAS
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);

// Ruta prueba
app.get('/api/status', (req, res) => {
    res.json({ status: 'Servidor funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});
