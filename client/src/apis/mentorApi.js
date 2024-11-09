/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const API_URL = "http://localhost:3000/api"; 

// Lấy danh sách mentors
const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/mentors`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Thêm mentor mới
const addMentor = async (mentor) => {
  try {
    const response = await axios.post(`${API_URL}/mentors`, mentor);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết mentor theo ID
const getMentorDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/mentors/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Trạng thái phản hồi không mong đợi: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error('Lỗi khi tải thông tin chi tiết mentor:', error.response.data);
      throw new Error(`Không thể lấy thông tin chi tiết mentor: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('Lỗi mạng:', error.request);
      throw new Error('Lỗi mạng: Không thể lấy thông tin chi tiết mentor.');
    } else {
      console.error('Lỗi người dùng:', error.message);
      throw new Error('Đã xảy ra lỗi: ' + error.message);
    }
  }
};

// Cập nhật mentor theo ID
const updateMentor = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/mentors/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa mentor theo ID
const deleteMentor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/mentors/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};

export default {
  getList,
  addMentor,
  getMentorDetails,
  updateMentor,
  deleteMentor,
};
