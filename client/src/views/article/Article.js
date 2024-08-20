import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import './Article.css';
import { IconDots, IconBookmark } from '@tabler/icons';

const Article = () => {
  return (
    <PageContainer title="Article" description="this is Article">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          <strong>Bài viết nổi bật</strong>
        </Typography>
        <Typography variant="body1" paragraph>
          Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.
        </Typography>

        <Grid container spacing={3}>
          {/* Left column */}
          <Grid item xs={12} md={8}>
            <div className="featured-article">
              <div className="article-info">
                <div className="author-info">
                  <img
                    src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                    alt="Kimdang.dev"
                    className="author-image"
                  />
                  <span className="author-name">Kimdang.dev</span>
                </div>

                <Typography variant="h5" component="h2" className="article-title">
                  Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày
                </Typography>
                <Typography variant="body2" paragraph className="article-description">
                  Xin chào mọi người mình là Kimdang.dev, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...
                </Typography>
                <div className="article-meta">
                  <span className="category-badge">Front-end</span>
                  <span className="article-time">2 tháng trước </span>
                  <span className="dot"> · </span>
                  <span className="reading-time">4 phút đọc</span>
                </div>
              </div>
              <div className="article-thumbnail">
                <div className="icon-group" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'  }}>
                <IconBookmark />
                <IconDots />
              </div>
                <div className="thumbnail-wrapper">
                  <img
                    src="https://files.fullstack.edu.vn/f8-prod/blog_posts/10850/667550d384026.png"
                    alt="Minh đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày"
                  />
                </div>
              </div>
            </div>
            <div className="featured-article">
              <div className="article-info">
                <div className="author-info">
                  <img
                    src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                    alt="Kimdang.dev"
                    className="author-image"
                  />
                  <span className="author-name">Kimdang.dev</span>
                </div>

                <Typography variant="h5" component="h2" className="article-title">
                  Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày
                </Typography>
                <Typography variant="body2" paragraph className="article-description">
                  Xin chào mọi người mình là Kimdang.dev, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...
                </Typography>
                <div className="article-meta">
                  <span className="category-badge">Front-end</span>
                  <span className="article-time">2 tháng trước </span>
                  <span className="dot"> · </span>
                  <span className="reading-time">4 phút đọc</span>
                </div>
              </div>
              <div className="article-thumbnail">
                <div className="icon-group" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'  }}>
                <IconBookmark />
                <IconDots />
              </div>
                <div className="thumbnail-wrapper">
                  <img
                    src="https://files.fullstack.edu.vn/f8-prod/blog_posts/10850/667550d384026.png"
                    alt="Minh đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày"
                  />
                </div>
              </div>
            </div>
            <div className="featured-article">
              <div className="article-info">
                <div className="author-info">
                  <img
                    src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                    alt="Kimdang.dev"
                    className="author-image"
                  />
                  <span className="author-name">Kimdang.dev</span>
                </div>

                <Typography variant="h5" component="h2" className="article-title">
                  Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày
                </Typography>
                <Typography variant="body2" paragraph className="article-description">
                  Xin chào mọi người mình là Kimdang.dev, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...
                </Typography>
                <div className="article-meta">
                  <span className="category-badge">Front-end</span>
                  <span className="article-time">2 tháng trước </span>
                  <span className="dot"> · </span>
                  <span className="reading-time">4 phút đọc</span>
                </div>
              </div>
              <div className="article-thumbnail">
                <div className="icon-group" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'  }}>
                <IconBookmark />
                <IconDots />
              </div>
                <div className="thumbnail-wrapper">
                  <img
                    src="https://files.fullstack.edu.vn/f8-prod/blog_posts/10850/667550d384026.png"
                    alt="Minh đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày"
                  />
                </div>
              </div>
            </div>
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
