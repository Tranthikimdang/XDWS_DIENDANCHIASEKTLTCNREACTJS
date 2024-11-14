const Question = require('../models/questionModel');
const UserModel = require('../models/userModel');


// Lấy tất cả câu hỏi
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll();
        res.status(200).json({
            status: 'success',
            results: questions.length,
            data: {
                questions
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving questions.'
        });
    }
};

// Tạo câu hỏi mới
exports.createQuestion = async (req, res) => {
    const { user_id,questions, imageUrls, fileUrls, isApproved, is_deleted, up_code, comments, replies } = req.body;
    console.log(questions);
    
    
    const userExists = await UserModel.findOne({ where: { id: user_id } });
    
    if (!userExists) {
        return res.status(400).json({ error: 'User not found with the provided user_id' });
    }

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        const newQuestion = await Question.create({
            user_id,questions, imageUrls, fileUrls, isApproved, is_deleted, up_code, comments, replies
        });
        res.status(201).json({
            status: 'success',
            data: {
                question: newQuestion
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the question.'
        });
    }
};


// Cập nhật câu hỏi
exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { user_id,questions, imageUrls, fileUrls, isApproved, is_deleted, up_code, comments, replies } = req.body;

    try {
        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({
                status: "error",
                message: "Question not found"
            });
        }

        question.user_id = user_id || question.user_id;
        question.questions = questions || question.questions;
        question.imageUrls = imageUrls || question.imageUrls;
        question.fileUrls = fileUrls || question.fileUrls;
        question.isApproved = isApproved !== undefined ? isApproved : question.isApproved;
        question.is_deleted = is_deleted !== undefined ? is_deleted : question.is_deleted;
        question.up_code = up_code || question.up_code;
        question.comments = comments || question.comments;
        question.replies = replies || question.replies;

        await question.save();
        res.status(200).json({
            status: 'success',
            data: {
                question
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the question.'
        });
    }
};

// Xóa câu hỏi
exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({
                status: "error",
                message: "Question not found"
            });
        }
        await question.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the question.'
        });
    }
};
