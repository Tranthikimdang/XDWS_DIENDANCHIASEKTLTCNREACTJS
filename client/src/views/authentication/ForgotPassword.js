import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';
import apiUser from '../../apis/UserApI';

const ForgotPassword = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');

    try {
      // Gọi API để lấy toàn bộ người dùng
      const users = await apiUser.getUsersList(); // Lấy danh sách tất cả người dùng
      const user = users.data.users.find(user => user.email === email); // Tìm người dùng có email tương ứng

      if (user) {
        // Nếu tìm thấy người dùng
        sendEmail({
          name: user.name || '', // Có thể cập nhật tên nếu có thông tin
          email: email,
          message: `Vui lòng truy cập link để đổi lại mật khẩu: http://localhost:3000/auth/reset-password/${user.id}`,
        });

        toast.success('Kiểm tra email để cập nhật mật khẩu.');
      } else {
        toast.error('Không tìm thấy người dùng với email: ' + email);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
    }

    try {
      // Ghi lại thông tin gửi email vào cơ sở dữ liệu nếu cần
      const timestamp = new Date();
      await apiUser.logPasswordResetRequest(email, timestamp);
    } catch (error) {
      toast.error('Không thể gửi email reset password, vui lòng kiểm tra lại!', {
        autoClose: 5000,
        position: 'top-right',
      });
    }
  };

  const sendEmail = (data) => {
    emailjs
      .send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        {
          to_name: data.name,
          to_email: data.email,
          message: data.message,
        },
        process.env.REACT_APP_PUBLIC_KEY,
      )
      .then(
        (result) => {
          toast.success('Email đã được gửi thành công!');
        },
        (error) => {
          toast.error('Đã xảy ra lỗi khi gửi email.');
        },
      );
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
            <Avatar
              sx={{
                m: 'auto',
                bgcolor: 'primary.main',
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
              Quên Mật Khẩu
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Địa chỉ Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Đặt lại mật khẩu
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
