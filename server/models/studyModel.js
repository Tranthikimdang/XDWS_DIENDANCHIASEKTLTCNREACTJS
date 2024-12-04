const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel"); // Import mô hình User
const Course = require("./courseModel"); // Import mô hình Course

const StudyTime = sequelize.define(
  "Study_time",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE", // Xóa bản ghi trong Study_time khi xóa user
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: "id",
      },
      onDelete: "CASCADE", // Xóa bản ghi trong Study_time khi xóa course
    },
    lesson_current: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    startdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    enddate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "study_time",
    timestamps: false,
  }
);

// Thiết lập quan hệ
StudyTime.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
StudyTime.belongsTo(Course, { foreignKey: "course_id", onDelete: "CASCADE" });

module.exports = StudyTime;
