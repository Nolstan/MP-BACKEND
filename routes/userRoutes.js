const express = require('express');
const router = express.Router();
const { getAllUsers, banUser, unbanUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.patch('/:id/ban', banUser);
router.patch('/:id/unban', unbanUser);
router.delete('/:id', deleteUser);

module.exports = router;
