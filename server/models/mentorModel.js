const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mentor = sequelize.define('Mentor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    reviews_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cv_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    certificate_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_deleted: {  // Trường này dùng cho xóa mềm
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    tableName: 'mentors',
    timestamps: false
});

module.exports = Mentor;
