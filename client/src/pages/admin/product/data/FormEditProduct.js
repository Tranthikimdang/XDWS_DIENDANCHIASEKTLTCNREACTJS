import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDoc, doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../../../config/firebaseconfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function FormEditProduct() {
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
        const docRef = doc(db, 'products', id); // Lấy sản phẩm từ Firestore bằng param id
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProductData(data);
          setImagePreview(data.image_url); // Hiện hình ảnh
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
    fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const categoriesCollectionRef = collection(db, 'categories_product'); // Cập nhật đây
      const snapshot = await getDocs(categoriesCollectionRef);
      const categoryList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (productData) {
      console.log(productData.description);

      setValue('name', productData.name);
      setValue('price', productData.price);
      setValue('discount', productData.discount);
      setValue('quality', productData.quality);
      setValue('description', productData.description);
      setValue('cate_pro_id', productData.cate_pro_id);
      setValue('video_demo', productData.video_demo);
    }
  }, [productData, setValue]);

  const onSubmit = async (data) => {
    try {
      let downloadURL = imagePreview; // URL hình ảnh hiện tại

      // Nếu người dùng chọn hình mới thì upload
      if (data.image && data.image[0]) {
        const imageFile = data.image[0];
        const storageRef = ref(storage, `products/${id}/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            () => {},
            (error) => reject(error),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                downloadURL = url;
                resolve();
              });
            },
          );
        });
      }

      // Cập nhật dữ liệu
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        cate_pro_id: data.cate_pro_id,
        image_url: downloadURL,
        name: data.name,
        price: parseFloat(data.price), // Chuyển đổi chuỗi thành số
        discount: parseFloat(data.discount), // Chuyển đổi chuỗi thành số
        quality: parseInt(data.quality), // Chuyển đổi chuỗi thành số nguyên
        description: data.description,
        video_demo: data.video_demo,
        updated_at: new Date(),
      });

      setSnackbarMessage('Product updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/products'), 500);
    } catch (error) {
      console.error('Error updating Product:', error);
      setSnackbarMessage('Failed to update Product.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const onDescriptionChange = (value) => {
    setValue("description", value); // Cập nhật giá trị vào react-hook-form
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
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label">Name</label>
              <input
                className={`form-control bg-dark text-light ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <div className="text-danger">{errors.name.message}</div>}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label">Hình ảnh</label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? 'is-invalid' : ''}`}
                type="file"
                onChange={handleImageChange}
              />
              {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
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
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label">Price</label>
              <input
                type="number"
                step="0.01"
                className={`form-control bg-dark text-light ${errors.price ? 'is-invalid' : ''}`}
                {...register('price', { required: 'Price is required' })}
              />
              {errors.price && <div className="text-danger">{errors.price.message}</div>}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label">Discount</label>
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
            <div className="col-6 mb-3">
              <label className="text-light form-label">Quality</label>
              <input
                type="number"
                className={`form-control bg-dark text-light ${errors.quality ? 'is-invalid' : ''}`}
                {...register('quality', { required: 'Quality is required' })}
              />
              {errors.quality && <div className="text-danger">{errors.quality.message}</div>}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label">Category</label>
              <select
                className={`form-select bg-dark text-light ${
                  errors.cate_pro_id ? 'is-invalid' : ''
                }`}
                {...register('cate_pro_id', { required: 'Category is required' })}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.cate_pro_id && (
                <div className="text-danger">{errors.cate_pro_id.message}</div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="text-light form-label">Video demo code</label>
              <input
                type="text"
                className={`form-control bg-dark text-light ${errors.video_demo ? 'is-invalid' : ''}`}
                {...register('video_demo', { required: 'Video demo is required' })}
              />
              {errors.video_demo && <div className="text-danger">{errors.video_demo.message}</div>}
            </div>
          </div>
          <div className="mb-3">
            <label className="text-light form-label">Description</label>
            <ReactQuill
              className={`bg-dark text-light ${errors.description ? 'is-invalid' : ''}`}
              value={productData ? productData.description : ''}
              onChange={onDescriptionChange} // Sử dụng onChange để cập nhật
            />
            {errors.description && <div className="text-danger">{errors.description.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Update Product
          </button>
          <button
              className="text-light btn btn-outline-secondary "
              type="button"
              onClick={() => navigate('/admin/products')}
            >
              Back
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

export default FormEditProduct;
