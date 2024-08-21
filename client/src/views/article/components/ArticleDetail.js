import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, Avatar, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, List, ListItem, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconHeart, IconMessageCircle } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import apis from "../../../apis/articleApi";
import userApi from "../../../apis/userApi";
import commentApi from "../../../apis/commentDetailApi";
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ReplyIcon from '@mui/icons-material/Reply';
import './style.css';

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
        const response = await apis.getArticleDetails(id);
        if (response.status === 200) {
          setArticle(response.data);
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
    const fetchUser = async () => {
      try {
        const response = await userApi.getList();
        if (response.status === 200) {
          const user = response.data || [];
          setUsers(user);
          console.log("Fetched users:", user);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentApi.getList();
        if (response.status === 200) {
          const comment = response.data || [];
          setComments(comment);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleAddComment = () => {
    // Handle adding a new comment
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
        <Grid item xs={2} sx={{ position: 'sticky', top: '85px', alignSelf: 'start', backgroundColor: 'white', zIndex: 1, padding: '16px' }}>
          <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
            {users?.filter(u => article?.user_id === u.id)?.[0]?.name}
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
            <Avatar
              alt="Author Name"
              src="https://via.placeholder.com/150"
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                {users?.filter(u => article?.user_id === u.id)?.[0]?.name}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ marginBottom: '20px' }} />

          <Typography variant="body1" paragraph>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Typography>

          <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={article.image || "https://via.placeholder.com/800x400"}
              alt="Article"
              style={{ width: '100%', borderRadius: '8px' }}
            />
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
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '5px 10px', marginRight: '10px', color: '#555', display: 'inline-block' }}
            >
              {article.categories_id}
            </Typography>
          </Box>
          <Box sx={{ padding: '20px' }}>
            {/* Related Articles */}
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>
                Bài đăng cùng tác giả
              </Typography>
              <ul>
                <li>
                  <Link
                    href="#"
                    underline="hover"
                    sx={{
                      color: 'black',
                      '&:hover': { color: 'black' },
                      '&:visited': { color: 'black' },
                    }}
                  >
                    Thư cảm ơn gửi đến anh Sơn
                  </Link>
                </li>
              </ul>
            </Box>

            <Divider sx={{ borderBottomWidth: 5, marginBottom: '20px', borderColor: '#5d86fe' }} />

            <Typography variant="h5" gutterBottom>
              Bài viết nổi bật khác
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="body2">
                Đăng bởi Sơn Đặng • 3 năm trước
              </Typography>
            </Box>
            <Typography variant="h6" component="h2" gutterBottom>
              Tổng hợp các sản phẩm của học viên tại F8 👏👏
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardMedia
                    component="img"
                    alt="Image 1"
                    height="140"
                    image="https://files.fullstack.edu.vn/f8-prod/blog_posts/65/6139fe28a9844.png"
                    title="Image 1"
                  />
                </Card>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography variant="body2">
                Bài viết này nhằm tổng hợp lại các dự án mà học viên F8 đã tạo ra, giúp bạn có thêm nguồn cảm hứng để học tập và làm việc.
              </Typography>
              <Link href="#" underline="hover" color="primary" sx={{ display: 'block', marginTop: '10px' }}>
                Xem chi tiết
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={openCommentsDialog}
        onClose={() => setOpenCommentsDialog(false)}
        fullWidth
        maxWidth="md"
        sx={{ position: 'absolute', right: 0, marginRight: '20px' }}
      >
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
          <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <Avatar alt="User Avatar" src="https://via.placeholder.com/40" sx={{ marginRight: '16px' }} />
            <TextField
              fullWidth
              label="Add a comment"
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              rows={2}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginBottom: '20px'}}
            onClick={handleAddComment}
          >
            Submit
          </Button>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
                <Avatar alt={comment.username} src={comment.avatar} sx={{ width: 40, height: 40 }} />
                <Box sx={{ marginLeft: '16px', flex: 1 }}>
                  <Typography variant="subtitle2" color="textPrimary" sx={{ marginTop: '4px' , color: 'blue' }}>
                    {comment.user_name} 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: '4px' }}>
                    {comment.content}
                  </Typography>
                  <Box sx={{ marginTop: '8px' }}>
                    <IconButton aria-label="like" sx={{ color: 'blue' }}>
                      <IconHeart />
                    </IconButton>
                    <IconButton aria-label="reply" sx={{ marginLeft: '8px', color: 'blue' }}>
                      <ReplyIcon />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ArticleDetail;
