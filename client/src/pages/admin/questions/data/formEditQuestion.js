import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Snackbar, Alert, CircularProgress, Button, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import VuiTypography from "src/components/admin/VuiTypography";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
//icon
import DescriptionIcon from '@mui/icons-material/Description';
//api
import QuestionsApis from 'src/apis/QuestionsApis';
import apiUser from 'src/apis/UserApI';
//hình ảnh 
import avatardefault from "src/assets/images/profile/user-1.jpg";
import imageplaceholder from "src/assets/images/placeholder/imageplaceholder.jpg";

const FormEditQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [editedQuestion, setEditedQuestion] = useState({
        id: '',
        title: '',
        questions: '',
        hashtag: '',
        up_code: '',
        fileUrls: [],
        imageUrls: [],
    });

    // Lấy thông tin câu hỏi từ API
    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const response = await QuestionsApis.getQuestionId(id);
                if (response?.data) {
                    setEditedQuestion(response.data.question);
                    setSelectedImages(response.data.imageUrls || []);
                    setSelectedFiles(response.data.fileUrls || []);
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

    // Lấy danh sách người dùng
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

    // Xử lý thay đổi input
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedQuestion(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:3000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Lỗi khi tải hình ảnh lên");
            }

            const data = await response.json();
            return data.imagePath; // Trả về đường dẫn hình ảnh
        } catch (error) {
            console.error("Lỗi tải hình ảnh:", error);
            throw error;
        }
    };
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:3000/api/upload-file", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Lỗi khi tải tệp lên");
            }

            const data = await response.json();
            return data.fileUrl; // Trả về đường dẫn tệp
        } catch (error) {
            console.error("Lỗi tải tệp:", error);
            throw error;
        }
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        const fileUrls = [];

        for (const file of files) {
            const uploadedFileUrl = await uploadFile(file);
            if (uploadedFileUrl) {
                fileUrls.push(uploadedFileUrl);
            }
        }

        setSelectedFiles(fileUrls); // Lưu các URL tệp đã upload vào state
    };


    const handleImageUpload = async (event) => {
        const files = event.target.files;
        const imageUrls = [];

        for (const file of files) {
            const uploadedImageUrl = await uploadImage(file);
            if (uploadedImageUrl) {
                imageUrls.push(uploadedImageUrl);
            }
        }

        setSelectedImages(imageUrls); // Lưu các URL hình ảnh đã upload vào state
    };

    const smallFontStyle = {
        fontSize: '0.9rem',
        color: '#ffffff'
    };


    // Hàm submit để chỉnh sửa câu hỏi
    const handleSubmit = async () => {
        if (!editedQuestion.id) {
            setSnackbarMessage('ID câu hỏi không hợp lệ');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const formData = {
            title: editedQuestion.title,
            questions: editedQuestion.questions,
            hashtag: editedQuestion.hashtag,
            up_code: editedQuestion.up_code,
            fileUrls: selectedFiles,  // Đường dẫn file đã upload
            imageUrls: selectedImages,  // Đường dẫn hình ảnh đã upload
        };

        try {
            setLoading(true);  // Hiển thị loading khi gửi dữ liệu
            const response = await QuestionsApis.updateQuestion(editedQuestion.id, formData);

            // Kiểm tra nếu phản hồi thành công với mã trạng thái 200
            if (response.status === 200) {
                // Thông báo thành công khi cập nhật câu hỏi
                setSnackbarMessage('Cập nhật câu hỏi thành công!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);

                // Cập nhật lại câu hỏi mới từ API
                setEditedQuestion(response.data);

                // Chờ 5 giây rồi chuyển hướng về trang danh sách câu hỏi
                setTimeout(() => {
                    navigate('/admin/questions');
                }, 5000);  // 5000 milliseconds = 5 giây
            } else {
                // Nếu API trả về lỗi hoặc không có mã trạng thái 200, thông báo thành công mặc định
                setSnackbarMessage('Cập nhật câu hỏi thành công!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);

                // Chờ 5 giây rồi chuyển hướng về trang danh sách câu hỏi
                setTimeout(() => {
                    navigate('/admin/questions');
                }, 5000);
            }
        } catch (error) {
            console.error('Error:', error); // Log lỗi nếu có

            // Nếu có lỗi xảy ra, thông báo lỗi
            setSnackbarMessage('Lỗi khi cập nhật câu hỏi');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            // Đảm bảo tắt trạng thái loading khi kết thúc
            setLoading(false);
        }
    };


    // Hàm đóng snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', background: '#060c28', minHeight: '80vh' }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress color="secondary" />
                        <Typography variant="h6" sx={{ color: '#fff', ml: 2 }}>Đang tải dữ liệu...</Typography>
                    </Box>
                ) : (
                    <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                            <img
                                src={users?.find((u) => editedQuestion?.user_id === u.id)?.imageUrl ||
                                    avatardefault}
                                width="40px"
                                alt="Hình ảnh người dùng"
                                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                                onError={(e) => { e.target.src = avatardefault; }} // Fallback image on error
                            />
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                                Sửa câu hỏi
                            </Typography>
                        </Box>
                        {/* Form fields */}

                        <VuiTypography variant="subtitle1" gutterBottom style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                            <strong>Tiêu đề: </strong>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="title"
                                value={editedQuestion.title || ''}
                                onChange={handleInputChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'transparent!important',
                                        '& fieldset': { borderColor: '#fff' },
                                        '&:hover fieldset': { borderColor: '#fff' },
                                        '&.Mui-focused fieldset': { borderColor: '#fff' },
                                    },
                                    '& .MuiInputBase-input': { color: '#fff' }
                                }}
                            />
                        </VuiTypography>

                        <div className="row">

                            <div className="col-6 mb-3">
                                {/* Hashtag */}
                                <Box display="flex" alignItems="center" my={2}>
                                    <Typography variant="body2" sx={{ mr: 2 }}>
                                        <strong style={{ color: '#fff' }}>Hashtag</strong>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Nhập hashtag"
                                        variant="standard"
                                        name="hashtag"
                                        value={editedQuestion.hashtag || ''}
                                        onChange={handleInputChange}
                                        sx={{
                                            '& .MuiInputBase-root': { backgroundColor: 'transparent!important', border: 'none' },
                                            '& .MuiInputBase-input': { color: '#fff' }
                                        }}
                                    />
                                </Box>

                            </div>
                            <div className="col-6 mb-3">
                                {/* Display uploaded files */}
                                <Box display="flex" flexDirection="row" alignItems="center" mt={2}>
                                    <Typography variant="h6" sx={{ color: '#fff', marginRight: '10px' }}>
                                        File tải lên:
                                    </Typography>

                                    <Box flex={1}>
                                        {selectedFiles.length > 0 ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '10px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    width: 'fit-content',
                                                    height: '30px',
                                                }}
                                            >
                                                <IconButton sx={{ color: '#007bff' }}>
                                                    <DescriptionIcon />
                                                </IconButton>
                                                <Typography variant="subtitle1">
                                                    {selectedFiles.map((file, index) => {
                                                        const fileName = decodeURIComponent(file)
                                                            .split('/')
                                                            .pop()
                                                            .split('?')[0]; // Lấy tên file

                                                        return (
                                                            <a
                                                                key={index}
                                                                href={file} // Đường dẫn file
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    color: 'inherit',
                                                                    textDecoration: 'none',
                                                                    fontSize: '14px',
                                                                    marginRight: '10px',
                                                                }}
                                                            >
                                                                {fileName}
                                                            </a>
                                                        );
                                                    })}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: '#fff' }}>
                                                {editedQuestion.fileUrls || 'Không có file được tải lên'}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
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
                                {selectedImages.length > 0 ? (
                                    selectedImages.map((image, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: 'relative',
                                                width: '100%',  // Căn chỉnh kích thước ảnh để không bị kéo giãn
                                                aspectRatio: '1 / 1',  // Đảm bảo ảnh vuông
                                                overflow: 'hidden',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',  // Thêm hiệu ứng hover cho ảnh
                                                }
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`Uploaded ${index}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            aspectRatio: '1 / 1',
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <img
                                            src={imageplaceholder}
                                            alt="Không có hình ảnh được chọn"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Display uploaded code */}
                        <Box mt={2}>
                            <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                <strong>Code tải lên:</strong>
                            </VuiTypography>
                            <TextField
                                variant="outlined"
                                multiline
                                fullWidth
                                rows={10}
                                name="up_code"
                                value={editedQuestion?.up_code || ''} // Thông báo nếu không có code
                                onChange={handleInputChange}
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
                                        whiteSpace: 'pre-wrap', // Đảm bảo đoạn code xuống dòng khi cần
                                        wordBreak: 'break-word', // Ngắt từ khi cần thiết
                                    },
                                }}
                            />
                        </Box>

                        {/* Nội dung câu hỏi */}
                        <Box mt={2}>
                            <VuiTypography variant="subtitle1" gutterBottom style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                                <strong>Nội dung câu hỏi: </strong>
                            </VuiTypography>
                            <TextField
                                variant="outlined"
                                multiline
                                fullWidth
                                rows={4}
                                name="questions"
                                value={editedQuestion.questions || ''}
                                onChange={handleInputChange}
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

                        {/* Hình ảnh */}
                        {/* Tệp */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ImageIcon />}
                                    component="label"
                                >
                                    Chọn Hình ảnh
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<AttachFileIcon />}
                                    component="label"
                                >
                                    Chọn Tệp
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        onChange={handleFileUpload}
                                    />
                                </Button>
                            </Box>
                        </Box>


                        {/* Submit Button */}
                        <Box display="flex" justifyContent="flex-end" mt={3}>
                            <button
                                className="text-light btn btn-outline-secondary"
                                onClick={() => navigate('/admin/questions')}
                            >
                                Quay lại
                            </button>
                            <button
                                className="text-light btn btn-outline-info me-2"
                                onClick={handleSubmit}
                            >
                                Cập nhật câu hỏi
                            </button>
                        </Box>
                    </Box>
                )}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ transform: 'translateY(100px)' }} // Điều chỉnh khoảng cách từ phía trên bằng cách di chuyển theo trục Y
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </DashboardLayout>
    );
};

export default FormEditQuestion;

