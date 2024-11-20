/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Chọn style mà bạn thích
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
// icon
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GifBoxIcon from '@mui/icons-material/GifBox';
import ImageIcon from '@mui/icons-material/Image';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { IconMessageCircle } from '@tabler/icons-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addQuestion, getQuestionsList, updateQuestion } from 'src/apis/QuestionsApis';
import userApis from 'src/apis/UserApI';
//firebase
import axios from 'axios';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import moment from 'moment';
import { db } from 'src/config/firebaseconfig';

const Questions = () => {
  const navigate = useNavigate();
  // const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [imageError, setImageError] = useState('');
  const [fileError, setFileError] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [error, setError] = useState('');
  const [showCodeField, setShowCodeField] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [listQuestion, setListQuestion] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState(false);
  const [dataTemp, setDataTemp] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const listUser = useRef([]);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentImages, setCommentImages] = useState([]);
  const [commentFiles, setCommentFiles] = useState([]);
  const [newReplies, setNewReplies] = useState({}); // Quản lý phản hồi theo ID bình luận
  const [replyImages, setReplyImages] = useState([]); // Quản lý hình ảnh cho phản hồi
  const [replyFiles, setReplyFiles] = useState([]);
  const storage = getStorage();
  const [replyingToUsername, setReplyingToUsername] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const location = useLocation();
  const { id } = location.state || {};
  const { id: question_id } = useParams();
  const handleToggleComments = (questionId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [questionId]: !prev[questionId], // Toggle visibility for the specific question
    }));
  };

  const handleAddReplyImage = (event, commentId) => {
    const images = event.target.files;
    const imagesArray = Array.from(images);
    setReplyImages(imagesArray); // Cập nhật hình ảnh đã chọn cho phản hồi

    const uploadImages = async () => {
      const uploadedImages = [];
      for (let image of imagesArray) {
        const imageRef = ref(storage, `images/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        uploadedImages.push(url);
      }
      setNewReplies((prev) => ({
        ...prev,
        [commentId]: { ...prev[commentId], imageUrls: uploadedImages },
      }));
    };

    uploadImages();
  };

  const handleAddReplyFile = (event, commentId) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setReplyFiles(filesArray); // Cập nhật tệp đã chọn cho phản hồi
  };

  const handleReplyButtonClick = (comment) => {
    if (replyingTo === comment.id) {
      // Nếu đang trả lời comment này, ẩn form
      setReplyingTo(null);
      setNewReplies((prev) => ({ ...prev, [comment.id]: '' })); // Xóa nội dung trả lời
    } else {
      // Nếu không, thiết lập comment này là comment đang được trả lời
      setReplyingTo(comment.id);
      // Không cần reset newReplies ở đây, vì chỉ có 1 comment id có thể trả lời cùng 1 lúc
    }
  };

  // Lấy danh sách người dùng từ Firestore
  const [currentUserImage, setCurrentUserImage] = useState('');

  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    userData.current = userDataFromLocalStorage;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await userApis.getUsersList()
        if (res.status == "success") {
          setUsers(res?.data.users);
        }
        // Tìm thông tin người dùng hiện tại dựa trên user ID trong localStorage
        // const currentUserInfo = userList.find((user) => user.id === userDataFromLocalStorage?.id);

        // Cập nhật hình ảnh người dùng hiện tại
        // if (currentUserInfo && currentUserInfo.imageUrl) {
        //   setCurrentUserImage(currentUserInfo.imageUrl);
        // } else {
        //   setCurrentUserImage('default-image-url.jpg'); // Hình ảnh mặc định nếu không có
        // }
      } catch (error) {
        console.error('Lỗi khi lấy người dùng:', error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchUsers(); // Gọi hàm lấy người dùng khi component mount
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
        const res = await getQuestionsList();
        if (res.status == 'success') {
          setListQuestion(res?.data?.questions);
        }
      } catch (error) {
        console.error('Error fetching Questionss:', error);
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

  const userData = useRef(null);

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
      setImageError(errorMsg);
    } else {
      setImageError('');
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const errorMsg = validateOtherFile(files);
    if (errorMsg) {
      setFileError(errorMsg);
    } else {
      setFileError(''); // Xóa lỗi nếu hợp lệ
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
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Lấy các tệp ảnh và tệp khác
    const imageFiles = formData.getAll('image');
    const otherFiles = formData.getAll('file');

    if (!imageError && !fileError) {
      try {
        // Nếu có ảnh, upload ảnh lên server
        let imageUrls = [];
        if (imageFiles.length > 0) {
          const uploadImagePromises = imageFiles.filter(file => file.size > 0).map((imageFile) => handleUploadImage(imageFile));
          const allImageUrls = await Promise.all(uploadImagePromises);
          imageUrls = allImageUrls?.map((imgUrl) => (imgUrl.status == 201 ? imgUrl.imagePath : ''));
        }

        let fileUrls = [];
        if (otherFiles.length > 0) {
          const uploadFilePromises = otherFiles.filter(file => file.size > 0).map((file) => handleUploadFile(file));
          fileUrls = await Promise.all(uploadFilePromises);
        }

        delete data.file;
        delete data.image;

        const dataToSubmit = {
          ...data,
          user_id: userData.current.id,
          imageUrls,
          fileUrls,
          isApproved: false, // Mặc định là false
          is_deleted: data.is_deleted || false,
          up_code: dataTemp?.up_code || codeSnippet,
          comments: [],
          replies: [],
        };

        // Gọi API để tạo câu hỏi mới
        const res = await addQuestion(dataToSubmit);

        if (res.status === 'success') {
          // Thông báo khi gửi thành công
          setLoading(false);
          setSnackbarOpen(true);
          setSnackbarMessage('Câu hỏi của bạn đã được gửi, đang chờ quản trị viên phê duyệt.');
          setSnackbarSeverity('success');
          e.target.reset();
          setReload((reload) => !reload);
        } else {
          // Xử lý nếu backend trả về lỗi với mã 400 hoặc các lỗi khác
          setLoading(false);
          setSnackbarOpen(true);
          setSnackbarMessage(res.data?.message || 'Có lỗi khi gửi câu hỏi. Vui lòng kiểm tra lại.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        setLoading(false);

        // Xử lý lỗi khi backend trả về các lỗi không phải 2xx
        console.error('Error:', error.message);
        setSnackbarOpen(true);
        setSnackbarMessage(error.message || 'Có lỗi xảy ra khi gửi câu hỏi. Vui lòng thử lại sau.');
        setSnackbarSeverity('error');
      }
    } else {
      setLoading(false);
      setSnackbarOpen(true);
      setSnackbarMessage('Có lỗi khi tải lên ảnh hoặc tệp.');
      setSnackbarSeverity('error');
    }
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

  const handleAddComment = async (question_id) => {
    try {
      const commentRef = doc(db, 'questions', question_id);
      const commentSnap = await getDoc(commentRef);
      const newCommentId = doc(collection(db, 'commentDetails')).id;
      if (commentSnap.exists()) {
        const commentData = commentSnap.data();
        const newCommentData = {
          id: newCommentId,
          question_id: question_id,
          user_id: userData.current.id,
          content: newComment,
          imageUrls: [],
          fileUrls: [], // Thêm mảng để lưu trữ URL tệp
          created_at: new Date(),
          up_code: dataTemp?.up_code || codeSnippet,
          replies: [],
        };
        // Upload images for the comment
        if (commentImages.length > 0) {
          const images = [];
          for (let image of commentImages) {
            const imageRef = ref(storage, `images/${image.name}`);
            const snapshot = await uploadBytes(imageRef, image);
            const url = await getDownloadURL(snapshot.ref);
            images.push(url);
          }
          newCommentData.imageUrls = images;
        }

        // Upload files for the comment
        if (commentFiles.length > 0) {
          // commentFiles là mảng chứa tệp
          const files = [];
          for (let file of commentFiles) {
            const fileRef = ref(storage, `files/${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const url = await getDownloadURL(snapshot.ref);
            files.push(url);
          }
          newCommentData.fileUrls = files; // Lưu trữ URL tệp vào bình luận
        }

        if (!commentData.comments) {
          commentData.comments = [];
        }
        commentData.comments.push(newCommentData);
        await updateDoc(commentRef, commentData);

        // Cập nhật trạng thái local
        setListQuestion((prevList) => {
          const newList = [...prevList];
          const index = newList.findIndex((item) => item.id === question_id);
          if (index !== -1) {
            console.log('Bình luận mới:', commentData.comments);
            newList[index] = { ...newList[index], comments: commentData.comments };
          }
          return newList;
        });

        setNewComment(''); // Clear comment input
        setCommentImages([]); // Clear images after submission
        setCommentFiles([]); // Clear files after submission

        // Show success notification
        setSnackbarMessage('Bình luận của bạn đã được gửi.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setSnackbarMessage('Đã xảy ra lỗi khi gửi bình luận.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddReply = async (questionId, commentId) => {
    try {
      const commentRef = doc(db, 'questions', questionId);
      const commentSnap = await getDoc(commentRef);

      if (commentSnap.exists()) {
        const commentData = commentSnap.data();
        const newReply = {
          user_id: userData.current.id,
          content: newReplies[commentId] || '',
          imageUrls: [],
          fileUrls: [],
          up_code: dataTemp?.up_code || codeSnippet,
          created_at: new Date(),
        };

        // Upload images for the reply
        if (replyImages.length > 0) {
          const images = await handleUpload(replyImages);
          newReply.imageUrls = images;
        }

        // Upload files for the reply
        if (replyFiles.length > 0) {
          const files = await handleUpload(replyFiles);
          newReply.fileUrls = files;
        }

        // Update the comment with the new reply
        const commentIndex = commentData.comments.findIndex((comment) => comment.id === commentId);
        if (commentIndex !== -1) {
          if (!commentData.comments[commentIndex].replies) {
            commentData.comments[commentIndex].replies = [];
          }
          commentData.comments[commentIndex].replies.push(newReply);
        }

        await updateDoc(commentRef, commentData);
        setListQuestion((prevList) => {
          return prevList.map((item) => {
            if (item.id === questionId) {
              return {
                ...item,
                comments: item.comments.map((comment) => {
                  if (comment.id === commentId) {
                    return {
                      ...comment,
                      replies: [...(comment.replies || []), newReply], // Thêm phản hồi mới
                    };
                  }
                  return comment;
                }),
              };
            }
            return item;
          });
        });

        setNewReplies((prev) => ({
          ...prev,
          [commentId]: '', // Clear reply input
        }));
        setReplyingTo(null); // Ẩn ô nhập
        setReplyImages([]); // Clear reply images after submission
        setReplyFiles([]); // Clear reply files after submission

        setSnackbarMessage('Trả lời của bạn đã được gửi.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      setSnackbarMessage('Đã xảy ra lỗi khi gửi phản hồi.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

        const dataToSubmit = {
          ...data,
          imageUrls: imageUrls.length > 0 ? imageUrls : dataTemp.imageUrls,
          fileUrls: fileUrls.length > 0 ? fileUrls : dataTemp.fileUrls,
          isApproved: false,
          is_deleted: data.is_deleted || false,
          up_code: dataTemp?.up_code || codeSnippet,
        };

        // Gọi API cập nhật câu hỏi
        const res = await updateQuestion(dataTemp.id, dataToSubmit);

        if (res.status === 'success') {
          // Thông báo khi cập nhật thành công
          setLoading(false);
          setSnackbarOpen(true);
          setSnackbarMessage('Câu hỏi đã được cập nhật thành công.');
          setSnackbarSeverity('success');
          setReload((reload) => !reload);
          setEdit(false);
          e.target.reset();
        } else {
          // Xử lý lỗi khi API trả về mã lỗi 400
          setLoading(false);
          setSnackbarOpen(true);
          setSnackbarMessage(res.data?.message || 'Có lỗi khi cập nhật câu hỏi. Vui lòng thử lại.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        setLoading(false);

        setSnackbarOpen(true);
        setSnackbarMessage(error.message || 'Có lỗi xảy ra khi cập nhật câu hỏi. Vui lòng thử lại sau.');
        setSnackbarSeverity('error');
      }
    } else {
      setLoading(false);
      setSnackbarOpen(true);
      setSnackbarMessage('Có lỗi khi tải lên ảnh hoặc tệp.');
      setSnackbarSeverity('error');
    }
  };


  const onEdit = (data) => {
    setAnchorEl(null);
    setEdit(true);
    setDataTemp(data);
  };

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
      setError('Vui lòng nhập code!');
      return;
    } else {
      setError('');
      // Thực hiện lưu giá trị codeSnippet vào trạng thái chính
      setDataTemp((prevData) => ({
        ...prevData,
        up_code: codeSnippet, // Lưu code vào dataTemp
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
      const date = new Date(updatedAt);
      const now = new Date();
      const diff = now - date;

      const seconds = Math.floor(diff / 1000);
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
    <PageContainer title="Hãy đặt câu hỏi hoặc chia sẻ kiến thức | Share Code" description="Đây là trang đặt câu hỏi">
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
                    // eslint-disable-next-line no-undef
                    src={userData?.current?.imageUrl || '../../assets/images/profile/user-1.jpg'}
                    alt="avatar"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      marginRight: 8,
                    }}
                  />
                  <Typography variant="h6">Đặt câu hỏi</Typography>
                </Box>

                {/* Post Content */}
                <TextField
                  label="Hãy đặt câu hỏi hoặc chia sẻ kiến thức ?"
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
                  .sort((a, b) =>
                    moment(a.updatedAt).unix() < moment(b.updatedAt).unix() ? 1 : -1,
                  )
                  .map((question) => {
                    console.log(question)
                    const listImgUrl = question.imageUrls;
                    const listFileUrl = question.fileUrls;
                    return (
                      question.isApproved == true && (
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
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Box display="flex" alignItems="center">
                              <img
                                src={
                                  users?.find((u) => question?.user_id === u.id)?.imageUrl ||
                                  '../../assets/images/profile/user-1.jpg'
                                }
                                alt="Author"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  marginRight: 8,
                                }}
                              />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                  <strong>
                                    {users?.find((u) => question?.user_id === u.id)?.name}
                                  </strong>
                                </Typography>
                                <Typography variant="body2">
                                  {formatUpdatedAt(question.updatedAt)}
                                </Typography>
                              </Box>
                            </Box>
                            {question?.user_id === userData.current?.id && (
                              <>
                                <Tooltip title="Options">
                                  <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
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
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                              >
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
                                {showCodeField && (
                                  <Dialog
                                    open={showCodeDialog}
                                    onClose={handleCloseDialog}
                                    maxWidth="sm"
                                    fullWidth
                                  >
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
                                  {question?.questions || ''}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {question?.hashtag && (
                                  <Typography
                                    variant="h6"
                                    sx={{ color: '#007bff', fontSize: '0.8rem' }}
                                  >
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
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  justifyContent: 'center',
                                  gap: '5px',
                                }}
                              >
                                {listImgUrl.length > 0 &&
                                  listImgUrl.map((image, index) => (
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
                                        src={image || '../../assets/images/profile/user-1.jpg'}
                                        alt=""
                                        style={{
                                          width: '100%',
                                          height: 'auto',
                                          borderRadius: '8px',
                                        }}
                                      />
                                    </Box>
                                  ))}
                              </Box>
                              {listFileUrl && listFileUrl.length > 0 && (
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
                                    {listFileUrl.map((url, index) => {
                                      const fileName = decodeURIComponent(url)
                                        .split('/')
                                        .pop()
                                        .split('?')[0];
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
                          {/* Like and Comment Buttons */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <IconButton>
                              <FavoriteBorderIcon />
                            </IconButton>
                            <Typography variant="body2">Thích</Typography>
                            <IconButton
                              sx={{ ml: 2 }}
                              onClick={() => handleToggleComments(question.id)}
                            >
                              <IconMessageCircle />
                            </IconButton>
                            <Typography variant="body2">
                              Bình luận ({question.comments?.length || 0})
                            </Typography>
                          </Box>
                          {/* Comment Section */}
                          {visibleComments[question.id] && (
                            <Box sx={{ mt: 3, mb: 3 }}>
                              {/* Comment Input */}
                              <Box
                                sx={{
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                {/* Avatar và Text Input */}
                                <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                                  <img
                                    src={
                                      users?.find((u) => question?.user_id === u.id)?.imageUrl ||
                                      '../../assets/images/profile/user-1.jpg'
                                    } // Đường dẫn đến ảnh tác giả hoặc ảnh mặc định
                                    alt="User Avatar"
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '50%',
                                      marginRight: 8,
                                    }}
                                  />
                                  <TextField
                                    placeholder={`Bình luận dưới tên ${users.find((user) => user.id === userData.current.id)?.name ||
                                      'Người dùng'
                                      } `}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{
                                      backgroundColor: '#f0f0f0',
                                    }}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                  />
                                </Box>

                                {/* Hàng biểu tượng cho Emojis, GIFs, Hình ảnh */}
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  sx={{
                                    width: '100%',
                                    gap: 1,
                                    marginRight: '345px',
                                    marginTop: '-20px',
                                  }}
                                >
                                  <IconButton>
                                    <InsertEmoticonIcon fontSize="medium" />
                                  </IconButton>
                                  <IconButton>
                                    <SentimentSatisfiedAltIcon fontSize="medium" />
                                  </IconButton>
                                  <IconButton>
                                    <InsertPhotoIcon fontSize="medium" />
                                  </IconButton>
                                  <IconButton>
                                    <CameraAltIcon fontSize="medium" />
                                  </IconButton>
                                  <IconButton>
                                    <GifBoxIcon fontSize="medium" />
                                  </IconButton>
                                </Box>

                                {/* File input cho hình ảnh */}
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  sx={{ width: '100%', marginLeft: ' 80px', marginTop: '-10px' }}
                                >
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
                                            onChange={(e) => setCommentImages(e.target.files)}
                                          />
                                        )}
                                        {index === 1 && (
                                          <input
                                            type="file"
                                            name="file"
                                            multiple
                                            hidden
                                            onChange={(e) => setCommentFiles(e.target.files)}
                                          />
                                        )}
                                      </Button>
                                    ))}
                                  </Box>

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
                                      marginRight: '45px',
                                    }}
                                    onClick={() =>
                                      handleAddComment(question.id, newComment, commentImages)
                                    }
                                  >
                                    Gửi
                                  </Button>
                                </Box>

                                {/* Code Dialog */}
                                <Dialog
                                  open={showCodeDialog}
                                  onClose={handleCloseDialog}
                                  maxWidth="sm"
                                  fullWidth
                                >
                                  <DialogTitle>Nhập code của bạn</DialogTitle>
                                  <DialogContent>
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
                              </Box>
                              <hr></hr>
                              {/* Displaying Comments */}
                              {question.comments?.map((comment) => (
                                <Box key={comment.id} sx={{ mt: 2 }}>
                                  <Box display="flex" alignItems="center">
                                    <img
                                      src={
                                        currentUserImage || '../../assets/images/profile/user-1.jpg'
                                      }
                                      alt="Commenter Avatar"
                                      style={{ borderRadius: '50%', marginRight: '10px' }}
                                      width="30px"
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                      {users.find((user) => user.id === comment.user_id)?.name}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mt: 1,
                                      fontSize: '1.2rem',
                                      fontWeight: '400',
                                      lineHeight: '1.5',
                                    }}
                                  >
                                    {comment.content}
                                  </Typography>

                                  {comment.up_code && (
                                    <Box sx={{ mt: 1 }}>
                                      <SyntaxHighlighter language="javascript" style={dracula}>
                                        {comment.up_code}
                                      </SyntaxHighlighter>
                                    </Box>
                                  )}
                                  {/* Render Images if available */}
                                  {comment.imageUrls?.length > 0 && (
                                    <Box
                                      sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: '5px' }}
                                    >
                                      {comment.imageUrls.map((imageUrl, index) => (
                                        <Box
                                          key={index}
                                          sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}
                                        >
                                          <img
                                            src={
                                              imageUrl || '../../assets/images/profile/user-1.jpg'
                                            }
                                            alt={`Comment image ${index + 1}`}
                                            style={{
                                              width: '35%',
                                              height: 'auto',
                                              borderRadius: '8px',
                                              objectFit: 'contain',
                                            }}
                                          />
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                  {comment.fileUrls?.length > 0 && (
                                    <Box
                                      sx={{
                                        mt: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                      }}
                                    >
                                      {comment.fileUrls.map((fileUrl, index) => {
                                        const fileName = decodeURIComponent(fileUrl)
                                          .split('/')
                                          .pop()
                                          .split('?')[0];
                                        return (
                                          <Box
                                            key={index}
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              padding: '8px 16px',
                                              border: '1px solid #e0e0e0',
                                              borderRadius: '8px',
                                              backgroundColor: '#fff',
                                              width: 'fit-content',
                                            }}
                                          >
                                            <IconButton sx={{ color: '#007bff', padding: '0' }}>
                                              <DescriptionIcon />
                                            </IconButton>
                                            <Typography
                                              component="a"
                                              href={fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              sx={{
                                                marginLeft: '8px',
                                                color: '#333',
                                                textDecoration: 'none',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                wordBreak: 'break-all',
                                              }}
                                            >
                                              {fileName}
                                            </Typography>
                                          </Box>
                                        );
                                      })}
                                    </Box>
                                  )}
                                  {/* Reply Button */}
                                  <Button
                                    variant="text"
                                    sx={{
                                      textTransform: 'none',
                                      padding: '2px 10px',
                                      fontSize: '0.8rem',
                                      borderRadius: '16px',
                                      marginRight: '10px',
                                    }}
                                    onClick={() => handleReplyButtonClick(comment)} // Toggle reply form
                                  >
                                    {replyingTo === comment.id ? 'Hủy' : 'Trả lời'}
                                  </Button>
                                  {/* Reply Section */}
                                  {replyingTo === comment.id && (
                                    <Box sx={{ mt: 2 }}>
                                      <Box display="flex" alignItems="center">
                                        <img
                                          src={
                                            currentUserImage ||
                                            '../../assets/images/profile/user-1.jpg'
                                          }
                                          width="30px"
                                          alt="User  Avatar"
                                          style={{ borderRadius: '50%', marginRight: '10px' }}
                                        />
                                        <TextField
                                          placeholder={`Trả lời dưới tên ${users.find((user) => user.id === userData.current.id)
                                            ?.name || 'Người dùng'
                                            }`}
                                          variant="outlined"
                                          size="small"
                                          fullWidth
                                          value={newReplies[comment.id] || ''} // Lấy nội dung trả lời cho bình luận cụ thể
                                          onChange={(e) =>
                                            setNewReplies((prev) => ({
                                              ...prev,
                                              [comment.id]: e.target.value,
                                            }))
                                          } // Cập nhật nội dung trả lời cho bình luận cụ thể
                                        />
                                      </Box>

                                      <Box
                                        display="flex"
                                        justifyContent="center"
                                        sx={{
                                          width: '100%',
                                          gap: 1,
                                          marginLeft: '-174px',
                                          marginTop: '-2px',
                                        }}
                                      >
                                        <IconButton>
                                          <InsertEmoticonIcon fontSize="medium" />
                                        </IconButton>
                                        <IconButton>
                                          <SentimentSatisfiedAltIcon fontSize="medium" />
                                        </IconButton>
                                        <IconButton>
                                          <InsertPhotoIcon fontSize="medium" />
                                        </IconButton>
                                        <IconButton>
                                          <CameraAltIcon fontSize="medium" />
                                        </IconButton>
                                        <IconButton>
                                          <GifBoxIcon fontSize="medium" />
                                        </IconButton>
                                      </Box>

                                      {/* Options for Image, File, Code */}
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{
                                          width: '100%',
                                          marginLeft: ' 40px',
                                          marginTop: '2px',
                                        }}
                                      >
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
                                              onClick={
                                                index === 2 ? handleCodeButtonClick : undefined
                                              }
                                            >
                                              {label}
                                              {index === 0 && (
                                                <input
                                                  name="image"
                                                  type="file"
                                                  accept="image/*"
                                                  multiple
                                                  hidden
                                                  onChange={(e) =>
                                                    handleAddReplyImage(e, comment.id)
                                                  } // Xử lý hình ảnh đính kèm cho phản hồi
                                                />
                                              )}
                                              {index === 1 && (
                                                <input
                                                  type="file"
                                                  name="file"
                                                  multiple
                                                  hidden
                                                  onChange={(e) =>
                                                    handleAddReplyFile(e, comment.id)
                                                  } // Xử lý tệp đính kèm cho phản hồi
                                                />
                                              )}
                                            </Button>
                                          ))}
                                        </Box>

                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() => handleAddReply(question.id, comment.id)} // Gửi phản hồi
                                          sx={{ marginRight: '40px' }}
                                        >
                                          Gửi
                                        </Button>
                                      </Box>
                                      <Dialog
                                        open={showCodeDialog}
                                        onClose={handleCloseDialog}
                                        maxWidth="sm"
                                        fullWidth
                                      >
                                        <DialogTitle>Nhập code của bạn</DialogTitle>
                                        <DialogContent>
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
                                    </Box>
                                  )}
                                  {/* Displaying Replies */}
                                  {comment.replies?.map((reply) => (
                                    <Box key={reply.id} sx={{ pl: 4, mt: 2 }}>
                                      <Box display="flex" alignItems="center">
                                        <img
                                          src={
                                            currentUserImage ||
                                            '../../assets/images/profile/user-1.jpg'
                                          }
                                          alt="Commenter Avatar"
                                          style={{ borderRadius: '50%', marginRight: '10px' }}
                                          width="20px"
                                        />
                                        <Typography variant="h8" sx={{ fontWeight: 'bold' }}>
                                          {users.find((user) => user.id === reply.user_id)?.name}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          mt: 1,
                                          fontSize: '1.2rem',
                                          fontWeight: '400',
                                          lineHeight: '1.5',
                                        }}
                                      >
                                        {reply.content}
                                      </Typography>
                                      {reply.up_code && (
                                        <Box sx={{ mt: 1 }}>
                                          <SyntaxHighlighter language="javascript" style={dracula}>
                                            {reply.up_code}
                                          </SyntaxHighlighter>
                                        </Box>
                                      )}
                                      {/* Hiển Thị Hình Ảnh Đính Kèm Phản Hồi */}
                                      {reply.imageUrls?.length > 0 && (
                                        <Box
                                          sx={{
                                            mt: 1,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '5px',
                                          }}
                                        >
                                          {reply.imageUrls.map((imageUrl, index) => (
                                            <Box
                                              key={index}
                                              sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}
                                            >
                                              <img
                                                src={
                                                  imageUrl ||
                                                  '../../assets/images/profile/user-1.jpg'
                                                }
                                                alt={`Reply image ${index + 1}`}
                                                style={{
                                                  width: '35%',
                                                  height: 'auto',
                                                  borderRadius: '8px',
                                                  objectFit: 'contain',
                                                }}
                                              />
                                            </Box>
                                          ))}
                                        </Box>
                                      )}

                                      {/* Hiển Thị Tệp Đính Kèm Phản Hồi */}
                                      {reply.fileUrls?.length > 0 && (
                                        <Box
                                          sx={{
                                            mt: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                          }}
                                        >
                                          {reply.fileUrls.map((fileUrl, index) => {
                                            const fileName = decodeURIComponent(fileUrl)
                                              .split('/')
                                              .pop()
                                              .split('?')[0];
                                            return (
                                              <Box
                                                key={index}
                                                sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  padding: '8px 16px',
                                                  border: '1px solid #e0e0e0',
                                                  borderRadius: '8px',
                                                  backgroundColor: '#fff',
                                                  width: 'fit-content',
                                                }}
                                              >
                                                <IconButton sx={{ color: '#007bff', padding: '0' }}>
                                                  <DescriptionIcon />
                                                </IconButton>
                                                <Typography
                                                  component="a"
                                                  href={fileUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  sx={{
                                                    marginLeft: '8px',
                                                    color: '#333',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    wordBreak: 'break-all',
                                                  }}
                                                >
                                                  {fileName}
                                                </Typography>
                                              </Box>
                                            );
                                          })}
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )
                    );
                  })
              ) : (
                <Typography variant="h6" align="center" sx={{ mt: 3 }}>
                  Không có câu hỏi nào.
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
              <hr
                style={{
                  border: 'none',
                  height: '1px',
                  backgroundColor: '#007bff',
                  margin: '1px 0',
                }}
              />

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
              <hr
                style={{
                  border: 'none',
                  height: '1px',
                  backgroundColor: '#007bff',
                  margin: '1px 0',
                }}
              />

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
                          src="../../assets/images/profile/user-1.jpg" // Replace with the correct image URL path
                          alt="avatar"
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
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                  Khóa học nổi bật
                </Typography>
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
              <hr
                style={{
                  border: 'none',
                  height: '1px',
                  backgroundColor: '#007bff',
                  margin: '1px 0',
                }}
              />
              {/* Article List */}
              {articles
                .filter((article) => article.isApproved === true)
                .slice(0, 4)
                .map((article) => (
                  <ListItem key={article.id} sx={{ padding: '10px 0' }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        onClick={() => handleCardClick(article.id)}
                      >
                        <img
                          src={
                            users?.find((u) => article?.user_id === u.id)?.imageUrl ||
                            '../../assets/images/profile/user-1.jpg'
                          } // Đường dẫn đến ảnh tác giả hoặc ảnh mặc định
                          alt="avatar"
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
                            Tác giả:{' '}
                            {users?.find((u) => article?.user_id === u.id)?.name || 'Không rõ'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}

              <hr
                style={{
                  border: 'none',
                  height: '1px',
                  backgroundColor: '#007bff',
                  margin: '1px 0',
                }}
              />
              <Link href="/article" underline="none" sx={{ color: '#007bff', fontSize: '0.9rem' }}>
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
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              width: '100%',
              border: '1px solid #ccc', // Thêm đường viền 1px với màu #ccc (màu xám nhạt)
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DashboardCard>
    </PageContainer>
  );
};

export default Questions;
