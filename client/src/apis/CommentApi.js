import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/comments';

export const getComments = async () => await axios.get(BASE_URL);
export const createComment = async (data) => await axios.post(BASE_URL, data);
export const updateComment = async (id, data) => await axios.put(`${BASE_URL}/${id}`, data);
export const deleteComment = async (id) => await axios.delete(`${BASE_URL}/${id}`);
export const createReply = async (comment_id, data) => await axios.post(`${BASE_URL}/${comment_id}/replies`, data);
export const deleteReply = async (comment_id, reply_id) => await axios.delete(`${BASE_URL}/${comment_id}/replies/${reply_id}`);
