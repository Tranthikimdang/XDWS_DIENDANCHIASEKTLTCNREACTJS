import axios from "axios";

// Cấu hình địa chỉ cơ sở cho API
const BASE_URL = "http://localhost:3000/api"; 
const FOLLOWS_URL = `${BASE_URL}/follows`;

// Hàm API chung để xử lý các yêu cầu
const apiRequest = async (method, url, data = null) => {
  try {
    const response = await axios({ method, url, data });
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    // Ném lỗi chi tiết để frontend dễ dàng hiển thị
    throw new Error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
  }
};

// API Follow
export default {
  // Tạo yêu cầu theo dõi mới
  createFollow: (follower_id, target_id) => 
    apiRequest('post', FOLLOWS_URL, { follower_id, target_id }),

  // Lấy danh sách tất cả các yêu cầu theo dõi
  getAllFollows: () => apiRequest('get', FOLLOWS_URL),

  // Xóa một yêu cầu theo dõi
  deleteFollow: (id) => apiRequest('delete', `${FOLLOWS_URL}/${id}`),

  // Lấy danh sách những người mà một người dùng đang theo dõi
  getFollowing: (follower_id) => 
    apiRequest('get', `${FOLLOWS_URL}/following/${follower_id}`),

  // Lấy danh sách những người theo dõi một người dùng
  getFollowers: (target_id) => 
    apiRequest('get', `${FOLLOWS_URL}/followers/${target_id}`),

  // Phê duyệt một yêu cầu theo dõi
  approveFollow: (id) => apiRequest('put', `${FOLLOWS_URL}/${id}/approve`),

  // Lấy danh sách yêu cầu theo dõi đang chờ xử lý
  getPendingFollows: () => apiRequest('get', `${FOLLOWS_URL}/pending`),

  // Kiểm tra trạng thái theo dõi giữa hai người dùng
  checkFollowStatus: (follower_id, target_id) => 
    apiRequest('get', `${FOLLOWS_URL}/status/${follower_id}/${target_id}`),

  // **Cập nhật trạng thái của yêu cầu theo dõi**
  updateFollow: (id, data) => apiRequest('put', `${FOLLOWS_URL}/${id}`, data),
};
