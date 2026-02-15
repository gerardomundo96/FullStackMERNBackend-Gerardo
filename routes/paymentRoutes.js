const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.get('/', auth, paymentController.getPayments);
router.post('/', auth, checkRole('SALES_ROLE'), paymentController.createPayment);

module.exports = router;
