import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Orders API
const ORDERS_URL = `${BASE_URL}/orders`;

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

// Orders API
const addOrder = async (order) => apiRequest('post', ORDERS_URL, order);
const getOrdersList = async () => apiRequest('get', ORDERS_URL);
const updateOrder = async (id, updatedData) => apiRequest('put', `${ORDERS_URL}/${id}`, updatedData);
const deleteOrder = async (id) => apiRequest('delete', `${ORDERS_URL}/${id}`);

// Xuất các hàm API
export default {
  addOrder,
  getOrdersList,
  updateOrder,
  deleteOrder,
};