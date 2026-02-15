const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },

    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },

    telefono: {
        type: String
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    // 🔥 RELACIÓN REAL CON ROLE (ObjectId)
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'El rol es obligatorio']
    },

    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} no es un estado válido'
        },
        default: 'active'
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
