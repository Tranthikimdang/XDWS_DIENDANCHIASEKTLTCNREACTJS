const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Tên bảng trong cơ sở dữ liệu
            key: 'id'       // Cột khóa chính của bảng `users`
        }
    },
    type: {
        type: DataTypes.ENUM('like', 'comment', 'reply', 'mention', 'system', 'pending', 'friend', 'not_followed'), // Các loại thông báo
        allowNull: false
    },
    relatedId: {
        type: DataTypes.INTEGER,
        allowNull: true // Có thể không bắt buộc nếu thông báo không cần tham chiếu
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Mặc định là chưa đọc
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
    tableName: 'notifications',
    timestamps: false // Không sử dụng `createdAt` và `updatedAt` của Sequelize
});

module.exports = Notification;
