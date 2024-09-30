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
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { GoogleLogin } from 'react-google-login';
import { collection, getDocs } from 'firebase/firestore';
import { db} from '../../../config/firebaseconfig';
import emailjs from 'emailjs-com';
// import FacebookLogin from '@greatsumini/react-facebook-login';
import context from 'src/store/context';
import { setAccount } from 'src/store/action';


const AuthLogin = ({ title, subtitle, subtext }) => {
  const [state, dispatch] = useContext(context)
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
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const user = users.find((user) => user.email === email && user.password === password);

      if (user) {
        dispatch(setAccount(user))
        localStorage.setItem('user', JSON.stringify(user));
          navigate('/home')
      } else {
        alert('Email hoặc mật khẩu chưa hợp lệ');
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
      console.error('Lỗi đăng nhập:', error);
    }
  };

  const responseGoogle = async (response) => {
    console.log(response);
    // if (!response || !response.profileObj) {
    //   console.error('Response không hợp lệ:', response);
    //   return;
    // }

    // const email = response.profileObj.email; // Lấy email từ response

    // try {
    //   // Kiểm tra xem người dùng đã tồn tại trong localStorage chưa
    //   const storedUserData = localStorage.getItem('users'); // Giả sử bạn lưu danh sách người dùng ở đây
    //   const users = storedUserData ? JSON.parse(storedUserData) : [];

    //   const existingUser = users.find((user) => user.email === email);

    //   if (existingUser) {
    //     // Nếu người dùng đã tồn tại, lưu thông tin vào localStorage và chuyển hướng
    //     localStorage.setItem('user', JSON.stringify(existingUser));
    //     navigate('/home'); // Chuyển hướng đến trang dashboard
    //     return;
    //   }

    //   // Tạo một mật khẩu ngẫu nhiên cho người dùng mới
    //   const generateRandomPassword = () => {
    //     return Math.random().toString(36).slice(-8); // Tạo chuỗi ngẫu nhiên 8 ký tự
    //   };
    //   const generatedPassword = generateRandomPassword();

    //   const newUser = {
    //     name: response.profileObj.name,
    //     email: email,
    //     password: generatedPassword,
    //     location: '', // Cung cấp thông tin nếu cần
    //     phone: '', // Cung cấp thông tin nếu cần
    //     role: 'user',
    //   };

    //   // Lưu người dùng mới vào localStorage
    //   users.push(newUser);
    //   // localStorage.setItem("users", JSON.stringify(users));
    //   localStorage.setItem('users', JSON.stringify(newUser));

    //   // Gửi email thông báo mật khẩu cho người dùng
    //   sendEmail({
    //     name: newUser.name,
    //     email: newUser.email,
    //     message: `Mật khẩu của bạn là: ${generatedPassword}`,
    //   });

    //   alert('Đăng ký thành công, kiểm tra email để nhận mật khẩu');
    //   navigate('/dashboard'); // Chuyển hướng đến trang dashboard
    // } catch (error) {
    //   console.error('Lỗi khi đăng nhập Google:', error);
    // }
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
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <form onSubmit={handleLogin} ref={form}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
              mb="5px"
            >
              Họ và tên
            </Typography>
            <CustomTextField
              id="username"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Mật khẩu
            </Typography>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={handleSetRememberMe} />}
                label="Ghi nhớ tôi?"
              />
            </FormGroup>
            <Typography
              component={Link}
              to="/auth/register"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Đăng ký tài khoảng?
            </Typography>
          </Stack>
        </Stack>
        <Box mt={3}>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Đăng nhập
          </Button>
        </Box>
        <Box mt={3}>
          <Typography

            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main'
            }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <Box mt={4} mb={1} textAlign="center">
          <div className="google-login-btn m-3 border-0">
            <GoogleLogin

              clientId="377354154325-optua6nsafe99lnk5it29j2v20bsfi25.apps.googleusercontent.com"
              buttonText=""
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              redirectUri={process.env.REACT_APP_REDIRECT_URI}
              ux_mode="popup"
              render={(renderProps) => (
                <button
                  className="google-login-btn btn border-0 btn-outline-info"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <img
                    className="google-icon"
                    src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0"
                    alt="Google"
                    style={{ width: '24px', height: '24px', marginRight: '8px' }}
                  />
                  Đăng nhập với Google
                </button>
              )}
            />
          </div>
        </Box>
        {subtitle}
      </form>
    </>
  );
};

export default AuthLogin;
