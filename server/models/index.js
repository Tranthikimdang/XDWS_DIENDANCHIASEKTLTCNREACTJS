// models/index.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
  }
);
const Order = require('./orderModel');
const User = require('./userModel');
const Cart = require('./cartsModel');

// Khởi tạo quan hệ (nếu cần)
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Cart, { foreignKey: 'cart_id' });
User.hasMany(Order, { foreignKey: 'user_id' });
Cart.hasOne(Order, { foreignKey: 'cart_id' });

module.exports = {
  Order,
  User,
  Cart,
};

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
