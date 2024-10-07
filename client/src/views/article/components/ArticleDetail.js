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
import { db } from '../../../config/firebaseconfig'; // Firebase configuration

const ArticleDetail = () => {
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
  const [currentUser, setCurrentUser] = useState(user || null);
  const [replyingToUsername, setReplyingToUsername] = useState('');

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
        setUsers(usersData || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
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
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified" && change.doc.data().status === "approved") {
            setSnackbarMessage("Your comment has been approved.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else if (change.type === "modified" && change.doc.data().status === "rejected") {
            setSnackbarMessage("Your comment was not approved.");
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
      alert('Please enter a comment.');
      return;
    }
    const currentDate = new Date().toLocaleString();
    const commentData = {
      article_id: id,
      user_name: currentUser?.name || "Khiem",
      content: newComment,
      created_date: currentDate,
      updated_date: currentDate,
      status: 'pending',
      isNotified: false,
      replies: []
    };
    try {
      await addDoc(collection(db, "commentDetails"), commentData);
      setNewComment('');
      setOpenCommentsDialog(false);
      setSnackbarMessage("Your comment has been submitted and is awaiting approval.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding comment: ", error);
      setSnackbarMessage("Failed to submit the comment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddReply = async (commentId, isReplyToReply = false, replyIndex = null) => {
    if (!replyContent.trim()) {
      alert('Please enter a reply.');
      return;
    }
    const currentDate = new Date().toLocaleString();
    const replyData = {
      user_name: currentUser?.name || "Khiem",
      content: replyContent,
      created_date: currentDate,
      replyingTo: commentId,
    };

    try {
      const commentRef = doc(db, "commentDetails", commentId);
      const commentSnap = await getDoc(commentRef);
      if (commentSnap.exists()) {
        const commentData = commentSnap.data();
        if (isReplyToReply) {
          commentData.replies[replyIndex].replies = [
            ...(commentData.replies[replyIndex].replies || []),
            replyData,
          ];
        } else {
          commentData.replies = [...commentData.replies, replyData];
        }
        await updateDoc(commentRef, commentData);
        setReplyContent('');
        setReplyingTo(null);
        setReplyingToReply(null);
        setSnackbarMessage("Your reply has been submitted.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding reply: ", error);
      setSnackbarMessage("Failed to submit the reply.");
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

  const handleReplyClick = (commentId, username) => {
    setReplyingTo(commentId);
    setReplyingToReply(null);
    setReplyingToUsername(username);
  };

  const handleReplyToReplyClick = (commentId, replyIndex, replyUsername) => {
    setReplyingTo(null);
    setReplyingToReply(replyIndex);
    setReplyingToUsername(replyUsername);
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
        {/* Left Sidebar */}
        <Grid item xs={2}>
          <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
            {users?.find((u) => article?.user_id === u.id)?.name || 'Unknown'}
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

        {/* Article Content */}
        <Grid item xs={10}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {article.title}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {article.content}
          </Typography>
          <Card>
            <CardMedia component="img" height="450" image={article.imageUrl} alt="Article Image" />
          </Card>
          <Divider sx={{ marginTop: '20px' }} />
        </Grid>
      </Grid>

      {/* Comments Dialog */}
      <Dialog open={openCommentsDialog} onClose={() => setOpenCommentsDialog(false)} fullWidth>
        <DialogTitle>
          Comments
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenCommentsDialog(false)}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '0px', paddingRight: '0px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar alt={comment.user_name} src={comment.avatarUrl} />
                  <Typography sx={{ marginLeft: '16px', fontWeight: 'bold' }}>
                    {comment.user_name}
                  </Typography>
                </Box>
                <Typography sx={{ marginLeft: '56px', marginTop: '8px' }}>{comment.content}</Typography>
                <Typography variant="caption" sx={{ marginLeft: '56px', marginTop: '4px', color: 'gray' }}>
                  {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
                </Typography>
                <Box sx={{ marginLeft: '56px', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleReplyClick(comment.id, comment.user_name)}>
                    <ReplyIcon />
                  </IconButton>
                  <Typography variant="caption" sx={{ marginLeft: '8px' }}>
                    Reply
                  </Typography>
                </Box>

                {/* Replies */}
                {comment.replies?.map((reply, replyIndex) => (
                  <Box key={replyIndex} sx={{ marginLeft: '72px', marginTop: '8px', borderLeft: '2px solid #ccc', paddingLeft: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={reply.user_name} src={reply.avatarUrl} />
                      <Typography sx={{ marginLeft: '16px', fontWeight: 'bold' }}>
                        {reply.user_name}
                      </Typography>
                    </Box>
                    <Typography sx={{ marginLeft: '56px', marginTop: '8px' }}>{reply.content}</Typography>
                    <Typography variant="caption" sx={{ marginLeft: '56px', marginTop: '4px', color: 'gray' }}>
                      {formatDistanceToNow(new Date(reply.created_date), { addSuffix: true })}
                    </Typography>
                    <Box sx={{ marginLeft: '56px', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                      <IconButton onClick={() => handleReplyToReplyClick(comment.id, replyIndex, reply.user_name)}>
                        <ReplyIcon />
                      </IconButton>
                      <Typography variant="caption" sx={{ marginLeft: '8px' }}>
                        Reply
                      </Typography>
                    </Box>
                  </Box>
                ))}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <Box sx={{ marginLeft: '56px', marginTop: '8px', width: '100%' }}>
                    <TextField
                      label={`Reply to ${replyingToUsername}`}
                      fullWidth
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      multiline
                      rows={2}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                      <Button onClick={handleCancelReply} sx={{ marginRight: '8px' }}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddReply(comment.id)}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Reply-to-Reply Input */}
                {replyingToReply === index && (
                  <Box sx={{ marginLeft: '56px', marginTop: '8px', width: '100%' }}>
                    <TextField
                      label={`Reply to ${replyingToUsername}`}
                      fullWidth
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      multiline
                      rows={2}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                      <Button onClick={handleCancelReply} sx={{ marginRight: '8px' }}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddReply(comment.id, true, index)}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ marginTop: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Add a Comment
            </Typography>
            <TextField
              label="Your comment"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              rows={4}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticleDetail;
