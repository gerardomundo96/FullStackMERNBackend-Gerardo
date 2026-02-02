const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.get('/', auth, checkRole('ADMIN_ROLE'), userController.getUsers);
router.get('/:id', auth,checkRole('ADMIN_ROLE'), userController.getUserById);
router.post('/', auth,checkRole('ADMIN_ROLE'), userController.createUser);
router.post('/login', userController.login);
router.put('/:id', auth,checkRole('ADMIN_ROLE'), userController.updateUser);
router.put('/:id/change-password', auth, userController.changePasswordUser);

module.exports = router;