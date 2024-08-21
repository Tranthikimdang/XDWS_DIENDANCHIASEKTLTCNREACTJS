import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, IconButton, Menu, MenuItem, Card, CardContent, CardMedia } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
// api
import categoriesApi from '../../apis/categoriesApi';

import './Article.css';

const Article = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [cates, setCates] = useState([]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getList();
        if (response.status === 200) {
          const categories = response.data || [];
          setCates(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { icon: <FacebookIcon />, text: 'Chia sẻ lên Facebook' },
    { icon: <TwitterIcon />, text: 'Chia sẻ lên Twitter' },
    { icon: <EmailIcon />, text: 'Chia sẻ tới Email' },
    { icon: <LinkIcon />, text: 'Sao chép liên kết' },
    { icon: <FlagIcon />, text: 'Báo cáo bài viết' },
  ];

  // Sample data for the articles
  const articles = [
    {
      id: 1,
      author: 'Kimdang.dev',
      title: 'Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày',
      description: 'Xin chào mọi người mình là Kimdang.dev, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết...',
      category: 'Front-end',
      time: '2 tháng trước',
      readTime: '4 phút đọc',
      image: 'https://files.fullstack.edu.vn/f8-prod/blog_posts/10850/667550d384026.png',
      authorImage: 'http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg',
    },
    {
      id: 2,
      author: 'Kimdang.dev',
      title: 'Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày',
      description: 'Xin chào mọi người mình là Kimdang.dev, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết...',
      category: 'Front-end',
      time: '2 tháng trước',
      readTime: '4 phút đọc',
      image: 'https://files.fullstack.edu.vn/f8-prod/blog_posts/10850/667550d384026.png',
      authorImage: 'http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg',
    },
    // Add more articles here...
  ];

 

  return (
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px'} }}>
        <Grid container spacing={3}>
          <Grid sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <h1 className="_heading_juuyp_22">Bài viết nổi bật</h1>
            <Typography variant="body1" paragraph className="typography-body">
              Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.
            </Typography>
          </Grid>

          {/* Left Column */}
          <Grid item md={8}>
            {articles.map((article) => (
              <Card
                key={article.id}
                sx={{
                  display: 'flex',
                  mb: 3,
                  flexDirection: { xs: 'column', md: 'row' },
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <img
                        src={article.authorImage}
                        alt={article.author}
                        className="author-image"
                      />
                      <Typography variant="body1" component="span" className="author-name">
                        <strong>{article.author}</strong>
                      </Typography>
                    </Box>
                    <Typography variant="h5" component="h2" className="article-title">
                      {article.title}
                    </Typography>
                    <Typography variant="body2" paragraph className="article-description">
                      {article.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="textSecondary" className="category-badge">
                        {article.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        {article.time}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        {article.readTime}
                      </Typography>
                    </Box>
                  </CardContent>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }} className="card-media">
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: '100%', md: 200 },
                      height: { xs: 200, md: 'auto' },
                      objectFit: 'cover',
                    }}
                    image={article.image}
                    alt={article.title}
                  />
                  <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <IconButton aria-label="bookmark">
                      <IconBookmark />
                    </IconButton>
                    <IconButton aria-label="more" onClick={handleClick}>
                      <IconDots />
                    </IconButton>
                    <Menu
                      id="menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      {menuItems.map((item, i) => (
                        <MenuItem key={i} onClick={handleClose}>
                          {item.icon}
                          <span style={{ marginLeft: 10 }}>{item.text}</span>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
              </Card>
            ))}
          </Grid>

          {/* Right Column */}
          <Grid item md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Xem các bài viết theo chủ đề
              </Typography>
              <ul className="category-list">
              {cates.map((cate) => (
                  <li  key={cate?.key} value={cate?.key} className="category-item">
                    <strong>{cate?.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Article;
