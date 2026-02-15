const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ==========================
   CREAR USUARIO
========================== */
exports.createUser = async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password, role, status } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            nombre,
            apellido,
            email,
            telefono,
            role,
            status,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            ok: true,
            msg: 'Usuario registrado exitosamente'
        });

    } catch (error) {

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ ok: false, errores });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El correo electrónico ya está registrado']
            });
        }

        res.status(500).json({ ok: false, error: error.message });
    }
};


/* ==========================
   LOGIN
========================== */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, status: 'active' }).populate('role');
        if (!user) {
            return res.status(400).json({ ok: false, msg: 'Usuario no encontrado o inactivo' });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ ok: false, msg: 'Contraseña incorrecta' });
        }

        const infoUser = {
            id: user._id,
            rol: user.role.name,
            email: user.email,
            nombre: user.nombre
        };

        const token = jwt.sign(
            infoUser,
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            ok: true,
            token,
            user: infoUser,
            msg: "Bienvenido " + user.nombre
        });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};


/* ==========================
   OBTENER USUARIOS
========================== */
exports.getUsers = async (req, res) => {
    try {

        const { apellido, nombre } = req.query;
        let query = {};

        if (nombre) query.nombre = { $regex: nombre, $options: 'i' };
        if (apellido) query.apellido = { $regex: apellido, $options: 'i' };

        const users = await User.find(query)
            .select('-password')
            .populate('role', 'name');

        res.json({
            ok: true,
            total: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};


/* ==========================
   OBTENER USUARIO POR ID
========================== */
exports.getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('role', 'name');

        if (!user) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        res.json({ ok: true, user });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};


/* ==========================
   ACTUALIZAR USUARIO
========================== */
exports.updateUser = async (req, res) => {
    try {

        const data = req.body;
        delete data.password;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        )
            .select('-password')
            .populate('role', 'name');

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            user: updatedUser
        });

    } catch (error) {

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ ok: false, errores });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El correo electrónico ya está registrado']
            });
        }

        res.status(500).json({ ok: false, error: error.message });
    }
};


/* ==========================
   CAMBIAR CONTRASEÑA
========================== */
exports.changePasswordUser = async (req, res) => {
    try {

        const { id } = req.user;

        if (id !== req.params.id) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permiso para cambiar esta contraseña'
            });
        }

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        const validPass = await bcrypt.compare(currentPassword, user.password);
        if (!validPass) {
            return res.status(400).json({ ok: false, msg: 'Contraseña actual incorrecta' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(req.params.id, {
            password: hashedPassword
        });

        res.json({
            ok: true,
            msg: 'Contraseña actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};
