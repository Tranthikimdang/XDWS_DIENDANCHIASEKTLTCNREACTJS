import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, Avatar, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, List, ListItem, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconHeart, IconMessageCircle } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ReplyIcon from '@mui/icons-material/Reply';
import './style.css';
// Firebase
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from '../../../config/firebaseconfig'; 

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [newComment, setNewComment] = useState('');

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
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsQuery = query(collection(db, 'comments'), where('article_id', '==', id));
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      } catch (error) {
        console.error("Lỗi khi lấy comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const handleAddComment = () => {
    console.log("New Comment:", newComment);
    setNewComment('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return (
      <Typography variant="h5" color="text.secondary" align="center">
        Article not found
      </Typography>
    );
  }

  const formattedDate = article.created_at ? new Date(article.created_at.seconds * 1000).toLocaleDateString() : '';

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={2} sx={{ position: 'sticky', top: '85px', backgroundColor: 'white', zIndex: 1, padding: '16px' }}>
          <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
            {users?.find(u => article?.user_id === u.id)?.name || "Unknown"}
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
              6
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={10}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {article.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar alt="Author Name" src="https://via.placeholder.com/150" sx={{ width: 40, height: 40 }} />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                {users?.find(u => article?.user_id === u.id)?.name || "Unknown"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ marginBottom: '20px' }} />

          <Typography variant="body1" paragraph>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Typography>

          <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={article.image || "https://via.placeholder.com/800x400"} alt="Article" style={{ width: '100%', borderRadius: '8px' }} />
          </Box>

          <Typography variant="body1" paragraph>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Typography>
          <Box sx={{ marginTop: '20px' }}>
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
              6
            </Typography>
          </Box>

          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="body2" color="textSecondary" sx={{ backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '5px 10px', color: '#555', display: 'inline-block' }}>
              {article.categories_id}
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
                  <CardMedia component="img" alt="Image 1" height="140" image="https://files.fullstack.edu.vn/f8-prod/blog_posts/279/6153f692d366e.jpg" title="Image 1" />
                </Card>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography variant="body2">
                Bài viết này hiện có <strong>9</strong> bình luận
              </Typography>
              <IconButton aria-label="reply" sx={{ marginLeft: 'auto', display: 'block' }} onClick={() => setOpenCommentsDialog(true)}>
                <ReplyIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openCommentsDialog} onClose={() => setOpenCommentsDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Bình luận
          <IconButton aria-label="close" onClick={() => setOpenCommentsDialog(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start">
                <Avatar alt={comment.user_name} src={comment.avatar || 'https://via.placeholder.com/40'} />
                <Box ml={2}>
                  <Typography variant="body1" color="textPrimary">
                    {comment.user_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {comment.content}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          <Divider />
          <TextField
            label="Viết bình luận"
            variant="outlined"
            multiline
            fullWidth
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddComment}>
            Gửi bình luận
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ArticleDetail;
