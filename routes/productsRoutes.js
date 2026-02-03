const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.get('/', auth, checkRole('ADMIN_ROLE','INVENTORY_ROLE'), productController.getProducts);
router.get('/:id', auth,checkRole('ADMIN_ROLE','INVENTORY_ROLE'), productController.getProductById);
router.post('/', auth,checkRole('ADMIN_ROLE','INVENTORY_ROLE'), productController.createProduct);
router.put('/:id', auth,checkRole('ADMIN_ROLE','INVENTORY_ROLE'), productController.updateProduct);
router.delete('/:id', auth,checkRole('ADMIN_ROLE','INVENTORY_ROLE'), productController.deleteProduct);
module.exports = router;