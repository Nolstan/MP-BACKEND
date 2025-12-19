const express = require('express');
const router = express.Router();
const {
    addProduct,
    getAllProducts,
    getProduct,
    getBusinessProducts,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', protect, upload.single('image'), addProduct);
router.get('/business/:businessId', getBusinessProducts);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
