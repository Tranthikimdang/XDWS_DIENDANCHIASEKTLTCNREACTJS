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
    <PageContainer title="Article" description="this is Article">
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom className="typography-header">
          <strong>Bài viết nổi bật</strong>
        </Typography>

        <Typography variant="body1" paragraph>
          Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.
        </Typography>

        <Grid container spacing={4}>
          {/* Left column */}
          <Grid item xs={12} md={8}>
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
                sx={{
                  display: 'flex',
                  mb: 3,
                  flexDirection: { xs: 'column', md: 'row' },
                  border: '1px solid #ddd', // Thêm border ở đây
                  borderRadius: '8px' // Tùy chọn, làm cho border có góc bo tròn
                }}
              >

                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <img
                        src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                        alt="Kimdang.dev"
                        className="author-image"
                        style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
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
                      height: { xs: 200, md: 'auto' }, /* Adjust height to maintain aspect ratio */
                      objectFit: 'cover'
                    }}
                    image="https://files.fullstack.edu.vn/f8-prod/blog_posts/10850/667550d384026.png"
                    alt="Minh đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày"
                  />
                  <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <IconBookmark />
                    <IconButton aria-label="more" aria-controls="menu" aria-haspopup="true" onClick={handleClick}>
                      <IconDots />
                    </IconButton>
                    <Menu
                      id="menu"
                      anchorEl={anchorEl}
                      keepMounted
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

          {/* Right column */}
          <Grid item xs={12} md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3">
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
