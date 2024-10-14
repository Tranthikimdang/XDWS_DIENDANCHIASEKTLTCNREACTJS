import React, { useEffect, useState } from 'react';
import { Box, Grid, Menu, MenuItem, Typography, IconButton, Avatar, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, List, ListItem, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconHeart, IconMessageCircle } from '@tabler/icons';
import { useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import ReplyIcon from '@mui/icons-material/Reply';
import { Snackbar, Alert } from "@mui/material";
//icon
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import './ArticleDetail.css';

// Firebase
import { db } from '../../../config/firebaseconfig';
import { doc, getDoc, addDoc, collection, getDocs, updateDoc, query, onSnapshot, where } from 'firebase/firestore';
import './style.css';

const ArticleDetail = () => {
  // const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [users, setUsers] = useState([]);
  const [catesMap, setCatesMap] = useState({});
  const [cates, setCates] = useState([]);
  const [comments, setComments] = useState([]);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const location = useLocation();
  const { id, user } = location.state || {};
  const [currentUser, setCurrentUser] = useState(user || null);



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

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCates(categoriesData);

        // Create a mapping of category ID to name
        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCatesMap(categoriesMap);

      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCommentsByArticle = () => {
      const commentsRef = collection(db, "commentDetails");
      const q = query(commentsRef, where("article_id", "==", id));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const commentsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Kiểm tra nếu trạng thái comment từ pending sang approved
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified" && change.doc.data().status === "approved") {
            setSnackbarMessage("Bình luận của bạn đã được phê duyệt.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else if (change.type === "modified" && change.doc.data().status === "rejected") {
            setSnackbarMessage("Bình luận của bạn không được phê duyệt.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        });
        const approvedComments = commentsList.filter(comment => comment.status === "approved");
        setComments(approvedComments || []);
      });

      return unsubscribe;
    };

    fetchCommentsByArticle();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Vui lòng nhập bình luận.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const commentData = {
      article_id: id,
      user_name: currentUser?.name || "Khiem",
      content: newComment,
      created_date: currentDate,
      updated_date: currentDate,
      status: 'pending',
      isNotified: false, // thong báo 
      replies: [] // thêm mảng để lưu các câu trả lời      
    };

    try {
      const docRef = await addDoc(collection(db, "commentDetails"), commentData);
      setNewComment('');
      setOpenCommentsDialog(false);
      setSnackbarMessage("Bình luận của bạn đã được gửi và đang chờ duyệt.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding comment: ", error);
      setSnackbarMessage("Bình luận không thành công!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyContent.trim()) {
      alert('Vui lòng nhập nội dung trả lời.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const replyData = {
      user_name: currentUser?.name || "Khiem",
      content: replyContent,
      created_date: currentDate,
    };

    try {
      const commentRef = doc(db, "commentDetails", commentId);
      const commentSnap = await getDoc(commentRef);

      if (commentSnap.exists()) {
        const currentReplies = commentSnap.data().replies || [];
        await updateDoc(commentRef, {
          replies: [...currentReplies, replyData],
        });
        setReplyContent('');
        setReplyingTo(null);
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

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  if (!article) {
    return (
      <Typography variant="h5" color="text.secondary" align="center">
        Article not found
      </Typography>
    );
  }

  const menuItems = [
    { icon: <FacebookIcon />, text: 'Share on Facebook' },
    { icon: <TwitterIcon />, text: 'Share on Twitter' },
    { icon: <EmailIcon />, text: 'Share via Email' },
    { icon: <LinkIcon />, text: 'Copy Link' },
    { icon: <FlagIcon />, text: 'Report Article' },
  ];

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={3}>
        <Grid
          item xs={2}
          sx={{
            position: 'sticky',
            top: '85px',
            backgroundColor: 'white',
            zIndex: 1,
            padding: '16px',
            height: '100vh' // Đảm bảo chiều cao đủ dài để sticky hoạt động
          }}
        >
          <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
            <strong>{users?.find((u) => article?.user_id === u.id)?.name || 'Unknown'}</strong>
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
          <Box display="flex" alignItems="center" sx={{ position: 'relative' }}>
            <img
              src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
              width="40px"
              alt="User Avatar"
              style={{ borderRadius: '50%', marginRight: '10px' }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {users?.find((u) => article?.user_id === u.id)?.name || 'Unknown'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {formatUpdatedAt(article.updated_at)}
              </Typography>
            </Box>

            {/* Nút icon bên phải */}
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
              <IconButton
                aria-label="bookmark"
                onClick={(event) => event.stopPropagation()} // Ngăn sự kiện click thẻ Card
              >
                <IconBookmark />
              </IconButton>
              <IconButton
                aria-label="more"
                onClick={(event) => {
                  event.stopPropagation(); // Ngăn sự kiện click thẻ Card
                  handleClick(event);
                }}
              >
                <IconDots />
              </IconButton>
              <Menu id="menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {menuItems.map((item, i) => (
                  <MenuItem key={i} onClick={handleClose}>
                    {item.icon}
                    <span style={{ marginLeft: 10 }}>{item.text}</span>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

          </Box>


          <Divider sx={{ marginBottom: '20px' }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {article.title}
          </Typography>
          <Typography variant="body1" paragraph>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Typography>
          <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={article.image || 'https://via.placeholder.com/800x400'} alt="Article" style={{ width: '100%', borderRadius: '8px' }} />
          </Box>

          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="body2" color="textSecondary" sx={{ backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '5px 10px', color: '#555', display: 'inline-block' }}>
              {catesMap[article.categories_id] || 'Chưa rõ chuyên mục'}
            </Typography>
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
                  <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img src={article.image || 'https://via.placeholder.com/800x400'} alt="Article" style={{ width: '100%', borderRadius: '8px' }} />
                  </Box>
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
            <Box>
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Bài viết cùng chuyên mục
              </Typography>
              <Grid item xs={12}>

                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                  </Box>
                ) : (
                  <ul className="category-list">
                    {cates.map((cate) => (
                      <Link to={`/CateArticleDetail/${cate.id}`} style={{ textDecoration: 'none' }}>
                        <li key={cate.id} className="category-item">
                          <strong>{cate.name}</strong>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </Grid>
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
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Avatar alt="Your Avatar" src="https://i.pinimg.com/736x/0d/e2/0f/0de20f2a3e65ae8b92e263dd8340a76c.jpg" />
            <TextField
              label="Viết bình luận"
              variant="outlined"
              multiline
              fullWidth
              rows={1}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ marginLeft: 2 }}
            />
          </Box>

          {/* Button for Sending Comment */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 1 }}>
            <Button variant="contained" color="primary" onClick={handleAddComment} sx={{ padding: '6px 12px' }}>
              Gửi bình luận
            </Button>
          </Box>

          {/* Comments List */}
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start">
                <Avatar alt={comment.user_name} src={'https://i.pinimg.com/474x/4a/ab/e2/4aabe24a11fd091690d9f5037169ba6e.jpg'} />
                <Box ml={1}>
                  <Typography variant="body1" color="textPrimary">
                    {comment.user_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {comment.content}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <IconButton aria-label="reply" onClick={() => handleReplyClick(comment.id)}>
                      <ReplyIcon fontSize="small" />
                      <Typography variant="body2" color="textSecondary">
                        Reply
                      </Typography>
                    </IconButton>
                    {replyingTo === comment.id && (
                      <Button variant="outlined" color="inherit" onClick={handleCancelReply} sx={{ marginLeft: 1 }}>
                        Hủy
                      </Button>
                    )}
                  </Box>
                  {replyingTo === comment.id && (
                    <Box className="reply-input" mt={2}>
                      <TextField
                        label="Viết trả lời"
                        variant="outlined"
                        multiline
                        fullWidth
                        rows={1}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <Button variant="contained" color="primary" onClick={() => handleAddReply(comment.id)} sx={{ marginTop: 1, padding: '6px 12px' }}>
                        Gửi trả lời
                      </Button>
                    </Box>
                  )}
                  {comment.replies?.length > 0 && (
                    <List>
                      {comment.replies.map((reply, index) => (
                        <ListItem key={index} alignItems="flex-start">
                          <Avatar alt={reply.user_name} src={'https://i.pinimg.com/474x/4a/ab/e2/4aabe24a11fd091690d9f5037169ba6e.jpg'} />
                          <Box ml={1}>
                            <Typography variant="body1" color="textPrimary">
                              {reply.user_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {reply.content}
                            </Typography>
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

