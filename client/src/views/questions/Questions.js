/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useRef, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
  Grid,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CodeIcon from '@mui/icons-material/Code';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconMessageCircle } from '@tabler/icons-react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/config/firebaseconfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
const Questions = () => {
  const [imageError, setImageError] = useState('');
  const [fileError, setFileError] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [error, setError] = useState('');
  const [showCodeField, setShowCodeField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false)
  const [listQuestion, setListQuestion] = useState([])
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState(false);
  const [dataTemp,setDataTemp] = useState(null)

  const listUser = useRef([])

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


  useEffect(() => {
    userData.current = JSON.parse(localStorage.getItem('user'));
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        listUser.current = usersList?.length > 0 ? usersList.map(user => ({ 'id': user?.id, 'name': user?.name })) : []

      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {

    const fetchQuestions = async () => {
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
  const validateOtherFile = (files) => {
    const allowedFileTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    for (const file of files) {
      if (!allowedFileTypes.includes(file.type)) {
        console.log(`Tệp ${file.name} không đúng định dạng (chỉ chấp nhận PDF, DOC, DOCX)`);

        return `Tệp ${file.name} không đúng định dạng (chỉ chấp nhận PDF, DOC, DOCX)`;
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

  const handleCodeChange = (e) => {
    setCodeSnippet(e.target.value);
  };

  const handleCodeButtonClick = () => {
    setShowCodeField(true);
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
          createdAt: serverTimestamp(),
        };

        const usersCollection = collection(db, 'questions');
        const res = await addDoc(usersCollection, dataToSubmit);
        setLoading(false)
        setSnackbarOpen(true);
        setSnackbarMessage('Questions uploaded successfully.');
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
          createdAt: serverTimestamp(),
        };

        const docRef = doc(db, 'questions', dataTemp.id);
        await updateDoc(docRef, dataToSubmit);
        setSnackbarOpen(true);
        setSnackbarMessage('Questions updated successfully.');
        setSnackbarSeverity("success");
         setReload(reload=>!reload)
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
  return (
    <PageContainer title="article">
      <DashboardCard>
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item md={8}>
            {/* Main Box for Post Creation */}
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
                  <Typography variant="h6">Tạo bài viết</Typography>
                </Box>

                {/* Post Content */}
                <TextField
                  label="Hãy chia sẻ kiến thức hoặc đặt câu hỏi?"
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
                          onClick={index === 2 ? handleCodeButtonClick : undefined}
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

                  {showCodeField && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel htmlFor="code-input" label="Nhập code của bạn"></InputLabel>
                      <TextField
                        id="code-input"
                        multiline
                        rows={4}
                        name="up_code"
                        variant="outlined"
                        value={codeSnippet}
                        onChange={handleCodeChange}
                      />
                      <FormHelperText>{error}</FormHelperText>
                    </FormControl>
                  )}

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
                    {/* <Box >
                      {!loading && (
                        <CircularProgress sx={{ color: 'white' }}
                          size={20} />
                      )}
                    </Box> */}
                    Đăng
                  </Button>
                </Box>
              </Box>

              {listQuestion?.length > 0 ? (
                listQuestion.map(question => {
                  return <Box
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
                          src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                          width="40px"
                          alt="User Avatar"
                          style={{ borderRadius: '50%', marginRight: '10px' }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {listUser.current.find(user => {
                              return user.id === question?.user_id
                            })?.name || ""}
                          </Typography>
                          <Typography variant="subtitle1" color="textSecondary">
                            11 hrs
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
                            {/* <MenuItem onClick={handleDelete}>Xoá</MenuItem> */}
                            <MenuItem onClick={()=>onEdit(question)}>Sửa</MenuItem>
                          </Menu>
                        </>
                      )}

                    </Box>

                    {/* Content Section */}
                    {edit ? (<Box component="form" mt={2} onSubmit={handleEdit}>
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
                                onClick={index === 2 ? handleCodeButtonClick : undefined}
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

                        {showCodeField && (
                          <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel htmlFor="code-input" label="Nhập code của bạn"></InputLabel>
                            <TextField
                              id="code-input"
                              multiline
                              rows={4}
                              name="up_code"
                              variant="outlined"
                              onChange={handleInputChange}
                              value={dataTemp?.up_code || ''}
                            />
                            <FormHelperText>{error}</FormHelperText>
                          </FormControl>
                        )}

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

                          Sửa
                        </Button>
                      </Box>
                    </Box>) : (
                      <>
                        <Box sx={{ mt: 3, mb: 3 }}>
                          {/* Title Section */}
                          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {question?.questions || ""}
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '5px',
                          }}
                        >
                          {question?.imageUrls?.length > 0 && question?.imageUrls.map((image, index) => (
                            <Box
                              key={index}
                              sx={{
                                flexBasis: ['100%', '48%', '32%'][Math.min(2, index)], // Adjust based on index
                                flexGrow: 1,
                                maxWidth: ['100%', '48%', '32%'][Math.min(2, index)], // Adjust max width based on index
                                mb: 2,
                              }}
                            >
                              <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  borderRadius: '8px',
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
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
                          src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
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
                            She starred as Jane Porter in The @Legend of Tarzan (2016), Tanya Vanderpoel
                            in Whiskey Tango Foxtrot (2016), and as DC Comics villain Harley Quinn in
                            Suicide Squad (2016), for which she was nominated for a Teen Choice Award...
                          </Typography>

                          {/* Like and Reply */}
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2" color="primary" sx={{ cursor: 'pointer' }}>
                              thích • phản hồi
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              23 phút trước
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                })
              ) : (
                <Box>Không có câu hỏi</Box>
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

              {/* List of Hashtags */}
              <List>
                {[
                  '#Nhà trọ gần trường',
                  '#Cà phê làm bài yên tĩnh',
                  '#Câu lạc bộ tại trường',
                  '#Học code clean hơn, logic hơn',
                  '#Học bổng tại trường',
                ].map((hashtag, index) => (
                  <ListItem key={index} sx={{ padding: 0 }}>
                    <ListItemText
                      primary={
                        <Link
                          href="#"
                          underline="none"
                          sx={{ color: '#007bff', fontSize: '0.9rem' }}
                        >
                          {hashtag}
                        </Link>
                      }
                    />
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
                          src="/mnt/data/image.png" // Replace with the correct image URL path
                          alt={name}
                          style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }}
                        />
                        <Link
                          href="#"
                          underline="none"
                          sx={{ color: '#007bff', fontSize: '0.9rem' }}
                        >
                          {name}
                        </Link>
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
                <Typography variant="h6">Bài viết nổi bật</Typography>
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

              {/* Article List */}
              <List>
                {[
                  {
                    title: 'ReactJS Là gì? Và cách thức hoạt động như thế nào?',
                    likes: 100,
                    comments: 50,
                    author: 'Kim Đang.dev',
                  },
                  {
                    title: 'TalkShow: Warmup Cuộc Thi Sáng Tạo Lập Trình Trò Chơi',
                    likes: 100,
                    comments: 50,
                    author: 'Kim Đang.dev',
                  },
                  {
                    title: 'TalkShow: Warmup Cuộc Thi Sáng Tạo Lập Trình Trò Chơi',
                    likes: 100,
                    comments: 50,
                    author: 'Kim Đang.dev',
                  },
                  {
                    title: 'TalkShow: Warmup Cuộc Thi Sáng Tạo Lập Trình Trò Chơi',
                    likes: 100,
                    comments: 50,
                    author: 'Kim Đang.dev',
                  },
                ].map((article, index) => (
                  <ListItem key={index} sx={{ padding: '10px 0' }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex" alignItems="center">
                        <img
                          src="/mnt/data/image.png" // Replace with the correct image URL path
                          alt={article.author}
                          style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }}
                        />
                        <Box>
                          <Link
                            href="#"
                            underline="none"
                            sx={{ color: '#007bff', fontSize: '0.9rem', display: 'block' }}
                          >
                            {article.title}
                          </Link>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Số lượt thích: {article.likes} | Số bình luận: {article.comments}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Tác giả: {article.author}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>

              {/* View More Button */}
              <Button
                variant="text"
                sx={{
                  display: 'block',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  margin: '10px auto 0 auto',
                  color: '#007bff',
                }}
              >
                Xem thêm
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DashboardCard>
    </PageContainer >
  );
};

export default Questions;
