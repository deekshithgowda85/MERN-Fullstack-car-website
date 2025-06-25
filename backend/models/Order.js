const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Assuming your User model file is named User.js
const DeliveryAddress = require('./DeliveryAddress'); // Assuming your DeliveryAddress model file is named DeliveryAddress.js

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    delivery_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow NULL if address is deleted
        references: {
            model: DeliveryAddress,
            key: 'id',
        },
        onDelete: 'SET NULL', // Set to NULL if delivery address is deleted
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    },
    // Sequelize automatically adds createdAt and updatedAt timestamps (order_date is covered by createdAt)
}, {
    tableName: 'orders', // Explicitly set table name
    timestamps: true, // Use timestamps for createdAt (order_date) and updatedAt
    createdAt: 'order_date', // Map createdAt to order_date column
    updatedAt: 'updated_at',
});

// Define associations (optional, but good practice if not in index.js)
// Order.belongsTo(User, { foreignKey: 'user_id' });
// Order.belongsTo(DeliveryAddress, { foreignKey: 'delivery_address_id' });
// Order.hasMany(OrderItem, { foreignKey: 'order_id' });

// Add the association here if it's not defined elsewhere
const OrderItem = require('./OrderItem'); // Make sure OrderItem is required
// Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' }); // Remove this line

module.exports = Order; 