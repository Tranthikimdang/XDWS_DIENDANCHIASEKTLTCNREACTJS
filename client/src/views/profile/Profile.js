import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Box, Card, CardContent, Typography, Avatar, Divider, Tabs, Tab, Button, IconButton, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Email, LocationOn, Phone, Work, Person } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DescriptionIcon from '@mui/icons-material/Description';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    expertise: '',
    email: '',
    curriculumvitae: '',
    github: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          setError('Người dùng không tồn tại');
        }
      } catch (error) {
        setError('Không thể lấy dữ liệu người dùng');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserArticlesAndQuestions = async () => {
      try {
        const articlesQuery = query(collection(db, 'articles'), where('user_id', '==', userId));
        const articlesSnapshot = await getDocs(articlesQuery);
        setArticles(articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const questionsQuery = query(collection(db, 'questions'), where('user_id', '==', userId));
        const questionsSnapshot = await getDocs(questionsQuery);
        setQuestions(questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Lỗi khi lấy bài viết và câu hỏi:', error);
      }
    };

    fetchUser();
    fetchUserArticlesAndQuestions();
  }, [userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCatesMap(categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {}));
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

  const formatUpdatedAt = (updatedAt) => {
    if (!updatedAt) return 'Không rõ thời gian';
    const date = new Date(updatedAt.seconds * 1000);
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

  const removeHtmlTags = (html) => html?.replace(/<[^>]+>/g, '');

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'mentors'), formData);
      console.log('Mentor added successfully');
    } catch (error) {
      console.error('Error adding mentor:', error);
    }
    handleCloseDialog();
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
                {user?.role === 'mentor' ? 'Người hướng dẫn' : 'Người dùng'}
              </Typography>
              <Divider sx={{ width: '100%', margin: '20px 0' }} />
              <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Button variant="contained" color="primary">
                  Theo Dõi
                </Button>
                {currentUser?.id === userId && (
                  <Button variant="outlined" color="secondary" onClick={handleOpenDialog}>
                    Đăng kí làm mentor
                  </Button>
                )}
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
                            onClick={() => handleCardClick(article.id)}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <img
                                    src={user.imageUrl || '../../assets/images/profile/user-1.jpg'}
                                    alt="User Avatar"
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '50%',
                                      marginRight: 8,
                                    }}
                                  />
                                  <Typography variant="body1" component="span" className="author-name">
                                    <strong>{user.name}</strong>
                                  </Typography>
                                </Box>
                                <Typography variant="h6" component="h2" className="article-title">
                                  {article.title.length > 100
                                    ? `${article.title.substring(0, 100)}...`
                                    : article.title}
                                </Typography>
                                <Typography variant="body2" paragraph color="textSecondary" className="article-description">
                                  {removeHtmlTags(article.content).length > 10
                                    ? `${removeHtmlTags(article.content).substring(0, 10)}...`
                                    : removeHtmlTags(article.content)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <Typography variant="body2" color="textSecondary" className="category-badge">
                                    {catesMap[article.categories_id] || 'Chưa rõ chuyên mục'}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                                    {formatUpdatedAt(article.updated_at)}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }} className="card-media">
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
                            <Box sx={{ mt: 3, mb: 3 }}>
                              <Typography variant="subtitle1">{question?.questions || ''}</Typography>
                              <Divider sx={{ mb: 2 }} />
                              {question?.hashtag && (
                                <Typography variant="h6" sx={{ color: '#007bff', fontSize: '0.8rem' }}>
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
                            {question.fileUrls && question.fileUrls.length > 0 && question.fileUrls.some(url => decodeURIComponent(url).split('/').pop().split('?')[0] !== 'uploads') && (
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
                                    const fileName = decodeURIComponent(url).split('/').pop().split('?')[0];
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Đăng kí làm mentor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Họ & Tên"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Tuổi"
            type="number"
            fullWidth
            value={formData.age}
            onChange={handleInputChange}
            />
            <TextField
            margin="dense"
            name="phone"
            label="Số điện thoại"
            type="number"
            fullWidth
            value={formData.phone}
            onChange={handleInputChange}
            />
            <TextField
            margin="dense"
            name="expertise"
            label="Chuyên môn"
            type="text"
            fullWidth
            value={formData.expertise}
            onChange={handleInputChange}
            />
               <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            />
               <TextField
            margin="dense"
            name="curriculumvitae"
            label="CV"
            type="file"
            fullWidth
            value={formData.curriculumvitae}
            onChange={handleInputChange}
            />
                <TextField
            margin="dense"
            name="github"
            label="Tài khoản Github"
            type="text"
            fullWidth
            value={formData.github}
            onChange={handleInputChange}
            />
            </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">đóng</Button>

          <Button onClick={handleSubmit} color="primary">Đăng kí</Button>
          </DialogActions>

      </Dialog>

    </PageContainer>

  );
  }
  export default Profile;
