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

// Icon
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CourseApi from '../../apis/CourseApI';
import CateCourseApi from '../../apis/Categories_courseApI';
import StudyTimeApi from '../../apis/StudyTimeApI';
// Firebase
import { db } from '../../config/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import ChatBox from './chatAI/chatAI';

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

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
  };

  const handleClick = (productId) => {
    navigate(`/productDetail/${productId}`, { state: { id: productId } });
  };

  // // Fetch products
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     try {
  //       const productsSnapshot = await getDocs(collection(db, 'products'));
  //       const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setProducts(productsData);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await CourseApi.getCoursesList();
        const course = response.data.courses;

        setProducts(course);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //date
  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt); // Chuyển đổi chuỗi thành đối tượng Date
      const now = new Date();
      const diff = now - date; // Tính toán khoảng cách thời gian

      const seconds = Math.floor(diff / 1000); // chuyển đổi ms thành giây
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
    <PageContainer
      title="Share Code | Diễn đàn chia sẻ lập trình code"
      description="Đây là trang chủ"
    >
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          {/* Carousel Banner */}
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
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
                        Trở Thành Mentor và Chia Sẻ Kiến Thức!
                      </Typography>
                      <SubText sx={{ color: '#fff' }}>
                        Hướng dẫn và hỗ trợ những lập trình viên mới bắt đầu. Tham gia vào đội ngũ
                        mentors của chúng tôi ngay hôm nay.
                      </SubText>
                      <ActionButton
                        variant="contained"
                        href="/auth/registerMentor"
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
                        Tham Gia Đội Ngũ Mentors
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
          {/* kết thúc Carousel Banner */}

          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h5"
              component="h2"
              sx={{ textDecoration: 'none', fontWeight: 1000 }}
            >
              Khóa học Pro
            </Typography>
            <Box
              component="a"
              href="/products"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px', // Khoảng cách giữa chữ và icon
                color: '#5d86fe', // Màu chính
                fontWeight: 'bold', // Chữ đậm để tạo sự nổi bật
                textDecoration: 'none', // Loại bỏ gạch chân mặc định
                fontSize: '16px', // Kích thước chữ dễ đọc
                padding: '4px 8px', // Tăng khoảng cách bấm
                borderRadius: '4px', // Bo góc mềm mại
                transition: 'all 0.3s ease', // Hiệu ứng chuyển đổi mượt mà
                '&:hover': {
                  color: '#3b5db2', // Màu nổi bật khi hover
                  textDecoration: 'underline', // Gạch chân nhấn mạnh khi hover
                  backgroundColor: 'rgba(93, 134, 254, 0.1)', // Nền nhẹ khi hover
                },
              }}
            >
              Xem tất cả
              <ArrowForwardIosIcon sx={{ fontSize: '15px' }} /> {/* Thêm icon mũi tên */}
            </Box>
          </Grid>
          {products
            .filter((product) => product.price > 0)
            .slice(0, 4)
            .map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
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
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h5"
              component="h2"
              sx={{ textDecoration: 'none', fontWeight: 1000 }}
            >
              Khóa học miễn phí
            </Typography>
            <Box
              component="a"
              href="/products"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px', // Khoảng cách giữa chữ và icon
                color: '#5d86fe', // Màu chính
                fontWeight: 'bold', // Chữ đậm để tạo sự nổi bật
                textDecoration: 'none', // Loại bỏ gạch chân mặc định
                fontSize: '16px', // Kích thước chữ dễ đọc
                padding: '4px 8px', // Tăng khoảng cách bấm
                borderRadius: '4px', // Bo góc mềm mại
                transition: 'all 0.3s ease', // Hiệu ứng chuyển đổi mượt mà
                '&:hover': {
                  color: '#3b5db2', // Màu nổi bật khi hover
                  textDecoration: 'underline', // Gạch chân nhấn mạnh khi hover
                  backgroundColor: 'rgba(93, 134, 254, 0.1)', // Nền nhẹ khi hover
                },
              }}
            >
              Xem lộ trình
              <ArrowForwardIosIcon sx={{ fontSize: '15px' }} /> {/* Thêm icon mũi tên */}
            </Box>
          </Grid>
          {products
            .filter((product) => product.price == 0)
            .slice(0, 4)
            .map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
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
      </Box>
      <ChatBox /> {/* Add the ChatBox component */}
    </PageContainer>
  );
};

export default Home;
