const checkRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        // 1. Verificar que el middleware de auth ya se ejecutó
        if (!req.user) {
            return res.status(500).json({
                ok: false,
                msg: 'Se intenta verificar el rol sin validar el token primero'
            });
        }

        // 2. Extraer el rol del usuario (inyectado por el middleware de JWT)
        const {rol, email} = req.user;
        console.log({rol, email, rolesPermitidos});
        // 3. Verificar si el rol del usuario está dentro de los permitidos
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({
                ok: false,
                msg: `El usuario ${email} no tiene permisos de: [${rolesPermitidos}]`
            });
        }

        next();
    };
};

module.exports = checkRole;