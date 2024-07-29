// api.js
import axios from "axios";

const API_URL = "http://localhost:4000/api"; // Thay đổi URL này nếu cần

const addCategory = async (category) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};
export default {
  addCategory,
  getList,
  updateCategory,
  deleteCategory,
};
