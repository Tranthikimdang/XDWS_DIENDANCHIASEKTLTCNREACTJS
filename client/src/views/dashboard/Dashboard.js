/* eslint-disable no-unused-vars */
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
  Link,
} from '@mui/material';
import { styled } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatDistanceToNow } from 'date-fns';
import { collection, getDocs, addDoc, where, query } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';

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
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
  };

  const handleClick = (product) => {
    navigate(`/productDetail/${product}`, { state: { id: product } });
  };

  const addToCart = async (product) => {
    if (userId) {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, 'orders'),
            where('user_id', '==', userId),
            where('product_id', '==', product.id)
          )
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
      setSnackbarMessage('Bạn vẫn chưa đăng nhập');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesSnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';
    if (updatedAt) {
      const date = new Date(updatedAt.seconds * 1000);
      const now = new Date();
      const diff = now - date;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        updatedAtString = `${days} ngày trước`;
      } else if (hours > 0) {
        updatedAtString = `${hours} giờ trước`;
      } else if (minutes > 0) {
        updatedAtString = `${minutes} phút trước`;
      } else {
        updatedAtString = `${seconds} giây trước`;
      }
    } else {
      updatedAtString = 'Không rõ thời gian';
    }
    return updatedAtString;
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
            {/* Carousel */} 
            <Grid>
              <Carousel variant="dark" indicators={false} interval={5000}>
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
                            alt="Diễn đàn"
                            style={{ width: '250px', height: 'auto' }}
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
                <Link href="/articles" underline="none">
                  Xem tất cả
                </Link>
              </Grid>
              {articles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.imageUrl}
                      alt={article.title}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(article.created_at)}
                      </Typography>
                    </CardContent>
                    <Button onClick={() => handleCardClick(article.id)}>Xem chi tiết</Button>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Featured Products */}
            <Grid container spacing={4} sx={{ marginTop: '40px' }}>
              <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Sản phẩm nổi bật
                </Typography>
                <Link href="/products" underline="none">
                  Xem tất cả
                </Link>
              </Grid>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image_url}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatUpdatedAt(product.updated_at)}
                      </Typography>
                    </CardContent>
                    <Button onClick={() => handleClick(product.id)}>Xem chi tiết</Button>
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
