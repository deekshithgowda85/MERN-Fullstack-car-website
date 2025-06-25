const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
const { verifyTransporter } = require('./utils/emailService');
const path = require('path');
const Order = require('./models/Order'); // Ensure Order model is imported
const OrderItem = require('./models/OrderItem');
const { Car, Accessory } = require('./models/Product');
const Service = require('./models/Service');


// Define associations between OrderItem and product models
OrderItem.belongsTo(Car, { foreignKey: 'product_id', as: 'carDetails', constraints: false });
OrderItem.belongsTo(Accessory, { foreignKey: 'product_id', as: 'accessoryDetails', constraints: false });
OrderItem.belongsTo(Service, { foreignKey: 'product_id', as: 'serviceDetails', constraints: false });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
require('./models'); // This will load all models and their associations

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/services', require('./routes/service.routes'));
app.use('/api/orders', require('./routes/orders'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
sequelize.sync({ alter: true }).then(async () => {
    // Verify email configuration
    await verifyTransporter();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});