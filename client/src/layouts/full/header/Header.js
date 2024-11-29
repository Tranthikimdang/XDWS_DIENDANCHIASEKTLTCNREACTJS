// src/components/header/Header.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Typography,
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';  // Firebase
import { db } from '../../../config/firebaseconfig';  // Kết nối Firebase Firestore
// components
import Profile from './Profile';
import { IconBellRinging, IconMenu, IconShoppingCart, IconHelpCircle } from '@tabler/icons-react';
import Sidebar from '../sidebar/Sidebar'; // Đường dẫn đến Sidebar.js
import { styled as muiStyled } from '@mui/system';

// Styled components
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.paper,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('lg')]: {
    minHeight: '70px',
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Header = (props) => {
  const { userName } = props;
  const navigate = useNavigate();

  // Lấy userId từ localStorage
  const userId = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).id
    : null;

  const userNamelocal = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).name
    : '';

  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false); // Trạng thái Sidebar

  // Lắng nghe sự thay đổi từ giỏ hàng trên Firebase
  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'orders'), where('user_id', '==', userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCartCount(snapshot.size);  // Cập nhật số lượng sản phẩm trong giỏ hàng
      });

      return () => unsubscribe();  // Cleanup khi component unmount
    }
  }, [userId]);

  const handleLogin = () => {
    navigate('/auth/login'); // Điều hướng tới trang login
  };

  const handleCart = () => {
    navigate('/cart'); // Điều hướng tới trang giỏ hàng
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{
              display: {
                lg: 'none',
                xs: 'inline',
              },
            }}
          >
            <IconMenu size={20} />
          </IconButton>

          <Box flexGrow={1} />

          <Stack spacing={1} direction="row" alignItems="center">
            <IconButton size="large" aria-label="show new notifications" color="inherit">
              <Badge variant="dot" color="primary">
                <IconBellRinging size={21} stroke={1.5} />
              </Badge>
            </IconButton>

            {/* Icon giỏ hàng với thông báo */}
            <IconButton size="large" aria-label="cart" color="inherit" onClick={handleCart}>
              <Badge badgeContent={cartCount} color="secondary">
                <IconShoppingCart size={24} />
              </Badge>
            </IconButton>

            {/* Hiển thị tên người dùng */}
            {localStorage.getItem('user') ? (
              <>
                <Profile />
                <Typography variant="body1" sx={{ ml: 2, color: 'text.primary' }}>
                  {userNamelocal}
                </Typography>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={handleLogin}>
                Đăng nhập
              </Button>
            )}
            
            <IconButton size="large" aria-label="help" color="inherit">
              <IconHelpCircle size={24} />
            </IconButton>
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>

      {/* Sidebar */}
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
    </>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  userName: PropTypes.string,
};

export default Header;