/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../../../apis/CourseApi';
import axios from 'axios';

function FormEditCourse() {
  const { id } = useParams(); // Lấy id từ URL param
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null); // Dữ liệu sản phẩm
  const [categories, setCategories] = useState([]); // Dữ liệu danh mục

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.getCoursesList();
        const resp = response.data.courses;
        const data = resp.find((course) => course.id === parseInt(id));
        if (data) {
          setProductData(data);
          setImagePreview(data.image);
        } else {
          throw new Error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.getCategoriesList();
        setCategories(response.data); // Cập nhật danh sách danh mục
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories(); // Gọi hàm fetchCategories ở đây
    fetchProduct(); // Gọi hàm fetchProduct
  }, [id]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (productData) {
      setValue('name', productData.name);
      setValue('price', productData.price);
      setValue('discount', productData.discount);
      setValue('description', productData.description);
      setValue('cate_course_id', productData.cate_course_id); // Đặt giá trị cate_course_id
      setValue('video_demo', productData.video_demo);
    }
  }, [productData, setValue]);

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

  const onSubmit = async (data) => {
    try {
      let imageName = productData.image; // Giữ tên tệp hình ảnh cũ nếu không có ảnh mới

      // Kiểm tra xem có hình ảnh mới hay không
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        // Upload ảnh mới lên server và nhận tên tệp
        imageName = await uploadImage(file); // Cập nhật tên tệp với ảnh mới
      }

      // Gọi API để cập nhật dữ liệu khóa học
      await api.updateCourse(id, {
        cate_course_id: data.cate_course_id, // Sử dụng đúng tên khóa ngoại
        image: imageName, // Lưu tên tệp đã upload hoặc giữ nguyên tên tệp cũ
        name: data.name,
        price: parseFloat(data.price), // Chuyển đổi chuỗi thành số
        discount: parseFloat(data.discount), // Chuyển đổi chuỗi thành số
        description: data.description,
        video_demo: data.video_demo,
        updated_at: new Date(),
      });
      

      setSnackbarMessage('Product updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/products'), 500); // Điều hướng sau khi cập nhật
    } catch (error) {
      console.error('Error updating Product:', error);
      setSnackbarMessage('Failed to update Product: ' + error.message); // Hiển thị thông báo lỗi
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
      setValue('image', e.target.files); // Lưu tệp vào react-hook-form
    }
  };

  const onDescriptionChange = (value) => {
    setValue('description', value); // Cập nhật giá trị vào react-hook-form
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
              />
              {errors.name && <div className="text-danger">{errors.name.message}</div>}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Video demo code
              </label>
              <input
                type="text"
                className={`form-control bg-dark text-light ${errors.video_demo ? 'is-invalid' : ''}`}
                {...register('video_demo', { required: 'Video demo is required' })}
              />
              {errors.video_demo && <div className="text-danger">{errors.video_demo.message}</div>}
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
              />
              {errors.price && <div className="text-danger">{errors.price.message}</div>}
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
              />
              {errors.discount && <div className="text-danger">{errors.discount.message}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Category
              </label>
              <select
                className={`form-select bg-dark text-light ${errors.cate_course_id ? 'is-invalid' : ''}`}
                {...register('cate_course_id', { required: 'Category is required' })} // Thêm validation cho danh mục
              >
                <option value="" style={smallFontStyle} disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} style={smallFontStyle}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.cate_course_id && <div className="text-danger">{errors.cate_course_id.message}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Image
              </label>
              <input
                type="file"
                className="form-control bg-dark text-light"
                accept="image/*"
                onChange={handleImageChange} // Gọi hàm xử lý thay đổi ảnh
              />
              <img src={imagePreview} alt="Preview" className="img-thumbnail mt-2" style={{ width: '100px', height: '100px' }} />
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Description
              </label>
              <ReactQuill
                className={`bg-dark text-light ${errors.description ? 'is-invalid' : ''}`}
                value={productData ? productData.description : ''} // Đảm bảo không có lỗi khi productData chưa có dữ liệu
                onChange={onDescriptionChange}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
              {errors.description && <div className="text-danger">{errors.description.message}</div>}
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">Save Changes</button>
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

export default FormEditCourse;
