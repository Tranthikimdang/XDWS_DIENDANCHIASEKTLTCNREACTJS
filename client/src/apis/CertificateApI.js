import axios from "axios";

// Địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 

// Certificates API
const CERTIFICATES_URL = `${BASE_URL}/certificates`;

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

// Certificates API

// Thêm chứng chỉ mới
const addCertificate = async (certificate) => apiRequest('post', CERTIFICATES_URL, certificate);

// Lấy danh sách chứng chỉ
const getCertificatesList = async () => apiRequest('get', CERTIFICATES_URL);

// Cập nhật chứng chỉ theo ID
const updateCertificate = async (id, updatedData) => apiRequest('put', `${CERTIFICATES_URL}/${id}`, updatedData);

// Xóa chứng chỉ theo ID
const deleteCertificate = async (id) => apiRequest('delete', `${CERTIFICATES_URL}/${id}`);

// Lấy thông tin chứng chỉ theo ID
const getCertificateById = async (id) => apiRequest('get', `${CERTIFICATES_URL}/${id}`);

// Xuất các hàm API
export default {
  addCertificate,
  getCertificatesList,
  updateCertificate,
  deleteCertificate,
  getCertificateById
};
