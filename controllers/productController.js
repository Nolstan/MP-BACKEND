const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

/**
 * Helper to delete image from Cloudinary
 * @param {string} imageUrl 
 */
const deleteCloudinaryImage = async (imageUrl) => {
    try {
        if (!imageUrl) return;
        // Extract public_id from URL: .../upload/v12345/local_marketplace/abc.jpg -> local_marketplace/abc
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1].split('.')[0];
        const folder = parts[parts.length - 2];
        const publicId = `${folder}/${fileName}`;

        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted Cloudinary image: ${publicId}`);
    } catch (err) {
        console.error('Error deleting Cloudinary image:', err.message);
    }
};

// @desc    Add a new product
// @route   POST /api/products
// @access  Public (Should be protected in a real app)
exports.addProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload an image',
            });
        }

        const productData = {
            ...req.body,
            imageUrl: req.file.path, // Cloudinary URL
        };

        const product = await Product.create(productData);
        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('businessId', 'businessName ownerName');
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('businessId', '_id businessName ownerName location contactInfo bio isActive');

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get all products for a business
// @route   GET /api/products/business/:businessId
// @access  Public
exports.getBusinessProducts = async (req, res) => {
    try {
        const products = await Product.find({ businessId: req.params.businessId });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found',
            });
        }

        // Update with new image if provided
        let updateData = req.body;
        if (req.file) {
            // Delete old image first
            if (product.imageUrl) {
                await deleteCloudinaryImage(product.imageUrl);
            }
            updateData.imageUrl = req.file.path;
        }

        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found',
            });
        }

        if (product.imageUrl) {
            await deleteCloudinaryImage(product.imageUrl);
        }

        await product.deleteOne();

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
