import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const MENTORS_URL = `${BASE_URL}/mentors`;

const apiRequest = async (method, url, data) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error.response || error);
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};

const addMentor = async (mentor) => apiRequest('post', MENTORS_URL, mentor);
const getMentors = async () => apiRequest('get', MENTORS_URL);
const getMentorById = async (id) => apiRequest('get', `${MENTORS_URL}/${id}`);
const updateMentor = async (id, updatedData) => apiRequest('put', `${MENTORS_URL}/${id}`, updatedData);
const deleteMentor = async (id) => apiRequest('delete', `${MENTORS_URL}/${id}`);

export default {
  addMentor,
  getMentors,
  getMentorById,
  updateMentor,
  deleteMentor,
};
