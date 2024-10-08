import { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, CardMedia, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material'; // Icon for search
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig'; // Firebase configuration

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); // Fetch users from Firestore
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

  const filteredUsers = users.filter((user) => 
    user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={4}>
        {/* Title */}
        <Grid item xs={12} sx={{ marginBottom: '20px', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" className="heading" sx={{ fontWeight: 'bold', color: '#333' }}>
            User List
          </Typography>
        </Grid>

        {/* Search Field */}
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

        {/* User Cards */}
        {loading ? (
          <Typography sx={{ textAlign: 'center', width: '100%' }}>Loading...</Typography>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
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
                {/* User Avatar */}
                <Box sx={{ flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    image={user.image || '/default-avatar.png'}
                    alt={user.name}
                    sx={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      margin: '10px',
                      border: '4px solid #fff',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                    }}
                  />
                </Box>

                {/* User Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent className="card-content" sx={{ padding: '10px' }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {user.location || 'Unknown Location'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#16a085' }}>
                      Articles: {user.articleCount || 0}
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

