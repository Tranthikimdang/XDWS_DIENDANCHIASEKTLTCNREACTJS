import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
// icon
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import SearchIcon from '@mui/icons-material/Search';
import { formatDistanceToNow } from 'date-fns';

// firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './Article.css';

const Article = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null); // Để mở menu cho từng bài viết
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({});
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenId(id); // Mở menu riêng cho từng bài viết
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenId(null); // Đóng menu
  };

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
  };

  // Fetch articles from Firestore
  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      try {
        const articlesSnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = articlesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchArticles();
  }, []);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCates(categoriesData);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              <strong>Bài viết nổi bật</strong>
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.
            </Typography>
          </Grid>
          <Grid item xs={8} sx={{ marginBottom: '20px', textAlign: 'center' }}>
            <TextField
              label="Search by name"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item md={8}>
            {loadingArticles ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : currentArticles.length > 0 ? (
              currentArticles
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((article) => (
                  article.isApproved == 1 && (
                    <Card
                      key={article?.id}
                      sx={{
                        display: 'flex',
                        mb: 3,
                        flexDirection: { xs: 'column', md: 'row' },
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                      }}
                      onClick={() => handleCardClick(article.id)}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <img
                              src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                              width="40px"
                              alt="User Avatar"
                              style={{ borderRadius: '50%', marginRight: '10px' }}
                            />
                            <Typography variant="body1" component="span" className="author-name">
                              <strong>{users?.find((u) => article?.user_id === u.id)?.name}</strong>
                            </Typography>
                          </Box>
                          <Typography variant="h5" component="h2" className="article-title">
                            {article.title}
                          </Typography>
                          <Typography variant="body2" paragraph className="article-description">
                            {removeSpecificHtmlTags(article.content, 'img')}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                {catesMap[article.category_id]}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(article.created_at)}
                              </Typography>
                            </Box>
                            <IconButton onClick={(event) => handleClick(event, article.id)}>
                              <IconDots />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Box>
                      <CardMedia
                        component="img"
                        sx={{ width: { xs: '100%', md: 200 }, height: 200 }}
                        image={article.image_url}
                        alt={article.title}
                      />
                      <Menu anchorEl={anchorEl} open={menuOpenId === article.id} onClose={handleClose}>
                        {menuItems.map((item, index) => (
                          <MenuItem key={index} onClick={handleClose}>
                            {item.icon}
                            {item.text}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Card>
                  )
                ))
            ) : (
              <Typography>No articles found.</Typography>
            )}
          </Grid>
          <Grid item md={8}>
            <Pagination
              count={Math.ceil(filteredArticles.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Article;
