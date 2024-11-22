const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/', commentController.getAllComments);
router.get('/questions/:id', commentController.getCommentsByQuestionId);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

// Routes cho replies
router.post('/:comment_id/replies', commentController.createReply);
router.delete('/:comment_id/replies/:id', commentController.deleteReply);

module.exports = router;
