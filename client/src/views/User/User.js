/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../config/firebaseconfig';
import UserApi from '../../apis/UserApI';
import MentorApi from '../../apis/mentorApi';


const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;
  const [mentors, setMentors] = useState([]); // Đổi tên từ rows thành mentors
  const navigate = useNavigate();

  // Fetch users and images
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserApi.getUsersList();
        if (response.status === 'success') {
          const userList = response.data.users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            location: user.location,
            image: user.imageUrl || 'default-image-url.jpg',
            articleCount: user.articleCount || 0,
          }));
          setUsers(userList);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch mentors from API
useEffect(() => {
  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await MentorApi.getMentorsList(); // Using MentorApi instead of UserApi
      if (response.status === 'success') {
        // Map mentor data with required fields
        const mentorsList = response.data.mentors.map(mentor => ({
          id: mentor.id,
          user_id: mentor.user_id,
          expertise: mentor.expertise,
          isApproved: mentor.isApproved,
          // Add any other mentor-specific fields you need
        }));
        setMentors(mentorsList);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchMentors();
}, []);


  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`, { state: { id: userId } });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <PageContainer title="Users" description="This is users">
      <DashboardCard>
        <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '1200px', margin: 'auto' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <Typography
                variant="h4"
                component="h1"
                className="heading"
                sx={{ fontWeight: 'bold', color: '#333' }}
              >
                Danh Sách Tài Khoản
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <TextField
                label="Tìm theo tên"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  maxWidth: '500px',
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
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Danh sách người hướng dẫn
              </Typography>
            </Grid>

            {loading ? (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>Loading...</Typography>
            ) : mentors.length > 0 ? (
              mentors
                .filter((mentor) => mentor.isApproved === 1)
                .map((mentor) => (
                  <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                    <Card
                      className="user-card"
                      key={mentor?.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                        },
                      }}
                      onClick={() => handleCardClick(mentor.user_id)}
                    >
                      {/* Rest of the mentor card content remains the same */}
                    </Card>
                  </Grid>
                ))
            ) : (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>
                Không có người hướng dẫn nào...
              </Typography>
            )}
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Danh sách người dùng
              </Typography>
            </Grid>
            {loading ? (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>Loading...</Typography>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                // eslint-disable-next-line no-undef
                <Grid item xs={12} sm={6} md={4} key={user.id}>
                  <Card
                    className="user-card"
                    // eslint-disable-next-line no-undef
                    key={user?.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                    // eslint-disable-next-line no-undef
                    onClick={() => handleCardClick(user.id)} // Điều hướng đến chi tiết
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      <CardMedia
                        component="img"
                        image={user.image} // Use URL from Firebase Storage or fallback
                        alt={user.name}
                        sx={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          margin: '16px',
                          border: '4px solid #fff',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <CardContent className="card-content" sx={{ padding: '16px' }}>
                        <Typography
                          variant="h6"
                          component="h2"
                          className="user-name"
                          sx={{ fontWeight: 'bold', color: '#2c3e50' }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          paragraph
                          className="user-email"
                          sx={{ color: '#7f8c8d' }}
                        >
                          {user.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="user-location"
                          sx={{ marginBottom: '8px' }}
                        >
                          {user.location || 'Unknown Location'}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="user-articles"
                          sx={{ color: '#16a085' }}
                        >
                          Number of articles: {user.articleCount || 0}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>
                Không có người dùng nào...
              </Typography>
            )}
          </Grid>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default User;
