import axios from "axios";

const API_URL = "http://localhost:4000/api"; // Thay đổi URL này nếu cần



const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/comments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateComment = async (id, commentData) => {
  try {
    const response = await axios.put(`${API_URL}/commentDetails/${id}`, commentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${id}`);
    if (response.status === 204) {
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Comment with ID ${id} not found.`);
      return false; 
    }
    throw error; 
  }
};

const getCommentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/comments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCommentsByArticleId = async (articleId) => {
  try {
    const response = await axios.get(`${API_URL}/comments/article/${articleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  
  getList,
  updateComment,
  deleteComment,
  getCommentById,
  getCommentsByArticleId
};
