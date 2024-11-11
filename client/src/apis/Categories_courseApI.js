// api.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/categories_course"; // Đảm bảo sử dụng đúng endpoint của backend

const addCategory = async (category) => {
  try {
    const response = await axios.post(`${API_URL}`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data.data; // Trả về mảng categories
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.status === 200; // Kiểm tra đúng mã trạng thái trả về từ server
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
