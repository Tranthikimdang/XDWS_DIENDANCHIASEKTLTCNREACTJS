const Comment = require("../models/commentModel.js");

const createComment = async (req, res) => {
  const { name, email, description , created_date } = req.body;

  if (!name || !email || !description || !created_date)  {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newComment = { name, email, description,created_date};

  try {
    const id = await Comment.addComment(newComment);
    res.status(201).send({ id, message: "Comment created successfully." });
  } catch (error) {
    console.error('Error in createComment:', error); 
    res.status(500).send({ error: error.message });
  }
};



const listComment = async (req, res) => {
  try {
    const comment = await Comment.getAllComment();
    res.status(200).json({
      data: comment,
      status: 200,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};


const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Comment.deleteComment(id);
    if (deleted) {
      res.status(204).json({status:204,message:"Xóa thành công"}); // Trả về mã trạng thái 204 No Content
    } else {
      res.status(404).json({ status: 404, error: "Comment not found." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};


module.exports = {
  createComment,
  listComment,
  deleteComment
};
