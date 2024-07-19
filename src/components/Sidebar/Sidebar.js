import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  
  faFolder,
  faSignOutAlt,
  faTachometerAlt,
  faUsers,
  faComment
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import logo from "./S.jpg"; // Adjust the path as necessary
import "./sidebar.css"; // Ensure the sidebar.css file is imported for styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-img" /> {/* Add the logo image here */}
        <h2>Admin</h2>
      </div>
      <ul>
        <li>
          <NavLink to="/" activeClassName="active">
            <FontAwesomeIcon icon={faTachometerAlt} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-bai-viet" activeClassName="active">
            <FontAwesomeIcon icon={faFolder} />
            <span>Quản lí bài viết</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-thanh-vien" activeClassName="active">
            <FontAwesomeIcon icon={faUsers} />
            <span>Quản lí Thành Viên</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-binh-luan" activeClassName="active">
            <FontAwesomeIcon icon={faComment} />
            <span>Bình Luận</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dang-xuat" activeClassName="active">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Đăng xuất</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
