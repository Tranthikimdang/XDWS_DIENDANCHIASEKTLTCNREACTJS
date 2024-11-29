/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import api from '../../../../apis/CourseDetailApI'; // Import API module của bạn

function FormAddCourseDetail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { course_id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (!course_id) {
      setSnackbarMessage('Không thể lấy ID khóa học từ URL.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [course_id]);

  const smallFontStyle = {
    fontSize: '0.9rem',
  };

  const onSubmit = async (data) => {
    if (!course_id) {
      setSnackbarMessage('Không thể thêm chi tiết khóa học vì thiếu ID khóa học.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Sử dụng FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('course_id', course_id);
    formData.append('no', data.no);
    formData.append('name', data.name);
    formData.append('video', data.video[0]); // Lấy file video từ input

    try {
      await api.addCourseDetail(formData);

      setSnackbarMessage('Thêm chi tiết khóa học thành công.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/products'), 500);
    } catch (error) {
      console.error('Lỗi khi thêm chi tiết khóa học:', error.message);
      setSnackbarMessage('Không thể thêm chi tiết khóa học. Vui lòng thử lại.');
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
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Số thứ tự
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.no ? 'is-invalid' : ''}`}
                {...register('no', {
                  required: 'Số thứ tự là bắt buộc.',
                  validate: (value) => !isNaN(value) || 'Số thứ tự phải là số.',
                })}
              />
              {errors.no && <span className="text-danger">{errors.no.message}</span>}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Tên
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'Tên là bắt buộc.' })}
              />
              {errors.name && <span className="text-danger">{errors.name.message}</span>}
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Video
              </label>
              <input
                type="file"
                className={`form-control bg-dark text-light ${errors.video ? 'is-invalid' : ''}`}
                {...register('video', { required: 'File video là bắt buộc.' })}
              />
              {errors.video && <span className="text-danger">{errors.video.message}</span>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3" style={smallFontStyle}>
            Thêm Chi Tiết Khóa Học
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

export default FormAddCourseDetail;
