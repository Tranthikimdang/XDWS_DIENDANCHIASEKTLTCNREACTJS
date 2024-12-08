const express = require('express');
const questionHashtagsController = require('../controllers/QuestionHashtagsController')

const router = express.Router();

// Route lấy tất cả các liên kết giữa câu hỏi và hashtag
router.get('/', questionHashtagsController.getAllQuestionHashtags);

// Route tạo liên kết mới giữa câu hỏi và hashtag
router.post('/', questionHashtagsController.createQuestionHashtag);

// Route lấy thông tin của một liên kết giữa câu hỏi và hashtag theo ID
router.get('/:id', questionHashtagsController.getQuestionHashtagById);

// Route xóa một liên kết giữa câu hỏi và hashtag theo ID
router.delete('/:id', questionHashtagsController.deleteQuestionHashtag);

// Route lấy tất cả hashtags liên kết với một câu hỏi theo ID
router.get('/by-question/:questionId', questionHashtagsController.getHashtagsByQuestion);

// Route lấy tất cả câu hỏi liên kết với một hashtag theo ID
router.get('/by-hashtag/:hashtagId', questionHashtagsController.getQuestionsByHashtag);

module.exports = router;
