import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from '@mui/material';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import emailjs from 'emailjs-com';
import context from 'src/store/context';
import { setAccount } from 'src/store/action';
import apiUser from '../../../apis/UserApI';
import bcrypt from 'bcryptjs';
import { TextField } from '@mui/material';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [state, dispatch] = useContext(context);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const form = useRef();
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/home');
    }
  }, [navigate]);
  const validate = () => {
    let valid = true;
    let errors = {};

    if (!email) {
      errors.email = 'Bạn chưa điền Email';
      valid = false;
    } else if (!validateEmailFormat(email)) {
      errors.email = 'Sai định dạng email';
      valid = false;
    }

    if (!password) {
      errors.password = 'Bạn chưa điền mật khẩu';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Gọi API để lấy danh sách người dùng
      const response = await apiUser.getUsersList();

      if (!response || !response.data) {
        alert('Không thể lấy danh sách người dùng.');
        return;
      }

      const user = response.data.users.find((user) => user.email === email);

      if (user) {
<<<<<<< HEAD
        // So sánh mật khẩu nhập vào với mật khẩu đã băm
        const isMatch = await bcrypt.compare(password, user.password);
=======
        
        // So sánh mật khẩu nhập vào với mật khẩu đã băm
        const isMatch = await bcrypt.compare(password, user.password);
        
>>>>>>> 9e70bbc752dce3fe5e502875a9cc28948cf60de6
        if (isMatch) {
          // Nếu thông tin đăng nhập hợp lệ
          dispatch(setAccount(user));
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/home');
        } else {
          alert('Mật khẩu không đúng.');
        }
      } else {
        alert('Email không tồn tại.');
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
      console.error('Lỗi đăng nhập:', error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Lấy thông tin người dùng từ Google
        const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());

        const { email, name } = profile;

        // Kiểm tra người dùng có tồn tại trong hệ thống không
        const {
          data: { users },
        } = await apiUser.getUsersList();
        const existingUser = users.find((user) => user.email === email);

        if (existingUser) {
          // Nếu có, lưu thông tin người dùng vào localStorage và dispatch account
          localStorage.setItem('user', JSON.stringify(existingUser));
          dispatch(setAccount(existingUser));
          navigate('/home');
        } else {
          // Nếu không có, tạo người dùng mới
          const rawPassword = Math.random().toString(36).slice(-8); // Mật khẩu ngẫu nhiên
          const hashedPassword = bcrypt.hashSync(rawPassword, 10); // Băm mật khẩu trước khi lưu

          const newUser = { name, email, password: hashedPassword, role: 'user' };

          const { data: createdUser } = await apiUser.addUser(newUser);

          if (createdUser) {
            // Lưu thông tin người dùng mới vào localStorage và dispatch account
            localStorage.setItem('user', JSON.stringify(createdUser));
            dispatch(setAccount(createdUser));

            // Gửi email thông báo mật khẩu
            sendEmail({
              name: newUser.name,
              email: newUser.email,
              message: `Mật khẩu của bạn là: ${rawPassword}`, // Gửi mật khẩu gốc (chưa băm)
            });

            alert('Đăng ký thành công, kiểm tra email để nhận mật khẩu');
            navigate('/auth/inter');
          }
        }
      } catch (error) {
        console.error('Lỗi trong xử lý đăng nhập Google:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại.');
      }
    },
    onError: (error) => {
      console.error('Lỗi Google Login:', error);
    },
  });

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
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          {/* Email */}
          <Box>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Box>

          {/* Password */}
          <Box>
            <TextField
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Box>

          {/* Remember me Checkbox */}
          <Box>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={handleSetRememberMe} />}
                label="Ghi nhớ tôi?"
              />
            </FormGroup>
          </Box>

          {/* Register Link */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              component={Link}
              to="/auth/register"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Đăng ký tài khoản?
            </Typography>
          </Box>

          {/* Submit Button */}
          <Box mt={3}>
            <Button color="primary" variant="contained" size="large" fullWidth type="submit">
              Đăng nhập
            </Button>
          </Box>

          {/* Forgot Password Link */}
          <Box mt={3}>
            <Typography
              component={Link}
              to="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Quên mật khẩu?
            </Typography>
          </Box>

          {/* Google Login Button */}
          <div>
            <Box
              mt={4}
              mb={1}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                variant="outlined"
                color="info"
                className="google-login-btn btn border-0 btn-outline-info"
                onClick={googleLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 16px',
                  textTransform: 'none',
                }}
              >
                <img
                  src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0"
                  alt="Google"
                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                />
                Đăng nhập với Google
              </Button>
            </Box>
          </div>

          {/* Subtitle */}
          {subtitle}
        </Stack>
      </form>
    </>
  );
};

export default AuthLogin;
