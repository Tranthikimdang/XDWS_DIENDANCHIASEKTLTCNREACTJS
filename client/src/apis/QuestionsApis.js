import axios from 'axios';

// Địa chỉ cơ sở cho API
const BASE_URL = 'http://localhost:3000/api';

// Questions API URL
const QUESTIONS_URL = `${BASE_URL}/questions`;

// Hàm API chung để xử lý các yêu cầu
const apiRequest = async (method, url, data) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',  // Đảm bảo gửi dữ liệu dưới dạng JSON
      },
    });
    return response.data; // Trả về data từ response
  } catch (error) {
    // Nếu lỗi xảy ra, xử lý lỗi chi tiết hơn
    let errorMessage = 'Request failed. Please try again.';

    if (error.response) {
      console.error(error);

      // Nếu backend trả về lỗi với status code, lấy message từ response
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error.request) {
      // Nếu không có phản hồi từ server (ví dụ lỗi mạng)
      errorMessage = 'No response from the server. Please check your internet connection.';
    } else {
      // Lỗi khác
      errorMessage = error.message || errorMessage;
    }
    console.log(errorMessage);

    throw new Error(errorMessage); // Ném lỗi với message chi tiết
  }
};

// Questions API
const addQuestion = async (question) => apiRequest('post', QUESTIONS_URL, question);
const getQuestionsList = async () => apiRequest('get', QUESTIONS_URL);
const getQuestionId = async (id) => apiRequest('get', `${QUESTIONS_URL}/${id}`);
const updateQuestion = async (id, updatedData) =>
  apiRequest('put', `${QUESTIONS_URL}/${id}`, updatedData);
const deleteQuestion = async (id) => apiRequest('delete', `${QUESTIONS_URL}/${id}`);

// Xuất các hàm API
export { addQuestion, getQuestionsList, getQuestionId, updateQuestion, deleteQuestion };

const QuestionsApis = {
  addQuestion,
  getQuestionsList,
  getQuestionId,
  updateQuestion,
  deleteQuestion,
};

export default QuestionsApis;
