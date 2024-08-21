import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#8000ff',
  borderRadius: '15px',
  padding: '20px',
  color: '#fff',
  textAlign: 'left',
  position: 'relative',
  overflow: 'hidden',
}));

const DiscountText = styled(Typography)(({ theme }) => ({
  fontSize: '40px',
  fontWeight: 'bold',
  color: '#FFC0CB',  // light pink color
  textAlign: 'right',
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

// Sample data for the cards
const featuredPosts = [
  {
    title: 'Tổng hợp các sản phẩm của học viên tại F8',
    image: 'https://files.fullstack.edu.vn/f8-prod/blog_posts/65/6139fe28a9844.png',
    author: 'Sơn Đặng',
    timeToRead: '6 phút đọc',
  },
  {
    title: '[Phần 1] Tạo dự án ReactJS với Webpack và Babel',
    image: 'https://files.fullstack.edu.vn/f8-prod/blog_posts/279/6153f692d366e.jpg',
    author: 'Sơn Đặng',
    timeToRead: '12 phút đọc',
  },
  {
    title: 'Cách đưa code lên GitHub và tạo GitHub Pages',
    image: 'https://files.fullstack.edu.vn/f8-prod/blog_posts/677/615436b218d0a.png',
    author: 'khadev27',
    timeToRead: '4 phút đọc',
  },
  {
    title: 'Ký sự ngày thứ 25 học ở F8',
    image: 'https://files.fullstack.edu.vn/f8-prod/blog_posts/51/6139c6453456e.png',
    author: 'Sơn Sơn',
    timeToRead: '1 phút đọc',
  },
  {
    title: 'Các nguồn tài nguyên hữu ích cho 1 front-end developer',
    image: 'https://files.fullstack.edu.vn/f8-prod/blog_posts/107/613a1f3685814.png',
    author: 'Dương Vương',
    timeToRead: '2 phút đọc',
  },
  // Add more posts here
];

const Home = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid >
          <Carousel variant="dark">
            {/* Carousel Item 1 */}
            <Carousel.Item>
              <StyledBox sx={{ background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)', borderRadius: '20px', padding: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" fontWeight="bold" sx={{ color: '#fff' }}>
                      Học JavaScript Miễn Phí!
                    </Typography>
                    <SubText sx={{ color: '#fff' }}>
                      Khóa học JavaScript từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với JavaScript.
                    </SubText>
                    <ActionButton
                      variant="outlined"
                      sx={{
                        color: '#fff',
                        borderColor: '#fff',
                        width: '100%',
                        padding: '15px 0',
                        marginTop: '15px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: '#0072ff',
                          borderColor: '#fff',
                        },
                      }}
                    >
                      Đăng Ký Ngay
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                    <ImageBox sx={{ maxWidth: '80%', margin: '0 auto' }}>
                      <img src="/path-to-your-image2.png" alt="JavaScript" style={{ width: '100%', borderRadius: '10px' }} />
                    </ImageBox>
                  </Grid>
                </Grid>
              </StyledBox>
            </Carousel.Item>
            {/* Carousel Item 2 */}
            <Carousel.Item>
              <StyledBox sx={{ background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)', borderRadius: '20px', padding: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" fontWeight="bold" sx={{ color: '#fff' }}>
                      Học JavaScript Miễn Phí!
                    </Typography>
                    <SubText sx={{ color: '#fff' }}>
                      Khóa học JavaScript từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với JavaScript.
                    </SubText>
                    <ActionButton
                      variant="outlined"
                      sx={{
                        color: '#fff',
                        borderColor: '#fff',
                        width: '100%',
                        padding: '15px 0',
                        marginTop: '15px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: '#0072ff',
                          borderColor: '#fff',
                        },
                      }}
                    >
                      Đăng Ký Ngay
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                    <ImageBox sx={{ maxWidth: '80%', margin: '0 auto' }}>
                      <img src="/path-to-your-image2.png" alt="JavaScript" style={{ width: '100%', borderRadius: '10px' }} />
                    </ImageBox>
                  </Grid>
                </Grid>
              </StyledBox>
            </Carousel.Item>
          </Carousel>
        </Grid>



        {/* Featured Posts Section */}
        <Grid container spacing={3} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Bài viết nổi bật
            </Typography>
          </Grid>
          {featuredPosts.map((post, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {post.author} • {post.timeToRead}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Box>
    </PageContainer>
  );
};

export default Home;







