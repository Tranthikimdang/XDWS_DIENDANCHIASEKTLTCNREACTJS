import React, { useState } from 'react';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../../../config/firebaseconfig'; // Import Firebase config and storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons'; // Import specific icon

function FormAddUser() {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    console.log('Form Data:', formData);
    try {
      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = await addDoc(collection(db, 'users'), { ...formData, imageUrl });
      console.log('User added successfully:', docRef.id);
      setSnackbarMessage('User added successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/user'), 1000);
    } catch (error) {
      console.error('Error adding user:', error);
      setSnackbarMessage('Failed to add user.');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Generate image preview URL
    }
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
              </div>
              <input
                className="form-control bg-dark text-light"
                {...register('name', { required: true, minLength: 3, maxLength: 50 })}
              />
              {errors.name && (
                <span className="text-danger">
                  Name is required and must be between 3 and 50 characters long
                </span>
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
              {errors.email && <span className="text-danger">Valid email is required</span>}
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
              {errors.location && <span className="text-danger">Location is required</span>}
            </div>
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Số điện thoại</label>
              </div>
              <input
                className="form-control bg-dark text-light"
                {...register('phone', { required: true, pattern: /^[0-9]{10}$/ })}
              />
              {errors.phone && <span className="text-danger">Valid phone number is required</span>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div style={{ textAlign: 'left' }}>
                <label className="text-light form-label">Mật khẩu</label>
              </div>
              <input
                type="password"
                className="form-control bg-dark text-light"
                {...register('password', { required: true, minLength: 6 })}
              />
              {errors.password && (
                <span className="text-danger">Password must be at least 6 characters long</span>
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
                <option value="mentor">Mentor</option> {/* Added mentor option */}
              </select>
              {errors.role && <span className="text-danger">Role is required</span>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="custom-file-input-wrapper">
                <input
                  type="file"
                  id="fileInput"
                  className="form-control bg-dark text-light"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <div style={{ textAlign: 'left' }}>
                  <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    Chọn ảnh đại diện_<FontAwesomeIcon icon={faImage} />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              {imagePreview && (
                <div style={{ textAlign: 'left' }}>
                  <img
                    src={imagePreview}
                    alt="Selected"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">
              Thêm mới
            </button>
            <button
              className="text-light btn btn-outline-secondary"
              type="button"
              onClick={() => navigate('/admin/user')}
            >
              Quay lại
            </button>
          </div>
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

export default FormAddUser;