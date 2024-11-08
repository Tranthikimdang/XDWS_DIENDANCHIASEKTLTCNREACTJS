const CourseDetail = require('../models/courseDetailModel');

exports.getAllCourseDetails = async (req, res) => {
    try {
        const courseDetails = await CourseDetail.findAll();
        res.status(200).json({
            status: 'success',
            results: courseDetails.length,
            data: {
                courseDetails
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving course details.'
        });
    }
};

exports.createCourseDetail = async (req, res) => {
    const { course_id, video, name, no } = req.body;
    if (!course_id) {
        return res.status(400).json({ error: 'course_id is required' });
    }
    try {
        const newCourseDetail = await CourseDetail.create({
            course_id, video, name, no
        });
        res.status(201).json({
            status: 'success',
            data: {
                courseDetail: newCourseDetail
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the course detail.'
        });
    }
};

exports.updateCourseDetail = async (req, res) => {
    const { id } = req.params;
    const { course_id, video, name, no } = req.body;

    try {
        const courseDetail = await CourseDetail.findByPk(id);
        if (!courseDetail) {
            return res.status(404).json({
                status: "error",
                message: "Course detail not found"
            });
        }
        courseDetail.course_id = course_id || courseDetail.course_id;
        courseDetail.video = video || courseDetail.video;
        courseDetail.name = name || courseDetail.name;
        courseDetail.no = no || courseDetail.no;

        await courseDetail.save();
        res.status(200).json({
            status: 'success',
            data: {
                courseDetail
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the course detail.'
        });
    }
};

exports.deleteCourseDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const courseDetail = await CourseDetail.findByPk(id);
        if (!courseDetail) {
            return res.status(404).json({
                status: "error",
                message: "Course detail not found"
            });
        }
        await courseDetail.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the course detail.'
        });
    }
};
