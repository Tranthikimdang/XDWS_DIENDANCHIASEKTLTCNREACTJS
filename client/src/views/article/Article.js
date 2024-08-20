import React, { useState } from 'react';
import { Grid, Box, Typography, IconButton, Menu, MenuItem, Card, CardContent, CardMedia } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import './Article.css';

const Article = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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

  return (
    <PageContainer title="Article" description="This is Article">
       <Box sx={{ padding: { xs: '10px'} }}>
        <Grid container spacing={3}>
          <Grid sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '50px' }}>
            <h1 className="_heading_juuyp_22">Bài viết nổi bật</h1>
            <Typography variant="body1" paragraph className="typography-body">
              Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.
            </Typography>
          </Grid>
          {/* Cột bên trái */}
          <Grid md={8}>
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
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
                        src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                        alt="Kimdang.dev"
                        className="author-image"
                      />
                      <Typography variant="body1" component="span" className="author-name">
                        <strong>Kimdang.dev</strong>
                      </Typography>
                    </Box>
                    <Typography variant="h5" component="h2" className="article-title">
                      Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày
                    </Typography>
                    <Typography variant="body2" paragraph className="article-description">
                      Xin chào mọi người mình là Kimdang.dev, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="textSecondary" className="category-badge">
                        Front-end
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        2 tháng trước
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        4 phút đọc
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
                    image="https://files.fullstack.edu.vn/f8-prod/blog_posts/10850/667550d384026.png"
                    alt="Minh đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày"
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

          {/* Cột bên phải */}
          <Grid md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Xem các bài viết theo chủ đề
              </Typography>
              <ul className="category-list">
                <li className="category-item"><strong>Front-end / Mobile apps</strong></li>
                <li className="category-item"><strong>Back-end / Devops</strong></li>
                <li className="category-item"><strong>UI / UX / Design</strong></li>
                <li className="category-item"><strong>Others</strong></li>
              </ul>
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Article;
