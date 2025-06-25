const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Assuming your User model file is named User.js

const DeliveryAddress = sequelize.define('DeliveryAddress', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true, // Assuming phone can be optional
    },
    // Sequelize automatically adds createdAt and updatedAt timestamps
}, {
    tableName: 'delivery_addresses', // Explicitly set table name
    timestamps: true,
});

// Define association (optional, but good practice if not in index.js)
// DeliveryAddress.belongsTo(User, { foreignKey: 'user_id' });

module.exports = DeliveryAddress;