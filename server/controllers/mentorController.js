const Mentor = require('../models/mentorModel');
const UserModel = require('../models/userModel');

// Lấy danh sách tất cả mentors
exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.findAll();
        if (mentors.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No mentors found.',
            });
        }
        res.status(200).json({
            status: 'success',
            results: mentors.length,
            data: {
                mentors
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving mentors.'
        });
    }
};

// Xem chi tiết mentor theo ID
exports.detailMentor = async (req, res) => {
    const { id } = req.params;

    try {
        const mentor = await Mentor.findByPk(id);

        if (!mentor) {
            return res.status(404).json({
                status: 'error',
                message: 'Mentor not found.',
            });
        }

        res.status(200).json({
            status: 'success',
            data: mentor,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error retrieving mentor details.',
        });
    }
};

// Tạo mentor mới
exports.createMentor = async (req, res) => {
    const { user_id, cv_url, certification_url, bio, experience_years, skills } = req.body;

    try {
        const newMentor = new Mentor({
            user_id,
            cv_url,
            certification_url,
            bio,
            experience_years,
            skills,
            rating: 0,
            reviews_count: 0,
            isApproved: '0', // Chờ phê duyệt
            created_at: new Date(),
            is_deleted: false,
            updated_at: new Date(),
        });

        await newMentor.save();
        res.status(201).json({ success: true, message: 'Mentor đăng ký thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trong quá trình đăng ký' });
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

        // Nếu mentor tồn tại, xóa mentor
        await mentor.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the mentor.'
        });
    }
};
