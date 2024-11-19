const express = require('express');
const router = express.Router();
const { addMentor, getMentors, getMentorById, updateMentor, deleteMentor } = require('../controllers/mentorController');
// Thêm mentor
router.post('/mentors', addMentor);

router.get('/mentors', getMentors);

router.get('/mentors/:id', getMentorById);

router.put('/mentors/:id', updateMentor);

router.delete('/mentors/:id', deleteMentor);

module.exports = router;
