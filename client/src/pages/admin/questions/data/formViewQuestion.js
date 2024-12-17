import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Snackbar, Alert, CircularProgress, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import VuiTypography from "src/components/admin/VuiTypography";
// api
import QuestionsApis from 'src/apis/QuestionsApis';
import apiUser from 'src/apis/UserApI';
// hình ảnh 
import avatardefault from "src/assets/images/profile/user-1.jpg";
import imageplaceholder from "src/assets/images/placeholder/imageplaceholder.jpg";

const FormViewQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questionData, setQuestionData] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    // Fetch question data
    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const response = await QuestionsApis.getQuestionId(id);
                if (response?.data) {
                    setQuestionData(response.data);
                } else {
                    setSnackbarMessage('Không có dữ liệu câu hỏi');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                }
            } catch (error) {
                setSnackbarMessage('Không thể tải dữ liệu câu hỏi');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionData();
    }, [id]);

    // Fetch user list
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiUser.getUsersList();
                setUsers(Array.isArray(response.data.users) ? response.data.users : []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
            }
        };
        fetchUsers();
    }, []);

    // Snackbar close handler
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const smallFontStyle = {
        fontSize: '0.9rem',
        color: '#ffffff'
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box
                sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    background: '#060c28',
                    minHeight: '80vh',
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress color="secondary" />
                        <Typography variant="h6" sx={{ color: '#fff', ml: 2 }}>
                            Đang tải dữ liệu...
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                            <img
                                src={users?.find((u) => questionData?.question?.user_id === u.id)?.imageUrl ||
                                    avatardefault}
                                width="40px"
                                alt="Hình ảnh người dùng"
                                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                                onError={(e) => { e.target.src = avatardefault; }} // Fallback image on error
                            />
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                                Xem câu hỏi
                            </Typography>
                        </Box>
                        <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                            <strong>Tiêu đề: </strong>{questionData?.question?.title}
                        </VuiTypography>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                    <strong>Hashtag: </strong>{questionData?.question?.hashtag || 'Người dùng không nhập hashtag'}
                                </VuiTypography>
                            </div>
                            <div className="col-6 mb-3">
                                <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                    <strong>File tải lên: </strong>
                                    {questionData?.question?.fileUrls.length > 0 ? (
                                        questionData?.question?.fileUrls.map((url, index) => {
                                            const fileName = decodeURIComponent(url).split('/').pop().split('?')[0];
                                            return fileName !== 'uploads' ? (
                                                <a
                                                    key={index}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: '#fff',
                                                        textDecoration: 'underline',
                                                        fontSize: '14px',
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    {fileName}
                                                </a>
                                            ) : null;
                                        })
                                    ) : (
                                        <Typography variant="caption" sx={{ color: '#fff' }}>
                                            Không có file được tải lên
                                        </Typography>
                                    )}
                                </VuiTypography>
                            </div>
                        </div>
                        <Box mt={2}>
                            <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                <strong>Hình ảnh tải lên:</strong>
                            </VuiTypography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',  // Tự động tạo các cột với kích thước tối thiểu là 200px
                                    gap: '10px',  // Khoảng cách giữa các ảnh
                                    justifyItems: 'center',  // Căn giữa các ảnh
                                }}
                            >

                                {questionData?.question?.imageUrls && questionData.question.imageUrls.length > 0 ? (
                                    questionData.question.imageUrls.map((imageUrl, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: 'relative',
                                                width: '100%',  // Chiều rộng bằng với phần tử chứa
                                                aspectRatio: '1 / 1',  // Giữ tỉ lệ 1:1 cho ảnh (vuông)
                                                overflow: 'hidden',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt="Hình ảnh"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',  // Giữ tỷ lệ gốc của hình ảnh mà không bị kéo giãn
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',  // Đổ bóng cho ảnh
                                                }}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <img
                                        src={imageplaceholder}
                                        alt="Không có hình ảnh"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                        {/* Display uploaded code */}
                        <Box mt={2}>
                            <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                <strong>Code tải lên:</strong>
                            </VuiTypography>
                            <TextField
                                multiline
                                rows={10}
                                variant="outlined"
                                fullWidth
                                name="up_code"
                                value={questionData?.question?.up_code || 'Người dùng không nhập code'}
                                disabled={true} // Make it read-only
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'transparent!important',
                                        '& fieldset': {
                                            borderColor: '#fff',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#fff',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#fff',
                                        },
                                        '& .MuiInputBase-input': {
                                            flex: 1,
                                            '&.Mui-disabled': {
                                                color: 'white!important',
                                                '-webkit-text-fill-color': '#fff',
                                            },
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#fff!important',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#fff',
                                    },
                                }}
                            />
                        </Box>

                        {/* Display question content */}
                        <Box mt={2}>
                            <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                <strong>Nội dung câu hỏi: </strong>
                            </VuiTypography>
                            <TextField
                                variant="outlined"
                                multiline
                                fullWidth
                                rows={10}
                                name="questionText"
                                value={questionData?.question?.questions || 'Người dùng không nhập câu hỏi'}
                                disabled={true} // Make it read-only
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'transparent!important',
                                        '& fieldset': {
                                            borderColor: '#fff',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#fff',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#fff',
                                        },
                                        '& .MuiInputBase-input': {
                                            flex: 1,
                                            '&.Mui-disabled': {
                                                color: 'white!important',
                                                '-webkit-text-fill-color': '#fff',
                                            },
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#fff!important',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#fff',
                                    },
                                }}
                            />
                        </Box>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" mt={3} alignItems="center">
                                <button
                                    className="text-light btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => navigate("/admin/questions")}
                                >
                                    Quay lại
                                </button>
                            </Box>
                        </Grid>


                        {/* Snackbar */}
                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={3000}
                            onClose={handleSnackbarClose}
                        >
                            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                )}
            </Box>
        </DashboardLayout>
    );
};

export default FormViewQuestion;
