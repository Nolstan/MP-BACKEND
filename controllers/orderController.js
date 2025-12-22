const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create a new order (send phone number)
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
    try {
        const { customerPhone, productId, sellerId } = req.body;

        // Check if seller is active
        const seller = await User.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                success: false,
                error: 'Seller not found',
            });
        }

        if (!seller.isActive) {
            return res.status(400).json({
                success: false,
                error: 'Seller is currently not accepting orders',
            });
        }

        const order = await Order.create({
            customerPhone,
            productId,
            sellerId,
        });

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get orders for a seller
// @route   GET /api/orders
// @access  Private
exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.user.id })
            .populate('productId', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }

        // Verify that the order belongs to the logged-in seller
        if (order.sellerId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this order',
            });
        }

        await order.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
