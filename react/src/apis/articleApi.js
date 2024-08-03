import axios from "axios";
const API_URL = process.env.REACT_APP_API_URI;
console.log(process.env);

const addArticle = async (article) => {
  try {
    const response = await axios.post(`${API_URL}/article`, article);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/article`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



const updateArticle = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/article/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteArticle = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/article/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};

export default {
  addArticle,
  getList,
  updateArticle,
  deleteArticle,
};
