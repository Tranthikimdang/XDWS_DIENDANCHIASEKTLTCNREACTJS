const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.get('/announcement', announcementController.list);
router.post('/announcement', announcementController.create);
router.put('/announcement/:id', announcementController.update);
router.delete('/announcement/:id', announcementController.dele);

module.exports = router;
