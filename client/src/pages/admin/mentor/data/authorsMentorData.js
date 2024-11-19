/* eslint-disable import/no-anonymous-default-export */
export default {
  columns: [
    { name: "no", align: "left", label: "No" }, // Tiêu đề cột
    { name: "author", align: "left", label: "ID người dùng" }, // ID của mentor (liên kết với user_id)
    { name: "bio", align: "left", label: "Giới thiệu" }, // Thông tin giới thiệu của mentor
    { name: "skills", align: "left", label: "Kỹ năng" }, // Kỹ năng của mentor
    { name: "experience_years", align: "left", label: "Kinh nghiệm (năm)" }, // Số năm kinh nghiệm
    { name: "rating", align: "left", label: "Đánh giá" }, // Đánh giá trung bình của mentor
    { name: "reviews_count", align: "left", label: "Số lượt đánh giá" }, // Tổng số lượt đánh giá
    { name: "cv_url", align: "left", label: "CV" }, // Đường dẫn tới CV
    { name: "certificate_url", align: "left", label: "Chứng chỉ nghề" }, // Đường dẫn tới chứng chỉ nghề
    { name: "action", align: "left", label: "Hành động" }, // Các hành động như chỉnh sửa, xóa
  ],
};
