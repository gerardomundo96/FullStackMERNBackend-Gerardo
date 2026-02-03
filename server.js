const express = require('express');
const connectDB = require('./config/mongoConfig');
const cors = require('cors');
const app = express();
const { createAdmin } = require('./libs/initialSetup');
// 1. Conectar BD
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/products', require('./routes/productsRoutes'));
createAdmin();
app.get('/api/status', (req, res) => {
    res.json({ status: 'conectado' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://127.0.0.1:${PORT}`);
});
