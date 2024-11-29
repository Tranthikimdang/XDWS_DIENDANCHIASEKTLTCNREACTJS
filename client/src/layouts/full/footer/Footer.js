import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Phần Bên Trái */}
        <div className="footer-section company-info">
          <h2>ShareCode</h2>
          <p>Điện thoại: +84 123 456 789</p>
          <p>Email: contact@sharecode.dev</p>
          <p>Địa chỉ: 123 Coding Street, Khu Công Nghệ, TP. HCM</p>
        </div>

        {/* Các Phần Trung Tâm */}
        <div className="footer-section links">
          <h3>Giới Thiệu</h3>
          <ul>
            <li>Về Chúng Tôi</li>
            <li>Liên Hệ</li>
            <li>Điều Khoản Dịch Vụ</li>
            <li>Chính Sách Bảo Mật</li>
            <li>Cơ Hội Việc Làm</li>
          </ul>
        </div>
        
        <div className="footer-section links">
          <h3>Tài Nguyên</h3>
          <ul>
            <li>Code Mẫu</li>
            <li>Mã Nguồn Mở</li>
            <li>Tài Liệu</li>
            <li>Hướng Dẫn</li>
            <li>Thực Hành Tốt Nhất</li>
            <li>Cộng Đồng</li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>Danh Mục</h3>
          <ul>
            <li>Lập Trình Web</li>
            <li>Lập Trình Di Động</li>
            <li>DevOps</li>
            <li>Khoa Học Dữ Liệu</li>
            <li>Học Máy</li>
            <li>Thiết Kế Hệ Thống</li>
          </ul>
        </div>

        {/* Phần Bên Phải */}
        <div className="footer-section company-details">
          <h3>Nền Tảng ShareCode</h3>
          
          <p>Thành lập: 2024</p>
          <p>Lĩnh vực: Chia sẻ kiến thức lập trình & xây dựng cộng đồng</p>
          <p>Sứ mệnh của chúng tôi là tạo ra một nền tảng hợp tác nơi các lập trình viên có thể chia sẻ và học hỏi từ code và kinh nghiệm của nhau.</p>
          <div className="social-icons">
            <span className="icon">GitHub</span>
            <span className="icon">Discord</span>
            <span className="icon">LinkedIn</span>
          </div>
        </div>
      </div>

      {/* Phần Chân Trang */}
      <div className="footer-bottom">
        <p>&copy; 2024 ShareCode. Xây dựng tương lai chia sẻ kiến thức lập trình cùng nhau.</p>
      </div>
    </footer>
  );
};

export default Footer;