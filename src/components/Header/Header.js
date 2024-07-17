import React from 'react';
import './header.css';

const Header = () => {
    return (
        <div className="header">
            <div className="breadcrumb">
                <span>Dashboard</span> / Quản lý thành viên
            </div>
            <div className="user-info">
                <span>Nam Hoàng Văn</span>
                <span>Administrator</span>
                <img src="/user-avatar.png" alt="User Avatar" />
            </div>
        </div>
    );
};

export default Header;
