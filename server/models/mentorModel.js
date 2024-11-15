const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mentor = sequelize.define('Mentor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  isApproved: { type: DataTypes.TINYINT, defaultValue: 0 },
  cv_url: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'mentors'
});

module.exports = Mentor;
