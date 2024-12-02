/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
//Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api";
//API
const MENTORS_URL = `${BASE_URL}/mentors`;

// Định nghĩa API sử dụng axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
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
    const message = error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.';
    console.error(`Lỗi khi ${method.toUpperCase()} đến ${url}:`, message);
    throw new Error(message);
  }
};

const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  // Sử dụng axios trực tiếp thay vì api
  const response = await axios.post('http://localhost:3000/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.fileUrl;
};

// Thêm mentor mới
const createMentor = async (mentor) => apiRequest('post', MENTORS_URL, mentor);

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
  handleUpload,
  createMentor,
  getMentors,
  detailMentor,
  updateMentor,
  deleteMentor,
};
