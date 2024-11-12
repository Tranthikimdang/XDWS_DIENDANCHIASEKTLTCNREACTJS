const Mentor = require('../models/mentorModel');

// Lấy tất cả danh sách Mentor
const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.findAll();  // Retrieve all mentors without any filter
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching mentors", error });
  }
};


// Xem chi tiết Mentor theo ID
const getMentorById = async (req, res) => {
  const { id } = req.params;

  try {
    const mentor = await Mentor.findOne({
      where: {
        id,
        is_deleted: null,  // Kiểm tra Mentor chưa bị xóa
      },
    });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching mentor details", error });
  }
};

// Cập nhật thông tin Mentor
const updateMentor = async (req, res) => {
  const { id } = req.params;
  const { user_id, cv_url, bio, specialization, hourly_rate, profile_picture_url, languages_spoken, rating, available_hours, last_login, isApproved } = req.body;

  try {
    const mentor = await Mentor.findOne({ where: { id, is_deleted: null } });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Cập nhật thông tin Mentor
    await mentor.update({
      user_id,
      cv_url,
      bio,
      specialization,
      hourly_rate,
      profile_picture_url,
      languages_spoken,
      rating,
      available_hours,
      last_login,
      isApproved,
      updated_at: new Date(),  // Cập nhật thời gian thay đổi
    });

    res.status(200).json({ message: "Mentor updated successfully", mentor });
  } catch (error) {
    res.status(500).json({ message: "Error updating mentor", error });
  }
};

// Xóa Mentor (đánh dấu là đã xóa - Soft Delete)
const deleteMentor = async (req, res) => {
  const { id } = req.params;

  try {
    const mentor = await Mentor.findOne({ where: { id, is_deleted: null } });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Đánh dấu Mentor là đã xóa (soft delete)
    await mentor.update({
      is_deleted: new Date(),  // Cập nhật trường is_deleted với thời gian hiện tại
    });

    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mentor", error });
  }
};

// Xóa cứng Mentor (xóa hoàn toàn trong cơ sở dữ liệu)
const hardDeleteMentor = async (req, res) => {
  const { id } = req.params;

  try {
    const mentor = await Mentor.findOne({ where: { id } });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Xóa Mentor hoàn toàn (hard delete)
    await mentor.destroy();

    res.status(200).json({ message: "Mentor permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error permanently deleting mentor", error });
  }
};

module.exports = { getMentors, getMentorById, updateMentor, deleteMentor, hardDeleteMentor };
