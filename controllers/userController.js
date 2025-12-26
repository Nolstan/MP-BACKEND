const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
// @desc    Ban a user
// @route   PATCH /api/users/:id/ban
// @access  Private/Admin
exports.banUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Unban a user
// @route   PATCH /api/users/:id/unban
// @access  Private/Admin
exports.unbanUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
