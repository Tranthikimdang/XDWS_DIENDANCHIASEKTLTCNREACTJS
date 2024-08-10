const express = require('express');
const router = express.Router();
const commentDetailController = require('../controllers/commentDetailController');

router.get('/commentDetails', commentDetailController.listComment);
router.get('/commentDetails/article/:articleId', commentDetailController.getCommentsByArticleId);
router.post('/commentDetails', commentDetailController.createComment);
router.delete('/commentDetails/:id', commentDetailController.deleteComment);

module.exports = router;
