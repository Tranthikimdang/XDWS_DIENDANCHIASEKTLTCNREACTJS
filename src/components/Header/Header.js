import React from 'react';
import './header.css';

const Header = () => {
    return (
        <div className="header">
            <div className="breadcrumb">
                <span>Dashboard</span> /
            </div>
            {/* <div className="user-info">
                <span className="user-name">Nam Hoàng Văn</span>
                <img src="/user-avatar.png" alt="User Avatar" className="user-avatar" />
            </div> */}
        </div>
    );
};

export default Header;
