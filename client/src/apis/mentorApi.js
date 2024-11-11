import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// mentors API
const MENTORS_URL = `${BASE_URL}/mentors`;

// Hàm API chung để xử lý các yêu cầu (GET, POST, PUT, DELETE)
const apiRequest = async (method, url, data = null) => {
  try {
    // Gửi yêu cầu với phương thức và dữ liệu tương ứng
    const response = await axios({ method, url, data });
    return response.data; // Trả về dữ liệu từ phản hồi API
  } catch (error) {
    // Nếu có lỗi, log và ném ra thông báo lỗi chi tiết
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    // Trả về thông báo lỗi hoặc thông báo chung nếu không có chi tiết
    throw new Error(error.response?.data?.message || 'Request failed. Please try again.');
  }
};

// Các API cho mentors
const addMentor = async (mentor) => apiRequest('post', MENTORS_URL, mentor);  // Thêm mentor mới
const getList = async () => apiRequest('get', MENTORS_URL);  // Lấy danh sách mentors
const updateMentor = async (id, updatedData) => apiRequest('put', `${MENTORS_URL}/${id}`, updatedData);  // Cập nhật mentor
const deleteMentor = async (id) => apiRequest('delete', `${MENTORS_URL}/${id}`);  // Xóa mentor

export default {
  addMentor,
  getList,
  updateMentor,
  deleteMentor,
};
