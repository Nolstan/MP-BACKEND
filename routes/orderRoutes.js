const express = require('express');
const router = express.Router();
const { createOrder, getSellerOrders, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', protect, getSellerOrders);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
