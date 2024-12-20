const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel'); // Giả sử có bảng user
const Course = require('./courseModel'); // Giả sử có bảng question

const CommentCourse = sequelize.define('CommentCourse', {
    course_id: {
        type: DataTypes.STRING,
        references: {
            model: Course,
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    replies: {
        type: DataTypes.JSON,  // Lưu các trả lời dưới dạng mảng JSON
        allowNull: true,
        defaultValue: []  // Mảng trống nếu không có trả lời
    }
}, {
    tableName: 'comment_course',
    timestamps: false
});

sequelize.sync()
  .then(() => {
    console.log('Comment table created if not exists');
  })
  .catch((error) => console.log('Error creating table:', error));
module.exports = CommentCourse;
