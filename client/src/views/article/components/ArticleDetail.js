import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, Avatar, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, List, ListItem, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconHeart, IconMessageCircle } from '@tabler/icons';
import { useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ReplyIcon from '@mui/icons-material/Reply';
import { Snackbar, Alert } from "@mui/material";
import { doc, getDoc, addDoc, collection, getDocs, updateDoc, query, onSnapshot, where } from 'firebase/firestore';
import './style.css';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase
import { db } from '../../../config/firebaseconfig';

const ArticleDetail = () => {
  // const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToReply, setReplyingToReply] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const location = useLocation();
  const { id, user } = location.state || {};
  console.log(id);
  const [currentUser, setCurrentUser] = useState(user || null);
  const [replyingToUsername, setReplyingToUsername] = useState('');
  const navigate = useNavigate();
  const [commentImages, setCommentImages] = useState([]); // Thêm ảnh vào bình luận
  const [replyImages, setReplyImages] = useState([]); // Thêm ảnh vào trả lời

  const handleLoginClick = () => {
    navigate('/auth/login'); // Điều hướng đến trang đăng nhập
  };
  const storage = getStorage();

  const handleAddImage = (event) => {
    const images = event.target.files;
    const imagesArray = Array.from(images);
    setCommentImages(imagesArray);

    const storage = getStorage();
    const imageRef = ref(storage, `images/${imagesArray[0].name}`);
    uploadBytes(imageRef, imagesArray[0]).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        // Lưu trữ URL của ảnh vào Firestore
      });
    });
  };

  const handleAddReplyImage = (event) => {
    const images = event.target.files;
    const imagesArray = Array.from(images);
    setReplyImages(imagesArray);

    const storage = getStorage();
    const imageRef = ref(storage, `images/${imagesArray[0].name}`);
    uploadBytes(imageRef, imagesArray[0]).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        // Lưu trữ URL của ảnh vào Firestore
      });
    });
  };

  useEffect(() => {
    if (!currentUser) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'articles', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData || []); // Đảm bảo `users` là mảng, ngay cả khi không có dữ liệu
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchCommentsByArticle = () => {
    const commentsRef = collection(db, "commentDetails");
    const q = query(commentsRef, where("article_id", "==", id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsList || []); // Đặt trạng thái bình luận là approved
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchCommentsByArticle();
    return unsubscribe;
  }, [id]);

  const handleAddComment = async () => {
    if (!currentUser) {
      setSnackbarMessage("Bạn cần phải đăng nhập để bình luận.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    if (!newComment.trim()) {
      alert('Vui lòng nhập bình luận.');
      return;
    }
    if (!newComment.trim() && !commentImages.length) {
      alert('Vui lòng nhập bình luận hoặc thêm ảnh.');
      return;
    }
    const currentDate = new Date().toLocaleString(); // Lấy thời gian hiện tại với định dạng ngày và giờ

    const commentData = {
      article_id: id,
      user_name: currentUser?.name || "Khiem",
      content: newComment,
      created_date: currentDate,
      updated_date: currentDate,
      // status: 'pending',
      // isNotified: false,
      replies: []
    };
    if (commentImages.length > 0) {
      const images = [];
      for (let i = 0; i < commentImages.length; i++) {
        const imageRef = ref(storage, `images/${commentImages[i].name}`);
        const snapshot = await uploadBytes(imageRef, commentImages[i]);
        const url = await getDownloadURL(snapshot.ref);
        images.push(url);
      }
      commentData.images = images;
    }
    try {
      const docRef = await addDoc(collection(db, "commentDetails"), commentData);
      console.log("Comment added with ID: ", docRef.id);
      fetchCommentsByArticle();
      setNewComment('');
      setOpenCommentsDialog(false);
      setSnackbarMessage("Bình luận của bạn đã được gửi.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding comment: ", error);
      setSnackbarMessage("Bình luận không thành công!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const handleAddReply = async (commentId, isReplyToReply = false, replyIndex = null) => {
    if (!replyContent.trim() && !replyImages.length) {
      alert('Vui lòng nhập nội dung trả lời hoặc thêm ảnh.');
      return;
    }

    const currentDate = new Date().toLocaleString(); // Lấy thời gian hiện tại với định dạng ngày và giờ

    const replyData = {
      user_name: currentUser?.name || "Khiem",
      content: replyContent,
      created_date: currentDate,
      replyingTo: commentId,
    };

    if (replyImages.length > 0) {
      const images = [];
      for (let i = 0; i < replyImages.length; i++) {
        const imageRef = ref(storage, `images/${replyImages[i].name}`);
        const snapshot = await uploadBytes(imageRef, replyImages[i]);
        const url = await getDownloadURL(snapshot.ref);
        images.push(url);
      }
      replyData.images = images;
    }

    try {
      const commentRef = doc(db, "commentDetails", commentId);
      const commentSnap = await getDoc(commentRef);

      if (commentSnap.exists()) {
        const commentData = commentSnap.data();

        if (isReplyToReply) {
          // Nếu đang trả lời trả lời của bình luận
          commentData.replies[replyIndex].replies = [
            ...(commentData.replies[replyIndex].replies || []),
            replyData,
          ];
        } else {
          // Trả lời bình luận chính
          commentData.replies = [...commentData.replies, replyData];
        }

        await updateDoc(commentRef, commentData);
        setReplyContent('');
        setReplyImages([]); // Xóa ảnh sau khi thêm trả lời
        setReplyingTo(null);
        setReplyingToReply(null);
        setSnackbarMessage("Trả lời của bạn đã được gửi.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding reply: ", error);
      setSnackbarMessage("Trả lời không thành công!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyingToReply(null);
    setReplyingToUsername('');
  };

  // Trả lời bình luận chính
  const handleReplyClick = (commentId, userName) => {
    setReplyingTo(commentId);
    setReplyingToUsername(userName);
  };

  // Trả lời của trả lời
  const handleReplyToReplyClick = (commentId, replyIndex, replyUserName) => {
    setReplyingToReply(replyIndex); // Đặt index của reply đang được trả lời
    setReplyingToUsername(replyUserName); // Đặt tên của người dùng từ reply trước đó
    setReplyContent(''); // Xóa nội dung trả lời trước đó
    setReplyImages([]); // Xóa ảnh trả lời trước đó
  };

  if (!article) {
    return (
      <Typography variant="h5" color="text.secondary" align="center">
        Article not found
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={2} sx={{ position: 'sticky', top: '85px', backgroundColor: 'white', zIndex: 1, padding: '16px' }}>
          <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
            {users?.find((u) => article?.user_id === u.id)?.name || 'Unknown'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Lập trình là đam mê
          </Typography>
          <Divider sx={{ marginTop: '10px' }} />
          <Box sx={{ marginTop: '10px' }}>
            <IconButton aria-label="like">
              <IconHeart />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>
              15
            </Typography>
            <IconButton aria-label="comments" sx={{ marginLeft: '16px' }} onClick={() => setOpenCommentsDialog(true)}>
              <IconMessageCircle />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>
              {comments.length}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={10}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {article.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <img
              src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
              width="40px"
              alt="User Avatar"
              style={{ borderRadius: '50%', marginRight: '10px' }}
            /> <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
              {users?.find(u => article?.user_id === u.id)?.name || "Unknown"}
            </Typography>

          </Box>

          {/* <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar alt="Author Name" src="https://via.placeholder.com/150" sx={{ width: 40, height: 40 }} />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                {users?.find((u) => article?.user_id === u.id)?.name || 'Unknown'}
              </Typography>
             
            </Box>
          </Box> */}

          <Divider sx={{ marginBottom: '20px' }} />

          <Typography variant="body1" paragraph>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Typography>

          <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={article.image || 'https://via.placeholder.com/800x400'} alt="Article" style={{ width: '100%', borderRadius: '8px' }} />
          </Box>

          {/* <Box sx={{ marginTop: '20px' }}>
            <Typography variant="body2" color="textSecondary" sx={{ backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '5px 10px', color: '#555', display: 'inline-block' }}>
              {article.categories_id}
            </Typography>
          </Box> */}

          <Box sx={{ padding: '20px' }}>
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>
                Bài đăng cùng tác giả
              </Typography>
              <ul>
                <li>
                  <Link href="#" underline="hover" sx={{ color: 'black' }}>
                    Thư cảm ơn gửi đến anh Sơn
                  </Link>
                </li>
              </ul>
            </Box>

            <Divider sx={{ borderBottomWidth: 5, marginBottom: '20px', borderColor: '#5d86fe' }} />

            <Typography variant="h5" gutterBottom>
              Bài viết nổi bật khác
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardMedia component="img" alt="Image 1" height="140" image="https://files.fullstack.edu.vn/f8-prod/blog_posts/279/6153f692d366e.jpg" title="Image 1" />
                </Card>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography variant="body2">
                Bài viết này hiện có <strong>{comments.length}</strong> bình luận
              </Typography>
              <IconButton aria-label="reply" sx={{ marginLeft: 'auto', display: 'block' }} onClick={() => setOpenCommentsDialog(true)}>
                {/* <ReplyIcon /> */}
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton aria-label="like" sx={{ color: 'blue' }}>
                <IconHeart />
              </IconButton>
              <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>
                15
              </Typography>
              <IconButton aria-label="comments" sx={{ marginLeft: '16px' }} onClick={() => setOpenCommentsDialog(true)}>
                <IconMessageCircle />
              </IconButton>
              <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>
                {comments.length}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Dialog for Comments */}
      <Dialog open={openCommentsDialog} onClose={() => setOpenCommentsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Bình luận
          <IconButton aria-label="close" onClick={() => setOpenCommentsDialog(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Comment Input Section */}
          {!currentUser ? (
            <Typography variant="body2" color="textSecondary">
              Vui lòng{' '}
              <Button onClick={handleLoginClick} style={{ padding: 0, color: 'primary' }}>
                đăng nhập
              </Button>
              {' '}để bình luận.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <Avatar alt="Your Avatar" src="https://i.pinimg.com/736x/0d/e2/0f/0de20f2a3e65ae8b92e263dd8340a76c.jpg" sx={{ marginRight: 2 }} />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label="Viết bình luận"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={1}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ width: '100%' }} // Add this line
                />
                <input type="file" multiple onChange={handleAddImage} sx={{ marginTop: 2, width: '100%' }} />
              </Box>
            </Box>
          )}
          {currentUser && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 1 }}>
              <Button variant="contained" color="primary" onClick={handleAddComment} sx={{ padding: '6px 12px' }}>
                Gửi bình luận
              </Button>
            </Box>
          )}
          <List sx={{ padding: 0, margin: 0 }}>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start" sx={{ padding: 2, borderBottom: '1px solid #ccc' }}>
                <Avatar alt={comment.user_name} src={'https://i.pinimg.com/474x/4a/ab/e2/4aabe24a11fd091690d9f5037169ba6e.jpg'} />
                <Box ml={1}>
                  <Typography variant="body1" color="textPrimary">
                    <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{comment.user_name}</span>
                  </Typography>
                  {comment.images && comment.images.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: 2 }}>
                      {comment.images.map((image, index) => (
                        <img src={image} key={index} alt="Ảnh trả lời" style={{ width: '200px', height: '200px', margin: '10px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' , objectFit: 'cover'  }} />
                      ))}
                    </Box>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    {comment.content}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <IconButton
                      aria-label="reply"
                      onClick={() => {
                        if (!currentUser) {
                          setSnackbarMessage("Bạn cần phải đăng nhập để trả lời bình luận.");
                          setSnackbarSeverity("warning");
                          setSnackbarOpen(true);
                          return;
                        }
                        handleReplyClick(comment.id, comment.user_name);
                      }}
                    >
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary" sx={{ marginRight: 1 }}>
                      Reply
                    </Typography>
                    {replyingTo === comment.id && (
                      <Button variant="outlined" color="inherit" onClick={handleCancelReply} sx={{ marginLeft: 1 }}>
                        Hủy
                      </Button>
                    )}
                  </Box>

                  {replyingTo === comment.id && (
                    <Box className="reply-input" mt={2}>
                      <TextField
                        label={`Trả lời ${replyingToUsername}`} // Đảm bảo hiển thị đúng người đang được trả lời
                        variant="outlined"
                        multiline
                        fullWidth
                        rows={1}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <input type="file" multiple onChange={handleAddReplyImage} sx={{ marginTop: 1 }} />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddReply(comment.id)} // Gửi reply cho comment này
                        sx={{ marginTop: 1, padding: '6px 12px' }}
                      >
                        Gửi trả lời
                      </Button>
                    </Box>
                  )}

                  {/* Hiển thị các replies */}
                  {comment.replies?.length > 0 && (
                    <List sx={{ padding: 0, margin: 0, marginLeft: 4 }}>
                      {comment.replies.map((reply, index) => (
                        <ListItem key={index} alignItems="flex-start" sx={{ padding: 2, borderBottom: '1px solid #ccc' }}>
                          <Avatar alt={reply.user_name} src={'https://i.pinimg.com/474x/4a/ab/e2/4aabe24a11fd091690d9f5037169ba6e.jpg'} />
                          <Box ml={1}>
                            <Typography variant="body1" color="textPrimary">
                              <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{reply.user_name}</span>
                              <span style={{ fontSize: '0.8rem', color: 'gray' }}> {' > '} </span>
                              <span style={{ fontWeight: 'bold' }}>{comment.user_name || reply.user_name}</span>
                            </Typography>
                            <Box display="flex" alignItems="center">
                              {reply.images && reply.images.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                  {reply.images.map((image, index) => (
                                    <img src={image} key={index} alt="Ảnh trả lời" style={{ width: '300px', height: '200px', margin: '10px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' , objectFit: 'cover' }} />
                                  ))}
                                </Box>
                              )}                             
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
                                {reply.content}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatDistanceToNow(new Date(reply.created_date), { addSuffix: true })}
                              </Typography>
                            <Box display="flex" alignItems="center" mt={1}>
                              <IconButton
                                aria-label="reply"
                                onClick={() => {
                                  if (!currentUser) {
                                    setSnackbarMessage("Bạn cần phải đăng nhập để trả lời bình luận.");
                                    setSnackbarSeverity("warning");
                                    setSnackbarOpen(true);
                                    return;
                                  }
                                  handleReplyToReplyClick(comment.id, index, reply.user_name);
                                }}
                              >
                                <ReplyIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
                                Reply
                              </Typography>
                              {replyingToReply === index && (
                                <Button variant="outlined" color="inherit" onClick={handleCancelReply} sx={{ marginLeft: 1 }}>
                                  Hủy
                                </Button>
                              )}
                            </Box>

                            {replyingToReply === index && (
                              <Box className="reply-input" mt={2}>
                                <TextField
                                  label={`Trả lời ${reply.user_name}`} // Sử dụng đúng tên người dùng của reply
                                  variant="outlined"
                                  multiline
                                  fullWidth
                                  rows={1}
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                />
                                <input type="file" multiple onChange={handleAddReplyImage} sx={{ marginTop: 1 }} />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleAddReply(comment.id)} // Gửi reply cho comment này
                                  sx={{ marginTop: 1, padding: '6px 12px' }}
                                >
                                  Gửi trả lời
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticleDetail;