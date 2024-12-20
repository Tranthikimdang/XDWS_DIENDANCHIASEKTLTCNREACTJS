const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CategoriesCourse = require('./categories_courseModel'); // Import mô hình Category
const User = require('./userModel');
const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cate_course_id: {
        type: DataTypes.INTEGER,
        references: {
            model: CategoriesCourse,
            key: 'id' // Chỉnh sửa theo khóa chính của mô hình categories_course
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Hoặc 'CASCADE' nếu bạn muốn xóa khóa học khi xóa danh mục
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // Mô hình hoặc bảng User
            key: 'id' // Chỉnh sửa theo khóa chính của mô hình User
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Chỉnh sửa hành vi xóa khi người dùng bị xóa
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    video_demo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'courses',
    timestamps: false // Nếu bạn không muốn Sequelize tự động thêm createdAt, updatedAt
});

module.exports = Course;
