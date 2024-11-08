/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const API_URL = "http://localhost:4000/api"; 
const addQuestion = async (questions) => {
  try {
    const response = await axios.post(`${API_URL}/questions`, questions);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getQuestionDetails = async (id) => {
  // Chuyển đổi id giả (index + 1) thành id thực sự nếu cần
  const realId = id; // Giả sử id từ API là chính xác
  console.log('Đang lấy thông tin chi tiết cho ID:', realId);
  try {
    const response = await axios.get(`${API_URL}/questions/${realId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Trạng thái phản hồi không mong đợi: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error('Lỗi khi tải thông tin chi tiết câu hỏi:', error.response.data);
      throw new Error(`Không thể lấy thông tin chi tiết câu hỏi: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('Lỗi mạng:', error.request);
      throw new Error('Lỗi mạng: Không thể lấy thông tin chi tiết câu hỏi.');
    } else {
      console.error('Lỗi người dùng:', error.message);
      throw new Error('Đã xảy ra lỗi: ' + error.message);
    }
  }
};


const updateQuestion = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/questions/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteQuestion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/questions/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};

export default {
  addQuestion,
  getList,
  getQuestionDetails,
  updateQuestion,
  deleteQuestion,
};
