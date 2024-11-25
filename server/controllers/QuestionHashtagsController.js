const QuestionHashtags = require('../models/QuestionHashtagsModel'); // Import model QuestionHashtags

// Lấy tất cả các liên kết giữa câu hỏi và hashtags
exports.getAllQuestionHashtags = async (req, res) => {
    try {
        const questionHashtags = await QuestionHashtags.findAll(); // Lấy tất cả các bản ghi
        res.status(200).json({
            status: 'success',
            results: questionHashtags.length,
            data: {
                questionHashtags
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving question hashtags.'
        });
    }
};

// Tạo liên kết giữa câu hỏi và hashtag
exports.createQuestionHashtag = async (req, res) => {
    const { question_id, hashtag_id } = req.body; // Lấy thông tin từ request body

    if (!question_id || !hashtag_id) {
        return res.status(400).json({ error: 'Question ID and Hashtag ID are required' });
    }

    try {
        // Tạo mới liên kết giữa câu hỏi và hashtag
        const newQuestionHashtag = await QuestionHashtags.create({ question_id, hashtag_id });
        res.status(201).json({
            status: 'success',
            data: {
                questionHashtag: newQuestionHashtag
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while creating the question hashtag.'
        });
    }
};

// Lấy thông tin của một liên kết giữa câu hỏi và hashtag theo ID
exports.getQuestionHashtagById = async (req, res) => {
    const { id } = req.params; // Lấy ID từ params

    try {
        // Tìm liên kết theo ID
        const questionHashtag = await QuestionHashtags.findByPk(id);
        if (!questionHashtag) {
            return res.status(404).json({
                status: 'error',
                message: 'Question Hashtag not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                questionHashtag
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving the question hashtag.'
        });
    }
};

// Xóa một liên kết giữa câu hỏi và hashtag theo ID
exports.deleteQuestionHashtag = async (req, res) => {
    const { id } = req.params; // Lấy ID từ params

    try {
        // Tìm liên kết theo ID
        const questionHashtag = await QuestionHashtags.findByPk(id);
        if (!questionHashtag) {
            return res.status(404).json({
                status: 'error',
                message: 'Question Hashtag not found'
            });
        }

        // Xóa liên kết
        await questionHashtag.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the question hashtag.'
        });
    }
};

// Lấy tất cả hashtags liên kết với một câu hỏi theo ID
exports.getHashtagsByQuestion = async (req, res) => {
    const { questionId } = req.params; // Lấy questionId từ params

    try {
        // Tìm tất cả hashtags liên kết với câu hỏi
        const hashtags = await QuestionHashtags.findAll({
            where: { question_id: questionId },
            include: 'Hashtag' // Bao gồm thông tin từ model Hashtag nếu có quan hệ
        });

        res.status(200).json({
            status: 'success',
            data: {
                hashtags
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving hashtags for this question.'
        });
    }
};

// Lấy tất cả câu hỏi liên kết với một hashtag theo ID
exports.getQuestionsByHashtag = async (req, res) => {
    const { hashtagId } = req.params; // Lấy hashtagId từ params

    try {
        // Tìm tất cả câu hỏi liên kết với hashtag
        const questions = await QuestionHashtags.findAll({
            where: { hashtag_id: hashtagId },
            include: 'Question' // Bao gồm thông tin từ model Question nếu có quan hệ
        });

        res.status(200).json({
            status: 'success',
            data: {
                questions
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving questions for this hashtag.'
        });
    }
};
