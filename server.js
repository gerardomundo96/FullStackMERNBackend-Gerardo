const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoConfig');
const { createInitialData } = require('./libs/initialSetup');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/products', require('./routes/productsRoutes'));
app.use('/api/customers', require('./routes/customersRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

createInitialData();   // ✅ ESTA ES LA CORRECTA

app.get('/api/status', (req, res) => {
    res.json({ status: 'conectado' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
