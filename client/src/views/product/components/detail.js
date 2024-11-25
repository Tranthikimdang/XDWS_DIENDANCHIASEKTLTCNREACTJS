/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'; // Lấy id từ URL
import './detail.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CourseApi from '../../../apis/CourseApI';
import StudyTimeApi from '../../../apis/StudyTimeApI';
import OrderAPI from '../../../apis/OrderApI'; // Import OrderAPI
import { formatDistanceToNow } from 'date-fns'; // Format ngày
const ProductsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading khi fetch dữ liệu
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [StudyTime, setStudyTime] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchStudyTime = async () => {
      setLoading(true);
      try {
        const response = await StudyTimeApi.getStudyTimesList();
        const course = response.data.studyTimes;
        console.log(course);

        setStudyTime(course);
      } catch (error) {
        console.error('Error fetching study times:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyTime();
  }, []);

  const hasStudyAccess = (productId) => {
    return StudyTime.some(
      (study) => study.user_id === userId && study.course_id === productId
    );
  };

  useEffect(() => {
    const handleLoad = () => {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow.document;

      // Tìm và ẩn các nút cụ thể trong iframe
      const header = iframeDoc.querySelector('.drive-viewer-header');
      const downloadBtn = iframeDoc.querySelector('.drive-viewer-download');
      const btn = iframeDoc.querySelector('.ndfHFb-c4YZDc-Wrql6b');
      if (btn) btn.style.display = 'none';
      if (header) header.style.display = 'none';
      if (downloadBtn) downloadBtn.style.display = 'none';
    };

    const iframeElement = iframeRef.current;
    if (iframeElement) {
      iframeElement.addEventListener('load', handleLoad);
    }

    // Cleanup event listener
    return () => {
      if (iframeElement) {
        iframeElement.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  // Lấy dữ liệu sản phẩm theo ID từ API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await CourseApi.getCoursesList(); // Lấy toàn bộ dữ liệu khóa học
        const allCourses = response.data.courses;

        // Tìm khóa học có id phù hợp sau khi chuyển đổi id từ useParams sang số
        const foundCourse = allCourses.find(
          (course) => course.id === Number(id)
        );

        if (foundCourse) {
          setProduct(foundCourse);
        } else {
          console.error('Không tìm thấy khóa học với ID này');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const addToCart = async (product) => {
    if (userId) {
      try {
        console.log(product);
        // Check if the product is already in the cart
        const existingCartItems = await OrderAPI.getCartItems(userId);
        const isAlreadyInCart = existingCartItems.data.some(
          (item) => item.product_id === product.id
        );

        if (isAlreadyInCart) {
          setSnackbarMessage('Sản phẩm đã có trong giỏ hàng');
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
        } else {
          // Add product to cart via OrderAPI
          await OrderAPI.addCartItem({
            user_id: userId,
            product_id: product.id,
            quantity: 1, // You can modify quantity as needed
            price: product.price, // Ensure price is included
            added_at: new Date(),
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
  const formatDate = (createdAt) => {
    if (!createdAt) return 'N/A';

    const date = new Date(createdAt);
    if (isNaN(date)) return 'Invalid date';

    return formatDistanceToNow(date, { addSuffix: true });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const getEmbedLink = (videoDemo) => {
    // Kiểm tra nếu link có dạng "/view", chuyển thành "/preview"
    if (videoDemo.includes('/view')) {
      return videoDemo.replace('/view', '/preview');
    }

    // Kiểm tra nếu link là dạng link YouTube và chuyển thành dạng nhúng
    if (
      videoDemo.includes('youtube.com') ||
      videoDemo.includes('youtu.be')
    ) {
      const videoId = videoDemo.includes('youtube.com')
        ? videoDemo.split('v=')[1] // Lấy ID từ link YouTube dài
        : videoDemo.split('youtu.be/')[1]; // Lấy ID từ link YouTube ngắn
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return videoDemo; // Trả về videoDemo nếu không có thay đổi
  };

  return (
    <Box sx={{ padding: { xs: '10px' } }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
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
                <div className="container-fluid">
                  <div className="wrapper row">
                    {/* Cột hiển thị hình ảnh sản phẩm */}
                    <div className="preview col-md-6">
                      <div
                        className="ratio ratio-16x9"
                        dangerouslySetInnerHTML={{
                          __html: `<iframe src="${getEmbedLink(
                            product.video_demo
                          )}" width="640" height="480" allow="autoplay" allowfullscreen></iframe>`,
                        }}
                      ></div>
                      <div className="overlay" id="overlay"></div>
                    </div>

                    {/* Cột hiển thị chi tiết sản phẩm */}
                    <div className="details col-md-6 ">
                      <h3 className="product-title d-flex flex-row">
                        {product.name}
                      </h3>
                      <div className="rating">
                        <div className="stars d-flex flex-row">
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                        </div>
                        <span className="review-no d-flex flex-row">
                          41 người xem khóa học này
                        </span>
                      </div>
                      <p className="product-description d-flex flex-row">
                        Mô tả:{' '}
                        {product.description
                          ? product.description.replace(/(<([^>]+)>)/gi, '')
                          : 'No description available'}
                      </p>
                      <h5 className="price d-flex flex-row ">
                        Giá khóa học: <span> {product.price} VND</span>
                      </h5>
                      <p className="vote d-flex flex-row">
                        <strong>91%</strong>
                        người mua rất thích sản phẩm này!{' '}
                        <strong>(87 votes)</strong>
                      </p>
                      <div className="action">
                        <div className="d-flex flex-column mt-4">
                          {/* Kiểm tra quyền truy cập để hiển thị nút */}
                          {hasStudyAccess(product.id) ? (
                            <button
                              className="btn btn-success btn-sm"
                              type="button"
                              onClick={() =>
                                navigate(`/productDetailUser/${product.id}`)
                              }
                            >
                              Bắt đầu học
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                type="button"
                                onClick={() => {
                                  navigate(`/purchase/${product.id}`);
                                }} // Navigate to purchase page if needed
                              >
                                Mua ngay
                              </button>
                              <button
                                className="btn btn-outline-primary btn-sm mt-2"
                                type="button"
                                onClick={() => addToCart(product)}
                              >
                                Thêm vào giỏ hàng
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        mt={2}
                      >
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