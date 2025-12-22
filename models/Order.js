const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerPhone: {
        type: String,
        required: [true, 'Please add a phone number'],
        trim: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Contacted', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
