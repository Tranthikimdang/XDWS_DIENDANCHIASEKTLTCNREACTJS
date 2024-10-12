/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useRef, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Chọn style mà bạn thích

import {
  Grid,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  Link,
  Divider,
  FormControl,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle

} from '@mui/material';
// icon
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CodeIcon from '@mui/icons-material/Code';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconMessageCircle } from '@tabler/icons-react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
//firebase
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/config/firebaseconfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const Questions = () => {
  const navigate = useNavigate();
  // const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [imageError, setImageError] = useState('');
  const [fileError, setFileError] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [error, setError] = useState('');
  const [showCodeField, setShowCodeField] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false)
  const [listQuestion, setListQuestion] = useState([])
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState(false);
  const [dataTemp, setDataTemp] = useState(null)
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const listUser = useRef([])
  const [showCodeDialog, setShowCodeDialog] = useState(false);


  // Lấy danh sách người dùng từ Firestore
  useEffect(() => {
    userData.current = JSON.parse(localStorage.getItem('user'));
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userCollectionRef = collection(db, "users");
        const userSnapshot = await getDocs(userCollectionRef);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
        console.log("Lấy người dùng:", userList);
      } catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesSnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = articlesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);


  useEffect(() => {

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const QuestionssSnapshot = await getDocs(collection(db, 'questions'));
        const QuestionssData = QuestionssSnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setListQuestion(QuestionssData)
      } catch (error) {
        console.error("Error fetching Questionss:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [reload]);

  const handleSnackbarClose = (event, reason) => {
    setSnackbarOpen(false);
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

  const userData = useRef(null)

  const validateOtherFile = (files) => {
    const allowedFileTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    for (const file of files) {
      if (!allowedFileTypes.includes(file.type)) {
        const errorMessage = `Tệp ${file.name} không đúng định dạng (chỉ chấp nhận PDF, DOC, DOCX)`;
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error'); // Hiển thị lỗi với mức độ nghiêm trọng là "error"
        setSnackbarOpen(true);
        return errorMessage;
      }
    }
    return '';
  };


  const handleImageChange = (e) => {
    const files = e.target.files;
    const errorMsg = validateImageFile(files);
    if (errorMsg) {
      console.log(errorMsg);

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
      setFileError(''); // Xóa lỗi nếu hợp lệ
      console.log('Tệp hợp lệ:', files);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const imageFiles = formData.getAll('image');
    const otherFiles = formData.getAll('file');
    if (!imageError && !fileError) {
      try {
        const imageUrls = await handleUpload(imageFiles);
        const fileUrls = await handleUpload(otherFiles);

        delete data.file;
        delete data.image;
        const dataToSubmit = {
          ...data,
          user_id: userData.current.id,
          imageUrls,
          fileUrls,
          isApproved: '0',
          created_at: new Date(),
          is_deleted: data.is_deleted || false,
          updated_at: new Date(),
          createdAt: serverTimestamp(),
          up_code: dataTemp?.up_code || codeSnippet, // Gán giá trị up_code từ dataTemp
        };

        const usersCollection = collection(db, 'questions');
        // eslint-disable-next-line no-unused-vars
        const res = await addDoc(usersCollection, dataToSubmit);
        setLoading(false)
        setSnackbarOpen(true);
        setSnackbarMessage('Câu hỏi của bạn đã được gửi, đang chờ quản trị viên phê duyệt.');
        setSnackbarSeverity("success");
        e.target.reset();
        // get all question
        setReload(reload => !reload)
      } catch (error) {
        setLoading(false)
        console.error('Lỗi khi gửi dữ liệu lên Firestore:', error);
      }
    } else {
      setLoading(false)
      console.log('Có lỗi khi tải lên');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const imageFiles = formData.getAll('image');
    const otherFiles = formData.getAll('file');

    if (!imageError && !fileError) {
      try {
        let imageUrls = [];
        let fileUrls = [];
        if (imageFiles[0].size !== 0) {
          imageUrls = await handleUpload(imageFiles);
        }
        if (imageFiles[0].size !== 0) {
          fileUrls = await handleUpload(otherFiles);
        }

        delete data.file;
        delete data.image;
        const dataToSubmit = {
          ...data,
          imageUrls: imageUrls.length > 0 ? imageUrls : dataTemp.imageUrls,
          fileUrls: fileUrls.length > 0 ? fileUrls : dataTemp.fileUrls,
          isApproved: '0',
          created_at: new Date(),
          is_deleted: data.is_deleted || false,
          updated_at: new Date(),
          createdAt: serverTimestamp(),
          up_code: dataTemp?.up_code || codeSnippet, // Gán giá trị up_code từ dataTemp

        };

        const docRef = doc(db, 'questions', dataTemp.id);
        await updateDoc(docRef, dataToSubmit);
        setSnackbarOpen(true);
        setSnackbarMessage('Questions updated successfully.');
        setSnackbarSeverity("success");
        setReload(reload => !reload)
        setEdit(false)
        e.target.reset();
      } catch (error) {
        console.error('Lỗi khi gửi dữ liệu lên Firestore:', error);
      }
    } else {
      console.log('Có lỗi khi tải lên');
    }
  };

  const onEdit = (data) => {
    setAnchorEl(null)
    setEdit(true)
    setDataTemp(data)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataTemp((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCodeChange = (event) => {
    setCodeSnippet(event.target.value);
    setError('');
  };

  const handleCardClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { id: articleId } });
  };

  const handleCodeButtonClick = () => {
    setShowCodeField(true);
    setShowCodeDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCodeDialog(false);
    setCodeSnippet('');
    setError('');
  };

  const handleSubmitCode = () => {
    if (!codeSnippet) {
      setError("Vui lòng nhập code!");
      return;
    } else {
      setError('');
      // Thực hiện lưu giá trị codeSnippet vào trạng thái chính
      setDataTemp((prevData) => ({
        ...prevData,
        up_code: codeSnippet,  // Lưu code vào dataTemp
      }));
      handleCloseDialog(); // Đóng dialog

      // Nếu cần, bạn có thể reset giá trị codeSnippet sau khi lưu
      setCodeSnippet('');
    }
  };



  //date
  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt.seconds * 1000); // Chuyển đổi giây thành milliseconds
      const now = new Date();
      const diff = now - date; // Tính toán khoảng cách thời gian

      const seconds = Math.floor(diff / 1000); // chuyển đổi ms thành giây
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        updatedAtString = `${days} ngày trước`;
      } else if (hours > 0) {
        updatedAtString = `${hours} giờ trước`;
      } else if (minutes > 0) {
        updatedAtString = `${minutes} phút trước`;
      } else {
        updatedAtString = `${seconds} giây trước`;
      }
    } else {
      updatedAtString = 'Không rõ thời gian';
    }

    return updatedAtString;
  };

  return (
    <PageContainer title="Questions">
      <DashboardCard>
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item md={8}>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
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
                  <Typography variant="h6">Đặt câu hỏi</Typography>
                </Box>

                {/* Post Content */}
                <TextField
                  label="Hãy đặt câu hỏi?"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={4}
                  name="questions"
                  // value={newComment}
                  // onChange={(e) => setNewComment(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                {/* Add Hashtag Section */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    <strong>+ Thêm Hashtag</strong>
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Nhập hashtag"
                      variant="standard"
                      name="hashtag"
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                  </Box>
                </Box>

                {/* Options for Image, File, Code */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap={1}>
                    {['Hình ảnh', 'Tệp', 'Code'].map((label, index) => (
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
                        onClick={index === 2 ? handleCodeButtonClick : undefined} // Chỉ mở dialog khi nhấn vào icon Code
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
                  {/* Code Dialog */}
                  <Dialog open={showCodeDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Nhập code của bạn</DialogTitle>
                    <DialogContent>
                      {showCodeField && (
                        <FormControl fullWidth>
                          <TextField
                            id="code-input"
                            multiline
                            rows={4}
                            name="up_code"
                            variant="outlined"
                            value={codeSnippet}
                            onChange={handleCodeChange}
                            error={!!error}
                          />
                          <FormHelperText>{error}</FormHelperText>
                        </FormControl>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="secondary">
                        Hủy
                      </Button>
                      <Button onClick={handleSubmitCode} color="primary">
                        Lưu
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {/* Post Button */}
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
                  >
                    Đăng
                  </Button>
                </Box>
              </Box>

              {/* Loading Spinner */}
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : listQuestion?.length > 0 ? (
                listQuestion
                  .sort((a, b) => (a.updated_at.seconds < b.updated_at.seconds ? 1 : -1))
                  .map((question) =>
                    // eslint-disable-next-line eqeqeq
                    question.isApproved == 1 && (
                      <Box
                        key={question?.id}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '20px',
                          marginTop: '20px',
                          backgroundColor: '#fff',
                        }}
                      >
                        {/* Post Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Box display="flex" alignItems="center">
                            <img
                              src={listUser.current.find(user => user.id === question?.user_id)?.avatar || "http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"}
                              width="40px"
                              alt="User Avatar"
                              style={{ borderRadius: '50%', marginRight: '10px' }}
                            />
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                <strong>{users?.find((u) => question?.user_id === u.id)?.name}</strong>
                              </Typography>
                              <Typography variant="body2">
                                {formatUpdatedAt(question.updated_at)}
                              </Typography>
                            </Box>
                          </Box>
                          {question?.user_id === userData.current.id && (
                            <>
                              <Tooltip title="Options">
                                <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
                                  <MoreHorizIcon />
                                </IconButton>
                              </Tooltip>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                              >
                                <MenuItem onClick={() => onEdit(question)}>Sửa</MenuItem>
                              </Menu>
                            </>
                          )}
                        </Box>

                        {/* Content Section */}
                        {edit ? (
                          <Box component="form" mt={2} onSubmit={handleEdit}>
                            <TextField
                              label="Hãy chia sẻ kiến thức hoặc đặt câu hỏi?"
                              variant="outlined"
                              multiline
                              fullWidth
                              rows={4}
                              name="questions"
                              value={dataTemp.questions}
                              onChange={handleInputChange}
                              sx={{ marginBottom: 2 }}
                            />

                            {/* Add Hashtag Section */}
                            <Box display="flex" alignItems="center" mb={2}>
                              <Typography variant="body2" sx={{ mr: 2 }}>
                                <strong>+ Thêm Hashtag</strong>
                              </Typography>
                              <Box sx={{ flexGrow: 1 }}>
                                <TextField
                                  fullWidth
                                  placeholder="Nhập hashtag"
                                  variant="standard"
                                  name="hashtag"
                                  value={dataTemp.hashtag}
                                  InputProps={{
                                    disableUnderline: true,
                                  }}
                                  onChange={handleInputChange}
                                />
                              </Box>
                            </Box>

                            {/* Options for Image, File, Code */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Box display="flex" gap={1}>
                                {['Hình ảnh', 'Tệp', 'Code'].map((label, index) => (
                                  <Button
                                    key={index}
                                    variant="outlined"
                                    startIcon={
                                      index === 0 ? <ImageIcon /> :
                                        index === 1 ? <AttachFileIcon /> : <CodeIcon />
                                    }
                                    sx={{ borderRadius: '16px', textTransform: 'none', padding: '5px 15px' }}
                                    component="label"
                                    onClick={index === 2 ? handleCodeButtonClick : undefined}
                                  >
                                    {label}
                                    {index === 0 && <input name="image" type="file" accept="image/*" multiple hidden onChange={handleImageChange} />}
                                    {index === 1 && <input type="file" name="file" multiple hidden onChange={handleFileChange} />}
                                  </Button>
                                ))}
                              </Box>
                              {showCodeField && (
                                <Dialog open={showCodeDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                                  <DialogTitle>Nhập code của bạn</DialogTitle>
                                  <DialogContent>
                                    {showCodeField && (
                                      <FormControl fullWidth>
                                        <TextField
                                          id="code-input"
                                          multiline
                                          rows={4}
                                          name="up_code"
                                          variant="outlined"
                                          value={dataTemp?.up_code || ''}
                                          onChange={handleCodeChange}
                                          error={!!error}
                                        />
                                        {error && <FormHelperText error>{error}</FormHelperText>}
                                      </FormControl>
                                    )}
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleCloseDialog} color="secondary">
                                      Hủy
                                    </Button>
                                    <Button onClick={handleSubmitCode} color="primary">
                                      Lưu
                                    </Button>
                                  </DialogActions>
                                </Dialog>
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
                              >
                                Sửa
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <>
                            {/* Display Question Content */}
                            <Box sx={{ mt: 3, mb: 3 }}>
                              <Typography variant="subtitle1">
                                {question?.questions || ""}
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              {question?.hashtag && (
                                <Typography variant="h6" sx={{ color: '#007bff', fontSize: '0.8rem' }}>
                                  #{question.hashtag}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ mt: 3, mb: 3 }}>
                              {question?.up_code ? (
                                <>
                                  <SyntaxHighlighter language="javascript" style={dracula}>
                                    {question.up_code}
                                  </SyntaxHighlighter>
                                  <Divider sx={{ mb: 2 }} />
                                </>
                              ) : null}
                            </Box>

                            {/* Display Images */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
                              {question?.imageUrls?.length > 0 && question?.imageUrls.map((image, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    flexBasis: ['100%', '48%', '32%'][Math.min(2, index)],
                                    flexGrow: 1,
                                    maxWidth: ['100%', '48%', '32%'][Math.min(2, index)],
                                    mb: 2,
                                  }}
                                >
                                  <img
                                    src={image}
                                    alt=""
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                  />
                                </Box>
                              ))}
                            </Box>
                            {question.fileUrls && question.fileUrls.length > 0 && question.fileUrls.some(url => decodeURIComponent(url).split('/').pop().split('?')[0] !== 'uploads') && (
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
                                  {question.fileUrls.map((url, index) => {
                                    const fileName = decodeURIComponent(url).split('/').pop().split('?')[0];
                                    return fileName !== 'uploads' ? (
                                      <a
                                        key={index}
                                        href={url}
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
                                    ) : null;
                                  })}
                                </Typography>
                              </Box>
                            )}

                          </>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Like and Comment Counts */}
                        <Typography variant="subtitle1" color="textSecondary">
                          345 Likes • 34 Comments
                        </Typography>

                        {/* Like and Comment Buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <IconButton>
                            <FavoriteBorderIcon />
                          </IconButton>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            Thích
                          </Typography>
                          <IconButton sx={{ ml: 2 }}>
                            <IconMessageCircle />
                          </IconButton>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            Bình luận
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Comment Section */}
                        <Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <img
                              src={userData.current.avatar || "http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"}
                              alt="User Avatar"
                              style={{ borderRadius: '50%', marginRight: '10px' }}
                              width="40px"
                            />
                            <TextField
                              placeholder="Viết bình luận..."
                              variant="outlined"
                              size="small"
                              fullWidth
                              sx={{ backgroundColor: '#f0f0f0', borderRadius: '20px' }}
                            />
                          </Box>

                          {/* Example Comment */}
                          <Box display="flex" alignItems="flex-start" mb={2}>
                            <img
                              src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                              alt="Commenter Avatar"
                              style={{ borderRadius: '50%', marginRight: '10px' }}
                              width="40px"
                            />
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Rowan Atkinson
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  backgroundColor: '#f0f2f5',
                                  padding: '10px',
                                  borderRadius: '10px',
                                  wordWrap: 'break-word',
                                }}
                              >
                                She starred as Jane Porter in The @Legend of Tarzan (2016), Tanya Vanderpoel...
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                                  11 giờ
                                </Typography>
                                <Button variant="text" sx={{ padding: '0px 10px' }}>
                                  Thích
                                </Button>
                                <Button variant="text" sx={{ padding: '0px 10px' }}>
                                  Phản hồi
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )
                  )
              ) : (
                <Typography variant="h6" align="center" sx={{ mt: 3 }}>
                  Không có bài viết nào.
                </Typography>
              )}
            </Box>
          </Grid>
          {/* Right Column */}
          <Grid item md={4}>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Từ khóa nổi bật</Typography>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <hr style={{ border: 'none', height: '1px', backgroundColor: '#007bff', margin: '1px 0' }} />

              {/* Danh sách Hashtags */}
              <List>
                {listQuestion.map((question) => (
                  <ListItem key={question?.id} sx={{ padding: 0 }}>
                    {question?.hashtag && ( // Kiểm tra nếu có hashtag
                      <Typography variant="h6" sx={{ color: '#007bff', fontSize: '0.8rem' }}>
                        #{question.hashtag} {/* Hiển thị hashtag nếu có */}
                      </Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '20px', // To add space between sections
                backgroundColor: '#fff',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Theo dõi người dùng khác</Typography>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <hr style={{ border: 'none', height: '1px', backgroundColor: '#007bff', margin: '1px 0' }} />

              {/* Follow List */}
              <List>
                {[
                  'Katheryn Winnick',
                  'Katheryn Winnick',
                  'Katheryn Winnick',
                  'Katheryn Winnick',
                  'Katheryn Winnick',
                  'Katheryn Winnick',
                  'Katheryn Winnick',
                ].map((name, index) => (
                  <ListItem key={index} sx={{ padding: 0 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex" alignItems="center">
                        <img
                          src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg" // Replace with the correct image URL path
                          alt={name}
                          style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }}
                        />
                        <Typography variant="h6" sx={{ color: '#007bff', fontSize: '0.8rem' }}>
                          {name}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          padding: '2px 10px',
                          fontSize: '0.8rem',
                          borderRadius: '16px',
                        }}
                      >
                        + Theo dõi
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
            {/* Popular Articles Section */}
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                marginTop: '20px', // Space between sections
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Bài viết nổi bật</Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: '16px',
                    padding: '5px 10px',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                  }}
                >
                  Mới nhất
                </Button>
              </Box>
              <hr style={{ border: 'none', height: '1px', backgroundColor: '#007bff', margin: '1px 0' }} />
              {/* Article List */}

              {articles
                .filter(article => article.isApproved === 1)
                .slice(0, 4)
                .map((article) => (
                  <ListItem key={article.id} sx={{ padding: '10px 0' }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex" alignItems="center" onClick={() => handleCardClick(article.id)}>
                        <img
                          src={article.authorImage || 'http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg'} // Đường dẫn đến ảnh tác giả hoặc ảnh mặc định
                          alt={article.author}
                          style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ color: '#007bff', fontSize: '0.8rem' }}>
                            Tiêu đề: {article.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Số lượt thích: {article.likes} | Số bình luận: {article.comments}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Tác giả: {users?.find(u => article?.user_id === u.id)?.name || 'Không rõ'}
                          </Typography>

                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}


              <hr style={{ border: 'none', height: '1px', backgroundColor: '#007bff', margin: '1px 0' }} />
              <Link
                href="/article"
                underline="none"
                sx={{ color: '#007bff', fontSize: '0.9rem' }}
              >
                <Button
                  variant="text"
                  sx={{
                    display: 'flex',
                    alignItems: 'center', // Để căn icon và chữ ở giữa theo chiều dọc
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    margin: '10px auto 0 auto',
                    color: '#007bff',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#007bff',
                      bottom: '-2px',
                      left: 0,
                      transition: 'width 0.3s ease',
                      // eslint-disable-next-line no-dupe-keys
                      width: 0,
                    },
                    '&:hover:after': {
                      width: '100%',
                    },
                  }}
                >
                  Xem thêm
                  <ChevronRightIcon sx={{ marginLeft: '5px' }} /> {/* Icon > phía sau */}
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ transform: 'translateY(50px)' }} // Điều chỉnh khoảng cách từ phía trên bằng cách di chuyển theo trục Y
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{
            width: '100%',
            border: '1px solid #ccc' // Thêm đường viền 1px với màu #ccc (màu xám nhạt)
          }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DashboardCard>
    </PageContainer >
  );
};

export default Questions;
