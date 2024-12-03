const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel'); // Giả sử có bảng user
const Question = require('./questionModel'); // Giả sử có bảng question

const Comment = sequelize.define('Comment', {
    question_id: {
        type: DataTypes.STRING,
        references: {
            model: Question,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrls: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    fileUrls: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    up_code: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null // Giá trị mặc định sửa thành null
    },
    replies: {
        type: DataTypes.JSON, // Lưu các trả lời dưới dạng mảng JSON
        allowNull: true,
        defaultValue: [] // Mảng trống nếu không có trả lời
    }
}, {
    tableName: 'comments',
    timestamps: false
});

sequelize.sync()
  .then(() => {
    console.log('Comment table created if not exists');
  })
  .catch((error) => console.log('Error creating table:', error));

module.exports = Comment;
