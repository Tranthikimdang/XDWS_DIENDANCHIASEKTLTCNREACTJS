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
import UserAPI from 'src/apis/UserApI';
import FollowAPI from 'src/apis/FollowApI';


const defaultImageUrl = 'path-to-default-image.jpg';

const FriendsList = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const [itemsPerPage] = useState(12);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // Fetch users
  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        
        // Lấy tất cả các yêu cầu theo dõi
        const followResponse = await FollowAPI.getAllFollows();
        const followData = followResponse.data;

        // Lọc những người đã kết bạn (status === 'friend')
        const friendsList = followData.filter(follow => 
          (follow.follower_id === userId || follow.target_id === userId) && follow.status === 'friend'
        );

        // Lấy danh sách ID bạn bè đã kết bạn
        const friendIds = friendsList.map(follow => 
          follow.follower_id === userId ? follow.target_id : follow.follower_id
        );

        // Lấy thông tin chi tiết của bạn bè từ bảng User
        const usersResponse = await UserAPI.getUsersList();
        const users = usersResponse.data.users;

        // Lọc danh sách bạn bè đã kết bạn từ bảng User
        const friendsInfo = users.filter(user => friendIds.includes(user.id));
 console.log(friendsInfo);
 
        setFriends(friendsInfo); // Lưu danh sách bạn bè vào state
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  // Handle card click
  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`, { state: { id: userId } });
  };

  // Filter users by search term
  const filteredFriends = friends.filter((friend) => {
    // Kiểm tra sự tồn tại của friend.name trước khi truy cập
    return friend.name && friend.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  

  // Pagination logic
  const indexOfLastUser= currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredFriends.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <PageContainer title="Người dùng | Share Code" description="Đây là trang người dùng">
    
        <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '1200px', margin: 'auto' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <Typography
                variant="h4"
                component="h1"
                className="heading"
                sx={{ fontWeight: 'bold', color: '#333' }}
              >
                Danh Sách Bạn bè
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <TextField
                label="Tìm kiếm người dùng"
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
            {/* User List */}
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
     {/* Pagination */}
     <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <Pagination
          count={Math.ceil(filteredFriends.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </PageContainer>
  );
};

export default FriendsList;
