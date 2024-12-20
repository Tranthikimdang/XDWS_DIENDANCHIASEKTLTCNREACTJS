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
import { useNavigate, Link } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];

  // Fetch articles from Firestore
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesSnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = articlesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesData);
        console.log('Fetched articles:', articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
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
        console.log('Fetched users:', usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
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
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCates(categoriesData);

        // Create a mapping of category ID to name
        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCatesMap(categoriesMap);

        console.log('Fetched categories:', categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const prioritizeArticles = (articles) => {
    // Ưu tiên các bài viết thuộc danh mục người dùng đã chọn
    const prioritized = articles.filter(article => selectedCategories.includes(article.categories_id));

    // Tìm kiếm trong nội dung bài viết có từ khóa gần giống với tên danh mục
    const relatedArticles = articles.filter(article => {
      const contentWithoutHtml = removeHtmlTags(article.content).toLowerCase();
      return selectedCategories.some(catId => {
        const categoryName = catesMap[catId]?.toLowerCase();
        return contentWithoutHtml.includes(categoryName);
      });
    });

    // Bỏ qua những bài đã có trong prioritized và relatedArticles
    const otherArticles = articles.filter(article =>
      !prioritized.includes(article) && !relatedArticles.includes(article)
    );

    // Kết hợp: bài viết ưu tiên -> bài có từ khóa liên quan -> các bài còn lại
    return [...prioritized, ...relatedArticles, ...otherArticles];
  };


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
    article.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = prioritizeArticles(filteredArticles).slice(indexOfFirstItem, indexOfLastItem);

  return (
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              <strong>Bài viết nổi bật</strong>
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật
              lập trình web.
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
                .map(
                  (article) =>
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
                          overflow: 'hidden',
                        }}
                        onClick={() => handleCardClick(article.id)} // Điều hướng đến chi tiết
                      >
                        {/* Bên trái: Nội dung */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <img
                                src={
                                  users?.find((u) => article?.user_id === u.id)?.imageUrl ||
                                  'default-image-url.jpg'
                                }
                                alt="User Avatar"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  marginRight: 8,
                                }}
                              />
                              <Typography variant="body1" component="span" className="author-name">
                                <strong>
                                  {users?.find((u) => article?.user_id === u.id)?.name}
                                </strong>
                              </Typography>
                            </Box>
                            <Typography variant="h5" component="h2" className="article-title">
                              {article.title.length > 100
                                ? `${article.title.substring(0, 100)}...`
                                : article.title}
                            </Typography>
                            <Typography variant="body2" paragraph className="article-description">
                              {removeHtmlTags(article.content, 'p').length > 10
                                ? `${removeHtmlTags(article.content, 'p').substring(0, 10)}...`
                                : removeHtmlTags(article.content, 'p')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                className="category-badge"
                              >
                                {catesMap[article.categories_id] || 'Chưa rõ chuyên mục'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                                {formatUpdatedAt(article.updated_at)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Box>

                        {/* Bên phải: Hình ảnh và các nút hành động */}
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
                          className="card-media"
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              width: { xs: '100%', md: 200 },
                              height: { xs: 'auto', md: '100%' },
                              aspectRatio: '16/9',
                              objectFit: 'cover',
                            }}
                            image={article.image}
                            alt={article.title}
                          />
                          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                            <IconButton
                              aria-label="bookmark"
                              onClick={(event) => event.stopPropagation()} // Ngăn sự kiện click thẻ Card
                            >
                              <IconBookmark />
                            </IconButton>
                            <IconButton
                              aria-label="more"
                              onClick={(event) => {
                                event.stopPropagation(); // Ngăn sự kiện click thẻ Card
                                handleClick(event);
                              }}
                            >
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
                    ),
                )
            ) : (
              <Typography>Không tìm thấy bài viết nào.</Typography>
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
                    <Link
                      to={`/CateArticleDetail/${cate.id}`}
                      style={{ textDecoration: 'none' }}
                      key={cate.id}
                    >
                      <li className="category-item mb-2">
                        {' '}
                        {/* Thêm mb-2 để tạo khoảng cách dưới mỗi mục */}
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
