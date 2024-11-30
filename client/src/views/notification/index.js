import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useParams } from 'react-router-dom'; // Để lấy id từ URL
import PageContainer from 'src/components/container/PageContainer';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../apis/NotificationsApI';
import 'bootstrap/dist/css/bootstrap.min.css';
import FollowApi from '../../apis/FollowApI';
const NotificationPage = () => {
  const { userId } = useParams(); // Lấy userId từ URL params
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRCodeDialog, setShowQRCodeDialog] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState('');

  useEffect(() => {
    // Lấy thông báo của người dùng từ API khi component được render
    const fetchNotifications = async () => {
      try {
        const data = await api.getUserNotifications(userId);
        setNotifications(data.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleDeleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(notifications.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleAcceptNotification = async (notification) => {
    console.log('Notification data:', notification); // Kiểm tra dữ liệu thông báo
    try {
      // Cập nhật trạng thái thông báo
      await api.updateNotification(notification.id, { type: 'friend' });
  
      // Cập nhật trạng thái follow
      await FollowApi.updateFollow(notification.relatedId, {
        status: 'friend',
        is_approved: 1,
      });
  
      setNotifications(
        notifications.map((item) =>
          item.id === notification.id ? { ...item, type: 'friend' } : item
        )
      );
      console.log('Thông báo và trạng thái follow đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };
  

  return (
    <PageContainer title="Thông báo của bạn" description="Danh sách thông báo của người dùng">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item md={8}>
            <div className="course-content">
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col">
                    <div className="p-4">
                      <Typography variant="h4" component="h1" className="heading" gutterBottom>
                        Thông báo của bạn
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Bạn có {notifications.length} thông báo mới
                      </Typography>

                      {loading ? (
                        <Typography variant="body1">Đang tải thông báo...</Typography>
                      ) : (
                        <List>
                          {notifications.map((notification) => (
                            <ListItem
                              key={notification.id}
                              sx={{
                                padding: '10px 0',
                                borderBottom: '1px solid #ddd',
                                '&:last-child': {
                                  borderBottom: 'none',
                                },
                              }}
                            >
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={8}>
                                  <ListItemText
                                    primary={notification.message}
                                    secondary={`Loại: ${notification.type} - ${new Date(
                                      notification.created_at,
                                    ).toLocaleString()}`}
                                  />
                                </Grid>

                                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                  {/* Nút Xóa */}
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    type="button"
                                    onClick={() => handleDeleteNotification(notification.id)}
                                  >
                                    Xóa
                                  </button>

                                  {/* Nút Chấp nhận khi thông báo là "pending" */}
                                  {notification.type === 'pending' && (
                                    <button
                                      className="btn btn-outline-success btn-sm m-2"
                                      type="button"
                                      onClick={() => handleAcceptNotification(notification)}
                                    >
                                      Chấp nhận
                                    </button>
                                  )}
                                </Grid>
                              </Grid>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default NotificationPage;
