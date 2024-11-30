const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const QuestionHashtags = sequelize.define(
  'QuestionHashtags',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions', // Tên bảng câu hỏi
        key: 'id',
      },
      onDelete: 'CASCADE', // Xóa liên kết nếu câu hỏi bị xóa
    },
    hashtag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hashtag', // Tên bảng hashtag
        key: 'id',
      },
      onDelete: 'CASCADE', // Xóa liên kết nếu hashtag bị xóa
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'question_hashtags', // Tên bảng trong database
    timestamps: false, // Không dùng mặc định createdAt, updatedAt của Sequelize
  }
);

module.exports = QuestionHashtags;
