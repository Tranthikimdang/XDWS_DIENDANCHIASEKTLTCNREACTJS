/* eslint-disable no-const-assign */
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Snackbar, Alert, CircularProgress, Button, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { saveAs } from 'file-saver';
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
    const { register, handleSubmit, formState: { errors } } = useForm();
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

    // Danh sách các từ khóa bị cấm (quảng cáo, bán hàng)
    const blockedKeywords = [
        "mua ngay", "giá rẻ", "khuyến mãi", "bán hàng", "liên hệ", "tuyển dụng", "marketing", "mua bán", "đặt hàng", "ship hàng", "công ty"
    ];

    // Biểu thức chính quy để kiểm tra từ khóa bán hàng/quảng cáo
    const createKeywordRegex = (keywords) => {
        return new RegExp(keywords.join("|"), "i"); // "i" là để không phân biệt chữ hoa chữ thường
    };

    // Hàm kiểm tra từ khóa bị cấm (bán hàng/quảng cáo)
    const checkForBlockedKeywords = (value) => {
        const blockedRegex = createKeywordRegex(blockedKeywords);
        return !blockedRegex.test(value) || "Tiêu đề chứa từ khóa không được phép! (Bán hàng, quảng cáo, mua bán)";
    };


    const smallFontStyle = {
        fontSize: '0.9rem',
        color: '#ffffff'
    };


    const onSubmit = async () => {
        // Kiểm tra xem câu hỏi có ID hợp lệ không
        if (!editedQuestion.id) {
            setSnackbarMessage('ID câu hỏi không hợp lệ');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        // Chuẩn bị dữ liệu cần gửi đi
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
                }, 3000);  // 5000 milliseconds = 5 giây
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

    // Hàm quay lại mà không làm reset dữ liệu
    const handleCancel = () => {
        // Quay lại mà không reset dữ liệu đã thay đổi
        navigate('/admin/questions');
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
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                        <div className="row">
                            <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                <strong>Tiêu đề: </strong>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <input

                                            type="text"
                                            name="title"
                                            {...register("title", {
                                                required: "Tiêu đề là bắt buộc",
                                                minLength: {
                                                    value: 10,
                                                    message: "Tiêu đề phải có ít nhất 10 ký tự"
                                                },
                                                maxLength: {
                                                    value: 150,
                                                    message: "Tiêu đề không được vượt quá 150 ký tự"
                                                },
                                                validate: {
                                                    noBlockedKeywords: (value) => checkForBlockedKeywords(value),
                                                    noUppercase: (value) => value !== value.toUpperCase() || "Không sử dụng toàn chữ in hoa"
                                                }
                                            })}
                                            value={editedQuestion.title || ''}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'transparent',
                                                borderColor: errors.title ? 'red' : '#fff',
                                                color: '#fff',
                                                padding: '10px',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        {errors.title && <span style={{ color: 'red' }}>{errors.title.message}</span>}
                                    </Grid>
                                </Grid>

                            </VuiTypography>
                            <div className="col-6 mb-3">
                                {/* Hashtag */}
                                <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                    <strong style={{ color: '#fff' }}>Hashtag</strong>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <input
                                                type="text"
                                                name="hashtag"
                                                placeholder="Nhập hashtag"
                                                {...register("hashtag", {
                                                    required: "Hashtag là bắt buộc",
                                                    validate: (value) =>
                                                        value.startsWith('#') || "Hashtag phải bắt đầu bằng dấu #",
                                                })}
                                                value={editedQuestion.hashtag || 'Người dùng không nhập hashtag'}
                                                onChange={handleInputChange}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '10px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    width: '100%',
                                                    backgroundColor: 'transparent',
                                                    borderColor: errors.title ? 'red' : '#fff',
                                                    color: '#fff',
                                                }}
                                            />
                                            {errors.hashtag && <span style={{ color: 'red' }}>{errors.hashtag.message}</span>}
                                        </Grid>
                                    </Grid>
                                </VuiTypography>
                            </div>
                            <div className="col-6 mb-3">
                                {/* Display uploaded files */}
                                <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                    <strong>File tải lên:</strong>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            {selectedFiles.length > 0 ? (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        border: '1px solid grey',
                                                        borderRadius: '12px',
                                                        width: '100%', // Đảm bảo rằng Box chiếm toàn bộ chiều rộng của phần tử chứa
                                                    }}
                                                >
                                                    {selectedFiles.map((file, index) => {
                                                        let fileName = decodeURIComponent(file).split('/').pop().split('?')[0]; // Lấy tên file từ URL
                                                        fileName = fileName.replace(/[0-9-]/g, ''); // Loại bỏ các ký tự không cần thiết
                                                        const fullUrl = 'http://localhost:3000' + file; // Đảm bảo URL đầy đủ để tải tệp

                                                        return (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <IconButton
                                                                    sx={{
                                                                        color: '#fff',
                                                                        '&:hover': { color: 'grey' },
                                                                    }}
                                                                    onClick={() => saveAs(fullUrl, fileName)}
                                                                >
                                                                    <DescriptionIcon />
                                                                </IconButton>
                                                                <span
                                                                    style={{
                                                                        color: '#fff',
                                                                        fontSize: '14px',
                                                                        marginLeft: '8px',
                                                                        cursor: 'pointer',
                                                                        '&:hover': {
                                                                            textDecoration: 'underline',
                                                                        },
                                                                    }}
                                                                >
                                                                    {fileName}
                                                                </span>
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" sx={{ color: '#fff' }}>
                                                    {/* Hiển thị file nếu có */}
                                                    {editedQuestion.fileUrls.length > 0 ? (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                border: '1px solid grey',
                                                                borderRadius: '12px',
                                                                width: '100%', // Đảm bảo rằng Box chiếm toàn bộ chiều rộng của phần tử chứa
                                                            }}
                                                        >
                                                            {editedQuestion.fileUrls.map((url, index) => {
                                                                let fileName = decodeURIComponent(url).split('/').pop().split('?')[0];
                                                                fileName = fileName.replace(/[0-9-]/g, ''); // Loại bỏ các ký tự không cần thiết


                                                                // Kiểm tra nếu file là hợp lệ và không phải là tên 'uploads'
                                                                if (fileName !== 'uploads') {
                                                                    const fullUrl = 'http://localhost:3000' + url; // Đảm bảo URL đầy đủ để tải tệp

                                                                    return (
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                            }}
                                                                        >
                                                                            <IconButton
                                                                                sx={{
                                                                                    color: '#fff',
                                                                                    '&:hover': { color: 'grey' },
                                                                                }}
                                                                                onClick={() => saveAs(fullUrl, fileName)}
                                                                            >
                                                                                <DescriptionIcon />
                                                                            </IconButton>
                                                                            <span
                                                                                style={{
                                                                                    color: '#fff',
                                                                                    fontSize: '14px',
                                                                                    marginLeft: '8px',
                                                                                    cursor: 'pointer',
                                                                                    '&:hover': {
                                                                                        textDecoration: 'underline',
                                                                                    },
                                                                                }}
                                                                            >
                                                                                {fileName} {/* Hiển thị tên file */}
                                                                            </span>
                                                                        </Box>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </Box>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '10px',
                                                                border: '1px solid #e0e0e0',
                                                                borderRadius: '8px',
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <Typography variant="caption" sx={{ color: '#e0e0e0', marginLeft: '8px' }}>
                                                                Không có file được tải lên
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                </Typography>
                                            )}

                                        </Grid>
                                    </Grid>
                                </VuiTypography>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 mb-3">
                                {/* Display uploaded code */}

                                <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                                    <strong>Code tải lên:</strong>
                                </VuiTypography>
                                <TextField
                                    variant="outlined"
                                    multiline
                                    fullWidth
                                    rows={10}
                                    name="up_code"
                                    value={editedQuestion?.up_code || 'Người dùng không nhập code'} // Thông báo nếu không có code
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

                            </div>
                            <div className="col-6 mb-3">
                                {/* Nội dung câu hỏi */}

                                <VuiTypography variant="subtitle1" gutterBottom style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                                    <strong>Nội dung câu hỏi: </strong>
                                </VuiTypography>
                                <TextField
                                    variant="outlined"
                                    multiline
                                    fullWidth
                                    rows={10}
                                    name="questions"
                                    value={editedQuestion?.questions || 'Người dùng không nhập câu hỏi'}
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
                            </div>
                        </div>

                        <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                            <strong>Hình ảnh tải lên:</strong>
                        </VuiTypography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',  // Tự động tạo các cột với kích thước tối thiểu là 200px
                                gap: '10px',  // Khoảng cách giữa các ảnh
                                justifyItems: 'center',  // Căn giữa các ảnh
                                border: '1px solid grey',
                                borderRadius: '12px',
                                padding: '10px 8px',
                            }}
                        >
                            {selectedImages.length > 0 ? (
                                selectedImages.map((image, index) => (
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
                                            src={image}
                                            alt={`Uploaded ${index}`}
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
                            ) : editedQuestion?.imageUrls ? (
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
                                        src={editedQuestion?.imageUrls}
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


                        {/*Button Tệp Hình ảnh */}
                        <Box mt={2}>
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
                        </Box>


                        {/* Submit Button */}
                        <Box display="flex" justifyContent="flex-end" mt={3}>
                            <Box display="flex" gap={1}> <button
                                className="text-light btn btn-outline-secondary"
                                onClick={handleCancel}  // Gọi hàm handleCancel khi nhấn nút Quay lại
                            >
                                Quay lại
                            </button>
                                <button
                                    className="text-light btn btn-outline-info me-2"
                                    type="submit"
                                >
                                    Cập nhật câu hỏi
                                </button>

                            </Box>
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

        </DashboardLayout >
    );
};

export default FormEditQuestion;

