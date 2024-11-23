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
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import UserAPI from 'src/apis/UserApI';
import api from 'src/apis/mentorApi';

const defaultImageUrl = 'path-to-default-image.jpg';

const User = () => {
  const [users, setUsers] = useState([]); // Separate state for users
  const [mentors, setMentors] = useState([]); // Separate state for mentors
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserAPI.getUsersList();  // API call to get users
        const filteredUsers = response.data.users.filter(
          (user) => !(user.role === 'admin' && user.id === userId)
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId]);

  // Fetch mentors
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const mentorsData = await api.getMentors();
        console.log('Fetched mentors data:', mentorsData); // Log the response

        // Check if mentorsData is an array; if not, fallback to an empty array
        setMentors(Array.isArray(mentorsData) ? mentorsData : []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setMentors([]); // Set rows to empty array in case of error
      }
    };
    fetchMentor();
  }, []);

  // Handle card click
  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`, { state: { id: userId } });
  };

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) => user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <PageContainer title="Người dùng | Share Code" description="Đây là trang người dùng">
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

            {/* Mentor List */}
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                Danh sách người hướng dẫn
              </Typography>
            </Grid>
            {loading ? (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>Loading...</Typography>
            ) : mentors.length > 0 ? (
              mentors.map((mentor) => (
                // <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                //   <Card
                //     className="user-card"
                //     sx={{ display: 'flex', alignItems: 'center' }}
                //     onClick={() => handleCardClick(mentor.user_id)}
                //   >
                //     <CardMedia
                //       component="img"
                //       src={users?.find(u => mentor.user_id === u.id)?.imageUrl || 'default-image-url.jpg'}
                //       alt={mentor.name}
                //       sx={{ width: '120px', height: '120px', borderRadius: '50%' }}
                //     />
                //     <CardContent>
                //       <Typography variant="h6" fontWeight="bold">
                //         {mentor.name}
                //       </Typography>
                //       <Typography variant="body2" color="#7f8c8d">
                //         {mentor.specialization}
                //       </Typography>
                //     </CardContent>
                //   </Card>
                // </Grid>
                <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                  <Card
                    className="user-card"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-5px)' },
                    }}
                    onClick={() => handleCardClick(mentor.user_id)}
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      <CardMedia
                        component="img"
                        image={users?.find(u => mentor.user_id === u.id)?.imageUrl || 'default-image-url.jpg'}
                        alt= {users?.find(u => u.id === mentor.user_id)?.name || 'Unknown'}
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
                      <CardContent sx={{ padding: '16px' }}>
                        <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                        {users?.find(u => u.id === mentor.user_id)?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" color="#7f8c8d">
                        {users?.find(u => u.id === mentor.user_id)?.email || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px' }}>
                        {users?.find(u => u.id === mentor.user_id)?.location || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" color="#16a085">
                          Chuyên môn: {mentor.specialization}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>
                Không có người hướng dẫn nào...
              </Typography>
            )}

            {/* User List */}
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                Danh sách người dùng
              </Typography>
            </Grid>
            {loading ? (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>Loading...</Typography>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.id}>
                  <Card
                    className="user-card"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-5px)' },
                    }}
                    onClick={() => handleCardClick(user.id)}
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      <CardMedia
                        component="img"
                        image={user.imageUrl || defaultImageUrl}
                        alt={user.name || 'User'}
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
                      <CardContent sx={{ padding: '16px' }}>
                        <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="#7f8c8d">
                          {user.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px' }}>
                          {user.location || 'Unknown Location'}
                        </Typography>
                        <Typography variant="body2" color="#16a085">
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
