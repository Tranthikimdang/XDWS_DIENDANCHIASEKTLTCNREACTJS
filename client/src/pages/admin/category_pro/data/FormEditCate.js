import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../config/firebaseconfig';

function FormEditCate() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // Dữ liệu danh mục
  const [categories, setCategories] = useState([]);
  const { setError } = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '', // Giá trị mặc định
    },
  });

  // Lấy danh mục hiện tại và danh sách tất cả danh mục
  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        // Lấy danh mục hiện tại
        const categoryDocRef = doc(db, 'categories_product', id);
        const categoryDoc = await getDoc(categoryDocRef);
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data();
          setData(categoryData); // Lưu dữ liệu vào state
          setValue('name', categoryData.name); // Gán dữ liệu vào form
        } else {
          console.log('Danh mục không tồn tại');
          navigate('/admin/categorypro'); // Điều hướng nếu không tìm thấy danh mục
        }
      }

      // Lấy danh sách tất cả các danh mục
      const categoriesCollectionRef = collection(db, 'categories_product');
      const categoriesSnapshot = await getDocs(categoriesCollectionRef);
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesList); // Lưu danh sách các danh mục vào state
    };

    fetchCategory();
  }, [id, setValue, navigate]);

  // Hàm xử lý khi người dùng submit form
  const onSubmit = async (formData) => {
    setLoading(true);

    // Kiểm tra tên danh mục đã tồn tại chưa, loại trừ danh mục đang chỉnh sửa
    const isNameExists = categories.some(
      (category) =>
        category.name.toLowerCase() === formData.name.toLowerCase() && category.id !== id,
    );

    if (isNameExists) {
      setError('name', { type: 'manual', message: 'Tên danh mục đã tồn tại.' });
      setSnackbarMessage('Tên danh mục đã tồn tại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      // Cập nhật danh mục
      const categoryDocRef = doc(db, 'categories_product', id);
      await updateDoc(categoryDocRef, { name: formData.name, updated_at: new Date() });

      setSnackbarMessage('Cập nhật danh mục thành công.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => navigate('/admin/categorypro'), 500);
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      setSnackbarMessage('Cập nhật danh mục thất bại. Vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="text-light form-label">
              Tên danh mục
            </label>
            <input
              className="form-control bg-dark text-light"
              type="text"
              id="name"
              {...register('name', { required: true, minLength: 3, maxLength: 20 })}
              disabled={loading} // Vô hiệu hóa input khi đang xử lý
            />
            {errors.name && errors.name.type === 'required' && (
              <span className="text-danger">Tên danh mục là bắt buộc</span>
            )}
            {errors.name && errors.name.type === 'minLength' && (
              <span className="text-danger">Tên phải có ít nhất 3 ký tự</span>
            )}
            {errors.name && errors.name.type === 'maxLength' && (
              <span className="text-danger">Tên phải có ít hơn 20 ký tự</span>
            )}
          </div>

          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Sửa'}
            </button>
            <Link to="/admin/categorypro" className="btn btn-outline-light ms-3">
              Quay lại
            </Link>
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

export default FormEditCate;
