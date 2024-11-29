// CartApi.js
import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Carts API
const CARTS_URL = `${BASE_URL}/carts`;

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

// Carts API
const createCart = async (cart) => apiRequest('post', CARTS_URL, cart);
const getCartsList = async () => apiRequest('get', CARTS_URL);
const getCartById = async (id) => apiRequest('get', `${CARTS_URL}/${id}`);
const updateCart = async (id, updatedData) => apiRequest('put', `${CARTS_URL}/${id}`, updatedData);
const deleteCart = async (id) => apiRequest('delete', `${CARTS_URL}/${id}`);
const getCartsByUserId = async (userId) => apiRequest('get', `${CARTS_URL}/user/${userId}`);
const clearCartsByUserId = async (userId) => apiRequest('delete', `${CARTS_URL}/user/${userId}`);



// Xuất các hàm API
export default {
  createCart,
  getCartsList,
  getCartById,
  updateCart,
  deleteCart,
  getCartsByUserId,
  clearCartsByUserId,

};