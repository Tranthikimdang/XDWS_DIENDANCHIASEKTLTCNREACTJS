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
        // Tìm khóa học theo ID
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found"
            });
        }
        console.log(course);
        

        // Cập nhật các trường nếu có giá trị trong req.body
        if (cate_course_id !== undefined) course.cate_course_id = cate_course_id;
        if (image !== undefined) course.image = image;
        if (video_demo !== undefined) course.video_demo = video_demo;
        if (name !== undefined) course.name = name;
        if (price !== undefined) course.price = price;
        if (discount !== undefined) course.discount = discount;
        if (description !== undefined) course.description = description;
        course.updated_at = new Date();

        // Lưu lại thay đổi vào cơ sở dữ liệu
        await course.save();

        // Trả về thông tin khóa học đã được cập nhật
        res.status(200).json({
            status: 'success',
            data: {
                course
            }
        });
    } catch (err) {
        console.error("Error updating course:", err); // Log lỗi chi tiết
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
