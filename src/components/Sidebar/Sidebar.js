import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faFolder,
  faSignOutAlt,
  faTachometerAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import "./sidebar.css"; // Đảm bảo file CSS sidebar.css đã được import và có các thiết lập kiểu dáng

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="" alt="Logo" /> {/* Thêm URL hoặc đường dẫn ảnh của logo vào src */}
        <h2>Admin</h2>
      </div>
      <ul>
        <li>
          <NavLink to="/">
            <FontAwesomeIcon icon={faTachometerAlt} />
            &nbsp; Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-bai-viet"> {/* Thay thế href thành to để sử dụng NavLink */}
            <FontAwesomeIcon icon={faFolder} />
            &nbsp; QL bài viết
          </NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-thanh-vien"> {/* Thay thế href thành to để sử dụng NavLink */}
            <FontAwesomeIcon icon={faUsers} />
            &nbsp; QL Thành Viên
          </NavLink>
        </li>
        <li>
          <NavLink to="/dang-xuat"> {/* Thay thế href thành to để sử dụng NavLink */}
            <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
