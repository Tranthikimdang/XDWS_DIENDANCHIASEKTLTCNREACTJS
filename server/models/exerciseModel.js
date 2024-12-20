const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Course = require("./courseModel");
const CourseDetail = require("./courseDetailModel");

const Exercise = sequelize.define(
  "Exercise",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Tự động tăng giá trị
      primaryKey: true, // Định nghĩa khóa chính
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Course, // Liên kết tới bảng Course
        key: "id", // Sử dụng khóa id của bảng Course
      },
      onUpdate: "CASCADE", // Cập nhật đồng bộ khi khóa id trong bảng Course thay đổi
      onDelete: "CASCADE", // Xóa bài tập nếu khóa học bị xóa
    },
    question_text: {
      type: DataTypes.TEXT, // Lưu nội dung câu hỏi
      allowNull: false, // Không cho phép để trống
    },
    option_a: {
      type: DataTypes.STRING, // Lưu nội dung lựa chọn A
      allowNull: false, // Không cho phép để trống
    },
    option_b: {
      type: DataTypes.STRING, // Lưu nội dung lựa chọn B
      allowNull: false, // Không cho phép để trống
    },
    option_c: {
      type: DataTypes.STRING, // Lưu nội dung lựa chọn C
      allowNull: false, // Không cho phép để trống
    },
    option_d: {
      type: DataTypes.STRING, // Lưu nội dung lựa chọn D
      allowNull: false, // Không cho phép để trống
    },
    correct_answer: {
      type: DataTypes.CHAR(1), // Lưu đáp án đúng (A, B, C hoặc D)
      allowNull: false, // Không cho phép để trống
    },
    explanation: {
      type: DataTypes.TEXT, // Lưu giải thích về đáp án
      allowNull: false, // Không cho phép để trống
    },
    created_at: {
      type: DataTypes.DATE, // Lưu thời điểm tạo bài tập
      defaultValue: DataTypes.NOW, // Mặc định là thời gian hiện tại
    },
    updated_at: {
      type: DataTypes.DATE, // Lưu thời điểm cập nhật bài tập
      defaultValue: DataTypes.NOW, // Mặc định là thời gian hiện tại
    },
  },
  {
    tableName: "exercise", // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không tự động thêm các trường `createdAt` và `updatedAt`
  }
);

module.exports = Exercise;
