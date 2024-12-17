import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Snackbar, Alert, CircularProgress, Grid} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';

//api

import QuestionsApis from 'src/apis/QuestionsApis';
import apiUser from 'src/apis/UserApI';
//hình ảnh 
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

    // Find user avatar
    const imageUser = users.find((user) => user.id === questionData?.user_id);

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
                                src={imageUser?.imageUrl ? imageUser.imageUrl : avatardefault}
                                width="40px"
                                alt="Hình ảnh người dùng"
                                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                                onError={(e) => { e.target.src = avatardefault; }} // Fallback image on error
                            />
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                                Xem câu hỏi
                            </Typography>
                        </Box>

                        {/* Display question content */}
                        <TextField
                            variant="outlined"
                            multiline
                            fullWidth
                            rows={4}
                            name="questionText"
                            value={questionData?.question?.questions || 'Người dùng không nhập câu hỏi'} // Correctly access the questions field
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


                        {/* Display hashtags */}
                        <Box display="flex" alignItems="center" my={2}>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                <strong style={{ color: '#fff' }}>Hashtag</strong>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Nhập hashtag"
                                variant="standard"
                                name="hashtag"
                                disabled={true}
                                // Ensure we're accessing the hashtag correctly, considering structure
                                value={questionData?.question?.hashtag || 'Người dùng không nhập hashtag'}  // Directly use questionData.hashtag if it's a simple string
                                sx={{
                                    '& .MuiInputBase-root': {
                                        backgroundColor: 'transparent!important',
                                        border: 'none',
                                        '& fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'transparent',
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

                        {/* Display uploaded images */}
                        <Box display="flex" flexDirection="row" alignItems="center" mt={2}>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                                Hình ảnh tải lên
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={2} justifyContent={'center'} flex={1}>
                                <img
                                    src={questionData?.question?.imageUrls || imageplaceholder
                                    }
                                    width="40px"
                                    alt="Không có hình ảnh"
                                    style={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: "1px solid #ffff",
                                    }}
                                    onError={(e) => {
                                        e.target.src = imageplaceholder; // Hiển thị ảnh mặc định nếu ảnh không tải được
                                    }}

                                />
                            </Box>
                        </Box>

                        {/* Display uploaded files */}
                        <Box display="flex" flexDirection="row" alignItems={'center'} mt={2}>
                            <Typography variant="h6" sx={{ color: '#fff', marginRight: '10px' }}>
                                File tải lên:
                            </Typography>
                            <Box flex={1}>
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
                            </Box>
                        </Box>

                        {/* Display uploaded code */}
                        <Box mt={2}>
                            <Typography variant="h6" sx={{ color: '#fff', marginRight: '10px' }}>
                                Code tải lên
                            </Typography>
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
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <button
                                    className="text-light btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => navigate("/admin/questions")}
                                >
                                    Quay lại
                                </button>
                            </Box>
                        </Grid>
                    </Box>
                )}
            </Box>

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
        </DashboardLayout>
    );
};

export default FormViewQuestion;
