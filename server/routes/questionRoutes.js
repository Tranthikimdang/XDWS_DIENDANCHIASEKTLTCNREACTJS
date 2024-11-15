const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/questions', questionController.getList);
router.get('/questions/:id', questionController.getQuestionById);
router.post('/questions', questionController.addQuestion);
router.put('/questions/:id', questionController.updateQuestion);
router.delete('/questions/:id', questionController.deleteQuestion);

module.exports = router;
