const express = require('express');
const router = express.Router();
const authorityController = require('../controllers/authorityController');

router.get('/authority', authorityController.list);
router.post('/authority', authorityController.create);
router.put('/authority/:id', authorityController.update);
router.delete('/authority/:id', authorityController.dele);

module.exports = router;
