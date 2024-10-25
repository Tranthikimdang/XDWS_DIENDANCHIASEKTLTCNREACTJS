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

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const usersPerPage = 12; // Number of users to display per page
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  // Fetch users and images
  useEffect(() => {
    const fetchUsers = async () => {
      try {
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

  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      try {
        const mentorSnapshot = await getDocs(collection(db, 'mentor'));
        const mentorData = mentorSnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }; // Trả về đối tượng mentor
        });
        setRows(mentorData); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi tải mentor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, []);

  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`); // Điều hướng với userId
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Filter mentors from users
  const mentors = users.filter(user => user.role === 'mentor');

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
              mentors.map((mentor) => (
                <Grid item xs={12} sm={6} md={4} key={mentor.id}>
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
                    onClick={() => handleCardClick(mentor.id)} // Điều hướng đến chi tiết
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      <CardMedia
                        component="img"
                        image={mentor.image} // Use URL from Firebase Storage or fallback
                        alt={mentor.name}
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
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                          {mentor.name}
                        </Typography>
                        <Typography variant="body2" paragraph sx={{ color: '#7f8c8d' }}>
                          {mentor.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px' }}>
                          {mentor.expertise}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>No mentors found</Typography>
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
              <Typography sx={{ textAlign: 'center', width: '100%' }}>No users found</Typography>
            )}
          </Grid>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default User;