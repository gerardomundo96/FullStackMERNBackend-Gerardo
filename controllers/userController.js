const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.createUser = async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password,rol,status } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ nombre, apellido, email, telefono,rol, status, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (error) {
        // 1. Manejar errores de validación (required, enum, match)
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                errores 
            });
        }

        // 2. Manejar error de campo duplicado (Email unique)
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El correo electrónico ya está registrado']
            });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email,status:'active' });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ msg: 'Contraseña incorrecta' });
        const infoUser={ id: user._id, rol: user.rol, email: user.email,nombre:user.nombre };
        const token = jwt.sign(infoUser, process.env.JWT_SECRET || 'secret_key', { expiresIn: '8h' });
        res.json({ token,user:infoUser, msg: "Bienvenido " + user.nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { apellido, nombre } = req.query;
        let query = {};
        if (nombre) query.nombre = { $regex: nombre, $options: 'i' };
        if (apellido) query.apellido = { $regex: apellido, $options: 'i' };

        const users = await User.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({msg: 'Usuario no encontrado'});
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const data = req.body;
        delete data.password;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, data, { new: false });
        res.json(updatedUser);
    } catch (error) {
         // 1. Manejar errores de validación (required, enum, match)
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                errores 
            });
        }

        // 2. Manejar error de campo duplicado (Email unique)
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El correo electrónico ya está registrado']
            });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.changePasswordUser = async (req, res) => {
    try {
       const {id} = req.user;
       if(id !==  req.params.id){
        return  res.status(403).json({ msg: 'No tienes permiso para cambiar esta contraseña' });
       }
       const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const validPass = await bcrypt.compare(currentPassword, user.password);
        if (!validPass) return res.status(400).json({ msg: 'Contraseña actual incorrecta' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {password: hashedPassword}, { new: false });
        res.json(updatedUser);
    } catch (error) {     
        res.status(500).json({ error: error.message });
    }
};