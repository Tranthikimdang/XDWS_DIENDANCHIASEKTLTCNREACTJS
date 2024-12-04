const express = require('express');
const router = express.Router();
const courseDetailController = require('../controllers/courseDetailController');

router.get('/', courseDetailController.getAllCourseDetails);

router.post('/', courseDetailController.createCourseDetail);

router.put('/:id', courseDetailController.updateCourseDetail);

router.delete('/:id', courseDetailController.deleteCourseDetail);

// Route lấy lộ trình học
router.get('/progress/:course_id', courseDetailController.getCourseProgress);

// Route cập nhật thời gian đã xem
router.put('/progress/:id', courseDetailController.updateWatchedTime);

module.exports = router;
