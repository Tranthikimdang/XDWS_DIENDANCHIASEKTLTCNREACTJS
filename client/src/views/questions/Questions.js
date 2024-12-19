/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

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
    ListItem,
    Menu,
    MenuItem,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
    InputAdornment,
    ButtonBase,
    List,
    Avatar
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { addQuestion, getQuestionsList, updateQuestion } from 'src/apis/QuestionsApis';
import SearchIcon from '@mui/icons-material/Search';
import avatardefault from 'src/assets/images/profile/user-1.jpg';
import userApis from 'src/apis/UserApI';
import memtorApis from 'src/apis/mentorApi';
import HashtagApi from 'src/apis/HashtagApI';
import QuestionHashtags from '../../apis/QuestionHashtagsApI';
import { getStorage } from 'firebase/storage';

const Questions = ({ listImgUrl = [] }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [imageError, setImageError] = useState('');
    const [fileError, setFileError] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [error, setError] = useState('');
    const [showCodeField, setShowCodeField] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [questions, setListQuestion] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [anchorEl, setAnchorEl] = useState(null);
    const [edit, setEdit] = useState(false);
    const [dataTemp, setDataTemp] = useState(null);
    const [users, setUsers] = useState([]);
    const [showCodeDialog, setShowCodeDialog] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [commentImages, setCommentImages] = useState([]);
    const [commentFiles, setCommentFiles] = useState([]);
    const [newReplies, setNewReplies] = useState({});
    const storage = getStorage();
    const [visibleComments, setVisibleComments] = useState({});
    const location = useLocation();
    const { id } = location.state || {};
    const [imageFile, setImageFile] = useState('');
    const [file, setFile] = useState('');
    const [replyImageFile, setReplyImageFile] = useState('');
    const [replyFile, setReplyFile] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [hashtag, setHashtag] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [question, setQuestion] = useState([]);
    const [expandedListIndexes, setExpandedListIndexes] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [showAllImages, setShowAllImages] = useState(false);
    const [currentUserImage, setCurrentUserImage] = useState('');
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái để theo dõi xem người dùng đã đăng nhập hay chưa

    useEffect(() => {
        const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        if (userDataFromLocalStorage) {
            setIsLoggedIn(true); // Nếu có dữ liệu người dùng, đặt trạng thái là đã đăng nhập
        }
    }, []);

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
            } catch (error) {
                console.error('Lỗi khi lấy người dùng:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const savedComments = JSON.parse(localStorage.getItem('comment_question')) || [];
                const res = await getQuestionsList();
                if (res.status === 'success') {
                    const questions = res?.data?.questions || [];
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


    const handleToggle = (questionId) => {
        setExpandedQuestions((prevState) => ({
            ...prevState,
            [questionId]: !prevState[questionId],
        }));
    };

    const isExpanded = expandedQuestions[question.id] || false;


    const handleSnackbarClose = (event, reason) => {
        setSnackbarOpen(false);
    };

    const getMentorsAndUsers = async () => {
        setLoading(true);
        try {
            const userResponse = await userApis.getUsersList();
            const users = Array.isArray(userResponse.data.users) ? userResponse.data.users : [];
            const mentorResponse = await memtorApis.getMentors();
            const mentorsList = Array.isArray(mentorResponse.data.mentors)
                ? mentorResponse.data.mentors
                : [];
            const combinedData = mentorsList
                .map((mentor) => {
                    const user = users.find((u) => u.id == mentor.user_id);
                    if (user) {
                        return { user };
                    }
                    return null;
                })
                .filter((mentor) => mentor !== null);

            setMentors(mentorsList);
            setUsers(users);
            setFilteredMentors(combinedData);
        } catch (error) {
            console.error('Error fetching users or mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMentorsAndUsers();
    }, []);

    const filteredQuestions = questions.filter((question) => {
        return (
            question.hashtag.toLowerCase().includes(searchTerm.toLowerCase()) ||
            question.up_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            question.questions.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const indexOfLastQuestion = currentPage * usersPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - usersPerPage;
    const listQuestion = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

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
                setSnackbarSeverity('error');
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
            const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
            setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        }
    };

    const handleExpandImages = (listIndex) => {
        if (expandedListIndexes.includes(listIndex)) {
            setExpandedListIndexes(expandedListIndexes.filter(index => index !== listIndex));
        } else {
            setExpandedListIndexes([...expandedListIndexes, listIndex]);
        }
    };


    const handleFileChange = (e) => {
        const files = e.target.files;
        const errorMsg = validateOtherFile(files);
        if (errorMsg) {
            setFileError(errorMsg);
        } else {
            setFileError('');
            const fileList = Array.from(files).map((file) => file.name);
            setFileNames(fileList);
        }
    };
    const handleToggleComments = (questionId) => {
        setVisibleComments((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
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
                const response = await axios.post('http://localhost:3000/api/uploads', formData);
                console.log('Image upload response:', response.data);
                uploadedImages.push(response.data.imagePaths[0]);
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
    const onSubmit = async (data, e) => {
        setLoading(true);
        const formData = new FormData(e.target);
        const imageFiles = formData.getAll('image');
        const otherFiles = formData.getAll('file');
        const hashtag = data.hashtag?.trim();
        if (!hashtag) {
            setLoading(false);
            setSnackbarOpen(true);
            setSnackbarMessage('Hashtag không được để trống.');
            setSnackbarSeverity('error');
            return;
        }
        if (!hashtag.startsWith('#')) {
            setLoading(false);
            setSnackbarOpen(true);
            setSnackbarMessage('Hashtag phải bắt đầu bằng dấu #.');
            setSnackbarSeverity('error');
            return;
        }
        try {
            let imageUrls = [];
            if (imageFiles.length > 0) {
                const uploadImagePromises = imageFiles
                    .filter((file) => file.size > 0)
                    .map((imageFile) => handleUploadImage(imageFile));
                const allImageUrls = await Promise.all(uploadImagePromises);
                imageUrls = allImageUrls
                    .filter((imgUrl) => imgUrl.status === 201)
                    .map((imgUrl) => imgUrl.imagePath);
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

            const res = await addQuestion(dataToSubmit);
            if (res?.status === 'success' && res?.data?.question?.id) {
                const questionId = res.data.question.id;

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
                setSnackbarMessage('Câu hỏi của bạn đã được đặt thành công.');
                setSnackbarSeverity('success');
                e.target.reset();
                setImagePreviews([]);
                setFileNames([]);
                setCodeSnippet('');
                setReload((reload) => !reload);
            } else {
                setLoading(false);
                setSnackbarOpen(true);
                setSnackbarMessage(
                    res?.data?.message || 'Có lỗi khi gửi câu hỏi. Vui lòng kiểm tra lại.'
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
            return response.data.fileUrl;
        } catch (error) {
            console.error('Lỗi khi tải tệp lên server:', error);
            throw new Error('Lỗi khi tải tệp lên server');
        }
    };

    const sensitiveWords = [
        // Xúc phạm trí tuệ
        "ngu", "ngu ngốc", "ngu si", "dốt", "dốt nát", "đần", "đần độn", "hâm", "khùng", "điên", "đồ ngu",
        "đồ dốt", "thiểu năng", "chậm hiểu", "đần thối", "hâm hấp", "óc", "con",

        // Xúc phạm nhân phẩm
        "mất dạy", "vô học", "đồ chó", "đồ điếm", "con điếm", "lừa đảo", "bẩn thỉu", "rác rưởi",
        "hèn mọn", "vô liêm sỉ", "mặt dày", "khốn nạn", "đồ khốn", "thất đức", "kẻ thù",
        "phản bội", "vô dụng", "đáng khinh", "nhục nhã",

        // Chửi tục thô lỗ
        "địt", "đụ", "lồn", "buồi", "chịch", "cặc", "đéo", "vãi lồn", "vãi buồi", "đái", "ỉa",
        "đéo mẹ", "đéo biết", "mẹ kiếp", "chết mẹ", "chết tiệt", "cái lồn", "cái buồi",
        "cái đít", "mặt lồn", "mặt c*",

        // Xúc phạm gia đình
        "bố mày", "mẹ mày", "ông mày", "bà mày", "con mày", "chó má", "cút mẹ", "xéo mẹ", "bố láo",
        "đồ mất dạy", "không biết điều", "con hoang", "đồ rẻ rách", "đồ phế thải", "đồ vô ơn",

        // Từ viết tắt thô tục
        "dm", "vcl", "vkl", "clgt", "vl", "cc", "dcm", "đmm", "dkm", "vãi cả lồn", "vc", "đb",

        // Kích động/hạ bệ
        "đập chết", "cút xéo", "đâm đầu", "tự tử", "biến đi", "mày đi chết đi", "vô giá trị",
        "không xứng đáng", "đồ thừa", "kẻ vô ơn", "đồ bất tài",

        // Các từ vùng miền hoặc ẩn ý tiêu cực
        "mất nết", "dơ dáy", "đồ rác", "đồ hèn", "hết thuốc", "chó cắn", "ngu như bò", "câm mồm",
        "hèn hạ", "ngu xuẩn", "đồ quỷ", "đồ xấu xa", "đồ ác độc"
    ];


    const containsSensitiveWords = (text) => {
        return sensitiveWords.some(word => text.includes(word));
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
                setSnackbarMessage("Bạn cần đăng nhập để gửi bình luận.");
                setSnackbarSeverity("warning");
                setSnackbarOpen(true);
                return;
            }
            if (!newComment || newComment.trim() === '') {
                setSnackbarMessage("Nội dung bình luận không được để trống.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }

            if (containsSensitiveWords(newComment)) {
                setSnackbarMessage("Nội dung bình luận không hợp lệ.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }

            let imageUrl = [];
            let fileUrl = [];

            if (imageFile) {
                const formDataImage = new FormData();
                formDataImage.append("image", imageFile);
                const imageResponse = await axios.post("http://localhost:3000/api/upload", formDataImage);
                if (imageResponse.data && imageResponse.data.imagePath) {
                    imageUrl = [imageResponse.data.imagePath];
                }
            }

            if (file) {
                const formDataFile = new FormData();
                formDataFile.append("file", file);
                const fileResponse = await axios.post("http://localhost:3000/api/upload-files", formDataFile);
                if (fileResponse.data && fileResponse.data.filePaths) {
                    fileUrl = fileResponse.data.filePaths;
                }
            }

            const newCommentData = {
                question_id,
                user_id: userData.current.id,
                content: newComment || '',
                imageUrls: imageUrl,
                fileUrls: fileUrl,
                created_at: new Date(),
                updated_at: new Date(),
                up_code: dataTemp?.up_code || codeSnippet || '',
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

                    localStorage.setItem('comment_question', JSON.stringify(newList));
                    return newList;
                });
                setNewComment('');
                setCommentImages([]);
                setCommentFiles([]);
                setImageFile(null);
                setFile(null);
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

    const handleAddReply = async (questionId, commentId, parentId = null) => {
        if (!userData?.current?.id) {
            setSnackbarOpen(false);
            setTimeout(() => {
                setSnackbarMessage("Bạn cần đăng nhập để gửi trả lời.");
                setSnackbarSeverity("warning");
                setSnackbarOpen(true);
            }, 100);
            return;
        }

        const replyContent = newReplies[parentId || commentId]?.content;
        if (!replyContent || typeof replyContent !== 'string' || replyContent.trim() === '') {
            setSnackbarMessage("Nội dung phản hồi không được để trống.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setIsSubmittingReply(false);
            return;
        }

        if (containsSensitiveWords(replyContent)) {
            setSnackbarMessage("Nội dung phản hồi không hợp lệ.");
            setSnackbarSeverity("error");
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

            const response = await axios.post(`http://localhost:3000/api/comments/${commentId}/replies`, newReply);

            if (response.data.status === 'success') {
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

                    localStorage.setItem('comment_question', JSON.stringify(updatedList));
                    return updatedList;
                });

                setNewReplies((prev) => ({ ...prev, [parentId || commentId]: { content: '', imageUrls: [], fileUrls: [] } }));
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
                const res = await updateQuestion(dataTemp.id, dataToSubmit);
                if (res.status === 'success') {
                    setLoading(false);
                    setSnackbarOpen(true);
                    setSnackbarMessage('Câu hỏi đã được cập nhật thành công.');
                    setSnackbarSeverity('success');
                    setReload((reload) => !reload);
                    setEdit(false);
                    reset();
                } else {
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
        navigate(`/questions/${questionId}`, { state: { id: questionId } });
    };

    const handleCodeButtonClick = () => {
        setShowCodeDialog(true);
    };

    const handleCloseDialog = () => {
        setShowCodeDialog(false);
    };

    const handleSubmitCode = () => {
        if (!codeSnippet) {
            setError('Vui lòng nhập code!');
            return;
        } else {
            setError('');

            setDataTemp((prevData) => ({
                ...prevData,
                up_code: codeSnippet,
            }));

            handleCloseDialog();
        }
    };

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
        const savedHashtags = JSON.parse(localStorage.getItem('selectedHashtags')) || [];
        const hashtagNames = savedHashtags
            .map((hashtag) => hashtag.name?.toLowerCase() || '')
            .filter((name) => name);
        const strippedHashtagNames = hashtagNames.map((name) =>
            name.startsWith('#') ? name.slice(1) : name,
        );

        const relevantQuestions = listQuestion.filter((question) => {
            const isHashtagRelevant = question.hashtag?.split(',').some(
                (tag) =>
                    hashtagNames.includes(tag.toLowerCase()) ||
                    strippedHashtagNames.includes(tag.toLowerCase()),
            );
            const isQuestionRelevant = hashtagNames.some((tag) =>
                question.questions?.toLowerCase().includes(tag),
            );
            return isHashtagRelevant || isQuestionRelevant;
        });

        const irrelevantQuestions = listQuestion.filter(
            (question) => !relevantQuestions.includes(question),
        );

        return [...relevantQuestions, ...irrelevantQuestions];
    };

    useEffect(() => {
        getFilteredQuestions();
    }, [searchTerm, currentPage, usersPerPage, questions]);
    return (
        <PageContainer
            title="Hãy đặt câu hỏi hoặc chia sẻ kiến thức | Share Code"
            description="Đây là trang đặt câu hỏi"
        >
            <Box sx={{ padding: { xs: '10px' } }}>
                <Grid container spacing={2}>
                    <Grid item xs={8} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            className="heading"
                            sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
                        >
                            Hỏi và chia sẻ lập trình
                        </Typography>
                        <Typography variant="body1" paragraph className="typography-body">
                            Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online
                            và các kỹ thuật lập trình web, nơi tôi có thể hỏi và chia sẻ kiến thức lập trình.
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
                            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        src={userData?.current?.imageUrl || avatardefault}
                                        alt="Hình ảnh người dùng"
                                        sx={{ width: 48, height: 48, marginRight: 2 }}
                                        onError={(e) => {
                                            e.target.src = avatardefault;
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight="bold">
                                        Đặt câu hỏi
                                    </Typography>
                                </Box>
                                {/* Tiêu đề bài viết */}
                                <TextField
                                    fullWidth
                                    placeholder="Bạn muốn hỏi gì?"
                                    variant="standard"
                                    sx={{ marginBottom: 2, borderRadius: '8px' }}
                                    {...register("title", {
                                        required: "Tiêu đề là bắt buộc",
                                        maxLength: { value: 100, message: "Tiêu đề không được quá 100 ký tự" },
                                    })}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    error={!!errors.title}
                                    helperText={errors.title && (errors.title.type === 'minLength'
                                        ? "Title must be at least 3 characters long"
                                        : errors.title.message)}
                                />

                                {/* Nội dung câu hỏi */}
                                <TextField
                                    label="Hãy đặt câu hỏi hoặc chia sẻ kiến thức ?"
                                    variant="outlined"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    name="questions"
                                    sx={{
                                        marginBottom: 2,
                                        borderRadius: '8px',
                                        '& .MuiInputBase-input': { color: 'grey' },
                                        '& .MuiFormLabel-root': { color: 'grey' },
                                    }}
                                    {...register("questions", {
                                        required: "Nội dung câu hỏi là bắt buộc",
                                    })}
                                    error={!!errors.questions}
                                    helperText={errors.questions ? errors.questions.message : null}
                                />

                                {/* Hashtag */}
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Typography variant="body2" sx={{ mr: 2 }}>
                                        <strong>+ Thêm Hashtag</strong>
                                    </Typography>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Nhập hashtag"
                                            variant="standard"
                                            InputProps={{ disableUnderline: true }}
                                            {...register("hashtag", {
                                                required: "Hashtag là bắt buộc",
                                                validate: (value) =>
                                                    value.startsWith('#') || "Hashtag phải bắt đầu bằng dấu #",
                                            })}
                                            error={!!errors.hashtag}
                                            helperText={errors.hashtag ? errors.hashtag.message : null}
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
                                    {/* Code Dialog */}

                                    {showCodeDialog && (
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
                                                        onChange={(e) => setCodeSnippet(e.target.value)}
                                                        error={!!error}
                                                    />
                                                    {error && <FormHelperText error>{error}</FormHelperText>}
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
                                        Đăng
                                    </Button>
                                </Box>
                                <Box>
                                    {/* Preview Images */}
                                    {imagePreviews && imagePreviews.length > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                                gap: '10px',
                                            }}
                                        >
                                            {imagePreviews.slice(0, Math.min(imagePreviews.length, 4)).map((image, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        position: 'relative',
                                                        flexBasis: imagePreviews.length === 1 ? '100%' : (imagePreviews.length === 3 && index === 2 ? '100%' : 'calc(50% - 10px)'),
                                                        maxWidth: imagePreviews.length === 1 ? '100%' : (imagePreviews.length === 3 && index === 2 ? '100%' : 'calc(50% - 10px)'),
                                                        mb: 2,
                                                        textAlign: imagePreviews.length === 3 && index === 2 ? 'center' : 'unset',
                                                        cursor: index === 3 && imagePreviews.length > 4 ? 'pointer' : 'unset',
                                                        overflow: 'hidden',
                                                        borderRadius: '8px',
                                                    }}
                                                >
                                                    <img
                                                        src={image || 'Người dùng không nhập hình ảnh'}
                                                        alt={`Preview ${index}`}
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                    {index === 3 && imagePreviews.length > 4 && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderRadius: '8px',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h5"
                                                                sx={{
                                                                    color: 'white',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '1.5rem'
                                                                }}
                                                            >
                                                                +{imagePreviews.length - 4}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                    {/* Preview Files */}
                                    {fileNames.length > 0 && (
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
                                                {fileNames.map((url, index) => {
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
                                    {/* Code */}
                                    {codeSnippet && (
                                        <Box mt={2}>
                                            <SyntaxHighlighter language="javascript" style={dracula}>
                                                {codeSnippet}
                                            </SyntaxHighlighter>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            {/* Loading Spinner */}
                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                    <CircularProgress />
                                </Box>
                            ) : listQuestion?.length > 0 ? (
                                listQuestion
                                    .sort((a, b) => (a.updatedAt.seconds < b.updatedAt.seconds ? 1 : -1))
                                    .map((question) => {
                                        const listImgUrl = question.imageUrls;
                                        const listFileUrl = question.fileUrls;
                                        return (
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
                                                                avatardefault
                                                            }
                                                            alt="Hình ảnh người dùng"
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius: '50%',
                                                                marginRight: 8,
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = avatardefault;
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
                                                        <ButtonBase
                                                            sx={{
                                                                display: 'block',
                                                                textAlign: 'left',
                                                                width: '100%',
                                                            }}
                                                            onClick={() => handleCardClick(question.id)}
                                                        >
                                                            {/* Display Question Content */}
                                                            <Box sx={{ mt: 3, mb: 3 }}>
                                                                <Typography variant="h5" component="h2" className="article-title">
                                                                    {question?.title.length > 100
                                                                        ? `${question?.title.substring(0, 100)}...`
                                                                        : question?.title}
                                                                </Typography>

                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{ color: '#007bff', fontSize: '0.8rem' }}
                                                                >
                                                                    {question.hashtag}
                                                                </Typography>


                                                                <Typography variant="subtitle1">
                                                                    {question.questions.length > 300
                                                                        ? `${question.questions.substring(0, 300)}...`
                                                                        : question.questions}
                                                                </Typography>


                                                            </Box>
                                                            {/* Hiển thị tệp */}
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
                                                                            const fileNameWithExt = decodeURIComponent(url)
                                                                                .split('/')
                                                                                .pop()
                                                                                .split('?')[0];
                                                                            const cleanFileName = fileNameWithExt
                                                                                .replace(/^\d+_*/, '')
                                                                                .replace(/-/g, '');
                                                                            return cleanFileName !== 'uploads' ? (
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
                                                                                    {cleanFileName}  {/* Display the cleaned file name */}
                                                                                </a>
                                                                            ) : null;
                                                                        })}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {/* Hiển thị ảnh */}
                                                            {listImgUrl && listImgUrl.length > 0 && (
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                        justifyContent: 'center',
                                                                        gap: '10px',
                                                                    }}
                                                                >
                                                                    {listImgUrl.slice(0, Math.min(listImgUrl.length, 4)).map((image, index) => (
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                position: 'relative',
                                                                                flexBasis: listImgUrl.length === 1 ? '100%' : (listImgUrl.length === 3 && index === 2 ? '100%' : 'calc(50% - 10px)'),
                                                                                maxWidth: listImgUrl.length === 1 ? '100%' : (listImgUrl.length === 3 && index === 2 ? '100%' : 'calc(50% - 10px)'),
                                                                                mb: 2,
                                                                                textAlign: listImgUrl.length === 3 && index === 2 ? 'center' : 'unset',
                                                                                cursor: index === 3 && listImgUrl.length > 4 ? 'pointer' : 'unset',
                                                                                overflow: 'hidden',
                                                                                borderRadius: '8px',
                                                                            }}
                                                                            onClick={index === 3 && listImgUrl.length > 4 ? () => setShowAllImages(true) : null}
                                                                        >
                                                                            <img
                                                                                src={image || 'Người dùng không nhập hình ảnh'}
                                                                                alt="hình ảnh"
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: 'auto',
                                                                                    borderRadius: '8px',
                                                                                    objectFit: 'cover',
                                                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                                }}
                                                                            />
                                                                            {index === 3 && listImgUrl.length > 4 && (
                                                                                <Box
                                                                                    sx={{
                                                                                        position: 'absolute',
                                                                                        top: 0,
                                                                                        left: 0,
                                                                                        right: 0,
                                                                                        bottom: 0,
                                                                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                                                        display: 'flex',
                                                                                        justifyContent: 'center',
                                                                                        alignItems: 'center',
                                                                                        borderRadius: '8px',
                                                                                    }}
                                                                                >
                                                                                    <Typography
                                                                                        variant="h5"
                                                                                        sx={{
                                                                                            color: 'white',
                                                                                            fontWeight: 'bold',
                                                                                            fontSize: '1.5rem'
                                                                                        }}
                                                                                    >
                                                                                        +{listImgUrl.length - 4}
                                                                                    </Typography>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    ))}

                                                                    {showAllImages && (
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexWrap: 'wrap',
                                                                                justifyContent: 'center',
                                                                                gap: '10px',
                                                                                mt: 2,
                                                                            }}
                                                                        >
                                                                            {listImgUrl.slice(4).map((image, index) => (
                                                                                <Box
                                                                                    key={index}
                                                                                    sx={{
                                                                                        flexBasis: '48%',
                                                                                        maxWidth: '48%',
                                                                                        mb: 2,
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        src={image || 'Người dùng không nhập hình ảnh'}
                                                                                        alt="hình ảnh"
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            height: 'auto',
                                                                                            borderRadius: '8px',
                                                                                            objectFit: 'cover',
                                                                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            ))}
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </ButtonBase>
                                                        {/* Hiển thị mã code */}
                                                        {question?.up_code && (
                                                            <Box sx={{ mt: 3, mb: 3 }}>
                                                                <SyntaxHighlighter language="javascript" style={dracula}>
                                                                    {expandedQuestions[question.id]
                                                                        ? question.up_code
                                                                        : question.up_code.length > 500
                                                                            ? `${question.up_code.substring(0, 500)}...`
                                                                            : question.up_code}
                                                                </SyntaxHighlighter>

                                                                {/* Chỉ hiển thị nút "Xem thêm/Rút gọn" nếu độ dài mã code lớn hơn 500 */}
                                                                {question.up_code.length > 500 && (
                                                                    <Button
                                                                        size="small"
                                                                        onClick={() => handleToggle(question.id)}
                                                                        sx={{ mt: 1 }}
                                                                    >
                                                                        {expandedQuestions[question.id] ? 'Rút gọn' : 'Xem thêm'}
                                                                    </Button>
                                                                )}
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
                                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                        {/* Kiểm tra xem người dùng đã đăng nhập hay chưa */}
                                                        {!isLoggedIn ? (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Vui lòng <Link to="/auth/login" style={{ color: '#007bff', textDecoration: 'underline' }}>đăng nhập</Link> để xem và bình luận.
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
                                                                                placeholder={`Bình luận dưới tên ${userData.current ? users.find((user) => user.id === userData.current.id)?.name : 'Người dùng'} `}
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
                                                                                marginRight: '420px',
                                                                                marginTop: '-17px',
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
                                                                                                    border: '1px solid #rgb(40, 42, 54)',
                                                                                                    borderRadius: '8px',
                                                                                                    backgroundColor: '#rgb(40, 42, 54)',
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
                                                                            <Box
                                                                                display="flex"
                                                                                alignItems="center"
                                                                                gap="8px"
                                                                            >
                                                                                <Typography
                                                                                    component="span"
                                                                                    variant="caption"
                                                                                    sx={{ color: 'text.secondary' }}
                                                                                >{formatUpdatedAt(comment.created_at)}
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
                                                                                                : { id: comment.id, type: 'comment' }
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
                                                                                            placeholder={`Trả lời dưới tên ${userData.current ? users.find((user) => user.id === userData.current.id)?.name : 'Người dùng'}`}
                                                                                            variant="outlined"
                                                                                            size="small"
                                                                                            fullWidth
                                                                                            value={newReplies[comment.id]?.content || ''} // Lấy nội dung trả lời cho bình luận cụ thể
                                                                                            onChange={(e) =>
                                                                                                setNewReplies((prev) => ({
                                                                                                    ...prev,
                                                                                                    [comment.id]: { ...prev[comment.id], content: e.target.value, },
                                                                                                }))
                                                                                            } // Cập nhật nội dung trả lời cho bình luận cụ thể
                                                                                        />
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

                                                                                            <Box
                                                                                                display="flex"
                                                                                                alignItems="center"
                                                                                                gap="8px"
                                                                                            >
                                                                                                <Typography
                                                                                                    component="span"
                                                                                                    variant="caption"
                                                                                                    sx={{ color: 'text.secondary' }}
                                                                                                >{formatUpdatedAt(comment.created_at)}
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
                                                                                                                : { id: reply.id, type: 'reply' }
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
                                                                                                            src={currentUserImage || 'https://i.pinimg.com/474x/5d/54/46/5d544626add5cbe8dce09b695164633b.jpg'}
                                                                                                            width="30px"
                                                                                                            alt="User  Avatar"
                                                                                                            style={{ borderRadius: '50%', marginRight: '10px' }}
                                                                                                        />
                                                                                                        <TextField
                                                                                                            placeholder={`Trả lời dưới tên ${userData.current ? users.find((user) => user.id === userData.current.id)?.name : 'Người dùng'}`}
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            fullWidth
                                                                                                            value={newReplies[comment.id]?.content || ''} // Lấy nội dung trả lời cho bình luận cụ thể
                                                                                                            onChange={(e) =>
                                                                                                                setNewReplies((prev) => ({
                                                                                                                    ...prev,
                                                                                                                    [comment.id]: { ...prev[comment.id], content: e.target.value, },
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
                                            </Box>
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
                                marginBottom: '10px',
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Người dùng uy tín</Typography>
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

                            {/* Danh sách mentor */}
                            <>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <List>
                                        {filteredMentors.length > 0 ? (
                                            filteredMentors.slice(0, 10).map((mentor) => (
                                                <ListItem
                                                    key={mentor.user?.id}
                                                    sx={{ padding: 0 }}
                                                    onClick={() => navigate(`/profile/${mentor.user.id}`)}
                                                >
                                                    {mentor && (
                                                        <Box
                                                            className="mb-1"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                border: '1px solid #999999',
                                                                padding: '8px',
                                                                borderRadius: '10px',
                                                                backgroundColor: '#fff',
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <img
                                                                src={mentor.user.imageUrl || avatardefault}
                                                                alt="User Avatar"
                                                                style={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: '50%',
                                                                    marginRight: 8,
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.src = avatardefault;
                                                                }}
                                                            />
                                                            <Typography variant="button" color="textPrimary" fontWeight="medium">
                                                                {mentor.user.name}
                                                            </Typography>
                                                        </Box>
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
                                                Không có ai để hiển thị.
                                            </Typography>
                                        )}
                                    </List>
                                )}
                            </>
                        </Box>
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
                                    <CircularProgress />
                                ) : (
                                    <List>
                                        {hashtag.length > 0 ? (
                                            hashtag.slice(0, 20).map((hashtag) => (
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
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ transform: 'translateY(50px)' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        border: '1px solid #ccc',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
};

export default Questions;
