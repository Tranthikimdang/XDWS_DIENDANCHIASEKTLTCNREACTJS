const express = require('express'); 
const router = express.Router();
const studyTimeController = require('../controllers/studyController'); // Đảm bảo bạn đã tạo studyTimeController

// Lấy tất cả bản ghi Study_time
router.get('/', studyTimeController.getAllStudyTimes);

// Tạo bản ghi Study_time mới
router.post('/', studyTimeController.createStudyTime);

// Cập nhật thông tin Study_time theo ID
router.put('/:id', studyTimeController.updateStudyTime);

// Xóa bản ghi Study_time theo ID
router.delete('/:id', studyTimeController.deleteStudyTime);

module.exports = router;
