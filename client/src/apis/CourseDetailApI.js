import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 
const COURSE_DETAILS_URL = `${BASE_URL}/course-details`;
const COURSE_PROGRESS_URL = `${BASE_URL}/course-details/progress`;

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

// Course Details API
const addCourseDetail = async (courseDetail) => apiRequest('post', COURSE_DETAILS_URL, courseDetail);
const getCourseDetailsList = async () => apiRequest('get', COURSE_DETAILS_URL);
const updateCourseDetail = async (id, updatedData) => apiRequest('put', `${COURSE_DETAILS_URL}/${id}`, updatedData);
const deleteCourseDetail = async (id) => apiRequest('delete', `${COURSE_DETAILS_URL}/${id}`);
const getProductByCourseId = async (detailId) => apiRequest('get', `${COURSE_DETAILS_URL}/${detailId}`);

// API cho lộ trình học
const getCourseProgress = async (courseId) => apiRequest('get', `${COURSE_PROGRESS_URL}/${courseId}`);
const updateWatchedTime = async (id, watchedTime) => {
  return apiRequest('put', `${COURSE_DETAILS_URL}/${id}`, { watched_time: watchedTime });
};

// Xuất các hàm API
export default {
  addCourseDetail,
  getCourseDetailsList,
  updateCourseDetail,
  deleteCourseDetail,
  getProductByCourseId,
  getCourseProgress,
  updateWatchedTime,
};
