import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/comments';

// API cho bình luận khóa học
export const getCourseComments = async (course_id) => 
  await axios.get(`${BASE_URL}/courses/${course_id}`);

// API cho bình luận câu hỏi
export const getQuestionComments = async (question_id) => 
    await axios.get(`${BASE_URL}/questions/${question_id}`);

// Tạo mới bình luận
export const createComment = async (data) => 
  await axios.post(BASE_URL, data);

// Cập nhật bình luận
export const updateComment = async (id, data) => 
  await axios.put(`${BASE_URL}/${id}`, data);

// Xóa bình luận
export const deleteComment = async (id) => 
  await axios.delete(`${BASE_URL}/${id}`);

// Tạo reply cho bình luận
export const createReply = async (comment_id, data) => 
  await axios.post(`${BASE_URL}/${comment_id}/replies`, data);

// Xóa reply của bình luận
export const deleteReply = async (comment_id, reply_id) => 
  await axios.delete(`${BASE_URL}/${comment_id}/replies/${reply_id}`);
