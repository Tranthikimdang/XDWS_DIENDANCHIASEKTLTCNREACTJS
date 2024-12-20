const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Hashtag = sequelize.define('Hashtag', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'hashtag',
    timestamps: false // Không để Sequelize tự động thêm createdAt, updatedAt
});

module.exports = Hashtag;
