import React, { useEffect, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';

// Icon
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Firebase
import { db } from '../../config/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

// Styled components
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#8000ff',
  borderRadius: '15px',
  padding: '20px',
  color: '#fff',
  textAlign: 'left',
  position: 'relative',
  overflow: 'hidden',
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#fff',
  marginBottom: '10px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#8000ff',
  borderRadius: '25px',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '-40px',
  bottom: '0',
  width: '250px',
  height: 'auto',
  opacity: 0.9,
}));

const Home = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catesMap, setCatesMap] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(false);

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
  };

  const handleClick = (productId) => {
    navigate(`/productDetail/${productId}`, { state: { id: productId } });
  };

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesSnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = articlesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCatesMap(categoriesMap);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(); // Format the date to be more readable
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Carousel Banner */}
            <Grid>
              <Carousel
                variant="dark"
                indicators={false}
                interval={5000}
                nextIcon={
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: '30px',
                      transform: 'translateY(-50%)',
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <ArrowForwardIcon sx={{ color: '#333', fontSize: '20px' }} />
                  </Box>
                }
                prevIcon={
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '30px',
                      transform: 'translateY(-50%)',
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <ArrowBackIcon sx={{ color: '#333', fontSize: '20px' }} />
                  </Box>
                }
              >
                <Carousel.Item>
                  <StyledBox
                    sx={{
                      background: 'linear-gradient(90deg, #0066ff 0%, #0099ff 100%)',
                      borderRadius: '20px',
                      padding: '20px',
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="h4"
                          component="h2"
                          fontWeight="bold"
                          sx={{ color: '#fff' }}
                        >
                          Chào Mừng Đến Với Diễn Đàn Chia Sẻ Code!
                        </Typography>
                        <SubText sx={{ color: '#fff' }}>
                          Kết nối với các lập trình viên khác, chia sẻ code, và học hỏi từ cộng đồng
                          lập trình đa dạng của chúng tôi.
                        </SubText>
                        <ActionButton
                          variant="contained"
                          href="/"
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#0057e6',
                            color: '#ffffff',
                            border: '2px solid #0044cc',
                            '&:hover': {
                              backgroundColor: '#0044cc',
                            },
                            padding: '10px 20px',
                            borderRadius: '30px',
                          }}
                        >
                          Tham Gia Cộng Đồng
                        </ActionButton>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <ImageBox sx={{ maxWidth: '90%', margin: '0 auto' }}>
                          <img
                            src="https://www.pace.edu.vn/uploads/news/2023/07/1-khai-niem-truyen-thong.jpg"
                            alt="Diễn đàn chia sẻ code"
                            style={{ width: '400px', marginLeft: '-237px', borderRadius: '10px' }}
                          />
                        </ImageBox>
                      </Grid>
                    </Grid>
                  </StyledBox>
                </Carousel.Item>
              </Carousel>
            </Grid>

            {/* Featured Articles */}
            <Grid container spacing={4} sx={{ marginTop: '40px' }}>
              <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Bài viết nổi bật
                </Typography>
                <Box component="a" href="/article" sx={{ textDecoration: 'none', color: '#5d86fe', fontWeight: 'bold' }}>
                  Xem tất cả &gt;
                </Box>
              </Grid>
              {articles
                .filter((article) => article.isApproved === 1)
                .slice(0, 4)
                .map((article) => (
                  <Grid item xs={6} sm={4} md={3} key={article.id}>
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCardClick(article.id)}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={article.image}
                        alt={article.title}
                      />
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {catesMap[article.categories_id] || 'Chưa rõ danh mục'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(article.updated_at)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {/* Featured Products */}
            <Grid container spacing={4} sx={{ marginTop: '40px' }}>
              <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Khóa học mới nhất
                </Typography>
                <Box component="a" href="/products" sx={{ textDecoration: 'none', color: '#5d86fe', fontWeight: 'bold' }}>
                  Xem tất cả &gt;
                </Box>
              </Grid>
              {products.slice(0, 4).map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product.id} onClick={() => handleClick(product.id)}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image_url}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.discount.toLocaleString()} VND
                        <strike>{product.price.toLocaleString()} VND</strike>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export default Home;
