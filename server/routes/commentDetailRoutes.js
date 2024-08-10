const express = require('express');
const router = express.Router();
const commentDetailController = require('../controllers/commentDetailController');

router.get('/commentDetails', commentDetailController.listComment);
router.get('/commentDetail/:id', commentDetailController.getOneCmt);
router.post('/commentDetails', commentDetailController.createComment);
router.delete('/commentDeatails/:id', commentDetailController.deleteComment);

module.exports = router;
