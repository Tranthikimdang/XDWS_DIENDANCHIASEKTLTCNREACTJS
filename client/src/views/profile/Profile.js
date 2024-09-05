import React from 'react';
import { Grid, Box, Typography, Avatar, Button, List, ListItem, ListItemText, TextField, LinearProgress } from '@mui/material';
import { GitHub, Twitter, Instagram, Facebook } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import "./profile.css";

const Profile = () => {
  return (
    <PageContainer className="PageContainer" title="Profile" description="User Profile">
      <Box className="container">
        <Box className="main-body">
          <Grid container spacing={2}>
            <Grid item lg={4}>
              <Box className="card">
                <Box className="card-body">
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Avatar 
                      src="https://bootdey.com/img/Content/avatar/avatar6.png" 
                      alt="User Avatar" 
                      sx={{ width: 110, height: 110, bgcolor: 'primary.main', p: 1 }} 
                    />
                    <Box mt={3}>
                      <Typography variant="h4">John Doe</Typography>
                      <Typography color="textSecondary">Full Stack Developer</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Bay Area, San Francisco, CA
                      </Typography>
                      <Box mt={2}>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                          Follow
                        </Button>
                        <Button variant="outlined" color="primary">
                          Message
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Box mt={4}>
                    <List>
                      <ListItem>
                        <ListItemText primary="Website" secondary="https://bootdey.com" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Github" secondary="bootdey" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Twitter" secondary="@bootdey" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Instagram" secondary="bootdey" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Facebook" secondary="bootdey" />
                      </ListItem>
                    </List>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={8}>
            <Box className="card">
  <Box className="card-body">
    <Grid container spacing={2} mb={3}>
      <Grid item sm={3}>
        <Typography variant="body1">Full Name</Typography>
      </Grid>
      <Grid item sm={9}>
        <Typography variant="body2">John Doe</Typography>
      </Grid>
    </Grid>
    <Grid container spacing={2} mb={3}>
      <Grid item sm={3}>
        <Typography variant="body1">Email</Typography>
      </Grid>
      <Grid item sm={9}>
        <Typography variant="body2">john@example.com</Typography>
      </Grid>
    </Grid>
    <Grid container spacing={2} mb={3}>
      <Grid item sm={3}>
        <Typography variant="body1">Phone</Typography>
      </Grid>
      <Grid item sm={9}>
        <Typography variant="body2">(239) 816-9029</Typography>
      </Grid>
    </Grid>
    <Grid container spacing={2} mb={3}>
      <Grid item sm={3}>
        <Typography variant="body1">Mobile</Typography>
      </Grid>
      <Grid item sm={9}>
        <Typography variant="body2">(320) 380-4539</Typography>
      </Grid>
    </Grid>
    <Grid container spacing={2} mb={3}>
      <Grid item sm={3}>
        <Typography variant="body1">Address</Typography>
      </Grid>
      <Grid item sm={9}>
        <Typography variant="body2">Bay Area, San Francisco, CA</Typography>
      </Grid>
    </Grid>
    {/* <Box textAlign="right">
      <Button variant="contained" color="primary">
        Save Changes
      </Button>
    </Box> */}
  </Box>
</Box>

              <Grid container spacing={2} mt={2}>
                <Grid item sm={12}>
                  <Box className="card">
                    <Box className="card-body">
                      <Typography variant="h5" mb={3}>Project Status</Typography>
                      <Typography>Web Design</Typography>
                      <LinearProgress variant="determinate" value={80} sx={{ mb: 3, height: 5 }} />
                      <Typography>Website Markup</Typography>
                      <LinearProgress variant="determinate" value={72} sx={{ mb: 3, height: 5 }} />
                      <Typography>One Page</Typography>
                      <LinearProgress variant="determinate" value={89} sx={{ mb: 3, height: 5 }} />
                      <Typography>Mobile Template</Typography>
                      <LinearProgress variant="determinate" value={55} sx={{ mb: 3, height: 5 }} />
                      <Typography>Backend API</Typography>
                      <LinearProgress variant="determinate" value={66} sx={{ mb: 3, height: 5 }} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Profile;
