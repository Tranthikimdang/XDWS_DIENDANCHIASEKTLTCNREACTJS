const express = require('express');
const router = express.Router();
const {
    getAllMentors,
    detailMentor,
    createMentor,
    updateMentor,
    deleteMentor,
} = require('../controllers/mentorController'); // Đảm bảo đường dẫn này đúng

// Lấy danh sách tất cả mentors
router.get('/', getAllMentors);

// Xem chi tiết mentors
router.get('/:id', detailMentor);

// Tạo mentor mới
router.post('/', createMentor);

// Cập nhật mentor theo ID
router.put('/:id', updateMentor);

// Xóa mentor theo ID
router.delete('/:id', deleteMentor);

module.exports = router;
