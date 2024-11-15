/* eslint-disable no-unused-vars */
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useState } from 'react';
import Logo from 'src/layouts/full/shared/logo/Logo';
import emailjs from 'emailjs-com';
import { GoogleLogin } from 'react-google-login';
import axios from "axios";
import { Box } from '@mui/material';
//sql
import apiUser from '../../apis/UserApI';

const AuthRegister = ({ subtext }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const exists = users.data.users.some(user => user.email === email);
      return exists; // Trả về true nếu email đã tồn tại, false nếu không
    } catch (error) {
      console.error('Lỗi khi kiểm tra email:', error);
      return false; // Trả về false trong trường hợp có lỗi
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.imagePath; // Trả về đường dẫn hình ảnh
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image. Please try again.");
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
        const file = e.target.elements.formImageUrl.files[0];
        let imageUrl = '';

        if (file) {
          imageUrl = await uploadImage(file);
        }

        const newUser = await addUser({
          ...formData,
          imageUrl,
        });

        if (newUser) {
          localStorage.setItem('user', JSON.stringify(newUser));
          alert('Đăng ký thành công!');
          onCancel();  // Chuyển hướng sau khi đăng ký thành công
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

  const checkEmailGoogle = async (email) => {
    try {
      // Giả sử bạn có một API để lấy tất cả người dùng
      const response = await apiUser.getAllUsers(); // Gọi API để lấy danh sách người dùng
      const users = response.data.users; // Dữ liệu trả về từ API

      // Kiểm tra xem có người dùng nào có email khớp hay không
      const exists = users.some(user => user.email === email); // Trả về true nếu có ít nhất một người dùng có email khớp
      return exists;
    } catch (error) {
      console.error('Lỗi khi kiểm tra email:', error);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  };

  const responseGoogle = async (response) => {
    if (response.error) {
      console.error(response.error);
      return;
    }

    const email = response;

    // try {
    //   const emailExists = await checkEmailGoogle(email);

    //   const generateRandomPassword = () => {
    //     return Math.random().toString(36).slice(-8); // Tạo chuỗi ngẫu nhiên 8 ký tự
    //   };
    //   const generatedPassword = generateRandomPassword();

    //   if (emailExists) {
    //     alert('Tài khoản đã tồn tại với email này.');
    //     return;
    //   }

    //   // Nếu email không tồn tại, tạo người dùng mới
    //   const newUser = {
    //     name: response.wt.Ad,
    //     email: response.wt.cu,
    //     password: generatedPassword,
    //     location: '', // Cung cấp thông tin nếu cần
    //     phone: '', // Cung cấp thông tin nếu cần
    //     role: 'user',
    //   };

    //   await addUser(newUser);
    //   localStorage.setItem('user', JSON.stringify(newUser));

    //   // Gửi email chứa mật khẩu
    //   sendEmail({
    //     name: newUser.name,
    //     email: newUser.email,
    //     message: `Mật khẩu của bạn là: ${generatedPassword}`,
    //   });

    //   alert('Đăng ký thành công, kiểm tra email để nhận mật khẩu');
    // } catch (error) {
    //   console.error('Error during Google login:', error);
    // }
  };

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
                <Form.Group controlId="formName">
                  <Form.Label className="d-flex justify-content-start">Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tên của bạn"
                    isInvalid={!!errors.name} // Kiểm tra lỗi cho input này
                  />
                  {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                </Form.Group>
                <Form.Group controlId="formImageUrl">
                  <Form.Label className="d-flex justify-content-start">Ảnh đại diện</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageUrl"
                    // Không cần sử dụng value cho input file
                    onChange={handleChange}
                    isInvalid={!!errors.imageUrl}
                  />
                  {errors.imageUrl && (
                    <Form.Text className="text-danger">{errors.imageUrl}</Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label className="d-flex justify-content-start">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập mail"
                    isInvalid={!!errors.email}
                  />
                  {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <Form.Label className="d-flex justify-content-start">Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    isInvalid={!!errors.phone}
                  />
                  {errors.phone && <Form.Text className="text-danger">{errors.phone}</Form.Text>}
                </Form.Group>
                <Form.Group controlId="formLocation">
                  <Form.Label className="d-flex justify-content-start">Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    isInvalid={!!errors.location}
                  />
                  {errors.location && (
                    <Form.Text className="text-danger">{errors.location}</Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label className="d-flex justify-content-start">Mật khẩu</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập password"
                      isInvalid={!!errors.password}
                    />
                    {errors.password && (
                      <Form.Text className="text-danger">{errors.password}</Form.Text>
                    )}
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
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label className="d-flex justify-content-start">
                    Xác nhận mật khẩu
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Xác nhận"
                      isInvalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
                    )}
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
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </Button>
                  </div>
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100 mt-3">
                  Đăng ký
                </Button>
                <div
                  style={{
                    // Chỉnh sửa cú pháp style
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div className="google-login-btn m-3 border-0">
                    <GoogleLogin
                      clientId="270409308877-6u9dv3fmnf2kdn7gb0d6aqbegrnlmqvo.apps.googleusercontent.com"
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
                          Đăng nhập với google
                        </button>
                      )}
                    />
                  </div>
                </div>
              </Form>

              <div className="text-center mt-3">
                <span>Bạn đã có tài khoản? </span>
                <Link to="/auth/login">Đăng nhập</Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Container> 
    </div>
  );
};

export default AuthRegister;
