// models/orderModel.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path as needed

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Table name
      key: 'id',
    },
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'carts', // Table name
      key: 'id',
    },
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unpaid',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Add other fields as necessary
}, {
  tableName: 'orders',
  timestamps: false, // Disable automatic timestamps
});

// Define associations (if not already defined in userModel.js and cartModel.js)

module.exports = Order;