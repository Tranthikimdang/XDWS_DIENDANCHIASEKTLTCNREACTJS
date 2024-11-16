// First, modify imports - remove Firestore related imports and add UserApi
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Button,
  IconButton,
  CardMedia,
} from '@mui/material';
import { Email, LocationOn, Phone, Work, Person } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import UserApi from '../../apis/ProfileApI';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//icon
import DescriptionIcon from '@mui/icons-material/Description';
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import SearchIcon from '@mui/icons-material/Search';

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [articles, setArticles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [catesMap, setCatesMap] = useState({});
  const [cates, setCates] = useState([]);
  

  // 2. Update user fetching logic
// Profile.js - Updated data fetching

// Combine data fetching into single useEffect
useEffect(() => {
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [userResponse, articlesResponse, questionsResponse, categoriesResponse] = 
        await Promise.all([
          UserApi.getUserById(userId),
          UserApi.getUserArticles(userId),
          UserApi.getUserQuestions(userId),
          UserApi.getCategories()
        ]);

      setUser(userResponse.data);
      setArticles(articlesResponse.data);
      setQuestions(questionsResponse.data);
      
      const categoriesMap = categoriesResponse.data.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {});
      
      setCatesMap(categoriesMap);
      setCates(categoriesResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, [userId]);
  // 3. Update articles and questions fetching
  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        const [articlesRes, questionsRes] = await Promise.all([
          UserApi.getUserArticles(userId),
          UserApi.getUserQuestions(userId),
        ]);

        setArticles(articlesRes.data || []);
        setQuestions(questionsRes.data || []);
      } catch (error) {
        console.error('Error fetching user content:', error);
      }
    };

    fetchUserContent();
  }, [userId]);

  // 4. Update formatUpdatedAt to work with ISO dates
  const formatUpdatedAt = (updatedAt) => {
    if (!updatedAt) return 'Không rõ thời gian';

    const date = new Date(updatedAt);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
  };

  // 5. Update categories fetching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await UserApi.getCategories();
        const categoriesData = response.data || [];

        setCates(categoriesData);
        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCatesMap(categoriesMap);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
  };

  //xóa các thẻ html
  const removeHtmlTags = (html) => {
    return html?.replace(/<[^>]+>/g, ''); // Loại bỏ tất cả các thẻ HTML
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Hồ Sơ Người Dùng" description="Đây là trang Hồ Sơ Người Dùng">
      <Box
        sx={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#f4f6f8',
          borderRadius: '15px',
        }}
      >
        <Grid container spacing={2}>
          {/* Phần thông tin hồ sơ bên trái */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '20px',
              }}
            >
              <Avatar
                src={user?.imageUrl || '../../assets/images/profile/user-1.jpg'}
                alt="Hồ Sơ"
                sx={{
                  width: '120px',
                  height: '120px',
                  marginBottom: '20px',
                }}
              />
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {user?.role === 'mentors' ? 'Mentors' : 'Người hướng dẫn'}
              </Typography>
              <Divider sx={{ width: '100%', margin: '20px 0' }} />
              <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Button variant="contained" color="primary">
                  Theo Dõi
                </Button>
                <Button variant="outlined" color="secondary">
                  Yêu Cầu Làm Mentor
                </Button>
              </Box>
              <Divider sx={{ width: '100%', margin: '20px 0' }} />
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Tổng Quan" />
                <Tab label="Bài Viết" />
                <Tab label="Câu Hỏi" />
              </Tabs>
            </Card>
          </Grid>

          {/* Phần chi tiết hồ sơ bên phải */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
              }}
            >
              <CardContent>
                {activeTab === 0 && (
                  <>
                    {/* Nội dung Tổng Quan */}
                    <Typography variant="h4" gutterBottom>
                      Chi Tiết Hồ Sơ
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                      <Grid item xs={6}>
                        <Typography variant="body1" color="textSecondary">
                          <Person fontSize="small" sx={{ marginRight: '8px' }} />
                          Tên:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">{user.name}</Typography>
                      </Grid>
                      {/* Thông tin chi tiết khác */}
                      <Grid item xs={6}>
                        <Typography variant="body1" color="textSecondary">
                          <Email fontSize="small" sx={{ marginRight: '8px' }} />
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">{user.email}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" color="textSecondary">
                          <Phone fontSize="small" sx={{ marginRight: '8px' }} />
                          Số Điện Thoại:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">{user.phone}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" color="textSecondary">
                          <LocationOn fontSize="small" sx={{ marginRight: '8px' }} />
                          Địa Chỉ:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">{user.location}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" color="textSecondary">
                          <Work fontSize="small" sx={{ marginRight: '8px' }} />
                          Nghề Nghiệp:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          {user.role === 'mentor' ? 'Người Hướng Dẫn' : 'Người Dùng'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    {/* Nội dung tab Bài Viết */}
                    <Typography variant="h4" gutterBottom>
                      Bài Viết Của Người Dùng
                    </Typography>
                    {articles.length > 0 ? (
                      articles.map(
                        (article) =>
                          article.isApproved === 1 && (
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
                                  {/*  */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <img
                                      src={
                                        user.imageUrl || '../../assets/images/profile/user-1.jpg'
                                      }
                                      alt="User Avatar"
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        marginRight: 8,
                                      }}
                                    />
                                    <Typography
                                      variant="body1"
                                      component="span"
                                      className="author-name"
                                    >
                                      <strong>{user.name}</strong>
                                    </Typography>
                                  </Box>
                                  {/*  */}
                                  <Typography variant="h6" component="h2" className="article-title">
                                    {article.title.length > 100
                                      ? `${article.title.substring(0, 100)}...`
                                      : article.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    paragraph
                                    color="textSecondary"
                                    className="article-description"
                                  >
                                    {removeHtmlTags(article.content, 'p').length > 10
                                      ? `${removeHtmlTags(article.content, 'p').substring(
                                          0,
                                          10,
                                        )}...`
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
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{ ml: 2 }}
                                    >
                                      {formatUpdatedAt(article.updated_at)}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Box>

                              {/* Bên phải: Hình ảnh và các nút hành động */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  position: 'relative',
                                }}
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
                                {/* <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
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
                              </Box> */}
                              </Box>
                            </Card>
                          ),
                      )
                    ) : (
                      <Typography variant="body2">Không có bài viết nào.</Typography>
                    )}
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    {/* Nội dung tab Câu Hỏi */}
                    <Typography variant="h4" gutterBottom>
                      Câu Hỏi Của Người Dùng
                    </Typography>
                    {questions?.length > 0 ? (
                      questions
                        .filter((question) => question.isApproved === 1)
                        .sort((a, b) => (a.updated_at.seconds < b.updated_at.seconds ? 1 : -1))
                        .map((question) => (
                          <Box
                            key={question.id}
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px',
                              padding: '20px',
                              marginTop: '20px',
                              backgroundColor: '#fff',
                            }}
                          >
                            {/* Header with Author Info */}
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Box display="flex" alignItems="center">
                                <img
                                  src={user.imageUrl || '../../assets/images/profile/user-1.jpg'}
                                  alt="Author"
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    marginRight: 8,
                                  }}
                                />
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {user.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {formatUpdatedAt(question.updated_at)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            {/* Display Question Content */}
                            <Box sx={{ mt: 3, mb: 3 }}>
                              <Typography variant="subtitle1">
                                {question?.questions || ''}
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              {question?.hashtag && (
                                <Typography
                                  variant="h6"
                                  sx={{ color: '#007bff', fontSize: '0.8rem' }}
                                >
                                  #{question.hashtag}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ mt: 3, mb: 3 }}>
                              {question?.up_code ? (
                                <>
                                  <SyntaxHighlighter language="javascript" style={dracula}>
                                    {question.up_code}
                                  </SyntaxHighlighter>
                                  <Divider sx={{ mb: 2 }} />
                                </>
                              ) : null}
                            </Box>

                            {/* Display Images */}
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '5px',
                              }}
                            >
                              {question?.imageUrls?.length > 0 &&
                                question?.imageUrls.map((image, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      flexBasis: ['100%', '48%', '32%'][Math.min(2, index)],
                                      flexGrow: 1,
                                      maxWidth: ['100%', '48%', '32%'][Math.min(2, index)],
                                      mb: 2,
                                    }}
                                  >
                                    <img
                                      src={image || '../../assets/images/profile/user-1.jpg'}
                                      alt=""
                                      style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </Box>
                                ))}
                            </Box>
                            {question.fileUrls &&
                              question.fileUrls.length > 0 &&
                              question.fileUrls.some(
                                (url) =>
                                  decodeURIComponent(url).split('/').pop().split('?')[0] !==
                                  'uploads',
                              ) && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    width: 'fit-content',
                                    height: '30px',
                                  }}
                                >
                                  <IconButton sx={{ color: '#007bff' }}>
                                    <DescriptionIcon />
                                  </IconButton>
                                  <Typography variant="subtitle1">
                                    {question.fileUrls.map((url, index) => {
                                      const fileName = decodeURIComponent(url)
                                        .split('/')
                                        .pop()
                                        .split('?')[0];
                                      return fileName !== 'uploads' ? (
                                        <a
                                          key={index}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            color: 'inherit',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            marginRight: '10px',
                                          }}
                                        >
                                          {fileName}
                                        </a>
                                      ) : null;
                                    })}
                                  </Typography>
                                </Box>
                              )}

                            <Divider sx={{ my: 2 }} />
                            {/* Like and Comment Counts */}
                            <Typography variant="subtitle1" color="textSecondary">
                              345 Likes • 34 Comments
                            </Typography>
                          </Box>
                        ))
                    ) : (
                      <Typography variant="body2">Không có câu hỏi nào.</Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Profile;
