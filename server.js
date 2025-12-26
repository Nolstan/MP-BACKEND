const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/business', require('./routes/businessRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const Product = require('./models/Product');
const User = require('./models/User');

// Stats endpoint for home page
app.get('/api/stats', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const shopCount = await User.countDocuments();

        console.log(`Stats fetched: ${productCount} products, ${shopCount} shops`);

        res.status(200).json({
            success: true,
            data: {
                products: productCount,
                shops: shopCount
            }
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
