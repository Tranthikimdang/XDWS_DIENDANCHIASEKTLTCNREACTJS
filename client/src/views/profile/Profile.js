/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
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
  Snackbar,
  Alert,
} from '@mui/material';
import { Email, LocationOn, Phone, Work, Person, Cake } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; //style
import { jsPDF } from 'jspdf';
//sql
import UserAPI from 'src/apis/UserApI';
import CourseApi from '../../apis/CourseApI';
import StudytimeApi from '../../apis/StudyTimeApI';
import QuestionsApis from '../../apis/QuestionsApis';
import { deleteQuestion, getQuestionsList, updateQuestion } from 'src/apis/QuestionsApis';
import FollowApi from '../../apis/FollowApI';
import NotificationApi from '../../apis/NotificationsApI';
import CertificateAPI from '../../apis/CertificateApI';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CardMedia } from '@mui/material';
import api from '../../apis/NotificationsApI';
//icon
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
  const [follow, setFollow] = useState([]);
  const [followStatus, setFollowStatus] = useState('not_followed'); // Trạng thái ban đầu
  const [followId, setFollowId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [courses, setCourses] = useState([]); // Lưu danh sách tất cả khóa học
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);

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
        // 1. Lấy toàn bộ dữ liệu studyTime
        const studyTimeResponse = await StudytimeApi.getStudyTimesList();
        const studyTimes = studyTimeResponse?.data?.studyTimes || [];

        // 2. Lọc dữ liệu studyTime theo userId
        const userStudyTimes = studyTimes.filter((item) => item.user_id === Number(userId));

        // 3. Lấy danh sách course_id từ studyTime của user
        const courseIds = userStudyTimes.map((item) => item.course_id);

        // 4. Lấy toàn bộ danh sách courses
        const coursesResponse = await CourseApi.getCoursesList();
        const allCourses = coursesResponse?.data?.courses || [];

        // 5. Lọc courses có id trùng với course_id
        const filteredCourses = allCourses.filter((course) => courseIds.includes(course.id));

        // 6. Cập nhật state
        setProducts(filteredCourses);
      } catch (error) {
        console.error('Error fetching data:', error); // Log lỗi nếu có
      } finally {
        setIsLoading(false); // Tắt trạng thái loading
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await CertificateAPI.getCertificatesList(); // Gọi API để lấy tất cả chứng chỉ

        // Lọc chứng chỉ chỉ thuộc về userId hiện tại
        const userCertificates = response.data.certificates.filter(
          (certificate) => certificate.user_id == userId,
        );

        // Gắn tên khóa học vào từng chứng chỉ
        const updatedCertificates = userCertificates.map((certificate) => {
          const course = courses.find((course) => course.id === certificate.course_id); // Tìm khóa học theo course_id
          return {
            ...certificate,
            course_name: course ? course.name : 'Khóa học không tìm thấy', // Gắn tên khóa học vào chứng chỉ
            img: course ? course.image : 'không có ảnh', // Gắn tên khóa học vào chứng chỉ
          };
        });

        setFilteredCertificates(updatedCertificates); // Lưu chứng chỉ đã được gắn tên khóa học vào state
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userId, courses]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CourseApi.getCoursesList(); // Gọi API để lấy toàn bộ khóa học
        setCourses(response.data.courses); // Lưu tất cả khóa học vào state
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleDownloadCertificate = (course, user) => {
    if (!user || !course) return; // Kiểm tra dữ liệu người dùng và khóa học

    // Tạo tài liệu PDF
    const doc = new jsPDF();

    // Thêm background cho chứng chỉ
    doc.setFillColor(240, 240, 240); // Màu nền sáng
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F'); // Vẽ hình chữ nhật nền

    // Thêm khung cho chứng chỉ
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); // Màu khung đen
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20); // Khung bao quanh chứng chỉ

    // Thêm logo ở giữa chứng chỉ
    const logoUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUkSURBVHgB7Z2NcdpMEIaXb1IAXweiAkMFhgpiKjCuwHEFmApsKjCuwLgClAqMK0CpwHRw2RdORAGZHyHdbqx9Zi5yzDjx7N7+3N6dtkEV4ZyL+NHlccEDX7f9RxHpJuGx9GPO4yeejUYjoQpoUImw0Lv8+M7jivQL+lSgjJjHMytjTiVxtgJY6E1+DGgt+C7VAyhgzIqY0JmcpQAW/oAfDzyaVE8SHqNzFFFIAd7VDKk+M/4QCY9ekTjxH50ICx8zfkYm/CwRjwXLZkgncrQF+KzmiUzwh0B86B9rDUcpwAsfsz4i4xgSOtIlHXRBLHzk729kwj+FiMfMy24vey3AZv7ZYDHX2WcJn1qACb8UkJ7PvCxz+dQC+IcWZMIvC5QyOnkf5FqAT6ciMsqi7dP3HXYswC+yZmRUATKjOPuNPAWY66mOhBXQyn7jLxfkazsRGVURsYzvs9/4ywJs9gcBqWmLLQHPPxZgsz8YSE1/pH/ZWIDN/qAs2QL+xxcrC/CZT0RGKJpe5hsXdE1GaLBtu3ZB5n5EWLmhRqbaaYQnggs6WDI1KqNnCpCl/Y3WB6fUEscxvb6+UpIkq7FcLqlMut0uPT09kRARFKDuSAmEPB6P6fHxsXSBbwOlCnIBBUSkCMz4m5ubYIJpt0U9cBMxQI0FjEYj6vV6QWflxYWoB25iDaCC+/t7x79Q8LFYLJwkKhTAQVBE+IPBwEkjrgDMwCiKajn7wclHE8sGfl8iExkOh8SKJ3GcMBKz//b21mlBVAHT6TS48K+vr50mRF0Qcv6QPDw80GQyIU18I0Hm89Ju+uwlLTeo8PlbiCqgKiBorHAvLy+JU01qNvVe4MF+gCNDDPE0tO6YAoQRjQH9fr+SQIwYAL9/dXW1igMag+8GJwgLKEjuj5qPhrJDHqIuKNTMRO7farVWZQ9tiCogdC2eS950d3dHqnCCfHx8OPbVwcsRGsrQKaIWkAbK0MAlYc9ZA+ILMZSiO51O5ZvveXBgFs+QxNcBEABq8xJg818cp4RQKen2QBySRM1KGNVKVC1D8/z8TJKoUQAC8mw2C+6OQu9J7OAU8vb2FmyrEv+PJKrL0ZidcBGoF1W5eSMpgn9mPwBpalWpqmQqahsywth+gDDq94QRB97f31cxoIoDXNg7xmkJKVQqIOT9AGnUKaBm9wN0xYAa3g/QsxCz+wGCvLy8iAjf7gc4ux8gHgNQarD7AYJIzH5NR9TtfoAwcEFiK53QtXi4HWX3A5ZYiEEBIue3Q94PQLlBetGVQwIFQAoRfSGwu5a9H6D4bOjKAn6RENiCrDnviAFh/ICRxxwKiMmQYp6+M+6D6tsJSYrVa4zTlbDs4Zh6EuOPVAFTMkKzmvTZN+eaGwrH5i3q2WKcjvPa9WBzVSdrAZj9CzIrqJqEMi2uNhbgX6duVlA942xXJeugEZb9HTQ8Cm4tfFl2ZLujAN9kxlxR+Yy2G/iAfX3E8EJve61xOey4npR9e8J9Wkds4zwSHr3PPmzQHty6BR8swVLTYhTvJQn8D0J7CRmnAuEfbGm71wJSnDX2PJWEyuonDDKWYJs3h4nphP7yRx/Mwj/oO4Lqe+WIHrDKPVr44CgXtI25pB3gGe7y8vxDFDqa6K0BeS1WdgnVFwRaCL5TRPigkAVs49ZtEG+pPgu3mMcrj0naE7IopSggxa1bYg14XNLXU0ZCa6FPi872PEpVQBYfJ6CELq0bBWExF5H+RV3in/Drv/wzPiWwGv8QvwHu5t44+FRvkgAAAABJRU5ErkJggg=='; // Logo
    const logoWidth = 50;
    const logoHeight = 50;
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2; // Căn giữa logo
    const logoY = 50;
    doc.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Thêm tiêu đề cho giấy khen
    doc.setFont('times', 'normal');
    doc.setFontSize(22);
    doc.text('SHARE CODE', doc.internal.pageSize.width / 2, 120, { align: 'center' });

    // Thêm thông tin học viên
    doc.setFontSize(16);
    doc.text(`Name: ${user.name}`, 20, 150);
    doc.text(`Course: ${course}`, 20, 160); // Sử dụng tên khóa học từ state course
    doc.text(`Issue date: ${new Date().toLocaleDateString()}`, 20, 170);
    doc.text(`Completion rate: 100%`, 20, 180);

    // Thêm thông điệp cuối
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.text('Thank you for participating and good luck!', doc.internal.pageSize.width / 2, 220, {
      align: 'center',
    });

    // Lưu PDF
    doc.save('certificate.pdf');
  };
  // Fetch câu hỏi
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await getQuestionsList();
        if (res.status == 'success') {
          setQuestions(res?.data?.questions);
        }
      } catch (error) {
        console.error('Lỗi khi tải câu hỏi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [reload]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  //date
  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt); // Tạo đối tượng Date từ chuỗi thời gian
      const now = new Date();
      const diff = now - date;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Hiển thị thời gian theo các đơn vị khác nhau
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

  //thông báo cho người khác
  const addNotification = async (message, followId = null) => {
    try {
      const notification = {
        userId: userId,
        message,
        type: followId ? 'not_followed' : 'pending',
        relatedId: followId || null,
      };

      await NotificationApi.createNotification(notification);
      console.log('Thông báo đã được thêm vào database');
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  //thông báo cho tôi
  const addNotificationMe = async (message, followId = null) => {
    try {
      const notification = {
        userId: userLocalId,
        message,
        type: 'pending',
        relatedId: followId || null,
      };

      await NotificationApi.createNotification(notification);
      console.log('Thông báo đã được thêm vào database');
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!userId) {
        console.warn('User ID không tồn tại');
        return;
      }

      try {
        // Lấy tất cả các follow từ API
        const response = await FollowApi.getAllFollows();
        if (!response || !Array.isArray(response.data)) {
          console.error('API trả về dữ liệu không hợp lệ');
          return;
        }

        // Tìm follow có liên quan đến userId
        const follow = response.data.find(
          (follow) =>
            (follow.follower_id == userId && follow.target_id == userLocalId) ||
            (follow.follower_id == userLocalId && follow.target_id == userId),
        );

        // Kiểm tra nếu có follow
        if (follow) {
          setFollowStatus(follow.status || 'not_followed');
          setFollowId(follow.id || null);
          setFollow(follow);
        } else {
          setFollowStatus('not_followed'); // Mặc định là 'not_followed' nếu không tìm thấy follow
          setFollowId(null);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    fetchFollowStatus();
  }, [userId, userLocalId]); // Chạy lại khi userId hoặc userLocalId thay đổi

  const deleteFollow = async () => {
    try {
      if (followId) {
        // Gọi API để xóa follow
        await FollowApi.deleteFollow(followId);
        setFollowStatus('not_followed'); // Cập nhật trạng thái
        setFollowId(null); // Xóa followId khỏi state
        setSnackbarMessage('Đã hủy kết bạn');
        setOpenSnackbar(true);
      } else {
        console.warn('Không tìm thấy followId để xóa.');
      }
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
      setSnackbarMessage('Hủy kết bạn thất bại, vui lòng thử lại.');
      setOpenSnackbar(true);
    }
  };
  const handleFollowClick = async () => {
    try {
      if (!isUserLoggedIn()) {
        setSnackbarMessage('Bạn cần đăng nhập để thực hiện hành động này');
        setOpenSnackbar(true);
        return;
      }
      if (followStatus === 'not_followed') {
        // Gửi yêu cầu theo dõi
        const response = await FollowApi.createFollow(userLocalId, userId);
        if (!response || !response.data || !response.data.id) {
          console.error('API createFollow không trả về dữ liệu hợp lệ');
          return;
        }

        const newFollowId = response.data.id; // Lấy ID của bản follow vừa được thêm
        setFollowStatus('pending');
        setFollowId(newFollowId); // Gán followId mới vào state
        setSnackbarMessage('Đã gửi yêu cầu theo dõi');
        setOpenSnackbar(true);

        // Gửi thông báo với followId làm relatedId
        await addNotification(`${user.name} đã gửi lời mời kết bạn`, newFollowId);
      } else if (followStatus === 'pending' && followId) {
        // Hủy yêu cầu theo dõi
        await FollowApi.deleteFollow(followId);
        setFollowStatus('not_followed');
        setFollowId(null);
        setSnackbarMessage('Đã hủy yêu cầu theo dõi');
        setOpenSnackbar(true);

        // Gửi thông báo với followId làm relatedId
        await addNotificationMe(`Bạn đã hủy yêu cầu kết bạn`, userLocalId);
      }
    } catch (error) {
      console.error('Error handling follow click:', error);
    }
  };
  const isUserLoggedIn = () => {
    const userLocalId = localStorage.getItem('user');
    return !!userLocalId; // Trả về true nếu tồn tại, ngược lại false
  };

  const handleAcceptNotification = async (notification) => {
    console.log('Notification data:', notification.relatedId); // Kiểm tra dữ liệu thông báo
    try {
      // Cập nhật trạng thái thông báo
      if (!notification.relatedId) {
        await api.deleteNotification(notification.id); // Gọi API xóa thông báo
        setNotifications(notifications.filter((item) => item.id !== notification.id)); // Cập nhật danh sách thông báo trong state
        return;
      }

      await api.updateNotification(notification.id, { type: 'friend' });

      // Cập nhật trạng thái follow
      await FollowApi.updateFollow(notification.relatedId, {
        status: 'friend',
        is_approved: 1,
      });

      const senderId = notification.userId; // Người khởi tạo yêu cầu
      const message = `Người dùng ${userLocal.name} đã đồng ý kết bạn với bạn.`; // user.name là người nhận yêu cầu

      await api.createNotification({
        userId: userLocalId,
        message,
        type: 'friend',
        relatedId: notification.relatedId,
      });
      setNotifications(
        notifications.map((item) =>
          item.id === notification.id ? { ...item, type: 'friend' } : item,
        ),
      );
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
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
                {user?.role === 'mentors'
                  ? 'Người hướng dẫn'
                  : user?.role === 'admin' || user?.role === 'user'
                  ? 'Người dùng'
                  : 'Không xác định'}
              </Typography>
              <Divider sx={{ width: '100%', margin: '10px 0' }} />
              {/* Kiểm tra nếu userId trong URL trùng với userLocalId */}
              <Box sx={{ display: 'flex', gap: '10px', marginBottom: '0px' }}>
                {userId === userLocalId ? (
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/editProfile/${userId}`}
                  >
                    Chỉnh sửa trang cá nhân
                  </Button>
                ) : followStatus === 'friend' ? (
                  <Button variant="contained" color="success" onClick={deleteFollow}>
                    Hủy kết bạn
                  </Button>
                ) : followStatus === 'pending' ? (
                  userLocalId === follow.target_id ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        // onClick={handleAcceptNotification(follow)}
                      >
                        Chấp nhận
                      </Button>
                      <Button variant="contained" color="warning" onClick={handleFollowClick}>
                        Hủy yêu cầu
                      </Button>
                    </>
                  ) : userLocalId === follow.follower_id ? (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleFollowClick} // Hàm xử lý khi nhấn nút "Hủy yêu cầu"
                    >
                      Hủy yêu cầu
                    </Button>
                  ) : null
                ) : (
                  <Button variant="contained" color="primary" onClick={handleFollowClick}>
                    Theo dõi
                  </Button>
                )}
              </Box>

              <Divider sx={{ width: '100%', margin: '10px 0' }} />
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Tổng Quan" />
                <Tab label="Chứng chỉ" />
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
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    {/* Nội dung tab khóa học*/}
                    <Typography variant="h4" gutterBottom>
                      Thành tích của người dùng
                    </Typography>
                    <Grid
                      container
                      spacing={2} // Khoảng cách giữa các item
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap', // Đảm bảo item xuống dòng khi không đủ không gian
                      }}
                    >
                      {loading ? (
                        <Grid item xs={12}>
                          <Typography variant="h6">Đang tải dữ liệu...</Typography>
                        </Grid>
                      ) : filteredCertificates.length > 0 ? (
                        filteredCertificates.map((certificate) => (
                          <Grid
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap', // Đúng cú pháp
                            }}
                            item
                            xs={12}
                            sm={6}
                            key={certificate.id}
                          >
                            <Grid item xs={4} sm={12} key={certificate.id}>
                              <Card
                                sx={{ cursor: 'pointer' }}
                                onClick={() =>
                                  handleDownloadCertificate(certificate.course_name, user)
                                }
                              >
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={certificate.img || 'defaultImageUrl'} // Nếu không có ảnh chứng chỉ, sử dụng ảnh mặc định
                                  alt="certificate"
                                />
                                <CardContent>
                                  <Typography variant="h6">
                                    {certificate.certificate_code}
                                  </Typography>{' '}
                                  {/* Mã chứng chỉ */}
                                  <Typography variant="body2" color="text.secondary">
                                    Khóa học: {certificate.course_name} {/* Tên khóa học */}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Ngày cấp:{' '}
                                    {new Date(certificate.issue_date).toLocaleDateString()}{' '}
                                    {/* Ngày cấp */}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Trạng thái:{' '}
                                    {certificate.status === 'active'
                                      ? 'Đang hoạt động'
                                      : 'Đã thu hồi'}{' '}
                                    {/* Trạng thái chứng chỉ */}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        ))
                      ) : (
                        <Grid item xs={12}>
                          <Typography variant="body2">Chưa có chứng chỉ nào.</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    {/* Nội dung tab Câu Hỏi */}
                    <Typography variant="h4" gutterBottom>
                      Câu Hỏi Của Người Dùng
                    </Typography>
                    {questions?.length > 0 ? (
                      questions.map((question) => (
                        <Box
                          key={question?.id}
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
                                  {formatUpdatedAt(question.updatedAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          {/* Display Question Content */}
                          <Box sx={{ mt: 3, mb: 3 }}>
                            <Typography variant="subtitle1">{question?.questions || ''}</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {question?.hashtag && (
                              <Typography
                                variant="h6"
                                sx={{ color: '#007bff', fontSize: '0.8rem' }}
                              >
                                {question.hashtag}
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
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">Không có câu hỏi nào.</Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Vị trí thông báo
            >
              <Alert onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Profile;
