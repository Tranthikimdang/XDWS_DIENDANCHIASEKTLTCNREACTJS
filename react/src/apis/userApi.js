import axios from "axios";

const API_URL = "http://localhost:4000/api"; // Thay đổi URL này nếu cần

const addUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};

export default {
  addUser,
  getList,
  updateUser,
  deleteUser,
};
