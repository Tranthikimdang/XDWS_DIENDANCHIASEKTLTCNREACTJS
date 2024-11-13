const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Lấy tất cả câu hỏi
router.get('/', questionController.getAllQuestions);

// Tạo câu hỏi mới
router.post('/', questionController.createQuestion);

// Cập nhật câu hỏi theo ID
router.put('/:id', questionController.updateQuestion);

// Xóa câu hỏi theo ID
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
