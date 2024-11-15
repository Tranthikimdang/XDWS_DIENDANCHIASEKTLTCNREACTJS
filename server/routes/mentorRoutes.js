const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');

router.get('/mentors', mentorController.getList);
router.get('/mentors/:id', mentorController.getMentorById);
router.post('/mentors', mentorController.addMentor);
router.put('/mentors/:id', mentorController.updateMentor);
router.delete('/mentors/:id', mentorController.deleteMentor);
router.put('/mentors/:id/approve', mentorController.approveMentor);

module.exports = router;
