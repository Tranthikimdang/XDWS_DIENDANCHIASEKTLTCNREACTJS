import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Typography, Grid, Box, Card, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from 'react-toastify';
import apiUser from '../../apis/UserApI';
import emailjs from 'emailjs-com';
import PageContainer from 'src/components/container/PageContainer';
import MuiAlert from '@mui/material/Alert';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Bước 1: Nhập email, Bước 2: Nhập token
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null); // Token ngẫu nhiên
  const [timeRemaining, setTimeRemaining] = useState(60); // Thời gian còn lại (60 giây)
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'

  // Gửi email chứa token
  const handleSendToken = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tìm người dùng bằng email
      const users = await apiUser.getUsersList();
      const user = users.data.users.find((u) => u.email === email);

      if (user) {
        // Tạo token ngẫu nhiên và lưu tạm trong state
        const token = Math.random().toString(36).substring(2, 15); // Tạo token ngẫu nhiên
        setGeneratedToken(token); // Lưu token vào state

        // Gửi email chứa token
        const resetLink = `${window.location.origin}/auth/reset-password/${token}`;
        sendEmail({
          name: user.name || 'Người dùng',
          email,
          message: `Mã token của bạn là: ${token}. Bạn cũng có thể nhấp vào liên kết này: ${resetLink}`,
        });

        setSnackbarMessage('Mã token đã được gửi đến email của bạn.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); // Mở Snackbar thông báo thành công
        setStep(2); // Chuyển sang bước nhập token
      } else {
        setSnackbarMessage('Không tìm thấy người dùng với email này.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true); // Mở Snackbar thông báo lỗi
      }
    } catch (error) {
      console.error('Lỗi khi gửi mã token:', error);
      setSnackbarMessage('Đã xảy ra lỗi, vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Mở Snackbar thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra token
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const users = await apiUser.getUsersList(); // Lấy toàn bộ danh sách người dùng
      const user = users.data.users.find((u) => u.email === email); // Tìm người dùng bằng email
      if (user && token === generatedToken) {
        setSnackbarMessage('Token hợp lệ! Chuyển đến trang đổi mật khẩu...');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); // Mở Snackbar thông báo thành công
        
        const userId = user.id; // Lấy ID của người dùng
        setTimeout(() => {
          window.location.href = `/auth/reset-password/${userId}`; // Redirect đến trang reset mật khẩu
        }, 1500);
      } else {
        setSnackbarMessage('Token không chính xác hoặc đã hết hạn.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true); // Mở Snackbar thông báo lỗi
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra token:', error);
      setSnackbarMessage('Đã xảy ra lỗi, vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Mở Snackbar thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  // Đồng hồ đếm ngược (1 phút)
  useEffect(() => {
    if (timeRemaining === 0) return; // Nếu hết thời gian thì không chạy nữa
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000); // Mỗi giây giảm đi 1
    return () => clearInterval(timer); // Dọn dẹp interval khi component unmount hoặc hết thời gian
  }, [timeRemaining]);

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
          setSnackbarMessage('Tin nhắn đã được gửi thành công...');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          console.log(result.text);
        },
        (error) => {
          setSnackbarMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          console.log(error.text);
        },
      );
  };

  // Snackbar Alert Component
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <PageContainer title="Quên mật khẩu" description="Trang quên mật khẩu">
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            opacity: 0.3,
            zIndex: -1,
          },
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card elevation={9} sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
              </Box>
              <Typography variant="h5" component="h1" align="center">
                Quên Mật Khẩu
              </Typography>
              {step === 1 && (
                <Box component="form" onSubmit={handleSendToken} sx={{ mt: 3 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Địa chỉ Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi mã Token'}
                  </Button>
                </Box>
              )}
              {step === 2 && (
                <Box component="form" onSubmit={handleVerifyToken} sx={{ mt: 3 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="token"
                    label="Nhập Token"
                    name="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <Typography variant="body2" color="textSecondary" align="center">
                    Thời gian còn lại: {timeRemaining} giây
                  </Typography>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading || timeRemaining === 0}
                  >
                    {loading ? 'Đang kiểm tra...' : 'Xác nhận Token'}
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Vị trí thông báo
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ForgotPassword;
