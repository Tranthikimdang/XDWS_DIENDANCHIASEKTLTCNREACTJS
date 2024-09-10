import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import userApi from '../../apis/userApi';
import './User.css';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getList();
        if (response.status === 200) {
          setUsers(response.data || []);
          console.log('Fetched users:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <PageContainer title="User List" description="This is the User List page">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={2}> {/* Reduced spacing here */}
          <Grid item xs={12} sx={{ marginBottom: '20px', marginTop: '20px' }}> {/* Adjust margins as needed */}
            <Typography variant="h4" component="h1" className="heading">
              User List
            </Typography>
          </Grid>

          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card
                className="user-card"
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent className="card-content">
                    <Typography variant="h6" component="h2" className="user-name">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" paragraph className="user-email">
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="user-location">
                      {user.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="user-articles">
                      Number of articles: {user.articleCount || 0}
                    </Typography>
                  </CardContent>
                </Box>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
                  className="card-media"
                >
                  <CardMedia
                    component="img"
                    image={user.image || '/default-avatar.png'}
                    alt={user.name}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default User;
