import axios from "axios";

// Base URL for the API
const BASE_URL = "http://localhost:3000/api";

// Carts API endpoint
const CARTS_URL = `${BASE_URL}/carts`;

// Common API request handler
const apiRequest = async (method, url, data) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};

// Carts API functions
const addCart = async (cart) => apiRequest('post', CARTS_URL, cart);
const getCartsList = async () => apiRequest('get', CARTS_URL);
const updateCart = async (id, updatedData) => apiRequest('put', `${CARTS_URL}/${id}`, updatedData);
const deleteCart = async (id) => {
  try {
    const response = await apiRequest('delete', `${BASE_URL}/carts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in DELETE request to /carts:', error);
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};

// Export the functions
export default {
  addCart,
  getCartsList,
  updateCart,
  deleteCart
};