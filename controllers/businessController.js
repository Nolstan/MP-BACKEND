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
