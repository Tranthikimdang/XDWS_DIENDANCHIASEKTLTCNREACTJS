import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  TextField,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  Menu,
  MenuItem,
  Snackbar,
  Tooltip,
  InputAdornment,
  ButtonBase,
} from '@mui/material';
import { IconHeart, IconMessageCircle } from '@tabler/icons';
//thư viện hổ trợ up_code
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
//icon upfile
import DescriptionIcon from '@mui/icons-material/Description';
//api
import QuestionsApis from 'src/apis/QuestionsApis'; // API để lấy câu hỏi
import UsersApis from 'src/apis/UserApI'; // API để lấy thông tin người dùng
// Images
import avatardefault from 'src/assets/images/profile/user-1.jpg';
// icon
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GifBoxIcon from '@mui/icons-material/GifBox';
import ImageIcon from '@mui/icons-material/Image';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { addQuestion, getQuestionsList, updateQuestion } from 'src/apis/QuestionsApis';
import SearchIcon from '@mui/icons-material/Search';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [user, setUser] = useState([]); // Lưu thông tin người dùng
  const [users, setUsers] = useState([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [currentUserImage, setCurrentUserImage] = useState('');
  const userData = useRef(null);
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
  const location = useLocation();
  const { id } = location.state || {};
  const { id: question_id } = useParams();
  const [imageFile, setImageFile] = useState('');
  const [file, setFile] = useState('');
  const [replyImageFile, setReplyImageFile] = useState('');
  const [replyFile, setReplyFile] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [hashtag, setHashtag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => setIsExpanded(!isExpanded);
  const [showCodeField, setShowCodeField] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [error, setError] = useState('');
  const [dataTemp, setDataTemp] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [questions, setListQuestion] = useState([]);
  const [reload, setReload] = useState(false);

  const handleToggleComments = (questionId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [questionId]: !prev[questionId], // Toggle visibility for the specific question
    }));
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái để theo dõi xem người dùng đã đăng nhập hay chưa

  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (userDataFromLocalStorage) {
      setIsLoggedIn(true); // Nếu có dữ liệu người dùng, đặt trạng thái là đã đăng nhập
    }
  }, []);

  const handleAddReplyImage = async (event, commentId) => {
    const images = event.target.files;
    const imagesArray = Array.from(images);

    const uploadedImages = [];
    for (let image of imagesArray) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const response = await axios.post('http://localhost:3000/api/uploads', formData);
        console.log('Image upload response:', response.data);
        uploadedImages.push(response.data.imagePaths[0]); // Ensure the correct path from response
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    setNewReplies((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        imageUrls: (prev[commentId]?.imageUrls || []).concat(uploadedImages),
      },
    }));
  };

  const handleAddReplyFile = async (event, commentId) => {
    const files = event.target.files;
    const filesArray = Array.from(files);

    const uploadedFiles = [];
    for (let file of filesArray) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:3000/api/upload-files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File upload response:', response.data);
        if (response.data && Array.isArray(response.data.filePaths)) {
          uploadedFiles.push(...response.data.filePaths);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setNewReplies((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        fileUrls: (prev[commentId]?.fileUrls || []).concat(uploadedFiles),
      },
    }));
  };

  // Lấy dữ liệu câu hỏi và người dùng
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true);
      try {
        // Fetch câu hỏi và bình luận từ API
        const questionResponse = await QuestionsApis.getQuestionId(questionId);
        const fetchedQuestion = questionResponse.data.question;

        // Fetch thông tin người dùng nếu cần
        const userId = fetchedQuestion.user_id;
        if (userId) {
          const userResponse = await UsersApis.getUserId(userId);
          setUser(userResponse.data.user);
        }

        const savedComments = JSON.parse(localStorage.getItem('comment_question')) || [];
        fetchedQuestion.comments = savedComments.find(
          (item) => item.id === Number(questionId),
        ).comments;
        console.log(fetchedQuestion);

        // Cập nhật state câu hỏi
        setQuestion(fetchedQuestion);

        // Cập nhật danh sách câu hỏi
        setListQuestion((prevQuestions) => {
          const updatedQuestions = prevQuestions.map((q) =>
            q.id === questionId ? fetchedQuestion : q,
          );
          return updatedQuestions;
        });
      } catch (error) {
        console.error('Error fetching question or user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [questionId]);
  // Lấy danh sách người dùng từ Firestore
  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    userData.current = userDataFromLocalStorage;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await UsersApis.getUsersList();
        if (res.status === 'success') {
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

  const handleCodeChange = (event) => {
    setCodeSnippet(event.target.value);
    setError('');
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
  const handleSnackbarClose = (event, reason) => {
    setSnackbarOpen(false);
  };
  const sensitiveWords = [
    // Xúc phạm trí tuệ
    'ngu',
    'ngu ngốc',
    'ngu si',
    'dốt',
    'dốt nát',
    'đần',
    'đần độn',
    'hâm',
    'khùng',
    'điên',
    'đồ ngu',
    'đồ dốt',
    'thiểu năng',
    'chậm hiểu',
    'đần thối',
    'hâm hấp',
    'óc',
    'con',

    // Xúc phạm nhân phẩm
    'mất dạy',
    'vô học',
    'đồ chó',
    'đồ điếm',
    'con điếm',
    'lừa đảo',
    'bẩn thỉu',
    'rác rưởi',
    'hèn mọn',
    'vô liêm sỉ',
    'mặt dày',
    'khốn nạn',
    'đồ khốn',
    'thất đức',
    'kẻ thù',
    'phản bội',
    'vô dụng',
    'đáng khinh',
    'nhục nhã',

    // Chửi tục thô lỗ
    'địt',
    'đụ',
    'lồn',
    'buồi',
    'chịch',
    'cặc',
    'đéo',
    'vãi lồn',
    'vãi buồi',
    'đái',
    'ỉa',
    'đéo mẹ',
    'đéo biết',
    'mẹ kiếp',
    'chết mẹ',
    'chết tiệt',
    'cái lồn',
    'cái buồi',
    'cái đít',
    'mặt lồn',
    'mặt c*',

    // Xúc phạm gia đình
    'bố mày',
    'mẹ mày',
    'ông mày',
    'bà mày',
    'con mày',
    'chó má',
    'cút mẹ',
    'xéo mẹ',
    'bố láo',
    'đồ mất dạy',
    'không biết điều',
    'con hoang',
    'đồ rẻ rách',
    'đồ phế thải',
    'đồ vô ơn',

    // Từ viết tắt thô tục
    'dm',
    'vcl',
    'vkl',
    'clgt',
    'vl',
    'cc',
    'dcm',
    'đmm',
    'dkm',
    'vãi cả lồn',
    'vc',
    'đb',

    // Kích động/hạ bệ
    'đập chết',
    'cút xéo',
    'đâm đầu',
    'tự tử',
    'biến đi',
    'mày đi chết đi',
    'vô giá trị',
    'không xứng đáng',
    'đồ thừa',
    'kẻ vô ơn',
    'đồ bất tài',

    // Các từ vùng miền hoặc ẩn ý tiêu cực
    'mất nết',
    'dơ dáy',
    'đồ rác',
    'đồ hèn',
    'hết thuốc',
    'chó cắn',
    'ngu như bò',
    'câm mồm',
    'hèn hạ',
    'ngu xuẩn',
    'đồ quỷ',
    'đồ xấu xa',
    'đồ ác độc',
  ];

  const containsSensitiveWords = (text) => {
    return sensitiveWords.some((word) => text.includes(word));
  };

  const handleAddComment = async (question_id) => {
    try {
      if (!isLoggedIn) {
        setSnackbarMessage("Vui lòng đăng nhập để bình luận.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return; // Ngừng thực hiện hàm nếu người dùng chưa đăng nhập
      }
      if (!userData?.current?.id) {
        setSnackbarMessage('Bạn cần đăng nhập để gửi bình luận.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }
      if (!newComment || newComment.trim() === '') {
        setSnackbarMessage('Nội dung bình luận không được để trống.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      if (containsSensitiveWords(newComment)) {
        setSnackbarMessage('Nội dung bình luận không hợp lệ.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      let imageUrl = [];
      let fileUrl = [];

      // Upload image if available
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);
        const imageResponse = await axios.post("http://localhost:3000/api/upload", formDataImage);
        if (imageResponse.data && imageResponse.data.imagePath) {
          imageUrl = [imageResponse.data.imagePath]; // Ensure it's an array
        }
      }

      // Upload file if available
      if (file) {
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        const fileResponse = await axios.post("http://localhost:3000/api/upload-files", formDataFile);
        if (fileResponse.data && fileResponse.data.filePaths) { // Change filePath to filePaths
          fileUrl = fileResponse.data.filePaths; // Ensure it's an array
        }
      }

      const newCommentData = {
        question_id,
        user_id: userData.current.id,
        content: newComment || '', // Optional content
        imageUrls: imageUrl,        // Optional image, should be an array
        fileUrls: fileUrl,          // Optional file, should be an array
        created_at: new Date(),
        updated_at: new Date(),
        up_code: dataTemp?.up_code || codeSnippet || '', // Optional up_code
        replies: []
      };


      const response = await axios.post('http://localhost:3000/api/comments', newCommentData);
      if (response.data.status === 'success') {
        const comment = response.data.data.comment;

        // Cập nhật LocalStorage
        const savedComments = JSON.parse(localStorage.getItem('comment_question')) || [];
        const questionIndex = savedComments.findIndex((item) => item.id === question_id);
        if (questionIndex !== -1) {
          savedComments[questionIndex].comments.push(comment);
        } else {
          savedComments.push({ id: question_id, comments: [comment] });
        }

        // Lưu lại bình luận vào LocalStorage
        localStorage.setItem('comment_question', JSON.stringify(savedComments));

        // Cập nhật setListQuestion đồng bộ với LocalStorage
        setListQuestion((prevQuestions) => {
          const updatedQuestions = prevQuestions.map((item) => {
            return item.id === question_id ? { ...item, comments: item.comments } : item;
          });
          return updatedQuestions;
        });

        // Cập nhật chi tiết câu hỏi (state của câu hỏi đang xem)
        setQuestion((prevQuestion) => ({
          ...prevQuestion,
          comments: [...(prevQuestion.comments || []), comment],
        }));

        setNewComment('');
        setCommentImages([]);
        setCommentFiles([]);
        setImageFile(null);
        setFile(null);

        setSnackbarMessage('Bình luận của bạn đã được gửi.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setSnackbarMessage('Đã xảy ra lỗi khi gửi bình luận.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddReply = async (questionId, commentId, parentId = null) => {
    if (!userData?.current?.id) {
      setSnackbarOpen(false);
      setTimeout(() => {
        setSnackbarMessage('Bạn cần đăng nhập để gửi trả lời.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
      }, 100);
      return;
    }
    const replyContent = newReplies[parentId || commentId]?.content;
    if (!replyContent || typeof replyContent !== 'string' || replyContent.trim() === '') {
      setSnackbarMessage('Nội dung phản hồi không được để trống.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsSubmittingReply(false);
      return;
    }
    if (containsSensitiveWords(replyContent)) {
      setSnackbarMessage('Nội dung phản hồi không hợp lệ.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    try {
      let imageUrls = [];
      let fileUrls = [];
      if (newReplies[parentId || commentId]?.imageUrls) {
        imageUrls = newReplies[parentId || commentId].imageUrls;
      }
      if (newReplies[parentId || commentId]?.fileUrls) {
        fileUrls = newReplies[parentId || commentId].fileUrls;
      }
      const newReply = {
        user_id: userData.current.id,
        content: replyContent,
        imageUrls: imageUrls,
        fileUrls: fileUrls,
        up_code: dataTemp?.up_code || codeSnippet || '',
        created_at: new Date(),
      };
      const response = await axios.post(
        `http://localhost:3000/api/comments/${commentId}/replies`,
        newReply,
      );
      if (response.data.status === 'success') {
        const reply = response.data.data.reply;

        // Update localStorage
        const savedComments = JSON.parse(localStorage.getItem('comment_question')) || [];
        const questionIndex = savedComments.findIndex((item) => item.id === questionId);
        if (questionIndex !== -1) {
          const comments = savedComments[questionIndex].comments.map((comment) => {
            if (comment.id === commentId) {
              const repliesArray = Array.isArray(comment.replies) ? comment.replies : [];
              return { ...comment, replies: [...repliesArray, reply] };
            }
            return comment;
          });
          savedComments[questionIndex].comments = comments;
        }
        localStorage.setItem('comment_question', JSON.stringify(savedComments));

        // Update state in both components
        setListQuestion((prevList) =>
          prevList.map((item) => {
            if (item.id === questionId) {
              return {
                ...item,
                comments: item.comments.map((comment) => {
                  if (comment.id === commentId) {
                    const repliesArray = Array.isArray(comment.replies) ? comment.replies : [];
                    return { ...comment, replies: [...repliesArray, reply] };
                  }
                  return comment;
                }),
              };
            }
            return item;
          }),
        );

        // Update state in the detail view
        setQuestion((prevQuestion) => ({
          ...prevQuestion,
          comments: prevQuestion.comments.map((comment) => {
            if (comment.id === commentId) {
              const repliesArray = Array.isArray(comment.replies) ? comment.replies : [];
              return { ...comment, replies: [...repliesArray, reply] };
            }
            return comment;
          }),
        }));

        setNewReplies((prev) => ({
          ...prev,
          [parentId || commentId]: { content: '', imageUrls: [], fileUrls: [] },
        }));
        setReplyingTo(null);
        setReplyImageFile(null);
        setReplyFile(null);
        setSnackbarMessage('Trả lời của bạn đã được gửi.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      setSnackbarMessage('Đã xảy ra lỗi khi gửi phản hồi.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingReply(false);
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

  // Nếu đang tải dữ liệu, hiển thị vòng tròn loading
  if (loading) return <CircularProgress />;

  // Nếu không có câu hỏi, hiển thị thông báo lỗi
  if (!question) return <Typography>Câu hỏi không tồn tại hoặc đã bị xóa.</Typography>;

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={3}>
        {/* Cột bên trái: Thông tin người dùng */}
        <Grid
          item
          xs={2}
          sx={{
            position: 'sticky',
            top: '85px',
            backgroundColor: 'white',
            zIndex: 1,
            padding: '16px',
          }}
        >
          <Typography variant="subtitle1">{user?.name || 'Chưa có tên'}</Typography>
          <Typography variant="body2" color="textSecondary">
            Lập trình là đam mê
          </Typography>
          <Divider sx={{ marginTop: '10px' }} />
          <Box sx={{ marginTop: '10px' }}>
            <IconButton aria-label="like">
              <IconHeart />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '-6px' }}>
              15
            </Typography>
            <IconButton aria-label="comments" sx={{ marginLeft: '16px' }}>
              <IconMessageCircle />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '-6px' }}>
              ({question.comments?.length || 0})
            </Typography>
          </Box>
        </Grid>

        {/* Cột bên phải: Nội dung câu hỏi */}
        <Grid item xs={10}>
          <Box display="flex" alignItems="center" mb={2}>
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Ảnh người dùng"
                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
              />
            ) : (
              <div
                style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ccc' }}
              />
            )}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <strong>{user?.name || 'Chưa có tên'}</strong>
              </Typography>
              <Typography variant="body2">{formatUpdatedAt(question.updatedAt)}</Typography>
            </Box>
          </Box>

          {/* Hiển thị tiêu đề câu hỏi nếu có */}
          {question.title && (
            <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
              {question.title}
            </Typography>
          )}
          {/* Hiển thị hashtag nếu có */}
          {question.hashtag && (
            <Box sx={{ marginTop: '20px' }}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  color: '#007bff',
                  display: 'inline-block',
                }}
              >
                {question.hashtag || 'Chưa rõ chuyên mục'}
              </Typography>
            </Box>
          )}

          {/* Hiển thị nội dung câu hỏi nếu có */}
          {question.questions && (
            <Typography variant="body1" paragraph>
              {question.questions}
            </Typography>
          )}
          {/* Hiển thị up_code nếu có */}
          {question.up_code && (
            <>
              <SyntaxHighlighter language="javascript" style={dracula}>
                {question.up_code}
              </SyntaxHighlighter>
              <Divider sx={{ mb: 2 }} />
            </>
          )}
          {/* Hiển thị file nếu có */}
          {question.fileUrls.length > 0 && (
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

          {/* Hiển thị hình ảnh câu hỏi nếu có */}
          {question.imageUrls?.length > 0 && (
            <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={question.imageUrls[0] || 'https://via.placeholder.com/800x400'}
                alt="Hình ảnh câu hỏi"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
          )}

          {/* Hiển thị tệp đính kèm nếu có */}
          {question.fileUrls?.length > 0 && (
            <Box sx={{ marginBottom: '20px' }}>
              <Typography variant="body2" color="textSecondary">
                Tải xuống tệp:
                {question.fileUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '10px' }}
                  >
                    Tệp {index + 1}
                  </a>
                ))}
              </Typography>
            </Box>
          )}

          {/* Các nút like và bình luận */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton aria-label="like" sx={{ color: 'blue' }}>
              <IconHeart />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '-6px' }}>
              15
            </Typography>
            <IconButton
              aria-label="comments"
              sx={{ marginLeft: '16px' }}
              onClick={() => handleToggleComments(question.id)}
            >
              <IconMessageCircle />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '-6px' }}>
              ({question.comments?.length || 0})
            </Typography>
          </Box>
          {visibleComments[question.id] && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {!isLoggedIn ? ( // Kiểm tra xem người dùng đã đăng nhập hay chưa
                <Typography variant="body2" color="text.secondary">
                  Vui lòng <Link to="/auth/login" style={{ color: '#007bff', textDecoration: 'underline' }}>đăng nhập</Link> để bình luận.
                </Typography>
              ) : (
                <>
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
                          src={currentUserImage || avatardefault}
                          alt="Hình ảnh người dùng"
                          width="30px"
                          style={{ borderRadius: '50%', marginRight: '10px' }}
                          onError={(e) => {
                            e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                          }}
                        />
                        <TextField
                          placeholder={`Bình luận dưới tên ${userData.current
                            ? users.find((user) => user.id === userData.current.id)?.name
                            : 'Người dùng'
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
                          gap: 0,
                          marginRight: '660px',
                          marginTop: '-14px',
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
                        sx={{ width: '100%', marginLeft: ' 80px', marginTop: '-16px' }}
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
                                  onChange={(e) => setImageFile(e.target.files[0])}
                                />
                              )}
                              {index === 1 && (
                                <input
                                  type="file"
                                  name="file"
                                  multiple
                                  hidden
                                  onChange={(e) => setFile(e.target.files[0])}
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
                          onClick={() => handleAddComment(question.id)}
                        >
                          Gửi
                        </Button>
                      </Box>

                      {/* Code Dialog */}
                      <Dialog open={showCodeDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
                            src={currentUserImage || avatardefault}
                            alt="Hình ảnh người dùng"
                            style={{ borderRadius: '50%', marginRight: '10px' }}
                            width="30px"
                            onError={(e) => {
                              e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                            }}
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
                        {Array.isArray(comment.imageUrls) && comment.imageUrls.length > 0 ? (
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {comment.imageUrls.map((imageUrl, index) => (
                              <Box key={index} sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}>
                                <img
                                  src={imageUrl || 'không có hình ảnh'}
                                  alt={`hình ảnh bình luận ${index + 1}`}
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
                        ) : (
                          comment.imageUrls &&
                          typeof comment.imageUrls === 'string' && ( // Ensure it's a string before rendering
                            <Box
                              sx={{
                                mt: 1,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '5px',
                              }}
                            >
                              <Box sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}>
                                <img
                                  src={comment.imageUrls || 'không có hình ảnh'}
                                  alt="Hình ảnh bình luận"
                                  style={{
                                    width: '35%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    objectFit: 'contain',
                                  }}
                                />
                              </Box>
                            </Box>
                          )
                        )}

                        {Array.isArray(comment.fileUrls) && comment.fileUrls.length > 0 ? (
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            {comment.fileUrls.map((fileUrl, index) => {
                              const fileName = decodeURIComponent(fileUrl).split('/').pop().split('?')[0];
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
                        ) : null}

                        {/* Reply Button */}
                        <Box display="flex" alignItems="center" gap="8px">
                          <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                            {formatUpdatedAt(comment.created_at)}
                          </Typography>
                          <Button
                            variant="text"
                            sx={{
                              textTransform: 'none',
                              padding: '2px 10px',
                              fontSize: '0.8rem',
                              borderRadius: '16px',
                              margin: 0,
                            }}
                            onClick={() =>
                              setReplyingTo(
                                replyingTo?.id === comment.id && replyingTo?.type === 'comment'
                                  ? null
                                  : { id: comment.id, type: 'comment' },
                              )
                            }
                          >
                            {replyingTo === comment.id ? 'Hủy' : 'Trả lời'}
                          </Button>
                        </Box>
                        {/* Reply Section */}
                        {replyingTo?.id === comment.id && replyingTo?.type === 'comment' && (
                          <Box sx={{ mt: 2 }}>
                            <Box display="flex" alignItems="center">
                              <img
                                src={currentUserImage || avatardefault}
                                alt="Hình ảnh người dùng"
                                width="30px"
                                style={{ borderRadius: '50%', marginRight: '10px' }}
                                onError={(e) => {
                                  e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                                }}
                              />
                              <TextField
                                placeholder={`Trả lời dưới tên ${userData.current
                                  ? users.find((user) => user.id === userData.current.id)?.name
                                  : 'Người dùng'
                                  }`}
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={newReplies[comment.id]?.content || ''} // Lấy nội dung trả lời cho bình luận cụ thể
                                onChange={(e) =>
                                  setNewReplies((prev) => ({
                                    ...prev,
                                    [comment.id]: { ...prev[comment.id], content: e.target.value },
                                  }))
                                } // Cập nhật nội dung trả lời cho bình luận cụ thể
                              />
                            </Box>

                            <Box
                              display="flex"
                              justifyContent="center"
                              sx={{
                                width: '100%',
                                gap: 0,
                                marginLeft: '-330px',
                                marginTop: '0px',
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
                                        onChange={(e) => handleAddReplyImage(e, comment.id)} // Xử lý hình ảnh đính kèm cho phản hồi
                                      />
                                    )}
                                    {index === 1 && (
                                      <input
                                        type="file"
                                        name="file"
                                        multiple
                                        hidden
                                        onChange={(e) => handleAddReplyFile(e, comment.id)} // Xử lý tệp đính kèm cho phản hồi
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
                        {Array.isArray(comment.replies) &&
                          comment.replies.map((reply, index) => {
                            return (
                              <Box key={reply.id || index} sx={{ pl: 4, mt: 2 }}>
                                <Box display="flex" alignItems="center">
                                  <img
                                    src={currentUserImage || avatardefault}
                                    alt="Hình ảnh người dùng"
                                    style={{ borderRadius: '50%', marginRight: '10px' }}
                                    width="20px"
                                    onError={(e) => {
                                      e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                                    }}
                                  />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {users.find((user) => user.id === reply.user_id)?.name ||
                                      'Unknown User'}
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

                                {/* Display images */}
                                {Array.isArray(reply.imageUrls) && reply.imageUrls.length > 0 && (
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
                                        sx={{
                                          flexBasis: 'calc(50% - 5px)',
                                          flexGrow: 1,
                                        }}
                                      >
                                        <img
                                          src={imageUrl || 'không có hình ảnh'}
                                          alt={`hình ảnh bình luận ${index + 1}`}
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

                                {Array.isArray(reply.fileUrls) && reply.fileUrls.length > 0 && (
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

                                <Box display="flex" alignItems="center" gap="8px">
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    {formatUpdatedAt(comment.created_at)}
                                  </Typography>
                                  <Button
                                    variant="text"
                                    sx={{
                                      textTransform: 'none',
                                      padding: '2px 10px',
                                      fontSize: '0.8rem',
                                      borderRadius: '16px',
                                      marginRight: '10px',
                                    }}
                                    onClick={() =>
                                      setReplyingTo(
                                        replyingTo?.id === reply.id && replyingTo?.type === 'reply'
                                          ? null
                                          : { id: reply.id, type: 'reply' },
                                      )
                                    }
                                  >
                                    {replyingTo === comment.id ? 'Hủy' : 'Trả lời'}
                                  </Button>
                                </Box>
                                {replyingTo?.id === reply.id && replyingTo?.type === 'reply' && (
                                  <Box sx={{ mt: 2 }}>
                                    <Box display="flex" alignItems="center">
                                      <img
                                        src={
                                          currentUserImage ||
                                          'https://i.pinimg.com/474x/5d/54/46/5d544626add5cbe8dce09b695164633b.jpg'
                                        }
                                        width="30px"
                                        alt="User  Avatar"
                                        style={{ borderRadius: '50%', marginRight: '10px' }}
                                      />
                                      <TextField
                                        placeholder={`Trả lời dưới tên ${userData.current
                                          ? users.find((user) => user.id === userData.current.id)?.name
                                          : 'Người dùng'
                                          }`}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={newReplies[comment.id]?.content || ''} // Lấy nội dung trả lời cho bình luận cụ thể
                                        onChange={(e) =>
                                          setNewReplies((prev) => ({
                                            ...prev,
                                            [comment.id]: {
                                              ...prev[comment.id],
                                              content: e.target.value,
                                            },
                                          }))
                                        } // Cập nhật nội dung trả lời cho bình luận cụ thể
                                      />
                                    </Box>

                                    <Box
                                      display="flex"
                                      justifyContent="center"
                                      sx={{
                                        width: '100%',
                                        gap: 0,
                                        marginLeft: '-314px',
                                        marginTop: '0px',
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
                                                onChange={(e) => handleAddReplyImage(e, comment.id)} // Xử lý hình ảnh đính kèm cho phản hồi
                                              />
                                            )}
                                            {index === 1 && (
                                              <input
                                                type="file"
                                                name="file"
                                                multiple
                                                hidden
                                                onChange={(e) => handleAddReplyFile(e, comment.id)} // Xử lý tệp đính kèm cho phản hồi
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
                              </Box>
                            );
                          })}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
    </Box>
  );
};

export default QuestionDetail;
