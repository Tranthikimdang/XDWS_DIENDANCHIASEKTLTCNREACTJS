const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Users = require('./userModel'); 
const Course = require('./courseModel'); 

const Certificate = sequelize.define(
  'Certificate',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Tự động tăng
      primaryKey: true, // Khóa chính
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Users, // Liên kết tới bảng User
        key: 'id', // Sử dụng khóa id của bảng User
      },
      allowNull: false, // Không cho phép để trống
      onUpdate: 'CASCADE', // Cập nhật đồng bộ
      onDelete: 'CASCADE', // Xóa chứng chỉ nếu người dùng bị xóa
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Course, // Liên kết tới bảng Course
        key: 'id', // Sử dụng khóa id của bảng Course
      },
      allowNull: false, // Không cho phép để trống
      onUpdate: 'CASCADE', // Cập nhật đồng bộ
      onDelete: 'CASCADE', // Xóa chứng chỉ nếu khóa học bị xóa
    },
    certificate_code: {
      type: DataTypes.STRING,
      unique: true, // Mã chứng chỉ phải là duy nhất
      allowNull: false, // Không cho phép để trống
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false, // Không cho phép để trống
      defaultValue: DataTypes.NOW, // Mặc định là thời gian hiện tại
    },
    status: {
      type: DataTypes.ENUM('active', 'revoked'), // Trạng thái của chứng chỉ
      defaultValue: 'active', // Mặc định là "active"
    },
  },
  {
    tableName: 'certificates', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không tự động thêm các trường `createdAt` và `updatedAt`
  }
);

module.exports = Certificate;
