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
  Pagination,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';
//api
import UserAPI from 'src/apis/UserApI';
import api from 'src/apis/mentorApi';
// Images
import avatardefault from "src/assets/images/profile/user-1.jpg";

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
        const response = await UserAPI.getUsersList(); // API call to get users
        const filteredUsers = response.data.users.filter(
          (user) => !(user.role === 'admin' && user.id === userId),
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
    (user) => user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <PageContainer title="Người dùng | Share Code" description="Đây là trang người dùng">
      <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '1200px', margin: 'auto' }}>
        <Grid container spacing={4}>
        <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '30px' }, marginTop: '10px' }}>
            <Typography
              variant="h4"
              component="h1"
              className="heading"
              sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
            >
              Người dùng
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              Tìm kiếm và kết nối với những người dùng trong lĩnh vực lập trình.
              <br />
              Những người kinh nghiệm, sẵn sàng hỗ trợ bạn
              trên hành trình học lập trình và phát triển sự nghiệp.
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'flex-start',
            }}
          >
            <TextField
              label="Tìm kiếm người dùng"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flex: '1 1 300px',
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
          {/* User List */}
          {loading ? (
            <Typography sx={{ textAlign: 'center', width: '100%'}}>Loading...</Typography>
          ) : currentUsers.length > 0 ? (
            <Grid container spacing={3} justifyContent="center" className='mt-3'>
              {currentUsers.map((user) => (
                <Grid item xs={12} sm={6} md={3} key={user.id}>
                  <Card
                    className="user-card"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-5px)' },
                      height: '100%', // Đảm bảo card có chiều cao đầy đủ
                    }}
                    onClick={() => handleCardClick(user.id)}
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      <CardMedia
                        component="img"
                        image={user.imageUrl || avatardefault}
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
                        onError={(e) => {
                          e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px' }}>
                      <CardContent sx={{ padding: '16px' }}>
                        <Typography variant="h6" fontWeight="bold" color="#2c3e50" sx={{ textAlign: 'center' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="#7f8c8d" sx={{ textAlign: 'center' }}>
                          {user.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px', textAlign: 'center' }}>
                          {user.location || 'Unknown Location'}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ textAlign: 'center', width: '100%' }}>
              Không có người dùng nào...
            </Typography>
          )}
        </Grid>
      </Box>
      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <Pagination
          count={Math.ceil(filteredUsers.length / usersPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </PageContainer>
  );
};

export default User;
