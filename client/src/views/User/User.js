import { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, CardMedia, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material'; // Thêm icon tìm kiếm
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig'; // Firebase config đã được khởi tạo

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); // Lấy dữ liệu từ collection "users"
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" className="heading" sx={{ fontWeight: 'bold', color: '#333' }}>
            User List
          </Typography>
        </Grid>

        {/* search by name */}
        <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
          <TextField
            label="Search by name"
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

        {loading ? (
          <Typography sx={{ textAlign: 'center', width: '100%' }}>Loading...</Typography>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card
                className="user-card"
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
              >
                <Box sx={{ flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    image={user.image || '/default-avatar.png'}
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
                    <Typography variant="h6" component="h2" className="user-name" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" paragraph className="user-email" sx={{ color: '#7f8c8d' }}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="user-location" sx={{ marginBottom: '8px' }}>
                      {user.location || 'Unknown Location'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="user-articles" sx={{ color: '#16a085' }}>
                      Number of articles: {user.articleCount || 0}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', width: '100%' }}>No users found</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default User;
