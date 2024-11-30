import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Users API
const USERS_URL = `${BASE_URL}/users`;

// Hàm API chung để xử lý các yêu cầu
const apiRequest = async (method, url, data) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};

// Users API
const addUser = async (user) => apiRequest('post', USERS_URL, user);
const getUsersList = async () => apiRequest('get', USERS_URL);
const updateUser = async (id, updatedData) => apiRequest('put', `${USERS_URL}/${id}`, updatedData);
const deleteUser = async (id) => apiRequest('delete', `${USERS_URL}/${id}`);
const checkEmail = async (email) => apiRequest('post', `${USERS_URL}/checkEmail`, { email });
const updateUserPassword = async (userId, newPassword) => {
  return apiRequest('put', `${USERS_URL}/${userId}`, { password: newPassword });
};

// Upload hình ảnh lên server (nếu cần)
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post('/api/upload', formData); // Đảm bảo đường dẫn này đúng
    return response.data.filename; // Trả về tên file hình ảnh
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

// Xuất các hàm API
export default {
  addUser,
  getUsersList,
  updateUser,
  deleteUser,
  uploadImage,
  checkEmail,
  updateUserPassword
};
