import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, IconButton, Menu, MenuItem, Card, CardContent, CardMedia, CircularProgress, TextField, InputAdornment, Pagination } from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
//icon
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import SearchIcon from '@mui/icons-material/Search';

//firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebaseconfig';
import '../Article.css';

const Article = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({}); // State to store category ID to name mapping
  const cateId = useParams();
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
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
  }, [cateId]);

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
  
  //xóa các thẻ html
  const removeHtmlTags = (html) => {
    return html?.replace(/<[^>]+>/g, ''); // Loại bỏ tất cả các thẻ HTML
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  //date
  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt.seconds * 1000); // Chuyển đổi giây thành milliseconds
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
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading" sx={{ textTransform: 'uppercase' }}>
              Chuyên mục {' '}
              {catesMap[cateId.id] ? catesMap[cateId.id] : 'Chuyên mục không tồn tại'}
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              A collection of products sharing experiences of self-learning programming online and
              web development techniques.
              {/* {catesMap[cateId.id] ? catesMap[cateId.id] : 'Chuyênmục không tồn tại'} tieu de*/}
            </Typography>
          </Grid>
          <Grid item xs={8} sx={{ marginBottom: '20px', textAlign: 'center' }}>
            <TextField
              label="Tìm kiếm bài viết"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{

                margin: 'auto',
                borderRadius: '50px',
                backgroundColor: '#f7f7f7',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px',
                },
                '& .MuiInputBase-input': {
                  padding: '12px 16px',
                },
              }}
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
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : currentArticles.length > 0 ? (
              currentArticles
                .filter((article) => article.categories_id === cateId.id)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((article) => (
                  // eslint-disable-next-line eqeqeq
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
                        overflow: 'hidden', // Đảm bảo nội dung không tràn ra ngoài
                      }}
                      onClick={() => handleCardClick(article.id)}
                    >
                      {/* Bên trái: Nội dung */}
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
                            {article.title.length > 100 ? `${article.title.substring(0, 100)}...` : article.title}
                          </Typography>

                          <Typography variant="body2" paragraph className="article-description">
                            {removeHtmlTags(article.content, 'p').length > 10
                              ? `${removeHtmlTags(article.content, 'p').substring(0, 10)}...`
                              : removeHtmlTags(article.content, 'p')}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" color="textSecondary" className="category-badge">
                              {catesMap[article.categories_id] || 'Chưa rõ chuyên mục'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                              {formatUpdatedAt(article.updated_at)} {/* Hiển thị ngày định dạng */}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Box>

                      {/* Bên phải: Hình ảnh */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }} className="card-media">
                        <CardMedia
                          component="img"
                          sx={{
                            width: { xs: '100%', md: 200 }, // Responsive chiều ngang
                            height: { xs: 'auto', md: '100%' }, // Đảm bảo hình ảnh lấp đầy chiều cao
                            aspectRatio: '16/9', // Đặt tỷ lệ khung hình cố định
                            objectFit: 'cover', // Giữ tỉ lệ hình ảnh mà không méo
                          }}
                          image={article.image}
                          alt={article.title}
                        />
                        {/* Các nút hành động */}
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
                ))
            ) : (
              <Typography>Không tìm thấy bài viết nào...</Typography>
            )}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(filteredArticles.length / itemsPerPage)}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          </Grid>
          {/* Right Column */}
          <Grid item md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Bài viết cùng chuyên mục
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <ul className="category-list">
                  {cates.map((cate) => (
                    <Link to={`/CateArticleDetail/${cate.id}`} style={{ textDecoration: 'none' }}>
                      <li key={cate.id} className="category-item">
                        <strong>{cate.name}</strong>
                      </li>
                    </Link>
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