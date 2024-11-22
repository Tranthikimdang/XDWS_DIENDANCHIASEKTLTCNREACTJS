const CommentCourse = require('../models/commentCourseModel');
// Lấy tất cả bình luận
exports.getAllCommentCourses = async (req, res) => {
    try {
        const comments = await CommentCourse.findAll();
        res.status(200).json({ status: 'success', data: { comments } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Lấy chi tiết một bình luận
exports.getCommentsByCourseId = async (req, res) => {
    const { id } = req.params;
    try {
      const comments = await CommentCourse.findAll({ where: { course_id: id } });
      if (!comments || comments.length === 0) {
        return res.status(200).json([]); // Đảm bảo trả về mảng rỗng thay vì lỗi 404
      }
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments for question:', error.message);
      res.status(500).json({ error: 'Lỗi khi lấy bình luận.' });
    }
  };
  

// Thêm bình luận
exports.createCommentCourse = async (req, res) => {
    const { course_id, user_id, content, imageUrls} = req.body;
    try {
        const newCommentCourse = await CommentCourse.create({ course_id, user_id, content, imageUrls, replies: '[]' });
        res.status(201).json({ status: 'success', data: { comment: newCommentCourse } });
    } catch (error) {
        console.error("Error in createCommentCourse:", error);
        res.status(500).json({ status: 'error', message: "Lỗi khi tạo bình luận.", error: error.message });
    }
};

// Cập nhật bình luận
exports.updateCommentCourse = async (req, res) => {
    const { id } = req.params;
    const { content, imageUrls} = req.body;
    try {
        const comment = await CommentCourse.findByPk(id);
        if (!comment) return res.status(404).json({ status: 'error', message: 'CommentCourse not found' });

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
exports.deleteCommentCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await CommentCourse.findByPk(id);
        if (!comment) return res.status(404).json({ status: 'error', message: 'CommentCourse not found' });
        await comment.destroy();

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Tạo phản hồi
exports.createReply = async (req, res) => {
    const { comment_course_id } = req.params;
    const { user_id, content, imageUrls} = req.body;
  
    try {
      // Find the comment by ID
      const comment = await CommentCourse.findByPk(comment_course_id);
      if (!comment) {
        return res.status(404).json({ status: 'error', message: 'CommentCourse not found' });
      }
  
      const replies = Array.isArray(comment.replies) ? comment.replies : [];
  
      const newReply = {
        id: Date.now(),
        user_id,
        content,
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
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
    const { comment_course_id, reply_id } = req.params;
    
    try {
        const comment = await CommentCourse.findByPk(comment_course_id);
        if (!comment) return res.status(404).json({ status: 'error', message: 'CommentCourse not found' });

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
