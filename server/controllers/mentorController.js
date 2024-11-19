const Mentor = require('../models/mentorModel');

// Lấy danh sách tất cả mentors
exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.findAll();
        res.status(200).json({
            status: 'success',
            results: mentors.length,
            data: {
                mentors
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving mentors.'
        });
    }
};

// Xem chi tiết mentor theo ID
exports.detailMentor = async (req, res) => {
    const { id } = req.params;
  
    try {
      const mentor = await Mentor.findByPk(id);
      if (!mentor) {
        return res.status(404).json({
          status: 'error',
          message: 'Mentor not found.',
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: { mentor },
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        message: err.message || 'Error retrieving mentor details.',
      });
    }
  };

// Tạo mentor mới
exports.createMentor = async (req, res) => {
    const { user_id, bio, skills, experience_years, cv_url, certificate_url } = req.body;

    if (!user_id || !bio || !skills) {
        return res.status(400).json({ 
            status: 'error',
            message: 'User ID, bio, and skills are required' 
        });
    }

    try {
        const newMentor = await Mentor.create({
            user_id,
            bio,
            skills,
            experience_years,
            cv_url,
            certificate_url
        });
        res.status(201).json({
            status: 'success',
            data: {
                mentor: newMentor
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the mentor.'
        });
    }
};

// Cập nhật thông tin mentor
exports.updateMentor = async (req, res) => {
    const { id } = req.params;
    const { bio, skills, experience_years, cv_url, certificate_url } = req.body;

    try {
        const mentor = await Mentor.findByPk(id);
        if (!mentor) {
            return res.status(404).json({
                status: "error",
                message: "Mentor not found"
            });
        }
        mentor.bio = bio || mentor.bio;
        mentor.skills = skills || mentor.skills;
        mentor.experience_years = experience_years || mentor.experience_years;
        mentor.cv_url = cv_url || mentor.cv_url;
        mentor.certificate_url = certificate_url || mentor.certificate_url;

        await mentor.save();
        res.status(200).json({
            status: 'success',
            data: {
                mentor
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the mentor.'
        });
    }
};

// Xóa mentor
exports.deleteMentor = async (req, res) => {
    const { id } = req.params;

    try {
        const mentor = await Mentor.findByPk(id);
        if (!mentor) {
            return res.status(404).json({
                status: "error",
                message: "Mentor not found"
            });
        }
        await mentor.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the mentor.'
        });
    }
};
