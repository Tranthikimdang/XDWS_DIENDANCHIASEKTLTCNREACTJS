import axios from "axios";

// const API_URL = "process.env.REACT_APP_API_URI";
// console.log(process.env);
const API_URL = "http://localhost:4000/api"; 

const addArticle = async (articles) => {
  try {
    const response = await axios.post(`${API_URL}/articles`, articles);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getArticleDetails = async (id) => {
  // Chuyển đổi id giả (index + 1) thành id thực sự nếu cần
  const realId = id; // Giả sử id từ API là chính xác
  console.log('Fetching details for ID:', realId);
  try {
    const response = await axios.get(`${API_URL}/articles/${realId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error('Error fetching article details:', error.response.data);
      throw new Error(`Failed to fetch article details: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('Network error:', error.request);
      throw new Error('Network error: Unable to fetch article details.');
    } else {
      console.error('Client error:', error.message);
      throw new Error('An error occurred: ' + error.message);
    }
  }
};


const updateArticle = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/articles/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteArticle = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/articles/${id}`);
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
