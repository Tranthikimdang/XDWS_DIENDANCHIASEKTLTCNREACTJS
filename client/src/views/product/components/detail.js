import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom'; // Lấy id từ URL
import { doc, getDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore'; // Sử dụng để lấy dữ liệu cụ thể từ Firestore
import { db } from '../../../config/firebaseconfig';
import { formatDistanceToNow } from 'date-fns'; // Format ngày
import './detail.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ProductsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading khi fetch dữ liệu
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // Lấy dữ liệu sản phẩm theo ID từ Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productRef = doc(db, 'products', id); // Lấy reference của sản phẩm
        const productSnap = await getDoc(productRef); // Fetch dữ liệu từ Firestore
  
        if (productSnap.exists()) {
          // Lấy dữ liệu sản phẩm và thêm id vào
          const productData = { id: productSnap.id, ...productSnap.data() }; 
          setProduct(productData); 
          console.log(productData);
        } else {
          console.error('Sản phẩm không tồn tại');
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchProduct(); // Gọi hàm nếu có ID
    }
  }, [id]);
  

  const addToCart = async (product) => {
    if (userId) {
      try {
        console.log(product);
        const querySnapshot = await getDocs(
          query(
            collection(db, 'orders'),
            where('user_id', '==', userId),
            where('product_id', '==', product.id),
          ),
        );
        
        
        if (!querySnapshot.empty) {
          setSnackbarMessage('Sản phẩm đã có trong giỏ hàng');
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
        } else {
          await addDoc(collection(db, 'orders'), {
            user_id: userId,
            product_id: product.id,
            total: 'total',
            note: '',
            order_day: new Date(),
          });

          setSnackbarMessage('Đã thêm sản phẩm vào giỏ hàng');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error adding product to cart: ', error);
        setSnackbarMessage('Lỗi khi thêm sản phẩm vào giỏ hàng');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      console.error('User is not logged in');
      setSnackbarMessage('Bạn vẫn chưa đăng nhập');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  // Hàm định dạng ngày
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <Box sx={{ padding: { xs: '10px' } }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {loading ? (
        <CircularProgress /> // Hiển thị spinner khi đang fetch dữ liệu
      ) : product ? (
        <Grid container spacing={3}>
          {/* Bố cục giao diện sản phẩm */}
          <Grid item md={12}>
            <div className="container">
              <div className="card">
                <div className="container-fliud">
                  <div className="wrapper row">
                    {/* Cột hiển thị hình ảnh sản phẩm */}
                    <div className="preview col-md-6">
                      <div
                        class="ratio ratio-16x9"
                        dangerouslySetInnerHTML={{ __html: product.video_demo }}
                      ></div>
                    </div>

                    {/* Cột hiển thị chi tiết sản phẩm */}
                    <div className="details col-md-6 ">
                      <h3 className="product-title d-flex flex-row">{product.name}</h3>
                      <div className="rating">
                        <div className="stars">
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                        </div>
                        <span className="review-no d-flex flex-row">41 reviews</span>
                      </div>
                      <p className="product-description d-flex flex-row">
                        Mô tả:{' '}
                        {product.description
                          ? product.description.replace(/(<([^>]+)>)/gi, '')
                          : 'No description available'}
                      </p>
                      <h4 className="price d-flex flex-row">
                        current price: <span> {product.price} VND</span>
                      </h4>
                      <p className="vote d-flex flex-row">
                        <strong>91%</strong> of buyers enjoyed this product!{' '}
                        <strong>(87 votes)</strong>
                      </p>
                      <div className="action">
                        <div className="d-flex flex-column mt-4">
                          <button className="btn btn-primary btn-sm" type="button">
                            Mua ngay
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm mt-2"
                            type="button"
                            onClick={() => addToCart(product)}
                          >
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      </div>
                      <Typography variant="body2" color="textSecondary" mt={2}>
                        Ngày tạo: {formatDate(product.created_at)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Typography>Không tìm thấy sản phẩm.</Typography>
      )}
    </Box>
  );
};

export default ProductsDetail;
