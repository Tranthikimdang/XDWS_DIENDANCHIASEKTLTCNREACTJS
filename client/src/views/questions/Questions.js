/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Chọn style mà bạn thích
import PageContainer from 'src/components/container/PageContainer';
import axios from 'axios';
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
  InputAdornment,
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
import SearchIcon from '@mui/icons-material/Search';
// Images
import avatardefault from "src/assets/images/profile/user-1.jpg";
//api
import userApis from 'src/apis/UserApI';
import HashtagApi from 'src/apis/HashtagApI';
import QuestionHashtags from '../../apis/QuestionHashtagsApI';
//
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
  const [reload, setReload] = useState(false);
  const [questions,setListQuestion] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState(false);
  const [dataTemp, setDataTemp] = useState(null);
  const [users, setUsers] = useState([]);
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
  const [imageFile, setImageFile] = useState('');
  const [file, setFile] = useState('');
  const [replyImageFile, setReplyImageFile] = useState('');
  const [replyFile, setReplyFile] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [hashtag, setHashtag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleToggleComments = (questionId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [questionId]: !prev[questionId], // Toggle visibility for the specific question
    }));
  };

  const handleAddReplyImage = async (event, commentId) => {
    const images = event.target.files;
    const imagesArray = Array.from(images);

    const uploadedImages = [];
    for (let image of imagesArray) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const response = await axios.post('http://localhost:3000/api/upload-image', formData);
        uploadedImages.push(response.data.url); // Assuming response contains image URL
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    setNewReplies((prev) => ({
      ...prev,
      [commentId]: { ...prev[commentId], imageUrls: uploadedImages },
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
        const response = await axios
          .post('http://localhost:3000/api/upload-file', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            console.log('File uploaded successfully', response);
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
          });
        uploadedFiles.push(response.data.url); // Assuming response contains file URL
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setNewReplies((prev) => ({
      ...prev,
      [commentId]: { ...prev[commentId], fileUrls: uploadedFiles },
    }));
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
        const res = await userApis.getUsersList();
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

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await getQuestionsList();
        if (res.status === 'success') {
          const questions = res?.data?.questions || [];

          // Load comments từ localStorage
          const savedComments = JSON.parse(localStorage.getItem('comment_question')) || [];
          const updatedQuestions = questions.map((question) => {
            const savedQuestion = savedComments.find((item) => item.id === question.id);
            return {
              ...question,
              comments: savedQuestion ? savedQuestion.comments : [],
            };
          });

          setListQuestion(updatedQuestions);
        }
      } catch (error) {
        console.error('Error fetching Questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [reload]);

  const handleSnackbarClose = (event, reason) => {
    setSnackbarOpen(false);
  };

  // Tìm kiếm tất cả trong bảng questions
  const filteredQuestions = questions.filter((question) => {
    // Chuyển đổi tất cả các trường cần tìm kiếm thành chuỗi và kiểm tra nếu có chứa searchTerm
    return (
      question.hashtag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.up_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.questions.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastQuestion = currentPage * usersPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - usersPerPage;
  const listQuestion = filteredQuestions.slice(indexOfFirstQuestion , indexOfLastQuestion);



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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Kiểm tra nếu hashtag trống
    const hashtag = data.hashtag; // Lấy hashtag từ form
    if (!hashtag || hashtag.trim() === '') {
      setLoading(false);
      setSnackbarOpen(true);
      setSnackbarMessage('Hashtag không được để trống.');
      setSnackbarSeverity('error');
      return;
    }

    // Tiếp tục xử lý các tệp ảnh và tệp khác
    const imageFiles = formData.getAll('image');
    const otherFiles = formData.getAll('file');

    if (!imageError && !fileError) {
      try {
        // Nếu có ảnh, upload ảnh lên server
        let imageUrls = [];
        if (imageFiles.length > 0) {
          const uploadImagePromises = imageFiles
            .filter((file) => file.size > 0)
            .map((imageFile) => handleUploadImage(imageFile));
          const allImageUrls = await Promise.all(uploadImagePromises);
          imageUrls = allImageUrls?.map((imgUrl) =>
            imgUrl.status === 201 ? imgUrl.imagePath : '',
          );
        }

        let fileUrls = [];
        if (otherFiles.length > 0) {
          const uploadFilePromises = otherFiles
            .filter((file) => file.size > 0)
            .map((file) => handleUploadFile(file));
          fileUrls = await Promise.all(uploadFilePromises);
        }

        delete data.file;
        delete data.image;

        const dataToSubmit = {
          ...data,
          user_id: userData.current.id,
          imageUrls,
          fileUrls,
          isApproved: true,
          is_deleted: data.is_deleted || false,
          up_code: dataTemp?.up_code || codeSnippet,
          comments: [],
          replies: [],
        };

        // Gọi API để tạo câu hỏi mới
        const res = await addQuestion(dataToSubmit);

        console.log(res);

        if (res?.status === 'success' && res?.data?.question?.id) {
          const questionId = res.data.question.id;

          // Kiểm tra nếu hashtag không bắt đầu bằng dấu #
          if (!hashtag.startsWith('#')) {
            setLoading(false);
            setSnackbarOpen(true);
            setSnackbarMessage('Hashtag phải bắt đầu bằng dấu #.');
            setSnackbarSeverity('error');
            return;
          }

          // Tiếp tục xử lý hashtag
          const existingHashtag = await HashtagApi.getHashtags();
          const existingHashtagData = existingHashtag.data.hashtags.find((h) => h.name === hashtag);

          let hashtagId;
          if (existingHashtagData) {
            hashtagId = existingHashtagData.id;
          } else {
            const newHashtag = await HashtagApi.addHashtag({ name: hashtag });
            hashtagId = newHashtag?.data?.hashtag?.id;
          }

          if (hashtagId) {
            await QuestionHashtags.addQuestionHashtag({
              question_id: questionId,
              hashtag_id: hashtagId,
            });
          }

          setLoading(false);
          setSnackbarOpen(true);
          setSnackbarMessage('Câu hỏi của bạn đã được đặt thành công');
          setSnackbarSeverity('success');
          e.target.reset();
          setReload((reload) => !reload);
        } else {
          setLoading(false);
          setSnackbarOpen(true);
          setSnackbarMessage(
            res?.data?.message || 'Có lỗi khi gửi câu hỏi. Vui lòng kiểm tra lại.',
          );
          setSnackbarSeverity('error');
        }
      } catch (error) {
        setLoading(false);
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
      if (!newComment || newComment.trim() === '') {
        setSnackbarMessage("Nội dung bình luận không được để trống.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Ngừng thực hiện hàm nếu bình luận rỗng
      }
      let imageUrl = [];
      let fileUrl = [];

      // Upload image if available
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);
        const imageResponse = await axios.post("http://localhost:3000/api/upload", formDataImage);
        if (imageResponse.data && imageResponse.data.imagePath) {
          imageUrl = imageResponse.data.imagePath;
        }
      }

      // Upload file if available
      if (file) {
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        const fileResponse = await axios.post("http://localhost:3000/api/upload-files", formDataFile);
        if (fileResponse.data && fileResponse.data.filePath) {
          fileUrl = fileResponse.data.filePath;
        }
      }

      const newCommentData = {
        question_id,
        user_id: userData.current.id,
        content: newComment || '',  // Optional content
        imageUrls: imageUrl,        // Optional image
        fileUrls: fileUrl,          // Optional file
        created_at: new Date(),
        updated_at: new Date(),
        up_code: dataTemp?.up_code || codeSnippet || '',  // Optional up_code
        replies: []
      };
      const response = await axios.post('http://localhost:3000/api/comments', newCommentData);
      console.log('newCommentData:', newCommentData);
      if (response.data.status === 'success') {
        setListQuestion((prevList) => {
          const newList = prevList.map((question) => {
            if (question.id === question_id) {
              const updatedQuestion = {
                ...question,
                comments: [...(question.comments || []), response.data.data.comment],
              };
              return updatedQuestion;
            }
            return question;
          });

          // Persist updated list in localStorage
          localStorage.setItem('comment_question', JSON.stringify(newList));
          return newList;
        });

        // Reset the input fields after success
        setNewComment('');  // Reset comment input
        setCommentImages([]);  // Reset images
        setCommentFiles([]);   // Reset files
        setImageFile(null);     // Reset image file state
        setFile(null);          // Reset file state
        setSnackbarMessage("Bình luận của bạn đã được gửi.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setSnackbarMessage("Đã xảy ra lỗi khi gửi bình luận.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const handleAddReply = async (questionId, commentId) => {
    if (isSubmittingReply) return;
    setIsSubmittingReply(true);

    // Kiểm tra xem có nội dung phản hồi hay không
    if (!newReplies[commentId] || newReplies[commentId].trim() === '') {
      setSnackbarMessage("Nội dung phản hồi không được để trống.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsSubmittingReply(false);
      return;
    }

    try {
      let imageUrls = [];
      let fileUrls = [];

      // Upload ảnh nếu có
      if (replyImageFile && replyImageFile.length > 0) {
        const formDataImage = new FormData();
        replyImageFile.forEach((image, index) => {
          formDataImage.append(`image_${index}`, image);
        });
        const imageResponse = await axios.post("http://localhost:3000/api/upload", formDataImage, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (imageResponse.data && Array.isArray(imageResponse.data.imagePaths)) {
          imageUrls = imageResponse.data.imagePaths;
        }
      }

      // Upload file nếu có
      if (replyFile && replyFile.length > 0) {
        const formDataFile = new FormData();
        replyFile.forEach((file, index) => {
          formDataFile.append(`file_${index}`, file);
        });
        const fileResponse = await axios.post("http://localhost:3000/api/upload-files", formDataFile);
        if (fileResponse.data && Array.isArray(fileResponse.data.filePaths)) {
          fileUrls = fileResponse.data.filePaths;
        }
      }

      // Tạo dữ liệu mới cho phản hồi
      const newReply = {
        user_id: userData.current.id,
        content: newReplies[commentId] || '',
        imageUrls: imageUrls,
        fileUrls: fileUrls,
        up_code: dataTemp?.up_code || codeSnippet || '',
        created_at: new Date(),
      };

      // Gửi phản hồi tới server
      const response = await axios.post(`http://localhost:3000/api/comments/${commentId}/replies`, newReply);

      if (response.data.status === 'success') {
        // Cập nhật danh sách câu hỏi và câu trả lời sau khi thành công
        setListQuestion((prevList) => {
          const updatedList = prevList.map((item) => {
            if (item.id === questionId) {
              return {
                ...item,
                comments: item.comments.map((comment) => {
                  if (comment.id === commentId) {
                    const repliesArray = Array.isArray(comment.replies) ? comment.replies : [];
                    return {
                      ...comment,
                      replies: [...repliesArray, response.data.data.reply],
                    };
                  }
                  return comment;
                }),
              };
            }
            return item;
          });

          // Lưu danh sách mới vào localStorage
          localStorage.setItem('comment_question', JSON.stringify(updatedList));
          return updatedList;
        });

        // Reset form và các trạng thái liên quan
        setNewReplies((prev) => ({ ...prev, [commentId]: '' }));
        setReplyingTo(null);
        setReplyImageFile(null);
        setReplyFile(null);
        setSnackbarMessage("Trả lời của bạn đã được gửi.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      setSnackbarMessage("Đã xảy ra lỗi khi gửi phản hồi.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  useEffect(() => {
    const fetchHashtags = async () => {
      setLoading(true);
      try {
        const hashtagsList = await HashtagApi.getHashtags();

        setHashtag(hashtagsList.data.hashtags);
      } catch (error) {
        console.error('Error fetching hashtags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHashtags();
  }, []);

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
          const uploadImagePromises = imageFiles
            .filter((file) => file.size > 0)
            .map((imageFile) => handleUploadImage(imageFile));
          const allImageUrls = await Promise.all(uploadImagePromises);
          imageUrls = allImageUrls?.map((imgUrl) =>
            imgUrl.status === 201 ? imgUrl.imagePath : '',
          );
        }

        let fileUrls = [];
        if (otherFiles.length > 0) {
          const uploadFilePromises = otherFiles
            .filter((file) => file.size > 0)
            .map((file) => handleUploadFile(file));
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
        setSnackbarMessage(
          error.message || 'Có lỗi xảy ra khi cập nhật câu hỏi. Vui lòng thử lại sau.',
        );
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

  const handleCardClick = (questionId) => {
    navigate(`/question/${questionId}`, { state: { id: questionId } });
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

  const getFilteredQuestions = () => {
    // Lấy danh sách hashtag được lưu từ localStorage
    const savedHashtags = JSON.parse(localStorage.getItem('selectedHashtags')) || [];
    const hashtagNames = savedHashtags.map((hashtag) => hashtag.name.toLowerCase());
    const strippedHashtagNames = hashtagNames.map((name) =>
      name.startsWith('#') ? name.slice(1) : name,
    );

    // Lọc các câu hỏi liên quan đến hashtag
    const relevantQuestions = listQuestion.filter((question) => {
      // Kiểm tra hashtag liên quan
      const isHashtagRelevant = question.hashtag?.split(',').some(
        (tag) =>
          hashtagNames.includes(tag.toLowerCase()) ||
          strippedHashtagNames.includes(tag.toLowerCase()),
      );

      // Kiểm tra nội dung câu hỏi có chứa từ khóa từ hashtag không
      const isQuestionRelevant = hashtagNames.some((tag) =>
        question.questions?.toLowerCase().includes(tag),
      );

      return isHashtagRelevant || isQuestionRelevant;
    });

    // Lọc các câu hỏi không liên quan
    const irrelevantQuestions = listQuestion.filter(
      (question) => !relevantQuestions.includes(question),
    );

    // Kết hợp các câu hỏi liên quan và không liên quan
    return [...relevantQuestions, ...irrelevantQuestions];
  };

  useEffect(() => {
    getFilteredQuestions();;
  }, [searchTerm, currentPage, usersPerPage, questions]);
  // const filteredQuestions = getFilteredQuestions();
  return (
    <PageContainer
      title="Hãy đặt câu hỏi hoặc chia sẻ kiến thức | Share Code"
      description="Đây là trang đặt câu hỏi"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
          <Typography variant="h4" component="h1" className="heading">
            <strong>Tất cả câu hỏi</strong>
          </Typography>
          <Typography variant="body1" paragraph className="typography-body">
            Tổng hợp các câu hỏi và bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật
            lập trình web.
          </Typography>
        </Grid>
        <Grid item xs={8} sx={{ marginBottom: '20px', textAlign: 'center' }}>
          <TextField
            label="Tìm kiếm câu hỏi"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              margin: 'auto',
              borderRadius: '50px',
              backgroundColor: '#f7f7f7',
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
              },
              '& .MuiInputBase-input': {
                padding: '12px 16px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

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
                  src={userData?.current?.imageUrl || avatardefault}
                  alt="Hình ảnh người dùng"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    marginRight: 8,
                  }}
                  onError={(e) => {
                    e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                  }}
                />
                <Typography variant="h6">Đặt câu hỏi</Typography>
              </Box>

              {/* Post Content */}
              <TextField
                label="Hãy đặt câu hỏi hoặc chia sẻ kiến thức?"
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
            ) : listQuestion?.length > 0 ? ( // Sử dụng danh sách đã lọc
              listQuestion
                .map((question) => {
                  const listImgUrl = question.imageUrls;
                  const listFileUrl = question.fileUrls;
                  return (
                    question.isApproved === true && (
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
                                users?.find((u) => question?.user_id === u.id)?.imageUrl || avatardefault}
                              alt="Hình ảnh người dùng"
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: 8,
                              }}
                              onError={(e) => {
                                e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
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
                                  {question.hashtag}
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
                                      src={image || 'không có hình ảnh'}
                                      alt="hình ảnh"
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
                                  src={currentUserImage || avatardefault}
                                  alt="Hình ảnh người dùng"
                                  width="30px"
                                  style={{ borderRadius: '50%', marginRight: '10px' }}
                                  onError={(e) => {
                                    e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
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
                                  marginTop: '-18px',
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
                                {Array.isArray(comment.imageUrls) &&
                                  comment.imageUrls.length > 0 ? (
                                  <Box
                                    sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: '5px' }}
                                  >
                                    {comment.imageUrls.map((imageUrl, index) => (
                                      <Box
                                        key={index}
                                        sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}
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
                                          src={comment.imageUrls || "không có hình ảnh"}
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
                                ) : null}

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
                                        src={currentUserImage || avatardefault}
                                        alt="Hình ảnh người dùng"
                                        width="30px"
                                        style={{ borderRadius: '50%', marginRight: '10px' }}
                                        onError={(e) => {
                                          e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                                        }}
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
                                          <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 'bold' }}
                                          >
                                            {users.find((user) => user.id === reply.user_id)
                                              ?.name || 'Unknown User'}
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
                                            <SyntaxHighlighter
                                              language="javascript"
                                              style={dracula}
                                            >
                                              {reply.up_code}
                                            </SyntaxHighlighter>
                                          </Box>
                                        )}

                                        {/* Display images */}
                                        {Array.isArray(reply.imageUrls) &&
                                          reply.imageUrls.length > 0 && (
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

                                        {Array.isArray(reply.fileUrls) &&
                                          reply.fileUrls.length > 0 && (
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
                                                    <IconButton
                                                      sx={{ color: '#007bff', padding: '0' }}
                                                    >
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
                                      </Box>
                                    );
                                  })}
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
            <>
              {loading ? (
                <CircularProgress /> // Hiển thị spinner khi đang tải
              ) : (
                <List>
                  {hashtag.length > 0 ? (
                    hashtag.map((hashtag) => (
                      <ListItem key={hashtag?.id} sx={{ padding: 0 }}>
                        {hashtag && (
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#007bff',
                              fontSize: '0.8rem',
                            }}
                          >
                            {hashtag.name} {/* Hiển thị hashtag nếu có */}
                          </Typography>
                        )}
                      </ListItem>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#999',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        marginTop: '1rem',
                      }}
                    >
                      Không có hashtags nào để hiển thị.
                    </Typography>
                  )}
                </List>
              )}
            </>
          </Box>
          {/* tam thoi */}
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

    </PageContainer>
  );
};

export default Questions;
