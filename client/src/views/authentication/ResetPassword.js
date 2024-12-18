/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockResetIcon from '@mui/icons-material/LockReset';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Card, CardContent } from '@mui/material';
import apiUser from '../../apis/UserApI'; // Import API User
import bcrypt from 'bcryptjs';
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
const ResetPassword = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newPassword = data.get('newpassword');
    const confirmPassword = data.get('confirmpassword');

    if (newPassword !== confirmPassword) {
      setSnackbarMessage('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Băm mật khẩu mới trước khi gửi lên API
      const salt = bcrypt.genSaltSync(10); // Tạo salt
      const hashedPassword = bcrypt.hashSync(newPassword, salt); // Băm mật khẩu

      // Gọi API để cập nhật mật khẩu
      await apiUser.updateUserPassword(userId, hashedPassword); // Giả định có phương thức updateUserPassword trong apiUser
      setSnackbarMessage('Đặt lại mật khẩu thành công!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
      setSnackbarMessage('Đặt lại mật khẩu thất bại, vui lòng thử lại!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ boxShadow: '4' }}>
          <CardContent sx={{ m: 3 }}>
            <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
              <LockResetIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
              Đặt Lại Mật Khẩu
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                name="newpassword"
                id="newpassword"
                label="Mật khẩu mới"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                label="Xác nhận mật khẩu"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Xác nhận
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResetPassword;
