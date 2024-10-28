import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Grid, Box, Card, CardContent, Typography, Avatar, Divider, Tabs, Tab, Button, IconButton, CardMedia } from '@mui/material';
import { Email, LocationOn, Phone, Work, Person } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//icon

// import { IconBookmark, IconDots } from '@tabler/icons';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import EmailIcon from '@mui/icons-material/Email';
// import LinkIcon from '@mui/icons-material/Link';
// import FlagIcon from '@mui/icons-material/Flag';
// import SearchIcon from '@mui/icons-material/Search';


const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [articles, setArticles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [catesMap, setCatesMap] = useState({});
  const [cates, setCates] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
        } else {
          console.log('Không tìm thấy tài liệu người dùng!');
          setError('Người dùng không tồn tại');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        setError('Không thể lấy dữ liệu người dùng');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserArticlesAndQuestions = async () => {
      try {
        // Lấy bài viết của người dùng
        const articlesQuery = query(collection(db, 'articles'), where('user_id', '==', userId));

        // Execute the query
        const articlesSnapshot = await getDocs(articlesQuery);

        // Map the documents to an array of objects
        const fetchedArticles = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Kiểm tra kết quả truy vấn
        console.log('User Articles:', fetchedArticles);

        // Update state with fetched articles
        setArticles(fetchedArticles);

        // Lấy câu hỏi của người dùng
        const questionsQuery = query(collection(db, 'questions'), where('user_id', '==', userId));
        const questionsSnapshot = await getDocs(questionsQuery);

        // Map the documents to an array of objects
        const fetchedQuestions = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Kiểm tra kết quả truy vấn
        console.log('User Questions:', fetchedQuestions);

        // Update state with fetched questions
        setQuestions(fetchedQuestions);

      } catch (error) {
        console.error('Lỗi khi lấy bài viết và câu hỏi:', error);
      }
    };



    fetchUser();
    fetchUserArticlesAndQuestions();
  }, [userId]);

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
                src={user?.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog'}
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
                {user?.role === 'mentors' ? 'Mentor' : 'Người Dùng'}
              </Typography>
              <Divider sx={{ width: '100%', margin: '20px 0' }} />
              <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Button variant="contained" color="primary" >
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
                        <Typography variant="body1">{user.role === 'admin' ? 'Quản Trị Viên' : 'Người Dùng'}</Typography>
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
                      articles.map((article) =>
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
                                {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <img
                                    src={
                                      user?.find((u) => article?.user_id === u.id)?.imageUrl ||
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
                                      {user?.find((u) => article?.user_id === u.id)?.name}
                                    </strong>
                                  </Typography>
                                </Box> */}
                                <Typography variant="h6" component="h2" className="article-title">
                                  {article.title.length > 100
                                    ? `${article.title.substring(0, 100)}...`
                                    : article.title}
                                </Typography>
                                <Typography variant="body2" paragraph color="textSecondary" className="article-description">
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
                        )
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
                              {/* <Box display="flex" alignItems="center">
                                <img
                                  src={
                                    users?.find((u) => question.user_id === u.id)?.imageUrl ||
                                    'default-image-url.jpg'
                                  }
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
                                    {users?.find((u) => question.user_id === u.id)?.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {formatUpdatedAt(question.updated_at)}
                                  </Typography>
                                </Box>
                              </Box> */}
                            </Box>
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
