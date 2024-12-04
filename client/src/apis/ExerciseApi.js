import axios from 'axios';

// Địa chỉ cơ sở cho API
const BASE_URL = 'http://localhost:3000/api';

// Categories Course API
const Exercise_URL = `${BASE_URL}/exercise`;

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
const addExercise = async (exercise) => apiRequest('post', Exercise_URL, exercise);
const getExercise = async () => apiRequest('get', Exercise_URL);

const getExerciseByIdCourse = async (id) => apiRequest('get', Exercise_URL + '/course/' + id);
const updateExercise = async (id, updatedData) =>
  apiRequest('put', `${Exercise_URL}/${id}`, updatedData);
const deleteExercise = async (id) => apiRequest('delete', `${Exercise_URL}/${id}`);

export {
  addExercise,
  getExercise,
  updateExercise,
  deleteExercise,
  getExerciseByIdCourse,
};
