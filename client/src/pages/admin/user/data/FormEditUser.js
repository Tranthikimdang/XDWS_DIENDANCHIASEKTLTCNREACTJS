import React, { useEffect, useState } from 'react';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../../config/firebaseconfig';
import '../index.css';

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, 'users', id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setData(userDoc.data());
            setValue('name', userDoc.data().name);
            setValue('email', userDoc.data().email);
            setValue('location', userDoc.data().location);
            setValue('phone', userDoc.data().phone);
            setValue('birthday', userDoc.data().birthday || '');
            setValue('cardId', userDoc.data().cardId || '');
            setValue('password', userDoc.data().password || '');
            setValue('role', userDoc.data().role || 'user');
            setImagePreview(userDoc.data().imageUrl || '');
          } else {
            setSnackbarMessage('User not found.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
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

  const uploadImageToStorage = async (file) => {
    const storageRef = ref(storage, `images/${id}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const sanitizeData = (formData) => {
    const sanitizedData = { ...formData };
    Object.keys(sanitizedData).forEach((key) => {
      if (sanitizedData[key] === undefined) {
        sanitizedData[key] = null;
      }
    });
    return sanitizedData;
  };

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
        imageUrl = await uploadImageToStorage(imageFile);
      }

      const sanitizedData = sanitizeData(formData);
      const userRef = doc(db, 'users', id);

      await updateDoc(userRef, {
        ...sanitizedData,
        imageUrl,
      });

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
                type="email"
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
            <label className="text-light form-label">Thay đổi ảnh</label>
              </div>
              <input
                type="file"
                className="form-control bg-dark text-light"
                onChange={handleImageChange}
              />
            </div>
            <div className="col-md-6 mb-3 text-center">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </div>
          </div>

          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">
              Sửa
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

export default FormEditUser;
