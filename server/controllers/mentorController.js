const Mentor = require('../models/mentorModel');
const UserModel = require('../models/userModel');

// Lấy danh sách tất cả mentors
exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.findAll();
        res.status(200).json({
            status: 'success',
            results: mentors.length,
            data: {
                mentors
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving mentors.'
        });
    }
};

// Xem chi tiết mentor theo ID
exports.detailMentor = async (req, res) => {
    const { id } = req.params;

    try {
        // Sử dụng findByPk để tìm mentor theo ID
        const mentor = await Mentor.findByPk(id);

        // Nếu không tìm thấy mentor, trả về mã lỗi 404
        if (!mentor) {
            return res.status(404).json({
                status: 'error',
                message: 'Mentor not found.',
            });
        }

        // Trả về mentor trực tiếp trong response
        res.status(200).json({
            status: 'success',
            data: mentor, // Trả về mentor mà không cần bọc thêm một lớp object { mentor }
        });
    } catch (err) {
        console.error("Error retrieving mentor details:", err);
        // Nếu có lỗi, trả về lỗi server 500
        res.status(500).send({
            status: 'error',
            message: err.message || 'Error retrieving mentor details.',
        });
    }
};



// Tạo mentor mới
exports.createMentor = async (req, res) => {
    const {
        user_id,
        bio,
        skills,
        experience_years,
        rating,
        reviews_count,
        cv_url,
        certificate_url,
        isApproved,
        is_deleted,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!user_id || !bio || !skills) {
        return res.status(400).json({
            status: 'error',
            message: 'User ID, bio, and skills are required',
        });
    }

    try {
        const newMentor = await Mentor.create({
            user_id,
            bio,
            skills,
            experience_years,
            rating: rating || 0,
            reviews_count: reviews_count || 0,
            cv_url,
            certificate_url,
            isApproved,
            is_deleted
        });
        res.status(201).json({
            status: 'success',
            data: { mentor: newMentor },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while creating the mentor.',
        });
    }
};


// Cập nhật thông tin mentor
exports.updateMentor = async (req, res) => {
    const { id } = req.params;
    const {
        bio,
        skills,
        experience_years,
        rating,
        reviews_count,
        cv_url,
        certificate_url,
        isApproved,
        is_deleted,
    } = req.body;

    try {
        // Tìm mentor cần cập nhật
        const mentor = await Mentor.findByPk(id);

        if (!mentor) {
            return res.status(404).json({
                status: 'error',
                message: 'Mentor not found',
            });
        }

        // Cập nhật các trường
        mentor.bio = bio ?? mentor.bio;
        mentor.skills = skills ?? mentor.skills;
        mentor.experience_years = experience_years ?? mentor.experience_years;
        mentor.rating = rating ?? mentor.rating;
        mentor.reviews_count = reviews_count ?? mentor.reviews_count;
        mentor.cv_url = cv_url ?? mentor.cv_url;
        mentor.certificate_url = certificate_url ?? mentor.certificate_url;
        mentor.isApproved = isApproved !== undefined ? isApproved : mentor.isApproved;
        mentor.is_deleted = is_deleted !== undefined ? is_deleted : mentor.is_deleted;

        // Lưu lại thông tin
        await mentor.save();

        res.status(200).json({
            status: 'success',
            data: { mentor },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while updating the mentor.',
        });
    }
};


// Xóa mentor
exports.deleteMentor = async (req, res) => {
    const { id } = req.params;

    try {
        const mentor = await Mentor.findByPk(id);
        if (!mentor) {
            return res.status(404).json({
                status: "error",
                message: "Mentor not found"
            });
        }
        await mentor.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the mentor.'
        });
    }
};
