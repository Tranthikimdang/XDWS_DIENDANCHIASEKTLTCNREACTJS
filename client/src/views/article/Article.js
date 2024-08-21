import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, IconButton, Menu, MenuItem, Card, CardContent, CardMedia } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
// icons
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
// api
import categoriesApi from '../../apis/categoriesApi';
import apis from '../../apis/articleApi';
import userApi from '../../apis/userApi';

import './Article.css';

const Article = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [cates, setCates] = useState([]);
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const menuItems = [
    { icon: <FacebookIcon />, text: 'Chia sẻ lên Facebook' },
    { icon: <TwitterIcon />, text: 'Chia sẻ lên Twitter' },
    { icon: <EmailIcon />, text: 'Chia sẻ tới Email' },
    { icon: <LinkIcon />, text: 'Sao chép liên kết' },
    { icon: <FlagIcon />, text: 'Báo cáo bài viết' },
  ];

  const removeSpecificHtmlTags = (html, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, 'gi');
    return html?.replace(regex, '');
  };

  return (
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Bài viết nổi bật
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.
            </Typography>
          </Grid>

          {/* Left Column */}
          <Grid item md={8}>
            {articles.map((article) => (
              <Card
                key={article?.id}
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
                      <Typography variant="body1" component="span" className="author-name">
                        <strong>{users?.find(u => article?.user_id === u.id)?.name}</strong>
                      </Typography>
                    </Box>
                    <Typography variant="h5" component="h2" className="article-title">
                      {article.title}
                    </Typography>
                    <Typography variant="body2" paragraph className="article-description">
                      {removeSpecificHtmlTags(article.content, 'p').length > 100
                        ? `${removeSpecificHtmlTags(article.content, 'p').substring(0, 100)}...`
                        : removeSpecificHtmlTags(article.content, 'p')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="textSecondary" className="category-badge">
                        {article.categories_id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        {article.updated_at}
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
                  <li key={cate?.key} className="category-item">
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
