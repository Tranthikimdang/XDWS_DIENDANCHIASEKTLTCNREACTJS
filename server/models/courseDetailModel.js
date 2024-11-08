const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseDetail = sequelize.define('CourseDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Course', // Tên bảng 'courses' nếu bạn đã thiết lập liên kết với khóa chính của bảng Course
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    video: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    no: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'course_details', // Đặt tên bảng là 'course_details'
    timestamps: false // Không tự động thêm createdAt, updatedAt
});

module.exports = CourseDetail;
