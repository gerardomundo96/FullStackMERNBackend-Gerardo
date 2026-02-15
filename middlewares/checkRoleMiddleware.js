const User = require('../models/User');
const Role = require('../models/Role');

const checkRole = (...rolesPermitidos) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).populate('role');

            if (!user || !user.role) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Usuario sin rol asignado'
                });
            }

            if (!rolesPermitidos.includes(user.role.name)) {
                return res.status(403).json({
                    ok: false,
                    msg: `El usuario ${user.email} no tiene permisos de: [${rolesPermitidos}]`
                });
            }

            next();

        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    };
};

module.exports = checkRole;
