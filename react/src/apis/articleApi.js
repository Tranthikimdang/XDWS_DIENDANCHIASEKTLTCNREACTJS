import axios from "axios";
const API_URL = process.env.REACT_APP_API_URI;
// console.log(process.env);
console.log('API_URL:', API_URL);

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

const getArticleDetails = async (id) => {
  console.log('Fetching details for ID:', id); // Đảm bảo ID được gửi đúng
  try {
    const response = await axios.get(`${API_URL}/article/${id}`);
    if (response.status === 200) {
      return response.data; // Trả về dữ liệu
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching article details:', error.response ? error.response.data : error.message);
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
  getArticleDetails,
  updateArticle,
  deleteArticle,
};
