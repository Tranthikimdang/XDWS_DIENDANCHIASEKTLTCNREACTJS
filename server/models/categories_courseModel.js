// models/categoriesCourse.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const CategoriesCourse = sequelize.define("CategoriesCourse", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "categories_course",
  timestamps: false, // Nếu bạn không cần `createdAt` và `updatedAt`
});

module.exports = CategoriesCourse;
