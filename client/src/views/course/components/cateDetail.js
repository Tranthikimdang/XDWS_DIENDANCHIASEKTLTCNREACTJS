import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Pagination, TextField, InputAdornment, } from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
// Firebase
import '../index.css';
import CourseApi from '../../../apis/CourseApI';
import CateCourseApi from '../../../apis/Categories_courseApI';
import StudyTimeApi from '../../../apis/StudyTimeApI';
import UserAPI from '../../../apis/UserApI';

const Products = () => {
  const navigate = useNavigate();
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { id: cateId } = useParams(); // Lấy ID danh mục từ tham số
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [StudyTime, setStudyTime] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    const fetchStudyTime = async () => {
      setLoading(true);
      try {
        const response = await StudyTimeApi.getStudyTimesList();
        const course = response.data.studyTimes;
        console.log(course);

        setStudyTime(course);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyTime();
  }, []);

  // Fetch products based on category ID
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await CourseApi.getCoursesList();
        const course = response.data.courses;
        
        // Lấy danh sách người dùng
        const responseuse = await UserAPI.getUsersList();
        const usersData = responseuse.data.users;

        // Lấy thông tin người dùng cho mỗi khóa học
        const coursesWithUsers = course.map((courseItem) => {
          const matchingUser = usersData.find((user) => user.id == courseItem.userId);
          return { ...courseItem, user: matchingUser }; // Gắn người dùng vào khóa học
        });

        setProducts(coursesWithUsers); // Cập nhật khóa học với người dùng tương ứng
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []); 

  // Fetch categories using API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true); // Start loading
      try {
        const response = await CateCourseApi.getList(); // Fetch categories
        const categories = response || []; // Ensure you have data

        setCates(categories); // Save categories to state

        // Create a map for categories
        const categoriesMap = categories.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        console.log('categoriesMap', categoriesMap);
        console.log('cateId:', cateId);
        setCatesMap(categoriesMap); // Save categories map to state
      } catch (error) {
        console.error('Error fetching categories:', error); // Log errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCategories(); // Call the function
  }, []);

  const addToCart = async (product) => {
    if (userId) {
      try {
        // Thêm sản phẩm vào giỏ hàng logic
      } catch (error) {
        console.error('Error adding product to cart: ', error);
      }
    } else {
      console.error('User is not logged in');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Move the filteredProducts definition here
  const filteredProducts = products.filter((product) => {
    const isInCategory = String(product.cate_course_id) === String(cateId); // Ensure the comparison is valid
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return isInCategory && matchesSearchTerm;
  });
  const hasStudyAccess = (productId) => {
    return StudyTime.some((study) => study.user_id == userId && study.course_id == productId);
  };

  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <PageContainer title="products" description="This is products">
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
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Danh mục khóa học{' '}
              {loading ? (
                <span>Đang tải danh mục...</span>
              ) : catesMap[Number(cateId)] ? ( // Chuyển đổi cateId thành số
                catesMap[Number(cateId)]
              ) : (
                'Danh mục không tồn tại'
              )}
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              A collection of products sharing experiences of self-learning programming online and
              web development techniques.
            </Typography>
          </Grid>
          <Grid item xs={8} sx={{ marginBottom: '20px', textAlign: 'center' }}>
          <TextField
              label="Tìm kiếm khóa học"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                margin: 'auto',
                borderRadius: '50px',
                backgroundColor: '#f7f7f7',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px',
                },
                '& .MuiInputBase-input': {
                  padding: '12px 16px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Left Column */}
          <Grid item md={8}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : currentProducts.length > 0 ? (
              currentProducts
                .filter((product) => product.cate_pro_id === cateId.id)
                .sort((a, b) => (a.updated_at.seconds < b.updated_at.seconds ? 1 : -1))
                .map((product) => (
                  <div className="container py-2" key={product.id}>
                    <div className="row justify-content-center mt-2">
                      <div className="card-body border p-4 rounded col-md-12 col-xl-12">
                        <div className="shadow-0 rounded-3">
                          <div className="row">
                            {/* Product Image */}
                            <div className="col-md-12 col-lg-4 col-xl-4 mb-4 mb-lg-0">
                              <Link
                                to={`/productDetail/${product.id}`}
                                style={{ textDecoration: 'none' }}
                              >
                                <div
                                  className="bg-image hover-zoom ripple rounded ripple-surface"
                                  style={{
                                    display: 'flex',
                                    border: '1px solid #ddd',
                                    padding: '5px',
                                    height: '150px',
                                    borderRadius: '10px',
                                  }}
                                >
                                  <img
                                    src={product.image}
                                    className="w-100"
                                    alt={product.name}
                                    style={{
                                      objectFit: 'cover',
                                      height: '100%',
                                      borderRadius: '10px',
                                      transition: 'all 0.3s ease',
                                      cursor: 'pointer',
                                    }}
                                  />
                                  <a href="#!">
                                    <div className="hover-overlay">
                                      <div
                                        className="mask"
                                        style={{ backgroundColor: 'rgba(253, 253, 253, 0.15)' }}
                                      ></div>
                                    </div>
                                  </a>
                                </div>
                              </Link>
                            </div>

                            {/* Product Details */}
                            <div className="col-md-6 col-lg-4 col-xl-4">
                              <h5>{product.name}</h5>
                              <div className="d-flex flex-row">
                                <span>Người đăng: {product.user?.name || 'Không có thông tin'}</span>
                              </div>
                              <div className="d-flex mt-1 mb-0 text-muted small">
                                <span>
                                  <span className="text-primary"> • </span>Giá gốc:
                                  {product.price + ' VND'
                                    ? product.price.toLocaleString('vi-VN') + ' VND'
                                    : 'Miễn phí'}{' '}
                                </span>
                              </div>
                              <div className="d-flex mt-1 mb-0 text-muted small">
                                <span>
                                  <span className="text-primary"> • </span>Giảm giá còn:{' '}
                                  {product.discount + ' VND'
                                    ? product.discount.toLocaleString('vi-VN') + ' VND'
                                    : 'Miễn phí'}{' '}
                                </span>
                              </div>
                              <div className="d-flex mt-1 mb-0 text-muted small">
                                <span
                                  className="text-truncate d-inline-block"
                                  style={{
                                    maxWidth: '250px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '0.9rem',
                                    display: 'block',
                                  }}
                                >
                                  Mô tả:{' '}
                                  {product.description
                                    ? product.description.replace(/(<([^>]+)>)/gi, '')
                                    : 'No description available'}
                                </span>
                              </div>
                            </div>

                            {/* Price and Additional Details */}
                            <div className="col-md-6 col-lg-4 col-xl-4 border-sm-start-none border-start">
                              <div className="align-items-center mb-1">
                                <h6 className="mb-1 me-1" style={{ fontSize: '1rem' }}>
                                  {product.discount + ' VND'
                                    ? product.discount.toLocaleString('vi-VN') + ' VND'
                                    : 'Miễn phí'}{' '}
                                </h6>
                                <span className="text-danger" style={{ fontSize: '0.7rem' }}>
                                  <s>
                                    {product.price + ' VND'
                                      ? product.price.toLocaleString('vi-VN') + ' VND'
                                      : 'Miễn phí'}{' '}
                                  </s>
                                </span>
                              </div>
                              <h6 className="text-success">
                                <b>Giảm giá sốc</b>
                              </h6>
                              <div className="d-flex flex-column mt-4">
                                {/* Kiểm tra quyền truy cập để hiển thị nút */}
                                {hasStudyAccess(product.id) ? (
                                  <button
                                    className="btn btn-success btn-sm"
                                    type="button"
                                    onClick={() => navigate(`/productDetailUser/${product.id}`)}
                                  >
                                    Bắt đầu học
                                  </button>
                                ) : (
                                  <>
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
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p>No products available.</p>
            )}

            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(products.length / itemsPerPage)} // Tổng số trang
                page={currentPage} // Trang hiện tại
                onChange={(event, value) => setCurrentPage(value)} // Hàm thay đổi trang
                color="primary"
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Danh mục các khóa học
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <ul className="category-list">
                  {cates.map((cate) => (
                    <Link
                      to={`/cateDetail/${cate.id}`}
                      style={{ textDecoration: 'none' }}
                      key={cate.id}
                    >
                      <li className="category-item">
                        <strong>{cate.name}</strong>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Products;
