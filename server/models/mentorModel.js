const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mentor = sequelize.define(
  'Mentor',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    languages_spoken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    reviews_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cv_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certificate_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_picture_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    available_hours: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // For soft deletes
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
    tableName: 'mentors',
    timestamps: false, // Disabled since we are manually defining created_at and updated_at
  }
);

module.exports = Mentor;
