const express = require('express');
const router = express.Router();
const courseDetailController = require('../controllers/courseDetailController');

router.get('/', courseDetailController.getAllCourseDetails);

router.post('/', courseDetailController.createCourseDetail);

router.put('/:id', courseDetailController.updateCourseDetail);

router.delete('/:id', courseDetailController.deleteCourseDetail);

module.exports = router;
