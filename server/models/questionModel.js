const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UserModel = require('./userModel'); // Import mô hình User

const syncDatabase = async () => {
    try {
      await sequelize.sync({ force: false }); // force: false để không xóa bảng cũ
      console.log('Database synchronized successfully.');
    } catch (error) {
      console.error('Error during synchronization:', error);
    }
  };
  
  syncDatabase();
const Questions = sequelize.define('Questions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UserModel,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    questions: {
        type: DataTypes.STRING,
    },
    hashtag:{
        type: DataTypes.STRING,
    },
    imageUrls: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    fileUrls: {
        type: DataTypes.JSON, 
        defaultValue: []
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    up_code: {
        type: DataTypes.STRING,
    },
    comments: {
        type: DataTypes.JSON,
        defaultValue: [], // Mặc định là mảng trống
    },
    replies: {
        type: DataTypes.JSON,
        defaultValue: [], // Mặc định là mảng trống
    }
}, {
    tableName: 'questions',
    timestamps: true, // Đảm bảo Sequelize tự động xử lý createdAt và updatedAt
});

module.exports = Questions;
