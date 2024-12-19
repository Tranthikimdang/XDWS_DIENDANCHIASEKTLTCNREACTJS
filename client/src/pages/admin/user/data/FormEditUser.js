import React, { useEffect, useState } from 'react';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Snackbar, Alert } from '@mui/material';
import '../index.css';
import UserApi from 'src/apis/UserApI';
import axios from 'axios';

function FormEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [data, setData] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      location: '',
      phone: '',
      birthday: '',
      cardId: '',
      password: '',
      role: 'user',
    },
  });
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserApi.getUsersList();

        const userData = response.data.users.find((user) => user.id == id);

        console.log(userData);

        if (userData) {
          setData(userData);
          setValue('name', userData.name);
          setValue('email', userData.email);
          setValue('location', userData.location);
          setValue('phone', userData.phone);
          setValue('birthday', userData.birthday || '');
          setValue('cardId', userData.cardId || '');
          setValue('password', userData.password || '');
          setValue('confirmPassword', userData.password || '');
          setValue('role', userData.role || 'user');
          setImagePreview(userData.imageUrl || '');
        } else {
          setSnackbarMessage('User not found.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserData();
  }, [id, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const watchPassword = watch('password');
  const watchConfirmPassword = watch('confirmPassword');

  const onSubmit = async (formData) => {
    if (!id) {
      setSnackbarMessage('User ID is missing. Cannot update the user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const sanitizedData = { ...formData, imageUrl };

      await UserApi.updateUser(id, sanitizedData);

      setSnackbarMessage('User updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => navigate('/admin/user'), 1000);
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbarMessage('Failed to update user.');
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
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container small-text">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Tên tài khoản</label>
              </div>{' '}
              <input
                className="form-control bg-dark text-light"
                {...register('name', { required: true, minLength: 3, maxLength: 50 })}
              />
              {errors.name && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger form-label">
                    Name is required and must be between 3 and 50 characters long
                  </span>
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Email</label>
              </div>
              <input
                className="form-control bg-dark text-light"
                {...register('email', {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                })}
              />
              {errors.email && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger form-label">Valid email is required</span>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            {/* Các trường nhập dữ liệu khác... */}
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Ngày sinh</label>
              </div>
              <input
                type="date"
                className="form-control bg-dark text-light"
                {...register('birthday', { required: true })}
              />
              {errors.birthday && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger form-label">Bạn phải điền này sinh</span>
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Phân quyền</label>
              </div>
              <select
                className="form-control bg-dark text-light"
                {...register('role', { required: true })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger form-label">Bạn phải phân quyền</span>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Địa chỉ</label>
              </div>
              <input
                className="form-control bg-dark text-light"
                {...register('location', { required: true })}
              />
              {errors.location && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger form-label">Bạn phải điền địa chỉ</span>
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Số điện thoại</label>
              </div>
              <input
                className="form-control bg-dark text-light"
                {...register('phone', { required: true, pattern: /^[0-9]{10}$/ })}
              />
              {errors.phone && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger  form-label">Số điện thoại phải là số</span>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Mật khẩu</label>
              </div>
              <input
                type="text"
                className="form-control bg-dark text-light"
                {...register('password', { required: true, minLength: 6 })}
              />
              {errors.password && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger form-label">Mật khẩu phải trên 6 kí tự</span>
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Xác nhận mật khẩu</label>
              </div>
              <input
                type="text"
                className="form-control bg-dark text-light"
                {...register('confirmPassword', {
                  required: false,
                  validate: (value) => value === watchPassword || 'Mật khẩu xác nhận không giống',
                })}
              />
              {errors.confirmPassword && (
                <div style={{ textAlign: 'left' }}>
                  <span className="text-danger form-label">{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>
          </div>
          {/* Trường dữ liệu Hình ảnh */}
          <div className="col-12 mb-3">
            <label className="text-light form-label">Hình ảnh</label>
            <input
              className="form-control bg-dark text-light"
              type="file"
              onChange={handleImageChange}
            />
            {errors.image && <div className="text-danger form-label">{errors.image.message}</div>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxWidth: '160px' }}
              />
            )}
          </div>
          <Box display="flex" justifyContent="flex-end" mt={3} alignItems="center">
            <button
              className="text-light btn btn-outline-secondary"
              type="button"
              onClick={() => navigate('/admin/user')}
            >
              Quay lại
            </button>
            <button className="text-light btn btn-outline-info me-2" type="submit">
              Cập nhật người dùng
            </button>
          </Box>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default FormEditUser;
