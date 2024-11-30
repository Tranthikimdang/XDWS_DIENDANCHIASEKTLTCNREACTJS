import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Notifications API
const NOTIFICATIONS_URL = `${BASE_URL}/notifications`;

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

// Notifications API
const createNotification = async (notification) => apiRequest('post', NOTIFICATIONS_URL, notification);
const getNotificationsList = async () => apiRequest('get', NOTIFICATIONS_URL);
const getUserNotifications = async (userId) => apiRequest('get', `${NOTIFICATIONS_URL}/user/${userId}`);
const getNotificationById = async (id) => apiRequest('get', `${NOTIFICATIONS_URL}/${id}`);
const updateNotification = async (id, updatedData) => apiRequest('put', `${NOTIFICATIONS_URL}/${id}`, updatedData);
const deleteNotification = async (id) => apiRequest('delete', `${NOTIFICATIONS_URL}/${id}`);
const markNotificationAsRead = async (id) => apiRequest('put', `${NOTIFICATIONS_URL}/${id}/read`);

// Tìm kiếm thông báo theo từ khóa trong message
const searchNotifications = async (searchTerm) => apiRequest('get', `${NOTIFICATIONS_URL}/search?searchTerm=${searchTerm}`);

// Xuất các hàm API
export default {
  createNotification,
  getNotificationsList,
  getUserNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
  searchNotifications
};
