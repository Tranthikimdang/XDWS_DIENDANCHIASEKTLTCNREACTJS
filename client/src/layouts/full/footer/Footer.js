import React from 'react';
import './Footer.css'; // Assuming you will write the CSS separately.

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-section company-info">
          <h2>F8 Học Lập Trình Để Đi Làm</h2>
          <p>Điện thoại: 08 1919 8989</p>
          <p>Email: contact@fullstack.edu.vn</p>
          <p>Địa chỉ: Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội</p>
          <img src="dmca.png" alt="DMCA Protected" className="dmca-logo" />
        </div>

        {/* Center Sections */}
        <div className="footer-section links">
          <h3>Về F8</h3>
          <ul>
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Điều khoản</li>
            <li>Bảo mật</li>
            <li>Cơ hội việc làm</li>
          </ul>
        </div>
        
        <div className="footer-section links">
          <h3>Sản Phẩm</h3>
          <ul>
            <li>Game Nester</li>
            <li>Game CSS Diner</li>
            <li>Game CSS Selectors</li>
            <li>Game Froggy</li>
            <li>Game Froggy Pro</li>
            <li>Game Scoops</li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>Công Cụ</h3>
          <ul>
            <li>Tạo CV xin việc</li>
            <li>Rút gọn liên kết</li>
            <li>Clip-path maker</li>
            <li>Snippet generator</li>
            <li>CSS Grid generator</li>
            <li>Cảnh báo sờ tay lên mặt</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-section company-details">
          <h3>Công Ty Cổ Phần Công Nghệ Giáo Dục F8</h3>
          <p>Mã số thuế: 0109922901</p>
          <p>Ngày thành lập: 04/03/2022</p>
          <p>Lĩnh vực hoạt động: Giáo dục, công nghệ - lập trình.</p>
          <p>Chúng tôi tập trung xây dựng và phát triển các sản phẩm mang lại giá trị cho cộng đồng lập trình viên Việt Nam.</p>
          <div className="social-icons">
            <span className="icon">YouTube</span>
            <span className="icon">Facebook</span>
            <span className="icon">TikTok</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2018 - 2024 F8. Nền tảng học lập trình hàng đầu Việt Nam</p>
      </div>
    </footer>
  );
};

export default Footer;
