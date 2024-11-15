/* eslint-disable no-lone-blocks */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography
} from '@mui/material';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// components
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { addDoc, collection, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import { db } from 'src/config/firebaseconfig';
import Logo from 'src/layouts/full/shared/logo/Logo';
import { useEffect } from 'react';

const Mentor = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData(e.target);
    const file = formData.get('upfile');
  
    if (!file) {
      setSnackbarMessage('Vui lòng chọn một file CV.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
  
    try {
      const fileUrl = await handleUpload(file);
  
      const dataToSubmit = {
        user_id: userData?.id,
        upfile: fileUrl,
        expertise: "WebDevelopment", // tạm thời
        // expertise: expertiseList,  // Gán danh sách các expertise
        isApproved: '0',
        created_at: new Date(),  // Thời gian tạo
        is_deleted: false,  // Mặc định là false
        updated_at: new Date(),  // Thời gian cập nhật
      };
  
      const mentorsCollection = collection(db, 'mentors');
      const res = await addDoc(mentorsCollection, dataToSubmit);
      const docSnapshot = await getDoc(res);
  
      if (docSnapshot.exists()) {
        setSnackbarMessage('CV của bạn đã được gửi, đang chờ quản trị viên phê duyệt.');
        setSnackbarSeverity('success');
        setTimeout(() => {
          navigate('/auth/inter');  // Chuyển hướng về trang home sau khi thông báo
        }, 3000);
      } else {
        setSnackbarMessage('Đã xảy ra lỗi khi gửi CV.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      e.target.reset();
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu lên Firestore:', error);
      setSnackbarMessage('Lỗi khi gửi CV. Vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file ? file.name : null); // Lưu tên file đã chọn
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {
      setUserData(storedUserData);
    }{
      navigate('/auth/mentor')
    }
  }, []);

  return (
    <PageContainer title="Login" description="This is the login page">
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            opacity: 0.3,
            zIndex: -1,
          },
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card elevation={9}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <div className="text-center mb-4">
                  <Logo />
                </div>
              </Box>
              <h5 display="flex" justifyContent="center" className="text-center mb-4">
                Đăng ký mentor
              </h5>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
                onSubmit={handleSubmit}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <img
                    src={userData?.imageUrl || ''}
                    width="40px"
                    alt="User Avatar"
                    style={{ borderRadius: '50%', marginRight: '10px' }}
                  />
                  <Typography variant="h6">{userData?.name || ''}</Typography>
                </Box>

                <Box display="flex" flexDirection={'column'} sx={{ padding: '10px' }}>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      startIcon={<AttachFileIcon />}
                      sx={{
                        borderRadius: '16px',
                        textTransform: 'none',
                        padding: '5px 15px',
                      }}
                      component="label"
                    >
                      Tải CV lên
                      <input
                        name="upfile"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Box>
                  {selectedFile && (
                    <Typography variant="body2" sx={{ marginTop: '10px' }}>
                      File đã chọn: {selectedFile}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '16px',
                      padding: '5px 20px',
                      fontWeight: 'bold',
                      mt: 2,
                    }}
                    disabled={loading} // Vô hiệu hóa khi đang tải lên
                  >
                    {loading ? <CircularProgress size={24} /> : 'Gửi'}
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ transform: 'translateY(50px)' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            border: '1px solid #ccc',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Mentor;
