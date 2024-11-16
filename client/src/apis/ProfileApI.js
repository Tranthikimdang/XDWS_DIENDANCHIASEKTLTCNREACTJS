import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const USER_URL = `${BASE_URL}/users`;

// Add auth token interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ProfileAPI = {
  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${USER_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('getUserById error:', error);
      throw error;
    }
  },

  // Get user's articles
  getUserArticles: async (userId) => {
    try {
      const response = await axios.get(`${USER_URL}/${userId}/articles`);
      return response.data;
    } catch (error) {
      console.error('getUserArticles error:', error);
      throw error;
    }
  },

  // Get user's questions
  getUserQuestions: async (userId) => {
    try {
      const response = await axios.get(`${USER_URL}/${userId}/questions`);
      return response.data;
    } catch (error) {
      console.error('getUserQuestions error:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('getCategories error:', error);
      throw error;
    }
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${USER_URL}/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('updateUser error:', error);
      throw error;
    }
  },

  // Upload user avatar
  uploadAvatar: async (userId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', imageFile);

      const response = await axios.post(`${USER_URL}/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('uploadAvatar error:', error);
      throw error;
    }
  }
};

export default ProfileAPI;