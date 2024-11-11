import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Hashtags API
const HASHTAGS_URL = `${BASE_URL}/hashtags`;

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

// Hashtags API
const addHashtag = async (hashtag) => apiRequest('post', HASHTAGS_URL, hashtag);
const getHashtags = async () => apiRequest('get', HASHTAGS_URL);
const updateHashtag = async (id, updatedData) => apiRequest('put', `${HASHTAGS_URL}/${id}`, updatedData);
const deleteHashtag = async (id) => apiRequest('delete', `${HASHTAGS_URL}/${id}`);

// Xuất các hàm API
export default {
  addHashtag,
  getHashtags,
  updateHashtag,
  deleteHashtag,
};
