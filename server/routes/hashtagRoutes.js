const express = require('express');
const router = express.Router();
const hashtagController = require('../controllers/hashtagController'); // Đảm bảo rằng bạn đã tạo hashtagController

// Lấy tất cả hashtags
router.get('/', hashtagController.getAllHashtags);

// Tạo hashtag mới
router.post('/', hashtagController.createHashtag);

// Cập nhật thông tin hashtag theo ID
router.put('/:id', hashtagController.updateHashtag);

// Xóa hashtag theo ID
router.delete('/:id', hashtagController.deleteHashtag);

module.exports = router;

