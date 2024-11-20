const express = require('express');
const router = express.Router();
const { getMentors, getMentorById, updateMentor, deleteMentor } = require('../controllers/mentorController');

// Xem danh sách tất cả Mentor
router.get('/mentors', getMentors);

// Xem chi tiết một Mentor
router.get('/mentors/:id', getMentorById);

// Cập nhật thông tin Mentor
router.put('/mentors/:id', updateMentor);

// Xóa Mentor (đánh dấu xóa)
router.delete('/mentors/:id', deleteMentor);

module.exports = router;
