/* eslint-disable no-unused-vars */
import React from 'react';
// import { getAuth } from 'firebase/auth'; // Import Firebase auth
import { collection, where, query, doc, setDoc, getDocs } from 'firebase/firestore'; // Import Firestore
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify'; // Thông báo khi gửi email thành công hoặc thất bại
import { db, storage } from '../../config/firebaseconfig'; // Import Firestore database
import emailjs from 'emailjs-com';

const ForgotPassword = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Nếu tìm thấy người dùng
        querySnapshot.forEach((doc) => {
          sendEmail({
            name: '',
            email: email,
            message: `Vui lòng truy cập link để đổi lại mật khẩu: http://localhost:3000/auth/reset-password/${doc.id}`,
          });

          alert('Kiểm tra email cập nhật mật khẩu');
        });
      } else {
        console.log('Không tìm thấy người dùng với email:', email);
      }
    } catch (error) {
      console.error('Lỗi khi lấy ID người dùng:', error);
    }

    try {
      // Ghi lại thông tin gửi email vào Firestore
      const timestamp = new Date();
      await setDoc(doc(db, 'passwordResetRequests', email), {
        email: email,
        timestamp: timestamp,
      });
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
          alert('Đăng ký thành công, kiểm tra email để nhận mật khẩu');
        },
        (error) => {
          alert('Đã xảy ra lỗi, vui lòng thử lại.');
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
              Forgot Password
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
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
