const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    availability: {
        type: Boolean,
        default: true,
    },
    freeDelivery: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image URL'],
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
