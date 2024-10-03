import React, { useEffect, useState } from 'react';
import { IconBracketsContainStart } from '@tabler/icons';
import {
  Grid,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import { formatDistanceToNow } from 'date-fns';
//firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './index.css';

const Products = () => {
  const navigate = useNavigate();
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({}); // State to store category ID to name mapping
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

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
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchProducts();
  }, []);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'products'));
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        console.log('Fetched users:', usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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

        // Create a mapping of category ID to name
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

  const menuItems = [
    { icon: <FacebookIcon />, text: 'Share on Facebook' },
    { icon: <TwitterIcon />, text: 'Share on Twitter' },
    { icon: <EmailIcon />, text: 'Share via Email' },
    { icon: <LinkIcon />, text: 'Copy Link' },
    { icon: <FlagIcon />, text: 'Report products' },
  ];

  const removeSpecificHtmlTags = (html, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, 'gi');
    return html?.replace(regex, '');
  };

  // Helper function to format date as "1 hour ago", "2 days ago", etc.
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <PageContainer title="products" description="This is products">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Featured products
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              A collection of products sharing experiences of self-learning programming online and
              web development techniques.
            </Typography>
          </Grid>

          {/* Left Column */}
          <Grid item md={8}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : products.length > 0 ? (
              products
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sắp xếp theo ngày tạo mới nhất
                .map((product) => (
                  <div className="container py-2" key={product.cate_pro_id}>
                    <div className="row justify-content-center mt-2">
                      <div className="col-md-12 col-xl-12">
                        <div className="card shadow-0 border rounded-3">
                          <div className="card-body">
                            <div className="row">
                              {/* Hình ảnh sản phẩm */}
                              <div className="col-md-12 col-lg-4 col-xl-4 mb-4 mb-lg-0">
                                <div
                                  className="bg-image hover-zoom ripple rounded ripple-surface"
                                  style={{
                                    display: 'flex',
                                    border: '1px solid #ddd',
                                    padding: '5px',
                                    height: '150px',
                                    borderRadius: '10px',
                                  }} // Làm mềm các góc
                                >
                                  <img
                                    src={product.image_url}
                                    className="w-100"
                                    alt={product.name}
                                    style={{
                                      objectFit: 'cover',
                                      height: '100%',
                                      borderRadius: '10px', // Bo tròn góc cho hình ảnh
                                      transition: 'all 0.3s ease', // Thêm hiệu ứng hover nhẹ nhàng
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
                              </div>

                              {/* Chi tiết sản phẩm */}
                              <div className="col-md-6 col-lg-4 col-xl-4">
                                <h5>{product.name}</h5>
                                <div className="d-flex flex-row">
                                  {/* <div className="text-danger mb-1 me-2">
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                  </div> */}
                                  <span>Số lượng {product.quality}</span>
                                </div>
                                <div className="d-flex flex-column mt-1 mb-0 text-muted small">
                                  <span>
                                    <span className="text-primary"> • </span>Price: ${product.price}
                                  </span>

                                  <span>
                                    <span className="text-primary"> • </span>Discount:{' '}
                                    {product.discount}%
                                  </span>

                                  {/* Mô tả sản phẩm */}
                                  <span
                                    className="text-truncate d-inline-block"
                                    style={{
                                      maxWidth: '250px',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      fontSize: '0.9rem',
                                      display: 'block', // Đảm bảo hiển thị mỗi span trên một dòng riêng
                                    }}
                                  >
                                   Mô tả: {product.description
                                      ? product.description.replace(/(<([^>]+)>)/gi, '')
                                      : 'No description available'}
                                  </span>
                                </div>
                              </div>

                              {/* Giá và chi tiết thêm */}
                              <div className="col-md-6 col-lg-4 col-xl-4 border-sm-start-none border-start">
                                <div className="align-items-center mb-1">
                                  <h6 className="mb-1 me-1" style={{ fontSize: '1rem' }}>
                                    {product.discount ? product.discount.toLocaleString('vi-VN') : 'N/A'}{' '}
                                    VND
                                  </h6>
                                  <span className="text-danger" style={{ fontSize: '0.7rem' }}>
                                    <s>
                                      {product.price 
                                        ? product.price .toLocaleString('vi-VN')
                                        : 'N/A'}{' '}
                                      VND
                                    </s>
                                  </span>
                                </div>
                                <h6 className="text-success">Free shipping</h6>
                                <div className="d-flex flex-column mt-4">
                                  <button
                                    data-mdb-button-init
                                    data-mdb-ripple-init
                                    className="btn btn-primary btn-sm"
                                    type="button"
                                  >
                                    Mua ngay
                                  </button>
                                  <button
                                    data-mdb-button-init
                                    data-mdb-ripple-init
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
                  </div>
                ))
            ) : (
              <p>No products available.</p>
            )}
          </Grid>

          {/* Right Column */}
          <Grid item md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Browse by Category
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <ul className="category-list">
                  {cates.map((cate) => (
                    <li key={cate?.id} className="category-item">
                      <strong>{cate?.name}</strong>
                    </li>
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
