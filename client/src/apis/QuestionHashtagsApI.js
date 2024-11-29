import axios from 'axios';

// Địa chỉ cơ sở cho API
const BASE_URL = 'http://localhost:3000/api';

// QuestionHashtags API URL
const QUESTION_HASHTAGS_URL = `${BASE_URL}/questionHashtags`;

// Hàm API chung để xử lý các yêu cầu
const apiRequest = async (method, url, data = null) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};

// Các hàm cụ thể cho QuestionHashtags API
const addQuestionHashtag = async (questionHashtag) => 
  apiRequest('post', QUESTION_HASHTAGS_URL, questionHashtag);

const getAllQuestionHashtags = async () => 
  apiRequest('get', QUESTION_HASHTAGS_URL);

const getQuestionHashtagById = async (id) => 
  apiRequest('get', `${QUESTION_HASHTAGS_URL}/${id}`);

const deleteQuestionHashtag = async (id) => 
  apiRequest('delete', `${QUESTION_HASHTAGS_URL}/${id}`);

const getHashtagsByQuestion = async (questionId) => 
  apiRequest('get', `${QUESTION_HASHTAGS_URL}/question/${questionId}`);

const getQuestionsByHashtag = async (hashtagId) => 
  apiRequest('get', `${QUESTION_HASHTAGS_URL}/hashtag/${hashtagId}`);

// Xuất các hàm API
export default {
  addQuestionHashtag,
  getAllQuestionHashtags,
  getQuestionHashtagById,
  deleteQuestionHashtag,
  getHashtagsByQuestion,
  getQuestionsByHashtag,
};
