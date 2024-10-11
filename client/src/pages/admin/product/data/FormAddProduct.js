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

function FormAddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [cates, setCates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');

  const smallFontStyle = {
    fontSize: '0.9rem',
  };
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'categories_product'));
        const categoriesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCates(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (parseFloat(data.discount) > parseFloat(data.price)) {
        throw new Error('Giá giảm không được cao hơn giá gốc');
      }

      let imageUrl = '';
      if (data.image[0]) {
        const file = data.image[0];
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      } else {
        throw new Error('Image is required');
      }

      await addDoc(collection(db, 'products'), {
        cate_pro_id: data.cate_pro_id,
        image_url: imageUrl,
        name: data.name,
        view: '0',
        price: parseFloat(data.price),
        discount: parseFloat(data.discount),
        quality: parseInt(data.quality),
        description: data.description,
        created_at: new Date(),
        updated_at: new Date(),
        video_demo: "video_demo"
      });

      setSnackbarMessage('Product added successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/products'), 500);
    } catch (error) {
      console.error('Error adding product:', error.message);
      setSnackbarMessage(error.message || 'Failed to add product. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
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
                Category
              </label>
              <select
                className={`form-select bg-dark text-light ${
                  errors.cate_pro_id ? 'is-invalid' : ''
                }`}
                {...register('cate_pro_id', { required: 'Category is required' })}
                style={smallFontStyle}
              >
                <option value="">Select a category</option>
                {!loading &&
                  cates.map((cate) => (
                    <option key={cate.id} value={cate.id}>
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
                Video Demo
              </label>
              <input
                className={`form-control bg-dark text-light ${
                  errors.video_demo ? 'is-invalid' : ''
                }`}
                type="file"
                {...register('video_demo', { required: 'Video is required' })}
                style={smallFontStyle}
              />
              {errors.video_demo && (
                <div className="invalid-feedback" style={smallFontStyle}>
                  {errors.video_demo.message}
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <div className="col-12 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Image
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? 'is-invalid' : ''}`}
                type="file"
                {...register('image', { required: 'Image is required' })}
                onChange={handleImageChange}
              />
              {errors.image && (
                <div className="invalid-feedback" style={smallFontStyle}>
                  {errors.image.message}
                </div>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxWidth: '160px' }}
                />
              )}
            </div>
          </div>
          <div className="mb-5">
            <label className="text-light form-label" style={smallFontStyle}>
              Description
            </label>
            <ReactQuill
              value={watch('description')} // Dùng watch để theo dõi giá trị của field
              onChange={(value) => setValue('description', value)} // Cập nhật giá trị bằng setValue
              onBlur={() => trigger('description')} // Gọi trigger để kiểm tra validation khi mất focus
              style={{ height: '100px' }}
            />
            {errors.description && (
              <span className="text-danger" style={smallFontStyle}>
                {errors.description.message}
              </span>
            )}
          </div>
            <button type="submit" className="btn btn-primary mt-3">
              Add Product
            </button>
        </form>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </DashboardLayout>
  );
}

export default FormAddProduct;
