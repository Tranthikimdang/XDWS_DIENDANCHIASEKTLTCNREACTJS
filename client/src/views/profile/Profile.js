import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
import { doc, updateDoc } from 'firebase/firestore'; // Firestore để lưu URL hình ảnh vào Firestore
import { db } from '../../config/firebaseconfig'; // Cấu hình Firebase của bạn
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State để lưu hình ảnh đã chọn
  const [previewImage, setPreviewImage] = useState(null); // State để xem trước hình ảnh
  const [uploading, setUploading] = useState(false); // Trạng thái tải lên

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
    setUser(storedUser);
    if (storedUser && storedUser.imageUrl) {
      setPreviewImage(storedUser.imageUrl); // Hiển thị ảnh từ Firestore nếu có
    }
  }, []);

  // Xử lý khi người dùng chọn hình ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file); // Tạo URL tạm thời để xem trước hình ảnh
      setPreviewImage(previewUrl);
    }
  };

  // Function để lưu ảnh vào Firebase Storage và cập nhật URL vào Firestore
  const handleSaveImage = async () => {
    if (selectedImage && user) {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${user.id}_${selectedImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);

      setUploading(true);

      // Theo dõi quá trình tải lên
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progress function
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          // Handle error
          console.error('Error uploading image:', error);
          setUploading(false);
        }, 
        async () => {
          // Khi tải lên hoàn tất
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);

          // Cập nhật URL hình ảnh vào Firestore
          await updateDoc(doc(db, 'users', user.id), {
            imageUrl: downloadURL
          });

          // Cập nhật LocalStorage với URL mới
          const updatedUser = { ...user, imageUrl: downloadURL };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setUploading(false);

          alert('Image uploaded successfully!');
        }
      );
    }
  };

  // Display loading message while user data is being fetched
  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <PageContainer title="User Profile" description="This is the User Profile page">
      {/* Main Profile Container */}
      <Box
        sx={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#f4f6f8', // Soft background color for the whole profile section
          borderRadius: '15px',
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          {/* Profile Picture and Edit Button */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#ffffff', // White background for the card  
                height: '100%', // Make the card take up the full height
              }}
            >
              <img
                src={previewImage || user.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"}
                alt="Profile"
                style={{
                  width: '100%',
                  maxWidth: '180px',
                  height: 'auto',
                  borderRadius: '5%',
                  marginBottom: '20px',
                }}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="upload-photo"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="upload-photo" className="btn btn-primary">
                  Ảnh mới
                </label>
                <button className="btn btn-success m-2" onClick={handleSaveImage} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Lưu ảnh '}
                </button>
              </div>
            </Card>
          </Grid>

          {/* Profile Information Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                backgroundColor: '#ffffff', // White background for the card
                height: '100%', // Make the card take up the full height
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
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Profile;
