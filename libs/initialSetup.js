const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');

exports.createInitialData = async () => {
    try {

        // 1️⃣ Crear roles si no existen
        const rolesCount = await Role.countDocuments();

        if (rolesCount === 0) {
            await Role.insertMany([
                { name: 'ADMIN_ROLE', description: 'Administrador del sistema' },
                { name: 'INVENTORY_ROLE', description: 'Encargado de inventario' },
                { name: 'SALES_ROLE', description: 'Encargado de ventas' }
            ]);
            console.log('Roles creados correctamente');
        }

        // 2️⃣ Crear admin si no existe
        const adminEmail = 'admin@admin.com';
        const existingUser = await User.findOne({ email: adminEmail });

        if (!existingUser) {

            const adminRole = await Role.findOne({ name: 'ADMIN_ROLE' });

            const hashedPassword = await bcrypt.hash('123456', 10);

            const newAdmin = new User({
                nombre: 'Admin',
                apellido: 'Principal',
                email: adminEmail,
                telefono: '00000000',
                password: hashedPassword,
                role: adminRole._id,
                status: 'active'
            });

            await newAdmin.save();
            console.log('Usuario admin creado correctamente');
        }

    } catch (error) {
        console.error('Error en initial setup:', error);
    }
};


