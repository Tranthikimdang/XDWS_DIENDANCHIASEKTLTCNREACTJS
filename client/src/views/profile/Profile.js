import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Lấy dữ liệu từ localStorage
    setUser(storedUser);
  }, []);

  // Nếu user chưa được load, trả về một thông báo loading
  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <PageContainer title="User Profile" description="This is the User Profile page">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={2}>
          <div className="container emp-profile">
            <div className="row">
              <div className="col-md-4">
                <div className="profile-img">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"
                    alt="Profile"
                  />
                  <div className="file btn btn-lg btn-primary">
                    Change Photo
                    <input type="file" name="file" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="profile-head">
                  <h5>{user?.name}</h5>
                  <h6>{user?.role === 'admin' ? 'Admin' : 'User'}</h6>
                  <p className="proile-rating">RANKINGS : <span>8/10</span></p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="tab-content profile-tab">
                  <div className="tab-pane fade show active" id="home" role="tabpanel">
                    <div className="row">
                      <div className="col-md-6"><label>User Id</label></div>
                      <div className="col-md-6"><p>{user?.id}</p></div>
                    </div>
                    <div className="row">
                      <div className="col-md-6"><label>Name</label></div>
                      <div className="col-md-6"><p>{user?.name}</p></div>
                    </div>
                    <div className="row">
                      <div className="col-md-6"><label>Email</label></div>
                      <div className="col-md-6"><p>{user?.email}</p></div>
                    </div>
                    <div className="row">
                      <div className="col-md-6"><label>Phone</label></div>
                      <div className="col-md-6"><p>{user?.phone}</p></div>
                    </div>
                    <div className="row">
                      <div className="col-md-6"><label>Location</label></div>
                      <div className="col-md-6"><p>{user?.location}</p></div>
                    </div>
                    <div className="row">
                      <div className="col-md-6"><label>Profession</label></div>
                      <div className="col-md-6"><p>{user?.role === 'admin' ? 'Admin' : 'User'}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Profile;
