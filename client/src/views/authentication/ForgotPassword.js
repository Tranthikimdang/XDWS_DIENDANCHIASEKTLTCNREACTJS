// import React, { useState } from 'react';
// import { Avatar, Button, TextField, Typography, Grid, Box, Card } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { toast } from 'react-toastify';
// import apiUser from '../../apis/UserApI';

// import emailjs from 'emailjs-com';

// import PageContainer from 'src/components/container/PageContainer';

// const ForgotPassword = () => {
//   const [step, setStep] = useState(1); // Bước 1: Nhập email, Bước 2: Nhập token
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Gửi email chứa token
//   // const handleSendToken = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//   //   try {
//   //     // Tìm người dùng bằng email
//   //     const users = await apiUser.getUsersList();
//   //     const user = users.data.users.find((u) => u.email === email);

//   //     if (user) {
//   //       // Tạo token và lưu vào backend
//   //       const token = Math.random().toString(36).substring(2, 15); // Tạo token ngẫu nhiên
//   //       const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // Hạn token sau 10 phút

//   //       // Gửi yêu cầu API với đầy đủ dữ liệu
//   //       const tokenData = {
//   //         userId: user.id,  // Truyền đúng ID người dùng
//   //         token: token,      // Truyền token vừa tạo
//   //         expires_at: expiresAt, // Hạn sử dụng của token
//   //       };

//   //       await apiToken.addToken(tokenData);  // Gửi dữ liệu lên API

//   //       // Gửi email (có thể sử dụng emailjs hoặc dịch vụ email khác)
//   //       const resetLink = `${window.location.origin}/auth/reset-password/${token}`;
//   //       sendEmail({
//   //         name: user.name || 'Người dùng',
//   //         email,
//   //         message: `Mã token của bạn là: ${token}. Bạn cũng có thể nhấp vào liên kết này: ${resetLink}`,
//   //       });

//   //       toast.success('Mã token đã được gửi đến email của bạn.');
//   //       setStep(2); // Chuyển sang bước nhập token
//   //     } else {
//   //       toast.error('Không tìm thấy người dùng với email này.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Lỗi khi gửi mã token:', error);
//   //     toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Kiểm tra token
//   // const handleVerifyToken = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//     try {
//       const response = await apiToken.verifyResetToken(email, token); // Gọi API kiểm tra token
//       if (response.data.message === 'Token hợp lệ') {
//         toast.success('Token hợp lệ! Chuyển đến trang đổi mật khẩu...');
//         const users = await apiUser.getUsersList();
//         const user = users.data.users.find((u) => u.email === email);
//         const Id = user.id;
//         setTimeout(() => {
//           window.location.href = `/auth/reset-password/${Id}`;
//         }, 1500);
//       } else {
//         toast.error('Token không chính xác hoặc đã hết hạn.');
//       }
//     } catch (error) {
//       console.error('Lỗi khi kiểm tra token:', error);
//       toast.error(error.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendEmail = (data) => {
//     emailjs
//       .send(
//         process.env.REACT_APP_SERVICE_ID,
//         process.env.REACT_APP_TEMPLATE_ID,
//         {
//           to_name: data.name,
//           to_email: data.email,
//           message: data.message,
//         },
//         process.env.REACT_APP_PUBLIC_KEY
//       )
//       .then(
//         () => {
//           toast.success('Email đã được gửi thành công!');
//         },
//         () => {
//           toast.error('Đã xảy ra lỗi khi gửi email.');
//         }
//       );
//   };

//   return (
//     <PageContainer title="Quên mật khẩu" description="Trang quên mật khẩu">
//       <Box
//         sx={{
//           position: 'relative',
//           height: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           '&:before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             height: '100%',
//             width: '100%',
//             background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
//             backgroundSize: '400% 400%',
//             animation: 'gradient 15s ease infinite',
//             opacity: 0.3,
//             zIndex: -1,
//           },
//         }}
//       >
//         <Grid container justifyContent="center">
//           <Grid item xs={12} sm={8} md={6} lg={4}>
//             <Card elevation={9} sx={{ p: 4 }}>
//               <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
//                 <Avatar sx={{ bgcolor: 'primary.main' }}>
//                   <LockOutlinedIcon />
//                 </Avatar>
//               </Box>
//               <Typography variant="h5" component="h1" align="center">
//                 Quên Mật Khẩu
//               </Typography>
//               {step === 1 && (
//                 <Box component="form" onSubmit={handleSendToken} sx={{ mt: 3 }}>
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="email"
//                     label="Địa chỉ Email"
//                     name="email"
//                     autoComplete="email"
//                     autoFocus
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     sx={{ mt: 3, mb: 2 }}
//                     disabled={loading}
//                   >
//                     {loading ? 'Đang gửi...' : 'Gửi mã Token'}
//                   </Button>
//                 </Box>
//               )}
//               {step === 2 && (
//                 <Box component="form" onSubmit={handleVerifyToken} sx={{ mt: 3 }}>
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="token"
//                     label="Nhập Token"
//                     name="token"
//                     value={token}
//                     onChange={(e) => setToken(e.target.value)}
//                   />
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     sx={{ mt: 3, mb: 2 }}
//                     disabled={loading}
//                   >
//                     {loading ? 'Đang kiểm tra...' : 'Xác nhận Token'}
//                   </Button>
//                 </Box>
//               )}
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// };

// export default ForgotPassword;
