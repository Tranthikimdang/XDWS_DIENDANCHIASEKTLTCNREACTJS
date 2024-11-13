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
    logging: console.log, // Enable logging
    dialectOptions: {
      connectTimeout: 60000 // Increase timeout to 60 seconds
    }
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Kết nối đã được thiết lập thành công."))
  .catch((err) => console.error("Không thể kết nối với cơ sở dữ liệu:", err));

module.exports = sequelize;