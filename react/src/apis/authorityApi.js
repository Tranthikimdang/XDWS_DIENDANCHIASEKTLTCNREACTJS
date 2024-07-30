// api.js
import axios from "axios";

const API_URL = "http://localhost:4000/api";

const add = async (authority) => {
  try {
    const response = await axios.post(`${API_URL}/authority`, authority);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/authority`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const update = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/authority/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const dele = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/authority/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};
export default {
  add,
  getList,
  update,
  dele,
};
