/* eslint-disable no-unused-vars */
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Logo from 'src/layouts/full/shared/logo/Logo';
import emailjs from 'emailjs-com';
import axios from 'axios';
import { Box } from '@mui/material';
//sql
import context from 'src/store/context';
import apiUser from '../../apis/UserApI';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { setAccount } from 'src/store/action';
import bcrypt from 'bcryptjs';
import { TextField } from '@mui/material';
const AuthRegister = ({ subtext }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phone: '',
  });
  const [state, dispatch] = useContext(context);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const imageRef = useRef(null);

  const navigate = useNavigate();
  const recordCreated = useRef();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Validate form data
  const validateForm = () => {
    let validationErrors = {};
    const { name, email, password, confirmPassword, location, phone } = formData;

    if (!name) validationErrors.name = 'Bắt buộc phải nhập tên';
    if (!email) validationErrors.email = 'Bắt buộc phải nhập Email';
    if (!password) validationErrors.password = 'Cần phải nhập mật khẩu.';
    if (!confirmPassword) validationErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu của bạn.';
    if (!location) validationErrors.location = 'Bắt buộc phải nhập vị trí.';
    if (!phone) validationErrors.phone = 'Bắt buộc phải nhập số điện thoại.';

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Mật khẩu không khớp!';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      validationErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ.';
    }

    if (password && password.length < 6) {
      validationErrors.password = 'Mật khẩu phải dài ít nhất 6 ký tự.';
    }

    return validationErrors;
  };

  // Firestore: Thêm người dùng mới
  const addUser = async (userData) => {
    try {
      const role = 'user';
      const created_at = new Date().toLocaleDateString('vi-VN');
      const updated_at = new Date().toLocaleDateString('vi-VN');
      const newUser = {
        ...userData,
        role,
        created_at,
        updated_at,
      };

      // Gọi API để thêm người dùng vào cơ sở dữ liệu
      const response = await apiUser.addUser(newUser);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      throw error;
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const users = await apiUser.getUsersList(); // Lấy tất cả người dùng

      // Kiểm tra xem có email nào trùng với email đã nhập không
      const exists = users.data.users.some((user) => user.email === email);
      return exists; // Trả về true nếu email đã tồn tại, false nếu không
    } catch (error) {
      console.error('Lỗi khi kiểm tra email:', error);
      return false; // Trả về false trong trường hợp có lỗi
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imagePath; // Trả về đường dẫn hình ảnh
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const emailExists = await checkEmailExists(formData.email);

      if (emailExists) {
        alert('Đã có tài khoản được tạo bằng email này.');
        return;
      } else {
        const file = imageRef.current.files[0];
        let imageUrl = '';
  
        if (file) {
          imageUrl = await uploadImage(file);
        }

        // **Băm mật khẩu trước khi gửi**
        const salt = bcrypt.genSaltSync(10); // Sinh Salt
        const hashedPassword = bcrypt.hashSync(formData.password, salt); // Băm mật khẩu

        const newUser = await addUser({
          ...formData,
          password: hashedPassword, // Sử dụng mật khẩu đã băm
          imageUrl,
        });

        if (newUser) {
          localStorage.setItem('user', JSON.stringify(newUser.user));
          alert('Đăng ký thành công!');
          onCancel(); // Chuyển hướng sau khi đăng ký thành công
        }
      }
    } catch (error) {
      alert('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
      console.error('Lỗi đăng ký:', error);
    }
  };

  // Xử lý khi thay đổi thông tin trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
  const onCancel = () => {
    navigate('/auth/inter');
  };

  // Hàm gửi email qua EmailJS
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
          alert('Tin nhắn đã được gửi thành công...');
          console.log(result.text);
        },
        (error) => {
          alert('Đã xảy ra lỗi, vui lòng thử lại.');
          console.log(error.text);
        },
      );
  };
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
      }}
    >
      {/* Background wrapper */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '100% 100%',
          animation: 'gradient 15s ease infinite',
          opacity: 0.3,
          zIndex: -1,
        }}
      ></div>

      {/* Content wrapper */}
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="p-4 border rounded shadow-sm bg-light">
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <div className="text-center mb-4">
                  <Logo />
                </div>
              </Box>
              <h3 className="text-center mb-4">Đăng ký</h3>
              {subtext}
              <Form onSubmit={handleRegister}>
                {/* Họ tên */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <TextField
                    label="Họ tên"
                    fullWidth
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tên của bạn"
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </div>

                {/* Ảnh đại diện */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <TextField
                    fullWidth
                    type="file"
                    name="imageUrl"
                    inputRef={imageRef} // Liên kết với ref
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl}
                  />
                </div>

                {/* Email */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <TextField
                    label="Email"
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập mail"
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </div>

                {/* Số điện thoại */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </div>

                {/* Địa chỉ */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <TextField
                    label="Địa chỉ"
                    fullWidth
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    error={!!errors.location}
                    helperText={errors.location}
                  />
                </div>

                {/* Mật khẩu */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <TextField
                    label="Mật khẩu"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập password"
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <Button
                    variant="link"
                    onClick={handleClickShowPassword}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {/* <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> */}
                  </Button>
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <TextField
                    label="Xác nhận mật khẩu"
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Xác nhận"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                  <Button
                    variant="link"
                    onClick={handleClickShowConfirmPassword}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {/* <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} /> */}
                  </Button>
                </div>

                {/* Đăng ký Button */}
                <Button type="submit" variant="primary" className="w-100 mt-3">
                  Đăng ký
                </Button>

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
              </Form>

              <div className="text-center mt-3">
                <span>Bạn đã có tài khoản? </span>
                <Link to="/home">Đăng nhập</Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthRegister;
