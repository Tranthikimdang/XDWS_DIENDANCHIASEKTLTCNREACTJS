import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../config/firebaseconfig'; 
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const { userId } = useParams(); // Get userId from the URL params
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, 'users', userId); // Create reference to user document using userId from URL
      const userSnap = await getDoc(userRef); // Fetch the document from Firestore

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData); // Update the user state
      } else {
        console.log('No such user document!');
      }
    };

    fetchUser();
  }, [userId]); // Dependency array includes userId

  // useEffect(() => {
  //   const fetchMentor = async () => {
  //     try {
  //       const mentorSnapshot = await getDoc(db, 'mentor');
  //       const mentorData = mentorSnapshot.docs.map((doc) => {
  //         return { id: doc.id, ...doc.data() }; // Trả về đối tượng mentor
  //       });
       
  //     } catch (error) {
  //       console.error("Lỗi khi tải mentor:", error);
  //     }
  //   };
  //   fetchMentor();
  // }, []);
 

  return (
    <PageContainer title="User Profile" description="This is the User Profile page">
      <Box
        sx={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#f4f6f8',
          borderRadius: '15px',
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                height: '100%',
              }}
            >
              <img
                src={user.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"}
                alt="Profile"
                style={{
                  width: '100%',
                  maxWidth: '180px',
                  height: 'auto',
                  borderRadius: '5%',
                  marginBottom: '20px',
                }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                backgroundColor: '#ffffff',
                height: '100%',
              }}
            >
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
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Profile;
