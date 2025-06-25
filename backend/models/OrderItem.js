const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./Order'); // Import the Order model

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_source: {
        type: DataTypes.ENUM('cars', 'accessories', 'memberships'),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // Sequelize automatically adds createdAt timestamp (created_at is covered by createdAt)
}, {
    tableName: 'order_items', // Explicitly set table name
    timestamps: true,
    createdAt: 'created_at', // Map createdAt to created_at column
    updatedAt: false, // Disable updatedAt for this table based on your schema
});

// Define association (optional, but good practice if not in index.js)
// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = OrderItem; 