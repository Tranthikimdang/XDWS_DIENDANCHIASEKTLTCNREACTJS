const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/articles', articleController.getList);
router.get('/article/:id', articleController.getArticleById);
router.post('/articles', articleController.addArticle);
router.put('/articles/:id', articleController.updateArticle);
router.delete('/articles/:id', articleController.deleteArticle);

module.exports = router;
