/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/img-redundant-alt */
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image';
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { da } from 'date-fns/locale';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { db } from 'src/config/firebaseconfig';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import { getQuestionId, updateQuestion } from 'src/apis/QuestionsApis'
import axios from 'axios';

const Questions = () => {
  const [imageError, setImageError] = useState('');
  const [fileError, setFileError] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [questionData, setQuestionData] = useState({
    question: '',
    hashtag: '',
    up_code: '',
    imageUrls: [],
    fileUrls: [],
  });

  const { id } = useParams();
  const location = useLocation();
  const { type } = location.state || {};
  const navigate = useNavigate()

  // Gọi dữ liệu từ Firestore
  useEffect(() => {
    const fetchQuestionById = async (id) => {
      try {
        const res = await getQuestionId(id)
        console.log(res);
        if (res.status == 'success') {
          setQuestionData({
            ...res?.data?.questions,
            imageUrls: JSON.parse(res?.data?.questions?.imageUrls) || [],
            fileUrls: JSON.parse(res?.data?.questions?.fileUrls) || [],
          });
        }

      } catch (error) {
        console.error('Lỗi khi tìm câu hỏi theo ID:', error);
      }
    };

    if (id) {
      fetchQuestionById(id);
    }
  }, [id]);

  // Xử lý thay đổi trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateImageFile = (files) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    for (const file of files) {
      if (!allowedImageTypes.includes(file.type)) {
        return `Ảnh ${file.name} không đúng định dạng (chỉ chấp nhận JPEG, PNG, GIF)`;
      }
    }
    return '';
  };

  const validateOtherFile = (files) => {
    const allowedFileTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    for (const file of files) {
      if (!allowedFileTypes.includes(file.type)) {
        return `Tệp ${file.name} không đúng định dạng (chỉ chấp nhận PDF, DOC, DOCX)`;
      }
    }
    return '';
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const errorMsg = validateImageFile(files);
    if (errorMsg) {
      setImageError(errorMsg);
    } else {
      setImageError(''); // Xóa lỗi nếu hợp lệ
      console.log('Hình ảnh hợp lệ:', files);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const errorMsg = validateOtherFile(files);
    if (errorMsg) {
      setFileError(errorMsg);
    } else {
      setFileError('');
    }
  };

  const handleUpload = async (files) => {
    const storage = getStorage();
    const urls = [];

    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      urls.push(downloadURL);
    });

    await Promise.all(uploadPromises);

    return urls;
  };
  const handleUploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên server:', error);
      throw new Error('Lỗi khi tải ảnh lên server');
    }
  };

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.fileUrl; // Đường dẫn tệp trả về từ server
    } catch (error) {
      console.error('Lỗi khi tải tệp lên server:', error);
      throw new Error('Lỗi khi tải tệp lên server');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Lấy các tệp ảnh và tệp khác
    const imageFiles = formData.getAll('image');
    const otherFiles = formData.getAll('file');

    if (!imageError && !fileError) {
      try {
        let imageUrls = [];
        if (imageFiles.length > 0) {
          const uploadImagePromises = imageFiles.filter(file => file.size > 0).map((imageFile) => handleUploadImage(imageFile));
          const allImageUrls = await Promise.all(uploadImagePromises);
          imageUrls = allImageUrls?.map((imgUrl) => (imgUrl.status === 201 ? imgUrl.imagePath : ''));
        }

        let fileUrls = [];
        if (otherFiles.length > 0) {
          const uploadFilePromises = otherFiles.filter(file => file.size > 0).map((file) => handleUploadFile(file));
          fileUrls = await Promise.all(uploadFilePromises);
        }

        delete data.file;
        delete data.image;
        console.log();

        const dataToSubmit = {
          ...data,
          imageUrls: imageUrls.length > 0 ? imageUrls : questionData.imageUrls,
          fileUrls: fileUrls.length > 0 ? fileUrls : questionData.imageUrls,
          isApproved: false,
          is_deleted: data.is_deleted || false,
          up_code: data?.up_code,
        };

        // Gọi API cập nhật câu hỏi
        const res = await updateQuestion(id, dataToSubmit);

        if (res.status === 'success') {
          // Thông báo khi cập nhật thành công
          setSnackbarOpen(true);
          setSnackbarMessage('Câu hỏi đã được cập nhật thành công.');
          setSnackbarSeverity('success');
          setTimeout(() => {
            navigate(-1);
          }, 2000);
          e.target.reset();
        } else {
          setSnackbarOpen(true);
          setSnackbarMessage(res.data?.message || 'Có lỗi khi cập nhật câu hỏi. Vui lòng thử lại.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        setSnackbarOpen(true);
        setSnackbarMessage(error.message || 'Có lỗi xảy ra khi cập nhật câu hỏi. Vui lòng thử lại sau.');
        setSnackbarSeverity('error');
      }
    } else {
      setSnackbarOpen(true);
      setSnackbarMessage('Có lỗi khi tải lên ảnh hoặc tệp.');
      setSnackbarSeverity('error');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    setSnackbarOpen(false);
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
        }}
      >
        {/* Create Post Header */}
        <Box component="form" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" mb={2}>
            <img
              src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
              width="40px"
              alt="User Avatar"
              style={{ borderRadius: '50%', marginRight: '10px' }}
            />
            <Typography variant="h6" sx={{ color: '#fff' }}>
              {type == 0 ? 'Xem câu hỏi' : 'Sửa câu hỏi'}
            </Typography>
          </Box>

          {/* Post Content */}
          <TextField
            variant="outlined"
            multiline
            fullWidth
            rows={4}
            name="questions"
            onChange={handleInputChange}
            value={questionData?.questions}
            disabled={type == 0 ? true : false}
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

          {/* Add Hashtag Section */}
          <Box display="flex" alignItems="center" my={2}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              <strong style={{ color: '#fff' }}>+ Thêm Hashtag</strong>
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                placeholder="Nhập hashtag"
                variant="standard"
                name="hashtag"
                disabled={type == 0 ? true : false}
                value={questionData.hashtag} // Gán dữ liệu vào trường hashtag
                onChange={handleInputChange} // Cập nhật dữ liệu khi thay đổi
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
          </Box>
          <Box>
            <Box display="flex" flexDirection="row" alignItems={'center'} mt={2}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                Hình ảnh tải lên
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2} justifyContent={'center'} flex={1}>
                {questionData.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="không có hình ảnh nào"
                    width="100px"
                    height="100px"
                    style={{ borderRadius: '8px' }}
                  />
                ))}
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems={'center'} mt={2}>
              <Typography variant="h6" sx={{ color: '#fff', marginRight: '10px' }}>
                File tải lên:
              </Typography>
              <Box flex={1}>
                {questionData.fileUrls && questionData.fileUrls.length > 0 && questionData.fileUrls.some(url => decodeURIComponent(url).split('/').pop().split('?')[0] !== 'uploads') ? (
                  questionData.fileUrls.map((url, index) => {
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
                  <Typography variant="caption" sx={{ color: '#fff', marginRight: '10px' }}>
                    Không có file được tải lên
                  </Typography>
                )}
              </Box>
            </Box>

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
                value={questionData.up_code}
                onChange={handleInputChange}
                disabled={type == 0 ? true : false}
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
          </Box>
          {/* Options for Image, File, Code */}
          {type == 1 && (
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" gap={1}>
                <Box display="flex" gap={1}>
                  {['Hình ảnh', 'Tệp'].map((label, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      startIcon={
                        index === 0 ? (
                          <ImageIcon />
                        ) : index === 1 ? (
                          <AttachFileIcon />
                        ) : (
                          <CodeIcon />
                        )
                      }
                      sx={{
                        borderRadius: '16px',
                        textTransform: 'none',
                        padding: '5px 15px',
                      }}
                      component="label"
                    >
                      {label}
                      {index === 0 && (
                        <input
                          name="image"
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleImageChange}
                        />
                      )}
                      {index === 1 && (
                        <input
                          type="file"
                          name="file"
                          multiple
                          hidden
                          onChange={handleFileChange}
                        />
                      )}
                    </Button>
                  ))}
                </Box>
              </Box>
              {/* Post Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={type == 0 ? true : false}
                sx={{
                  textTransform: 'none',
                  borderRadius: '16px',
                  padding: '5px 20px',
                  fontWeight: 'bold',
                  mt: 2,
                  color: '#fff',
                }}
              >
                Sửa
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Questions;
