import React from 'react';
import './Footer.css'; // Ensure you update the CSS as needed.
import logoFooter from '../../img/logoFooter.png'; // Đảm bảo đường dẫn đúng

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-section company-info">
          <h2>Share Code</h2>
          <p>Điện thoại: 08 1919 8989</p>
          <p>Email: support@sharecode.com</p>
          <p>Địa chỉ: Toà nhà A2, Quang Trung,<br></br> Q.Cái Răng, TP.Cần Thơ.</p>
          <img src={logoFooter} alt="Logo Share Code" className="dmca-logo large-logo" />
        </div>

        {/* Center Sections */}
        <div className="footer-section links">
          <h3>Về Share Code</h3>
          <ul>
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Điều khoản sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Cơ hội hợp tác</li>
          </ul>
        </div>
        
        <div className="footer-section links">
          <h3>Chức Năng</h3>
          <ul>
            <li>Hỏi Đáp</li>
            <li>Chia Sẻ Mã</li>
            <li>Blog Lập Trình</li>
            <li>Tài Nguyên</li>
            <li>Sự Kiện</li>
            <li>Thảo Luận</li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>Cộng Đồng</h3>
          <ul>
            <li>Thành viên</li>
            <li>Điều khoản cộng đồng</li>
            <li>Chính sách đăng bài</li>
            <li>Hỗ trợ kỹ thuật</li>
            <li>Feedback</li>
            <li>FAQs</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2023 - 2024 Share Code. Nền tảng chia sẻ kiến thức lập trình hàng đầu Việt Nam.</p>
      </div>
    </footer>
  );
};

export default Footer;