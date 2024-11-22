const express = require('express');
const router = express.Router();
const commentCourseController = require('../controllers/commentCourseController');

router.get('/', commentCourseController.getAllCommentCourses);
router.get('/courses/:id', commentCourseController.getCommentsByCourseId);
router.post('/', commentCourseController.createCommentCourse);
router.put('/:id', commentCourseController.updateCommentCourse);
router.delete('/:id', commentCourseController.deleteCommentCourse);

// Routes cho replies
router.post('/:comment_course_id/replies', commentCourseController.createReply);
router.delete('/:comment_course_id/replies/:id', commentCourseController.deleteReply);

module.exports = router;
