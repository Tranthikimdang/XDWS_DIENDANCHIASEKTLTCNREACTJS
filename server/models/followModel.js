const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  target_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Mặc định là chưa đồng ý
  },
  status: {
    type: DataTypes.ENUM('pending', 'friend', 'not_followed'),
    defaultValue: 'pending',
},
}, {
  tableName: 'follow',
  timestamps: false // Không tự động thêm createdAt, updatedAt
});

module.exports = Follow;
