// api.js
import axios from "axios";

const API_URL = "http://localhost:4000/api"; // Thay đổi URL này nếu cần

const addComment = async (commentData) => {
  try {
    const response = await axios.post(`${API_URL}/commentDetails`, commentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/commentDetails`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const deleteComment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/commentDetails/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};

const getCommentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/commentDetails/id/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default {
  addComment,
  getList,
  deleteComment,
  getCommentById
};
