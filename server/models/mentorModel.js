const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Cấu hình kết nối với cơ sở dữ liệu

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',  // Đây là bảng 'Users' (người dùng) mà Mentor tham chiếu tới
      key: 'id'
    },
  },
  cv_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  profile_picture_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  languages_spoken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  available_hours: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isApproved: {
    type: DataTypes.TINYINT,
    defaultValue: 0,  // 0 = chưa duyệt, 1 = đã duyệt 
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  is_deleted: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'mentors',  // Tên bảng trong cơ sở dữ liệu
  timestamps: false,  // Không tự động thêm createdAt/updatedAt
});

module.exports = Mentor;
