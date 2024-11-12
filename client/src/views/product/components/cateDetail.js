import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Pagination, TextField } from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// Firebase
import '../index.css';
import CourseApi from '../../../apis/CourseApi';
import CateCourseApi from '../../../apis/Categories_courseApi';


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

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Fetch products based on category ID
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await CourseApi.getCoursesList(); // Gọi API để lấy tất cả sản phẩm
        const filteredProducts = response.data.courses.filter(
          (product) => String(product.cate_course_id) === cateId,
        ); // Lọc theo ID danh mục
        setProducts(filteredProducts); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cateId]);

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
              label="Tìm kiếm sản phẩn"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
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
                                <span>Số lượng {product.quality}</span>
                              </div>
                              <div className="d-flex mt-1 mb-0 text-muted small">
                                <span>
                                  <span className="text-primary"> • </span>Price: ${product.price}
                                </span>
                              </div>
                              <div className="d-flex mt-1 mb-0 text-muted small">
                                <span>
                                  <span className="text-primary"> • </span>Discount:{' '}
                                  {product.discount}%
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
                                  {product.discount
                                    ? product.discount.toLocaleString('vi-VN')
                                    : 'N/A'}{' '}
                                  VND
                                </h6>
                                <span className="text-danger" style={{ fontSize: '0.7rem' }}>
                                  <s>
                                    {product.price ? product.price.toLocaleString('vi-VN') : 'N/A'}{' '}
                                    VND
                                  </s>
                                </span>
                              </div>
                              <h6 className="text-success">
                                <b>Giảm giá sốc</b>
                              </h6>
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
