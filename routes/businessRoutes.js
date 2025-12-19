const express = require('express');
const router = express.Router();
const { createBusiness, getBusiness } = require('../controllers/businessController');

router.post('/', createBusiness);
router.get('/:id', getBusiness);

module.exports = router;
