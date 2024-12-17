const Course = require('../models/courseModel');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.status(200).json({
            status: 'success',
            results: courses.length,
            data: {
                courses
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving courses.'
        });
    }
};

exports.createCourse = async (req, res) => {
    const { cate_course_id, image, video_demo, name, price, discount, description, userId } = req.body;
    if (!cate_course_id) {
        return res.status(400).json({ error: 'cate_course_id is required' });
    }
    try {
        const newCourse = await Course.create({
            cate_course_id, image, video_demo, name, price, discount, description, userId
        });
        res.status(201).json({
            status: 'success',
            data: {
                course: newCourse
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the course.'
        });
    }
};

exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { cate_course_id, image, video_demo, name, price, discount, description } = req.body;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found"
            });
        }
        course.cate_course_id = cate_course_id || course.cate_course_id;
        course.image = image || course.image;
        course.video_demo = video_demo || course.video_demo;
        course.name = name || course.name;
        course.price = price || course.price;
        course.discount = discount || course.discount;
        course.description = description || course.description;

        await course.save();
        res.status(200).json({
            status: 'success',
            data: {
                course
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the course.'
        });
    }
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found"
            });
        }
        await course.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the course.'
        });
    }
};
