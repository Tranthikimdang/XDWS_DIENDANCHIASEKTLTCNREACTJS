import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  InputBase,
  Typography,
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';  // Firebase
import { db } from '../../../config/firebaseconfig';  // Kết nối Firebase Firestore
// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import CartIcon from '@mui/icons-material/ShoppingCartCheckout';

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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = (props) => {
  const { userName, toggleMobileSidebar } = props;
  const navigate = useNavigate();

  // Lấy userId từ localStorage
  const userId = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).id
    : null;

  const userNamelocal = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).name
    : '';

  const [cartCount, setCartCount] = useState(0);

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

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <IconButton size="large" aria-label="show new notifications" color="inherit">
            <Badge variant="dot" color="primary">
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          </IconButton>

          {/* Icon giỏ hàng với thông báo */}
          <IconButton size="large" aria-label="cart" color="inherit" onClick={handleCart}>
            <Badge badgeContent={cartCount} color="secondary">
              <CartIcon />
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
            <HelpIcon />
          </IconButton>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleMobileSidebar: PropTypes.func,
  userName: PropTypes.string,
};

export default Header;
