import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, IconButton, Menu, MenuItem, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import { formatDistanceToNow } from 'date-fns';
//firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './Article.css';

const Article = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({}); // State to store category ID to name mapping
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  // Fetch articles from Firestore
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesSnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = articlesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesData);
        console.log("Fetched articles:", articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchArticles();
  }, []);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        console.log("Fetched users:", usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCates(categoriesData);

        // Create a mapping of category ID to name
        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCatesMap(categoriesMap);

        console.log("Fetched categories:", categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const menuItems = [
    { icon: <FacebookIcon />, text: 'Share on Facebook' },
    { icon: <TwitterIcon />, text: 'Share on Twitter' },
    { icon: <EmailIcon />, text: 'Share via Email' },
    { icon: <LinkIcon />, text: 'Copy Link' },
    { icon: <FlagIcon />, text: 'Report Article' },
  ];

  const removeSpecificHtmlTags = (html, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, 'gi');
    return html?.replace(regex, '');
  };

  // Helper function to format date as "1 hour ago", "2 days ago", etc.
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };


  return (
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item md={8}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : (
              articles.map((article) =>
                // eslint-disable-next-line eqeqeq
                article.status == 1 && (
                  <Card
                    key={article?.id}
                    sx={{
                      display: 'flex',
                      mb: 3,
                      flexDirection: { xs: 'column', md: 'row' },
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleCardClick(article.id)}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body1" component="span" className="author-name">
                            <strong>{users?.find((u) => article?.user_id === u.id)?.name}</strong>
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
                            {catesMap[article.categories_id] || 'Unknown Category'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                            {formatDate(article.updated_at)} {/* Display formatted date */}
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
                        <Menu id="menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
                )
              )
            )}

          </Grid>

          {/* Right Column */}
          <Grid item md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Browse by Category
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <ul className="category-list">
                  {cates.map((cate) => (
                    <li key={cate?.id} className="category-item">
                      <strong>{cate?.name}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Article;
