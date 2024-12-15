import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import api from '../../../../apis/CourseDetailApI';

function EditProductDetail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const { detailId } = useParams(); // Lấy detailId từ URL
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { course_id } = useParams();
  // Truy xuất chi tiết sản phẩm dựa trên detailId
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        // Lấy toàn bộ dữ liệu
        const allData = await api.getCourseDetailsList();

        // Tìm chi tiết sản phẩm có id trùng với detailId
        const data = allData.data.courseDetails.find((item) => item.id === parseInt(detailId));

        if (data) {
          setValue('no', data.no);
          setValue('name', data.name);
          setValue('video', data.video);
        } else {
          setSnackbarMessage('Không tìm thấy chi tiết sản phẩm.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Lỗi khi truy xuất chi tiết sản phẩm:', error);
        setSnackbarMessage('Lỗi khi truy xuất chi tiết sản phẩm.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
    fetchProductDetail();
  }, [detailId, setValue]);

  const smallFontStyle = {
    fontSize: '0.9rem',
  };
  // Xử lý cập nhật chi tiết sản phẩm
  const onSubmit = async (data) => {
    if (!detailId) {
      setSnackbarMessage('Không thể cập nhật chi tiết khóa học vì thiếu ID chi tiết.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const formData = new FormData();
    formData.append('course_id', course_id);
    formData.append('no', data.no);
    formData.append('name', data.name);
  
    // Kiểm tra và thêm video vào formData nếu có URL video (chứ không phải file)
    if (data.video && data.video.length > 0) {
      formData.append('video', data.video); // Thêm URL video vào formData
    }
  
    formData.append('updated_at', new Date().toISOString()); // Thêm ngày cập nhật
  
    // Log formData để kiểm tra
    formData.forEach((value, key) => {
      console.log(`FormData - ${key}:`, value);
    });
  
    try {
      // Gửi dữ liệu cập nhật đến API
      await api.updateCourseDetail(detailId, formData);
  
      setSnackbarMessage('Cập nhật chi tiết khóa học thành công.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/products'), 500);
    } catch (error) {
      console.error('Lỗi khi cập nhật chi tiết khóa học:', error.message);
      setSnackbarMessage('Không thể cập nhật chi tiết khóa học. Vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  
  
  // Đóng thông báo
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
                accept="video/*" 
                className={`form-control bg-dark text-light ${errors.video ? 'is-invalid' : ''}`}
                {...register('video')}
              />
              {errors.video && <span className="text-danger">{errors.video.message}</span>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3" style={smallFontStyle}>
            Cập nhật chi tiết sản phẩm
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

export default EditProductDetail;
