/* eslint-disable no-lone-blocks */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
  TextField,
  Container,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from 'src/layouts/full/shared/logo/Logo';
import PageContainer from 'src/components/container/PageContainer';
import AttachFileIcon from '@mui/icons-material/AttachFile';

// API
import api from '../../apis/mentorApi';

const Mentor = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.fileUrl;
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
        cv_url: fileUrl,
        bio: formData.get('bio'),
        specialization: formData.get('specialization'),
        hourly_rate: formData.get('hourly_rate'),
        languages_spoken: formData.get('languages_spoken'),
        experience_years: formData.get('experience_years'),
        certification: formData.get('certification'),
        education: formData.get('education'),
        contact_info: formData.get('contact_info'),
        linkedin_profile: formData.get('linkedin_profile'),
        github_profile: formData.get('github_profile'),
        isApproved: '0',
        created_at: new Date(),
        is_deleted: false,
        updated_at: new Date(),
      };

      const response = await api.post('/mentors', dataToSubmit);

      if (response.data.success) {
        setSnackbarMessage('CV của bạn đã được gửi, đang chờ quản trị viên phê duyệt.');
        setSnackbarSeverity('success');
        setTimeout(() => {
          navigate('/home');  // Chuyển hướng về trang home sau khi thông báo
        }, 3000);
      } else {
        setSnackbarMessage('Đã xảy ra lỗi khi gửi CV.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      e.target.reset();
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu lên API:', error);
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
    } else {
      navigate('/auth/mentor');
    }
  }, [navigate]);

  return (
    <PageContainer title="Đăng ký làm người hướng dẫn" description="Đây là trang đăng ký làm người hướng dẫn">
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ padding: 4, marginTop: 4, borderRadius: '16px' }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <div className="text-center mb-4">
              <Logo />
            </div>
            <Typography variant="h4" className="text-center mb-4">
              Đăng ký mentor
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="bio"
                    label="Bio"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="specialization"
                    label="Chuyên môn"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="hourly_rate"
                    label="Giá mỗi giờ"
                    type="number"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="languages_spoken"
                    label="Ngôn ngữ"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="experience_years"
                    label="Số năm kinh nghiệm"
                    type="number"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="certification"
                    label="Chứng chỉ"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="education"
                    label="Học vấn"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="contact_info"
                    label="Thông tin liên lạc"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="linkedin_profile"
                    label="LinkedIn Profile"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="github_profile"
                    label="GitHub Profile"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    fullWidth
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
                  {selectedFile && (
                    <Typography variant="body2" sx={{ marginTop: '10px' }}>
                      File đã chọn: {selectedFile}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
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
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Gửi'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>

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

export default Mentor