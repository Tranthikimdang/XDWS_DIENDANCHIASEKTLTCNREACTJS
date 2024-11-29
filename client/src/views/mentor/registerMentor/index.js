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
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from 'src/layouts/full/shared/logo/Logo';
import PageContainer from 'src/components/container/PageContainer';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import api from '../../../apis/mentorApi';

const RegisterMentor = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedFileCV, setSelectedFileCV] = useState(null);
  const [selectedFileCertification, setSelectedFileCertification] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.fileUrl;
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'cv') {
      setSelectedFileCV(file ? file.name : null);
    } else if (fileType === 'certification') {
      setSelectedFileCertification(file ? file.name : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const cvFile = formData.get('cv');
    const certificationFile = formData.get('certification');

    if (!cvFile || !certificationFile) {
      setSnackbarMessage('Vui lòng chọn cả CV và chứng chỉ.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      // Upload CV và chứng chỉ
      const cvFileUrl = await handleUpload(cvFile);
      const certificationFileUrl = await handleUpload(certificationFile);

      // Chuẩn bị dữ liệu gửi lên API
      const dataToSubmit = {
        user_id: userData?.id,
        cv_url: cvFileUrl,
        certification_url: certificationFileUrl,
        bio: formData.get('bio'),
        experience_years: formData.get('experience_years'),
        skills: formData.get('skills'),
        rating: 0, // Mặc định là 0
        reviews_count: 0, // Mặc định là 0
        isApproved: '0', // Đang chờ xét duyệt
        created_at: new Date(),
        is_deleted: false,
        updated_at: new Date(),
      };

      // Gửi dữ liệu lên API
      const response = await api.post('/mentors', dataToSubmit);  // Đảm bảo gọi đúng URL tại đây

      if (response.data.success) {
        setSnackbarMessage('CV và chứng chỉ của bạn đã được gửi, đang chờ quản trị viên phê duyệt.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate('/home');
        }, 3000);
      } else {
        setSnackbarMessage('Đã xảy ra lỗi khi gửi thông tin.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
      e.target.reset(); // Reset form sau khi gửi thành công
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu lên API:', error);
      setSnackbarMessage('Lỗi khi gửi CV và chứng chỉ. Vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {
      setUserData(storedUserData);
    } else {
      navigate('/auth/registerMentor');
    }
  }, [navigate]);

  return (
    <PageContainer title="Đăng ký làm người hướng dẫn | Share Code" description="Đây là trang đăng ký làm người hướng dẫn">
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
                  <TextField fullWidth name="bio" label="Bio" multiline rows={4} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="experience_years" label="Số năm kinh nghiệm" type="number" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth name="skills" label="Kỹ năng" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" startIcon={<AttachFileIcon />} fullWidth sx={{ borderRadius: '16px', textTransform: 'none', padding: '5px 15px' }} component="label">
                    Tải CV lên (PDF, DOC, DOCX)
                    <input name="cv" type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => handleFileChange(e, 'cv')} />
                  </Button>
                  {selectedFileCV && <Typography variant="body2" sx={{ marginTop: '10px' }}>File đã chọn: {selectedFileCV}</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" startIcon={<AttachFileIcon />} fullWidth sx={{ borderRadius: '16px', textTransform: 'none', padding: '5px 15px' }} component="label">
                    Tải chứng chỉ lên (PDF)
                    <input name="certification" type="file" accept=".pdf" hidden onChange={(e) => handleFileChange(e, 'certification')} />
                  </Button>
                  {selectedFileCertification && <Typography variant="body2" sx={{ marginTop: '10px' }}>File đã chọn: {selectedFileCertification}</Typography>}
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', borderRadius: '16px', padding: '5px 20px', fontWeight: 'bold', mt: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Gửi'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default RegisterMentor;
