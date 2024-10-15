import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'; // Sử dụng useParams để lấy product_id từ URL
import { Snackbar, Alert } from '@mui/material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebaseconfig.js'; // Firebase config
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout/index.js';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar/index.js';

function FormAddProductDetail() {
  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm();
  const navigate = useNavigate();
  const { product_id } = useParams(); // Lấy product_id từ URL
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [cates, setCates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kiểm tra nếu không lấy được product_id
  useEffect(() => {
    if (!product_id) {
      setSnackbarMessage('Không thể lấy ID sản phẩm từ URL.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [product_id]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'categories_product'));
        const categoriesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCates(categoriesList);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    if (!product_id) {
      setSnackbarMessage('Không thể thêm chi tiết sản phẩm vì thiếu ID sản phẩm.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      await addDoc(collection(db, 'product_detail'), {
        product_id: product_id, // Lưu product_id từ URL
        no: data.no,
        name: data.name,
        video: data.video,
        created_at: new Date(),
        updated_at: new Date(),
      });

      setSnackbarMessage('Thêm chi tiết sản phẩm thành công.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/products'), 500);
    } catch (error) {
      console.error('Lỗi khi thêm chi tiết sản phẩm:', error.message);
      setSnackbarMessage('Không thể thêm chi tiết sản phẩm. Vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label">Số thứ tự</label>
              <input
                className={`form-control bg-dark text-light ${errors.no ? 'is-invalid' : ''}`}
                {...register('no', {
                  required: 'Số thứ tự là bắt buộc.',
                  validate: value => !isNaN(value) || 'Số thứ tự phải là số.',
                })}
              />
              {errors.no && (
                <span className="text-danger">{errors.no.message}</span>
              )}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label">Tên</label>
              <input
                className={`form-control bg-dark text-light ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'Tên là bắt buộc.' })}
              />
              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="text-light form-label">Video</label>
              <input
                className={`form-control bg-dark text-light ${errors.video ? 'is-invalid' : ''}`}
                {...register('video', { required: 'Liên kết video là bắt buộc.' })}
              />
              {errors.video && (
                <span className="text-danger">{errors.video.message}</span>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">Thêm Chi Tiết Sản Phẩm</button>
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

export default FormAddProductDetail;
