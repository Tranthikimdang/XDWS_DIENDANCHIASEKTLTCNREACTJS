const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Course = require("./courseModel");
const CourseDetail = require("./courseDetailModel");

const Exercise = sequelize.define(
  "Exercise",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Course,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    course_detail_id: {
      type: DataTypes.INTEGER,
      references: {
        model: CourseDetail,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_c: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_d: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "exercise",
    timestamps: false,
  }
);

module.exports = Exercise;
