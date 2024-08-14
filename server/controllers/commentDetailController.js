const CommentDetail = require('../models/commentDetailModel.js');

const createComment = async (req, res) => {
  const {  user_name, content, created_date, updated_date } = req.body;

  if ( !user_name || !content || !created_date || !updated_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newComment = { user_name, content, created_date, updated_date };

  try {
    const id = await CommentDetail.addComment(newComment);
    res.status(201).send({ id, message: 'Comment created successfully.' });
  } catch (error) {
    console.error('Error in createComment:', error);
    res.status(500).send({ error: error.message });
  }
};

const listComment = async (req, res) => {
  try {
    const comments = await CommentDetail.getAllComment();
    res.status(200).json({
      data: comments,
      status: 200,
      message: 'success',
    });
  } catch (error) {
    console.error('Error in listComment:', error);
    res.status(500).json({ status: 500, error: 'Internal Server Error', message: error.message });
  }
};

const updatedComment = async (req, res) => {
  const { id } = req.params;
  const { user_name, content, created_date, updated_date } = req.body;

  if (!user_name || !content || !created_date || !updated_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newComment = { user_name, content, created_date, updated_date };

  try {
    const updated = await CommentDetail.updatedComment(id, newComment);
    if (updated) {
      res.status(200).json({ status: 200, message: "Comment updated successfully." });
    } else {
      res.status(404).json({ status: 404, error: "Comment not found." });
    }
  } catch (error) {
    console.error('Error updating comment:', error.message);
    res.status(500).json({ status: 500, error: error.message });
  }
};


const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await CommentDetail.deleteComment(id);
    if (deleted) {
      res.status(204).json({ status: 204, message: 'Xóa thành công' });
    } else {
      res.status(404).json({ status: 404, error: 'Comment not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const getOneCmt = async (req, res) => {
  const { id } = req.params;
  try {
    const commentDetail = await CommentDetail.getCommentById(id);
    res.status(200).json(commentDetail);
  } catch (error) {
    console.error('Error getting commentDetail:', error);
    res.status(404).json({ message: error.message });
  }
};

const getCommentsByArticleId = async (req, res) => {
  const { articleId } = req.params;

  try {
    const comments = await CommentDetail.getCommentsByArticleId(articleId);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error getting comments by article ID:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  listComment,
  updatedComment,
  deleteComment,
  getOneCmt,
  getCommentsByArticleId
};