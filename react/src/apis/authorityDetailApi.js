import axios from "axios";

const API_URL = "http://localhost:4000/api"; 

const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/authorityDetail`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/authorityDetail`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/authorityDetail/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/authorityDetail/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default {
  addUser,
  getList,
  updateUser,
  deleteUser,
  getUserByEmail
};
