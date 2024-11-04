import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Categories Course API
const CATEGORIES_URL = `${BASE_URL}/categories_course`;
const COURSES_URL = `${BASE_URL}/courses`;
const COURSE_DETAILS_URL = `${BASE_URL}/course-details`; // URL mới cho courseDetail

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

// Categories API
const addCategory = async (category) => apiRequest('post', CATEGORIES_URL, category);
const getCategoriesList = async () => apiRequest('get', CATEGORIES_URL);
const updateCategory = async (id, updatedData) => apiRequest('put', `${CATEGORIES_URL}/${id}`, updatedData);
const deleteCategory = async (id) => apiRequest('delete', `${CATEGORIES_URL}/${id}`);

// Courses API
const addCourse = async (course) => apiRequest('post', COURSES_URL, course);
const getCoursesList = async () => apiRequest('get', COURSES_URL);
const updateCourse = async (id, updatedData) => apiRequest('put', `${COURSES_URL}/${id}`, updatedData);
const deleteCourse = async (id) => apiRequest('delete', `${COURSES_URL}/${id}`);

// Course Details API
const addCourseDetail = async (courseDetail) => apiRequest('post', COURSE_DETAILS_URL, courseDetail);
const getCourseDetailsList = async () => apiRequest('get', COURSE_DETAILS_URL);
const updateCourseDetail = async (id, updatedData) => apiRequest('put', `${COURSE_DETAILS_URL}/${id}`, updatedData);
const deleteCourseDetail = async (id) => apiRequest('delete', `${COURSE_DETAILS_URL}/${id}`);

// Upload hình ảnh lên server
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post('/api/upload', formData); // Đảm bảo đường dẫn này đúng
    return response.data.filename; // Trả về tên file hình ảnh
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

// Xuất các hàm API
export default {
  addCategory,
  getCategoriesList,
  updateCategory,
  deleteCategory,
  addCourse,
  getCoursesList,
  updateCourse,
  deleteCourse,
  addCourseDetail,
  getCourseDetailsList,
  updateCourseDetail,
  deleteCourseDetail,
  uploadImage,
};
