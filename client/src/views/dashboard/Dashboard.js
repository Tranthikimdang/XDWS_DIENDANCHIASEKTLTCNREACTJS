import React, { useEffect, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//api
import categoriesApi from '../../apis/categoriesApi';
import apis from '../../apis/articleApi';
import userApi from '../../apis/userApi';

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

const Home = () => {
  const [cates, setCates] = useState([]);
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apis.getList();
        if (response.status === 200) {
          setArticles(response.data || []);
          console.log("Fetched articles:", response.data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getList();
        if (response.status === 200) {
          setUsers(response.data || []);
          console.log("Fetched users:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getList();
        if (response.status === 200) {
          setCates(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <PageContainer title="Dashboard" description="This is the Dashboard">
      <Box>
        {/* Banner */}
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
                right: '30px', // Adjust spacing from the right side
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
                left: '30px', // Adjust spacing from the left side
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
            {/* Carousel Item 1 */}
            <Carousel.Item>
              <StyledBox
                sx={{
                  background: 'linear-gradient(90deg, #f94f4f 0%, #ff8a00 100%)',
                  borderRadius: '20px',
                  padding: '20px',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h4" component="h2" fontWeight="bold" sx={{ color: '#fff' }}>
                      Welcome to the Knowledge Sharing Platform!
                    </Typography>
                    <SubText sx={{ color: '#fff' }}>
                      Our platform is where experts and learners can connect, share knowledge and experience in various fields. Explore free courses, useful articles, and high-quality resources to enhance your skills and expand your understanding.
                    </SubText>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                    <ImageBox sx={{ maxWidth: '90%', margin: '0 auto' }}>
                      <img
                        src="https://files.fullstack.edu.vn/f8-prod/banners/36/6454dee96205c.png"
                        alt="JavaScript"
                        style={{ width: '100%', borderRadius: '10px' }}
                      />
                    </ImageBox>
                  </Grid>
                </Grid>
              </StyledBox>
            </Carousel.Item>
            {/* Carousel Item 2 */}
            <Carousel.Item>
              <StyledBox
                sx={{
                  background: 'linear-gradient(90deg, #f94f4f 0%, #ff8a00 100%)',
                  borderRadius: '20px',
                  padding: '20px',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" fontWeight="bold" sx={{ color: '#fff' }}>
                      Learn JavaScript for Free!
                    </Typography>
                    <SubText sx={{ color: '#fff' }}>
                      JavaScript course from basics to advanced. By the end of this course, you will be able to handle most common projects with JavaScript.
                    </SubText>
                    <ActionButton
                      variant="outlined"
                      sx={{
                        color: '#fff',
                        borderColor: '#fff',
                        width: 'auto',
                        padding: '10px 20px',
                        marginTop: '20px',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: '#f94f4f',
                          borderColor: '#fff',
                        },
                      }}
                    >
                      Register Now
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                    <ImageBox sx={{ maxWidth: '90%', margin: '0 auto' }}>
                      <img
                        src="https://files.fullstack.edu.vn/f8-prod/banners/Banner_04_2.png"
                        alt="JavaScript"
                        style={{ width: '100%', borderRadius: '10px' }}
                      />
                    </ImageBox>
                  </Grid>
                </Grid>
              </StyledBox>
            </Carousel.Item>
          </Carousel>
        </Grid>

        {/* Featured Posts Section */}
        <Grid container spacing={3} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h2" fontWeight="bold">
              Featured Articles
            </Typography>
            <Box component="a" href="/article" sx={{ textDecoration: 'none', color: '#5d86fe', fontWeight: 'bold' }}>
              View All &gt;
            </Box>
          </Grid>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={3} key={article?.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    {article.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Typography variant="body2" color="textSecondary">
                      {users?.find(u => article?.user_id === u.id)?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {article.updated_at}
                    </Typography>
                  </Box>
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
