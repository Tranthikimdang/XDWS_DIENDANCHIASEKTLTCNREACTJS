/* eslint-disable import/no-anonymous-default-export */
export default {
  columns: [
    { name: "no", align: "left", label: "No" }, // Tiêu đề cột
    { name: "author", align: "left", label: "ID người dùng" }, // ID của mentor (liên kết với user_id)
    { name: "bio", align: "left", label: "Giới thiệu" }, // Thông tin giới thiệu của mentor
    { name: "skills", align: "left", label: "Kỹ năng" }, // Kỹ năng của mentor
    { name: "experience_years", align: "left", label: "Kinh nghiệm (năm)" }, // Số năm kinh nghiệm
    { name: "date", align: "left" },
    { name: "action", align: "left", label: "Hành động" }, // Các hành động như chỉnh sửa, xóa
  ],
};
