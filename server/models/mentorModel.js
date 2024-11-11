const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Mentor = sequelize.define("Mentor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0, // 0 là chưa phê duyệt, 1 là đã phê duyệt
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "mentors",
  timestamps: false,
});

module.exports = Mentor;
