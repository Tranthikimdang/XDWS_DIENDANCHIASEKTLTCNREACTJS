import { useEffect, useState } from 'react';
import { Search as SearchIcon } from '@mui/icons-material'; // Icon for search
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig'; // Firebase configuration
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../config/firebaseconfig';
import { IconArrowBadgeRight,IconArrowBadgeLeft } from '@tabler/icons-react'; // Or the appropriate library


const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const usersPerPage = 12; // Number of users to display per page

  // Fetch users and images
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); // Fetch users from Firestore
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userData = doc.data();
            let imageUrl = '';

            try {
              // Fetch image URL from Firebase Storage if an imagePath exists
              if (userData.imagePath) {
                const storage = getStorage();
                const imageRef = ref(storage, userData.imagePath);
                imageUrl = await getDownloadURL(imageRef);
              } else if (userData.imageUrl) {
                // If no imagePath exists but imageUrl exists in Firestore, use it
                imageUrl = userData.imageUrl;
              } else {
                // If neither exists, use a default fallback image
                imageUrl =
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog';
              }
            } catch (error) {
              console.error('Error fetching image: ', error);
              // Use fallback image if there's an error fetching the image
              imageUrl =
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog';
            }

            return {
              id: doc.id,
              ...userData,
              image: imageUrl, // Use fetched or fallback image URL
            };
          }),
        );
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
  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle changing pages
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={4}>
        {/* Title */}
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

        {/* Search Field */}

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

        {/* User Cards */}
        {loading ? (
          <Typography sx={{ textAlign: 'center', width: '100%' }}>Loading...</Typography>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
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
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                {/* User Avatar */}
                <Box sx={{ flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    image={user.image} // Use URL from Firebase Storage or fallback
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
          <Typography sx={{ textAlign: 'center', width: '100%' }}>No users found</Typography>
        )}
      </Grid>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1}>
        <IconArrowBadgeLeft />
        </Button>
        <Typography sx={{ margin: '0 10px', alignSelf: 'center' }}>trang {currentPage}</Typography>
        <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages}>
          <IconArrowBadgeRight />
        </Button>
      </Box>
    </Box>
  );
};

export default User;

