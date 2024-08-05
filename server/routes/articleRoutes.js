const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/article', articleController.getList);
router.get('/article/:id', articleController.getArticleById);
router.post('/article', articleController.addArticle);
router.put('/article/:id', articleController.updateArticle);
router.delete('/article/:id', articleController.deleteArticle);

module.exports = router;
