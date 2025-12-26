const User = require('../models/User');

// @desc    Create a new business
// @route   POST /api/business
// @access  Public
exports.createBusiness = async (req, res) => {
    try {
        const business = await User.create(req.body);
        res.status(201).json({
            success: true,
            data: business,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get business details
// @route   GET /api/business/:id
// @access  Public
exports.getBusiness = async (req, res) => {
    try {
        const business = await User.findById(req.params.id);
        if (!business) {
            return res.status(404).json({
                success: false,
                error: 'Business not found',
            });
        }
        res.status(200).json({
            success: true,
            data: business,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

exports.getBusinesses = async (req, res) => {
    try {
        const businesses = await User.find();
        res.status(200).json({
            success: true,
            data: businesses,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Update business status
// @route   PUT /api/business/status
// @access  Private
exports.updateStatus = async (req, res) => {
    try {
        // req.user is already set by protect middleware
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found',
            });
        }

        user.isActive = req.body.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
