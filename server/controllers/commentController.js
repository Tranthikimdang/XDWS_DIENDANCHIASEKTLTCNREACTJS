const Comment = require('../models/commentModel');
// Lấy tất cả bình luận
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json({ status: 'success', data: { comments } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Thêm bình luận
exports.createComment = async (req, res) => {
    const { question_id, user_id, content, imageUrls , fileUrls, up_code } = req.body;
    try {
        const newComment = await Comment.create({ question_id, user_id, content, imageUrls, fileUrls, up_code, replies: '[]' });
        res.status(201).json({ status: 'success', data: { comment: newComment } });
    } catch (error) {
        console.error("Error in createComment:", error);
        res.status(500).json({ status: 'error', message: "Lỗi khi tạo bình luận.", error: error.message });
    }
};

// Cập nhật bình luận
exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { content, imageUrls, fileUrls, up_code } = req.body;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) return res.status(404).json({ status: 'error', message: 'Comment not found' });

        comment.content = content || comment.content;
        comment.imageUrls = imageUrls || comment.imageUrls;
        comment.fileUrls = fileUrls || comment.fileUrls;
        comment.up_code = up_code || comment.up_code;
        await comment.save();

        res.status(200).json({ status: 'success', data: { comment } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Xóa bình luận
exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) return res.status(404).json({ status: 'error', message: 'Comment not found' });
        await comment.destroy();

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Tạo phản hồi
exports.createReply = async (req, res) => {
    const { comment_id } = req.params;
    const { user_id, content, imageUrls, fileUrls, up_code } = req.body;
  
    try {
      // Find the comment by ID
      const comment = await Comment.findByPk(comment_id);
      if (!comment) {
        return res.status(404).json({ status: 'error', message: 'Comment not found' });
      }
  
      const replies = Array.isArray(comment.replies) ? comment.replies : [];
  
      const newReply = {
        id: Date.now(),
        user_id,
        content,
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        fileUrls: Array.isArray(fileUrls) ? fileUrls : [],
        up_code,
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      replies.push(newReply);
      comment.replies = replies;
  
      await comment.save();
      
      res.status(201).json({ status: 'success', data: { reply: newReply } });
    } catch (error) {
      console.error("Error in createReply:", error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

  
// Xóa phản hồi
exports.deleteReply = async (req, res) => {
    const { comment_id, reply_id } = req.params;
    
    try {
        const comment = await Comment.findByPk(comment_id);
        if (!comment) return res.status(404).json({ status: 'error', message: 'Comment not found' });

        // Find and remove the reply from the replies array
        const replies = comment.replies || [];
        const replyIndex = replies.findIndex(reply => reply.id === parseInt(reply_id));
        if (replyIndex === -1) return res.status(404).json({ status: 'error', message: 'Reply not found' });

        replies.splice(replyIndex, 1);
        comment.replies = replies;
        await comment.save();

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        console.error("Error in deleteReply:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
