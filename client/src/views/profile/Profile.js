import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
    setUser(storedUser);
  }, []);

  // Display loading message while user data is being fetched
  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <PageContainer title="User Profile" description="This is the User Profile page">
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Grid container spacing={2} justifyContent="center">
          {/* Profile Information Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </Typography>

                <div className="profile-details" style={{ marginTop: '20px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">
                        User ID:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{user.id}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{user.name}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">
                        Email:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{user.email}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">
                        Phone:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{user.phone}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">
                        Location:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{user.location}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1" color="textSecondary">
                        Profession:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{user.role === 'admin' ? 'Admin' : 'User'}</Typography>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Picture and Edit Button */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '10px', textAlign: 'center', padding: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"
                alt="Profile"
                style={{ width: '100%', borderRadius: '50%', marginBottom: '20px' }}
              />
              <div>
                <button className="btn btn-primary">Change Photo</button>
                <input type="file" name="file" style={{ display: 'none' }} />
              </div>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Profile;
