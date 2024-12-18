// OrderApi.js

import axios from "axios";

// Base URL for the API
const BASE_URL = "http://localhost:3000/api"; 

// Orders API endpoint
const ORDERS_URL = `${BASE_URL}/orders`;

// General API request handler
// Enhanced error logging in apiRequest
const apiRequest = async (method, url, data = null) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
};

/**
 * Get the list of all orders.
 * @returns {Promise<Array>} - An array of orders.
 */
const getOrdersList = async () => {
  try {
    return await apiRequest('get', ORDERS_URL);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Internal server error.');
  }
};

/**
 * Create a new order.
 * @param {Object} order - The order data to create.
 * @returns {Promise<Object>} - The created order.
 */
const createOrder = async (order) => {
  // Map frontend fields to backend expected fields
  const mappedOrder = {
    user_id: order.user_id,
    cart_id: order.cart_id,
    total_amount: order.total_amount,
    payment_method: order.payment_method, // Ensure this field is handled in the backend
    order_status: order.order_status || 'pending',
    payment_status: order.payment_status || (order.payment_method === 'card' ? 'paid' : 'unpaid'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Add any other necessary fields here
  };

  return apiRequest('post', ORDERS_URL, mappedOrder);
};

/**
 * Get the list of all orders.
 * @returns {Promise<Array>} - An array of orders.
 */

/**
 * Get a specific order by ID.
 * @param {number} id - The ID of the order to retrieve.
 * @returns {Promise<Object>} - The requested order.
 */
const getOrderById = async (id) => apiRequest('get', `${ORDERS_URL}/${id}`);

/**
 * Update an existing order.
 * @param {number} id - The ID of the order to update.
 * @param {Object} updatedData - The data to update the order with.
 * @returns {Promise<Object>} - The updated order.
 */
const updateOrder = async (id, updatedData) => {
  // Map frontend fields to backend expected fields
  const mappedData = {
    order_status: updatedData.order_status,
    payment_status: updatedData.payment_status,
    total_amount: updatedData.total_amount,
    payment_method: updatedData.payment_method, // Ensure this field is handled in the backend
    updated_at: new Date().toISOString(),
    // Add any other necessary fields here
  };

  return apiRequest('put', `${ORDERS_URL}/${id}`, mappedData);
};

/**
 * Delete an order by ID.
 * @param {number} id - The ID of the order to delete.
 * @returns {Promise<Object>} - Confirmation of deletion.
 */
const deleteOrder = async (id) => apiRequest('delete', `${ORDERS_URL}/${id}`);

// Export the API methods
export default {
  createOrder,
  getOrdersList,
  getOrderById,
  updateOrder,
  deleteOrder,
};