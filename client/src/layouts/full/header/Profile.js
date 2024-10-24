import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { IconListCheck, IconMail, IconUser, IconUserCircle, IconPencil, IconBook2 } from '@tabler/icons';


// import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const navigate = useNavigate();

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const user = JSON.parse(localStorage.getItem('user'));
  const ProfileImg = user ? user.imageUrl : 'src/assets/images/profile/user-1.jpg';


  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        {user?.role === 'admin' && (
          <MenuItem component={Link} to="/admin/dashboard">
            <ListItemIcon>
              <IconUserCircle width={20} />
            </ListItemIcon>
            <ListItemText>Admin</ListItemText>
          </MenuItem>
        )}
        
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>Thông tin cá nhân</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>Thông báo</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>Khóa học của tôi</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/new-post">
          <ListItemIcon>
            <IconPencil width={20} />
          </ListItemIcon>
          <ListItemText>Thêm câu hỏi</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/new-post">
          <ListItemIcon>
            <IconBook2 width={20} />
          </ListItemIcon>
          <ListItemText>Thêm bài viết</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button onClick={handleLogout} variant="outlined" color="primary" fullWidth>
            Đăng xuất
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
