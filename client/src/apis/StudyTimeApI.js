import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// StudyTime API
const STUDY_TIME_URL = `${BASE_URL}/study-times`;

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

// StudyTime API
const addStudyTime = async (studyTime) => apiRequest('post', STUDY_TIME_URL, studyTime);
const getStudyTimesList = async () => apiRequest('get', STUDY_TIME_URL);
const updateStudyTime = async (id, updatedData) => apiRequest('put', `${STUDY_TIME_URL}/${id}`, updatedData);
const deleteStudyTime = async (id) => apiRequest('delete', `${STUDY_TIME_URL}/${id}`);

// Xuất các hàm API
export default {
  addStudyTime,
  getStudyTimesList,
  updateStudyTime,
  deleteStudyTime,
};
