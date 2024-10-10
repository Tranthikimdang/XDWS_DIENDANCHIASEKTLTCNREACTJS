import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Snackbar, Alert } from '@mui/material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../../config/firebaseconfig.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

function FormAddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedCategoryId = watch('categories_id');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'categories_product'));
        const categoriesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCates(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    document.querySelectorAll('pre').forEach((block) => {
      hljs.highlightElement(block);
    });
  });

  const onSubmit = async (data) => {
    try {
      if (parseFloat(data.discount) > parseFloat(data.price)) {
        setSnackbarMessage('Giá giảm không được cao hơn giá gốc');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return; // Dừng lại nếu có lỗi
      }

      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const storageRef = ref(storage, `images/${file.name}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'products'), {
          cate_pro_id: data.cate_pro_id,
          image_url: downloadURL,
          name: data.name,
          video_demo: data.video_demo,
          view: "0",
          price: parseFloat(data.price), // Chuyển đổi chuỗi thành số
          discount: parseFloat(data.discount), // Chuyển đổi chuỗi thành số
          quality: parseInt(data.quality), // Chuyển đổi chuỗi thành số nguyên
          description: data.description,
          created_at: new Date(),
          updated_at: new Date(),
        });

        setSnackbarMessage('Product added successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => navigate('/admin/products'), 500);
      } else {
        setSnackbarMessage('Image is required.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error adding product:', error.message);
      setSnackbarMessage('Failed to add product. Please try again.');
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

  const smallFontStyle = {
    fontSize: '0.9rem',
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Name
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'Name is required' })}
                style={smallFontStyle}
              />
              {errors.name && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Image
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? 'is-invalid' : ''}`}
                type="file"
                {...register('image', { required: 'Image is required' })}
              />
              {errors.image && (
                <div className="invalid-feedback" style={smallFontStyle}>
                  {errors.image.message}
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Price
              </label>
              <input
                type="number"
                step="0.01"
                className={`form-control bg-dark text-light ${errors.price ? 'is-invalid' : ''}`}
                {...register('price', { required: 'Price is required' })}
                style={smallFontStyle}
              />
              {errors.price && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.price.message}
                </span>
              )}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Discount
              </label>
              <input
                type="number"
                step="0.01"
                className={`form-control bg-dark text-light ${errors.discount ? 'is-invalid' : ''}`}
                {...register('discount', { required: 'Discount is required' })}
                style={smallFontStyle}
              />
              {errors.discount && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.discount.message}
                </span>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Quality
              </label>
              <input
                type="number"
                className={`form-control bg-dark text-light ${errors.quality ? 'is-invalid' : ''}`}
                {...register('quality', { required: 'Quality is required' })}
                style={smallFontStyle}
              />
              {errors.quality && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.quality.message}
                </span>
              )}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Category product
              </label>
              <select
                className={`form-control bg-dark text-light ${
                  errors.cate_pro_id ? 'is-invalid' : ''
                }`}
                style={smallFontStyle}
                {...register('cate_pro_id', { required: 'Category is required' })}
              >
                <option style={smallFontStyle} value="">
                  Open this select menu
                </option>
                {cates.map((cate) => (
                  <option style={smallFontStyle} key={cate.id} value={cate.id}>
                    {cate.name}
                  </option>
                ))}
              </select>
              {errors.cate_pro_id && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.cate_pro_id.message}
                </span>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Video Demo code
              </label>
              <input
                type="text"
                className={`form-control bg-dark text-light ${errors.video_demo ? 'is-invalid' : ''}`}
                {...register('video_demo', { required: 'Video demo is required' })}
                style={smallFontStyle}
              />
              {errors.video_demo && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.video_demo.message}
                </span>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="text-light form-label" style={smallFontStyle}>
              Description
            </label>
            <ReactQuill
              theme="snow"
              onChange={(description) => setValue("description", description)}
              style={{ backgroundColor: '#fff', color: '#000' }}
            />
            {errors.description && (
              <span className="text-danger" style={smallFontStyle}>
                {errors.description.message}
              </span>
            )}
          </div>
          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">
              Add product
            </button>
            <button
              className="text-light btn btn-outline-secondary"
              type="button"
              onClick={() => navigate('/admin/products')}
            >
              Back
            </button>
          </div>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
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

export default FormAddProduct;
