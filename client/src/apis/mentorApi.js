/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
//Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api";
//API
const MENTORS_URL = `${BASE_URL}/mentors`;

// Hàm API chung để xử lý các yêu cầu
const apiRequest = async (method, url, data, params) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      params, // Thêm params vào đây
    });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};


// Thêm mentor mới
const addMentor = async (mentor) => apiRequest('post', MENTORS_URL, mentor);

// Lấy danh sách tất cả mentor
const getMentors = async () => apiRequest('get', MENTORS_URL);

// Xem chi tiết mentor
const detailMentor = async (id) => apiRequest('get', `${MENTORS_URL}/${id}`);

// Cập nhật mentor
const updateMentor = async (id, updatedData) => apiRequest('put', `${MENTORS_URL}/${id}`, updatedData);

// Xóa mentor (cứng hoặc mềm)
const deleteMentor = async (id, deleteType = 'soft') => {
  const params = { deleteType }; // Thêm tham số `deleteType` vào query
  return apiRequest('delete', `${MENTORS_URL}/${id}`, null, params);
};

export default {
  addMentor,
  getMentors,
  detailMentor,
  updateMentor,
  deleteMentor,
};