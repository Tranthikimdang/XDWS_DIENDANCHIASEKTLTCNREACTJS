const Mentor = require('../models/mentorModel');

const getList = async (req, res) => {
  try {
    const mentors = await Mentor.findAll();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy danh sách mentors', error: error.message });
  }
};

const getMentorById = async (req, res) => {
  const { id } = req.params;
  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor không tồn tại' });
    }
    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy mentor', error: error.message });
  }
};

const addMentor = async (req, res) => {
  const { user_id, student_id, cv_url } = req.body;
  try {
    const newMentor = await Mentor.create({ user_id, student_id, cv_url });
    res.status(201).json(newMentor);
  } catch (error) {
    res.status(400).json({ message: 'Không thể thêm mentor', error: error.message });
  }
};

const updateMentor = async (req, res) => {
  const { id } = req.params;
  const { user_id, student_id, cv_url, isApproved } = req.body;
  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor không tồn tại' });
    }
    mentor.user_id = user_id || mentor.user_id;
    mentor.student_id = student_id || mentor.student_id;
    mentor.cv_url = cv_url || mentor.cv_url;
    mentor.isApproved = isApproved !== undefined ? isApproved : mentor.isApproved;
    await mentor.save();
    res.status(200).json(mentor);
  } catch (error) {
    res.status(400).json({ message: 'Không thể cập nhật mentor', error: error.message });
  }
};

const deleteMentor = async (req, res) => {
  const { id } = req.params;
  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor không tồn tại' });
    }
    await mentor.destroy();
    res.status(200).json({ message: 'Mentor đã bị xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể xóa mentor', error: error.message });
  }
};

const approveMentor = async (req, res) => {
  const { id } = req.params;
  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor không tồn tại' });
    }
    mentor.isApproved = 1;
    await mentor.save();
    res.status(200).json({ message: 'Mentor đã được phê duyệt thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể phê duyệt mentor', error: error.message });
  }
};

module.exports = {
  getList,
  getMentorById,
  addMentor,
  updateMentor,
  deleteMentor,
  approveMentor
};
