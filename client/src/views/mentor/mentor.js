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
  CircularProgress,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';
import { IconUser, IconHeart } from '@tabler/icons-react';
// Image
import avatar from 'src/assets/images/profile/user-1.jpg';
// API
import apiUser from 'src/apis/UserApI';
import api from 'src/apis/mentorApi';
// Icon
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const Mentor = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // List of users
  const [mentors, setMentors] = useState([]); // List of mentors
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const user = await apiUser.getUsersList();
        setUsers(Array.isArray(user.data.users) ? user.data.users : []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch mentors
  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      try {
        const response = await api.getMentors();
        setMentors(Array.isArray(response.data.mentors) ? response.data.mentors : []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, []);

  // Handle card click
  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`, { state: { id: userId } });
  };

  // Filter users by search term
  const filteredMentors = mentors.filter((mentor) => {
    const user = users.find((u) => u.id === mentor.user_id);
    return user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination logic
  const indexOfLastMentor = currentPage * itemsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - itemsPerPage;
  const currentMentors = filteredMentors.slice(indexOfFirstMentor, indexOfLastMentor);

  return (
    <PageContainer title="Người cố vấn | Share Code" description="Đây là trang người cố vấn">
      <Box sx={{ padding: { xs: '16px', md: '24px' } }}>
        <Grid container spacing={3}>
          {/* Heading */}
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading" >
              Cố vấn
            </Typography>
            <Typography variant="body1" paragraph className="typography-body" >
              Tìm kiếm và kết nối với những người cố vấn hàng đầu trong lĩnh vực lập trình.
              <br />
              Người cố vấn của chúng tôi là các chuyên gia giàu kinh nghiệm, sẵn sàng hỗ trợ bạn
              trên hành trình học lập trình và phát triển sự nghiệp.
            </Typography>
          </Grid>

          {/* Search Section */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'flex-start',
            }}
          >
            {/* Tìm kiếm */}
            <TextField
              label="Tìm kiếm người hướng dẫn"
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

            {/* Lĩnh vực quan tâm */}
            <TextField
              select
              label="Lĩnh vực quan tâm"
              variant="outlined"
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
              SelectProps={{
                native: true,
              }}
              onChange={(e) => console.log('Lĩnh vực chọn:', e.target.value)}
            >
              <option value="" disabled>
                Từ khóa quan tâm
              </option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Fullstack</option>
              <option value="data-science">Data Science</option>
            </TextField>

            {/* Bộ lọc */}
            <button
              style={{
                padding: '10px 16px',
                border: '1px solid #ddd',
                borderRadius: '50px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
              }}
              onClick={() => console.log('Kích hoạt bộ lọc!')}
            >
              <FilterAltOutlinedIcon style={{ fontSize: '20px' }} />
              Bộ lọc tìm kiếm
            </button>
          </Grid>

          {/* Mentor List */}
          <Grid container spacing={3} sx={{ marginTop: '16px' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : currentMentors.length > 0 ? (
              currentMentors.map((mentor) => {
                const userInfo = users.find((u) => u.id === mentor.user_id);
                return (
                  <Grid item xs={6} sm={4} md={3} key={mentor.id}>
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        padding: '16px',
                        textAlign: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-5px)' },
                      }}
                      onClick={() => handleCardClick(mentor.user_id)}
                    >
                      <CardMedia
                        component="img"
                        image={userInfo?.imageUrl || avatar}
                        alt={userInfo?.name || 'Không có hình ảnh'}
                        sx={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '4px solid #fff',
                          marginBottom: '16px',
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6">{userInfo?.name || 'Không rõ tên'}</Typography>
                        <Typography variant="body2" color="#7f8c8d" sx={{ marginBottom: '8px' }}>
                          {mentor.skills || 'Chưa có thông tin'}
                        </Typography>

                         {/* Availability Time */}
                         <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ecf2ff',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              marginBottom: '16px',
                              fontSize: '14px',
                            }}
                          >
                            <Typography variant="body2" color="#5d87ff">
                              <i className="fas fa-calendar-alt"></i> Lịch rảnh: 16:00, 24/08/2024
                            </Typography>
                          </Box>

                          {/* Stats Section */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '8px' }}>
                            {/* Mentee count */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <IconUser size={18} stroke={1.5} />
                              <Typography variant="body2" color="#2c3e50">
                                10 mentee
                              </Typography>
                            </Box>

                            {/* Likes count */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <IconHeart size={18} stroke={1.5} />
                              <Typography variant="body2" color="#2c3e50">
                                18
                              </Typography>
                            </Box>
                          </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Typography sx={{ textAlign: 'center', width: '100%' }}>
                Không có người hướng dẫn nào...
              </Typography>
            )}
          </Grid>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(filteredMentors.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Mentor;
