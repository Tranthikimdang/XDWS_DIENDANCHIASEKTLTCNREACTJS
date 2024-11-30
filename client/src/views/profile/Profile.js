// PROFILE.JS CONTEXT

/* eslint-disable no-unused-vars */
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
} from '@mui/material';
import { Email, LocationOn, Phone, Work, Person, Cake } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; //style
import { Link } from 'react-router-dom';
// APIs
import UserAPI from 'src/apis/UserApI';
import CourseApi from '../../apis/CourseApI';
import StudytimeApi from '../../apis/StudyTimeApI';
import QuestionsApis from '../../apis/QuestionsApis';
import MentorAPI from 'src/apis/mentorApi'; // Import MentorAPI
import { deleteQuestion, getQuestionsList, updateQuestion } from 'src/apis/QuestionsApis';
import Chat from '../chat/chatbox';
//
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Icons
import DescriptionIcon from '@mui/icons-material/Description';

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [reload, setReload] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [StudyTime, setStudyTime] = useState([]);
  const [showChat, setShowChat] = useState(false); 

  // New states for Mentor details
  const [mentorDetails, setMentorDetails] = useState({});
  const [mentorLoading, setMentorLoading] = useState(true);
  const [mentorError, setMentorError] = useState(null);

  const userLocal = JSON.parse(localStorage.getItem('user'));
  const userLocalId = userLocal ? userLocal.id : null;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await UserAPI.getUsersList();
        const matchingUser = response.data.users.find((user) => user.id == userId);

        setUser(matchingUser);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Get all studyTime data
        const studyTimeResponse = await StudytimeApi.getStudyTimesList();
        const studyTimes = studyTimeResponse?.data?.studyTimes || [];

        // 2. Filter studyTime by userId
        const userStudyTimes = studyTimes.filter((item) => item.user_id === Number(userId));

        // 3. Get course_ids from user's studyTime
        const courseIds = userStudyTimes.map((item) => item.course_id);

        // 4. Get all courses
        const coursesResponse = await CourseApi.getCoursesList();
        const allCourses = coursesResponse?.data?.courses || [];

        // 5. Filter courses matching course_ids
        const filteredCourses = allCourses.filter((course) => courseIds.includes(course.id));

        // 6. Update state
        setProducts(filteredCourses);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error if any
      } finally {
        setIsLoading(false); // Turn off loading state
      }
    };

    fetchData();
  }, [userId]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await getQuestionsList();
        if (res.status == 'success') {
          setQuestions(res?.data?.questions);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [reload]);

  // Fetch Mentor details if user is a mentor
  useEffect(() => {
    const fetchMentorDetails = async () => {
      setMentorLoading(true);
      try {
        const response = await MentorAPI.detailMentor(userId);
        setMentorDetails(response.data);
      } catch (error) {
        console.error('Error fetching mentor details:', error);
        setMentorError('Failed to load mentor details.');
      } finally {
        setMentorLoading(false);
      }
    };

    if (user.role === 'mentor') {
      fetchMentorDetails();
    }
  }, [userId, user.role]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Date formatting
  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt.seconds * 1000); // Convert seconds to milliseconds
      const now = new Date();
      const diff = now - date; // Calculate time difference

      const seconds = Math.floor(diff / 1000); // Convert ms to seconds
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

  useEffect(() => {
    const fetchStudyTime = async () => {
      setLoading(true);
      try {
        const response = await StudytimeApi.getStudyTimesList();
        const course = response.data.studyTimes;
        console.log(course);

        setStudyTime(course);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyTime();
  }, []);

  const hasStudyAccess = (productId) => {
    return StudyTime.some((study) => study.user_id == userLocalId && study.course_id == productId);
  };

  // Remove HTML tags
  const removeHtmlTags = (html) => {
    return html?.replace(/<[^>]+>/g, ''); // Remove all HTML tags
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
          {/* Left Profile Information */}
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
                alt="Profile"
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
                {user?.role === 'mentor' ? 'Người Hướng Dẫn' : 'Người Dùng'}
              </Typography>
              <Divider sx={{ width: '100%', margin: '20px 0' }} />
              <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Button variant="contained" color="primary">
                  Theo Dõi
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShowChat(true)}
                >
                  Nhắn Tin
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
                <Tab label="Khóa Học" />
                <Tab label="Câu Hỏi" />
              </Tabs>
            </Card>
          </Grid>

          {/* Right Profile Details */}
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
                    {/* General Overview */}
                    <Typography variant="h4" gutterBottom>
                      Chi Tiết Hồ Sơ
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                      {/* User Details */}
                      <Grid item xs={6}>
                        <Typography variant="body1" color="textSecondary">
                          <Person fontSize="small" sx={{ marginRight: '8px' }} />
                          Tên:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">{user.name}</Typography>
                      </Grid>
                      {/* Other Details */}
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
                          <Cake fontSize="small" sx={{ marginRight: '8px' }} />
                          Ngày sinh:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">{user.birthday}</Typography>
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

                    {/* Mentor Specific Details */}
                    {user.role === 'mentor' && (
                      <Box sx={{ marginTop: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                          Thông Tin Mentor
                        </Typography>
                        {mentorLoading ? (
                          <div>Đang tải thông tin mentor...</div>
                        ) : mentorError ? (
                          <div>{mentorError}</div>
                        ) : (
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body1" color="textSecondary">
                                Kỹ Năng:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body1">{mentorDetails.skills}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body1" color="textSecondary">
                                Số Năm Kinh Nghiệm:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body1">{mentorDetails.experience_years}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body1" color="textSecondary">
                                Đánh Giá:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body1">{mentorDetails.reviews_count} đánh giá</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body1" color="textSecondary">
                                Chứng Chỉ:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <a href={mentorDetails.certificate_url} target="_blank" rel="noopener noreferrer">
                                Xem chứng chỉ
                              </a>
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    )}
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    {/* Courses Tab Content */}
                    <Typography variant="h4" gutterBottom>
                      Khóa học của người dùng đăng ký
                    </Typography>
                    {Array.isArray(products) && products.length > 0 ? (
                      products.map((product) => (
                        <Card
                          key={product?.id}
                          sx={{
                            display: 'flex',
                            mb: 3,
                            flexDirection: { xs: 'column', md: 'row' },
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                          }}
                        >
                          <div className="card-body border p-3 rounded col-md-12 col-xl-12">
                            <div className="shadow-sm rounded-3">
                              <div className="row g-2">
                                {/* Product Image */}
                                <div className="col-12 col-md-4 mb-3 mb-md-0">
                                  <Link to={`/productDetail/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <div
                                      className="bg-image hover-zoom ripple rounded ripple-surface"
                                      style={{
                                        display: 'flex',
                                        border: '1px solid #ddd',
                                        padding: '4px',
                                        height: '120px',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <img
                                        src={product.image}
                                        className="w-100"
                                        alt={product.name}
                                        style={{
                                          objectFit: 'cover',
                                          height: '100%',
                                          borderRadius: '8px',
                                          transition: 'all 0.3s ease',
                                          cursor: 'pointer',
                                        }}
                                      />
                                    </div>
                                  </Link>
                                </div>

                                {/* Product Details */}
                                <div className="col-12 col-md-4">
                                  <h6
                                    style={{
                                      fontSize: '1rem',
                                      fontWeight: 'bold',
                                      marginBottom: '8px',
                                      textAlign: 'left',
                                    }}
                                  >
                                    {product.name}
                                  </h6>
                                  <div
                                    className="text-muted small mt-1"
                                    style={{
                                      width: '100%',
                                      whiteSpace: 'normal',
                                      overflow: 'visible',
                                      textOverflow: 'clip',
                                      textAlign: 'left',
                                    }}
                                  >
                                    Mô tả:{' '}
                                    {removeHtmlTags(product.description) || 'Không có mô tả'}
                                  </div>
                                </div>

                                {/* Price and Actions */}
                                <div className="col-12 col-md-4 d-flex flex-column align-items-start align-items-md-end">
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      padding: '10px',
                                      border: '1px solid #ddd',
                                      borderRadius: '8px',
                                      backgroundColor: '#f9f9f9',
                                      minWidth: '200px',
                                    }}
                                  >
                                    {/* Discounted Price */}
                                    <h6
                                      className="text-success mb-1"
                                      style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {product.discount?.toLocaleString('vi-VN')} VND
                                    </h6>
                                    {/* Original Price */}
                                    <span
                                      className="text-danger small mb-3"
                                      style={{ fontSize: '0.9rem', textDecoration: 'line-through' }}
                                    >
                                      {product.price?.toLocaleString('vi-VN')} VND
                                    </span>

                                    {/* Action Buttons */}
                                    <div className="mt-2 w-100 d-flex flex-column align-items-center">
                                      {hasStudyAccess(product.id) ? (
                                        <Button
                                          variant="contained"
                                          color="success"
                                          size="small"
                                          fullWidth
                                          sx={{ mb: 1 }}
                                          onClick={() => navigate(`/productDetailUser/${product.id}`)}
                                        >
                                          Bắt đầu học
                                        </Button>
                                      ) : (
                                        <>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            fullWidth
                                            sx={{ mb: 1 }}
                                          >
                                            Mua ngay
                                          </Button>
                                          <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            fullWidth
                                          >
                                            Thêm vào giỏ hàng
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body2">Không có khóa học nào.</Typography>
                    )}
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    {/* Questions Tab Content */}
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
      {/* Conditional Rendering of Chat */}
      {showChat && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            height: '500px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            backgroundColor: '#fff',
            zIndex: 1000,
          }}
        >
          <Chat
            participants={[
              {
                id: userLocal.id,
                name: userLocal.name,
                avatar: userLocal.avatar || '/path/to/default-avatar.png',
              },
              {
                id: user.id,
                name: user.name,
                avatar: user.avatar || '/path/to/default-avatar.png',
              },
            ]}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowChat(false)}
            sx={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            Đóng
          </Button>
        </Box>
      )}
    </PageContainer>
  );
};

export default Profile;