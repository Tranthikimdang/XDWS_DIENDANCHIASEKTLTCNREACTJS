const Mentor = require('../models/mentorModel');

// 1. Lấy danh sách tất cả người hướng dẫn (Get list of all mentors)
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.findAll();
    res.json({ status: 'success', data: mentors });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'An error occurred while fetching mentors' });
  }
};

// 2. Lấy chi tiết của một người hướng dẫn cụ thể (Get mentor details)
exports.getMentorDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json({ status: 'success', data: mentor });
  } catch (error) {
    console.error('Error fetching mentor details:', error);
    res.status(500).json({ error: 'An error occurred while fetching mentor details' });
  }
};

// 3. Tạo người hướng dẫn mới (Create a new mentor)
exports.createMentor = async (req, res) => {
  const { name, expertise, bio } = req.body;

  try {
    const newMentor = await Mentor.create({ name, expertise, bio });
    res.status(201).json({ status: 'success', data: newMentor });
  } catch (error) {
    console.error('Error creating mentor:', error);
    res.status(500).json({ error: 'An error occurred while creating mentor' });
  }
};

// 4. Cập nhật người hướng dẫn (Update an existing mentor)
exports.updateMentor = async (req, res) => {
  const { id } = req.params;
  const { name, expertise, bio } = req.body;

  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    mentor.name = name || mentor.name;
    mentor.expertise = expertise || mentor.expertise;
    mentor.bio = bio || mentor.bio;
    await mentor.save();

    res.json({ status: 'success', data: mentor });
  } catch (error) {
    console.error('Error updating mentor:', error);
    res.status(500).json({ error: 'An error occurred while updating mentor' });
  }
};

// 5. Xóa người hướng dẫn (Delete a mentor)
exports.deleteMentor = async (req, res) => {
  const { id } = req.params;

  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    await mentor.destroy();
    res.json({ status: 'success', message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Error deleting mentor:', error);
    res.status(500).json({ error: 'An error occurred while deleting mentor' });
  }
};
