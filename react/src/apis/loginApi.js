import axios from "axios";

const API_URL = "http://localhost:4000/api"; 

const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error in addUser:", error); // Log the error
    throw error;
  }
};


const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/login`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/login/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/login/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};

const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/login/email/${email}`);
    return true;
  } catch (error) {
    return false;
  }
};


export default {
  addUser,
  getList,
  updateUser,
  deleteUser,
  checkEmailExists
};
