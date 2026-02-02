const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            ok: false,
            msg: 'Acceso denegado, formato de token inválido o inexistente' 
        });
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' 
            ? 'El token ha expirado' 
            : 'Token no válido';

        return res.status(401).json({ 
            ok: false, 
            msg: message 
        });
    }
};

module.exports = auth;