// models/order.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path as needed

class Order extends Model {}

Order.init({
  // Define your attributes here
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    defaultValue: 'pending',
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 'unpaid',
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true, // If using createdAt and updatedAt
});

module.exports = Order;