const express = require('express');
const router = express.Router();
const { createBusiness, getBusiness, updateStatus } = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createBusiness);
router.get('/:id', getBusiness);
router.put('/status', protect, updateStatus);

module.exports = router;
