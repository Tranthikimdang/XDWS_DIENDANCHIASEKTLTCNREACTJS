const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const mentors = sequelize.define("mentors", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
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
  tableName: "mentors",
  timestamps: false, // Nếu bạn không cần `createdAt` và `updatedAt`
});

module.exports = mentors;
