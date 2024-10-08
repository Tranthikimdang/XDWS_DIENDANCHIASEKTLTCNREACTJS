import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Pagination, TextField,InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
// Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './index.css';

const Products = () => {
  const navigate = useNavigate();
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
        console.log('Fetched products:', productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories_product'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCates(categoriesData);

        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCatesMap(categoriesMap);
        console.log('Fetched categories:', categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <PageContainer title="products" description="This is products">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Các khóa học của chúng tôi
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
                                    src={product.image_url}
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
                                  <span className="text-primary"> • </span>Price: {product.price}{' '}
                                  VND
                                </span>
                              </div>
                              <div className="d-flex mt-1 mb-0 text-muted small">
                                <span>
                                  <span className="text-primary"> • </span>Discount:{' '}
                                  {product.discount}%
                                </span>
                              </div>
                              <div className="d-flex mt-1 mb-0 text-muted small d-flex justify-content-start">
                                <span
                                  className="text-truncate d-inline-block "
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
              <p>Không tìm thấy khóa học nào.</p>
            )}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(products.length / itemsPerPage)} // Total pages
                page={currentPage} // Current page
                onChange={(event, value) => setCurrentPage(value)} // Change page function
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
                    <Link to={`/cateDetail/${cate.id}`} style={{ textDecoration: 'none' }}>
                      <li key={cate.id} className="category-item">
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
