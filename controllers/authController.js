const User = require('../models/User');

// @desc    Register a business
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { businessName, ownerName, email, password, location, contactInfo } = req.body;

        // Create user
        const user = await User.create({
            businessName,
            ownerName,
            email,
            password,
            location,
            contactInfo,
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists. Please login instead.',
            });
        }
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Login business
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password',
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            id: user._id,
            businessName: user.businessName,
        },
    });
};
