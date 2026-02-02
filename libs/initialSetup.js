const User = require('../models/User');
const bcrypt = require('bcrypt');

const createAdmin = async () => {
    try {
        // 1. Verificar si ya existen usuarios para no duplicar
        const count = await User.estimatedDocumentCount();
        if (count > 0) return;

        // 2. Encriptar contraseña (siempre hazlo por seguridad)
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // 3. Crear el usuario administrador
        const adminUser = new User({
            nombre: 'Administrador',
            apellido: 'Sistema',
            email: 'admin@correo.com',
            password: hashedPassword,
            rol: 'ADMIN_ROLE',
            status: 'active'
        });

        await adminUser.save();
        console.log('Usuario administrador creado por defecto');
    } catch (error) {
        console.error('Error creando usuario por defecto:', error);
    }
};

module.exports = { createAdmin };