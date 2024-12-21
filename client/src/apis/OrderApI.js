import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Orders API
const ORDERS_URL = `${BASE_URL}/orders`;

// Hàm API chung để xử lý các yêu cầu
const apiRequest = async (method, url, data) => {
  try {
    const response = await axios({ method, url, data });
    return response.data; // Đảm bảo trả về data từ server
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};

// Orders API
const addOrder = async (order) => {
  try {
    // Đảm bảo item là JSON hợp lệ
    const itemJson = JSON.stringify(order.item); // Chuyển đổi item thành JSON string
    const newOrder = { ...order, item: itemJson };
    return await apiRequest('post', ORDERS_URL, newOrder);
  } catch (error) {
    console.error('Error adding order:', error);
    throw new Error('Failed to add order. Please check your data and try again.');
  }
};

const getOrdersList = async () => apiRequest('get', ORDERS_URL);

const updateOrder = async (id, updatedData) => {
  try {
    // Đảm bảo item là JSON hợp lệ
    const itemJson = JSON.stringify(updatedData.item); // Chuyển đổi item thành JSON string
    const updatedOrder = { ...updatedData, item: itemJson };
    return await apiRequest('put', `${ORDERS_URL}/${id}`, updatedOrder);
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw new Error(`Failed to update order with ID ${id}. Please try again.`);
  }
};

const deleteOrder = async (id) => apiRequest('delete', `${ORDERS_URL}/${id}`);

// Xuất các hàm API
export default {
  addOrder,
  getOrdersList,
  updateOrder,
  deleteOrder,
};
