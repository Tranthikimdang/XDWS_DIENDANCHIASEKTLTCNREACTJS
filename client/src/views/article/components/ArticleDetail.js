import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, Avatar, Divider, CircularProgress } from '@mui/material';
import { IconHeart, IconMessageCircle } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import apis from "../../../apis/articleApi";
import userApi from "../../../apis/userApi";
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import './style.css';

const ArticleDetail = () => {
  const { id } = useParams(); // Assuming the article ID comes from the route parameters
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

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

  // Convert the created_at object to a readable date string
  const formattedDate = article.created_at ? new Date(article.created_at.seconds * 1000).toLocaleDateString() : '';

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid
          item
          xs={2}
          sx={{
            position: 'sticky',    // Làm cho sidebar "dính" khi cuộn trang
            top: '85px',           // Giữ khoảng cách 16px từ đỉnh trang khi "dính"
            alignSelf: 'start',    // Đảm bảo nó dính từ đầu khi có lưới bố cục
            backgroundColor: 'white', // Đảm bảo nó luôn hiển thị rõ ràng
            zIndex: 1,             // Đảm bảo nó nổi lên trên các thành phần khác
            padding: '16px',       // Khoảng cách bên trong cho đẹp
          }}
          
        >
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
            <IconButton aria-label="comments" sx={{ marginLeft: '16px' }}>
              <IconMessageCircle />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>
              6
            </Typography>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid
          item
          xs={10} // Adjust width to fill the remaining space
          
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {article.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar
              alt="Author Name"
              src="https://via.placeholder.com/150" // Replace with the author's avatar URL if available
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                {users?.filter(u => article?.user_id === u.id)?.[0]?.name}
              </Typography>
              {/* <Typography variant="body2" color="textSecondary">
                {formattedDate} · 4 phút đọc {/* Adjust the reading time if available */}
              {/* </Typography> */}
            </Box>
          </Box>

          <Divider sx={{ marginBottom: '20px' }} />

          <Typography variant="body1" paragraph>
            {/* Render the introduction part of the content */}
            {/* Parse HTML content safely */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Typography>

          <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={article.image || "https://via.placeholder.com/800x400"} // Replace with the article image URL
              alt="Article"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>

          <Typography variant="body1" paragraph>
            {/* Render the full content here */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Typography>
          <Box sx={{ marginTop: '20px' }}>
            <IconButton aria-label="like">
              <IconHeart />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>
              15
            </Typography>
            <IconButton aria-label="comments" sx={{ marginLeft: '16px' }}>
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
              sx={{
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                padding: '5px 10px',
                marginRight: '10px',
                color: '#555',
                display: 'inline-block', // ensures that the badge wraps the text closely
              }}
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
                      color: 'black', // Sets the text color to black
                      '&:hover': {
                        color: 'black', // Ensures the color remains black on hover
                      },
                      '&:visited': {
                        color: 'black', // Ensures the color remains black for visited links
                      },
                    }}
                  >
                    Thư cảm ơn gửi đến anh Sơn
                  </Link>
                </li>
              </ul>
            </Box>

            <Divider
              sx={{
                borderBottomWidth: 5,
                marginBottom: '20px',
                borderColor: '#5d86fe', // You can use any color here
              }}
            />
            {/* Featured Articles */}
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
                Bài viết này nhằm tổng hợp lại các dự án mà học viên F8 đã hoàn thành và chia sẻ trên nhóm
                <Link href="#" underline="hover">
                  Học lập trình web F8
                </Link>. Các dự án dưới đây được mình ngẫu nhiên lựa chọn để đăng chứ không mang tính xếp hạng các bạn nhé.
              </Typography>
              <Link href="#" underline="hover" color="primary">
                Xem thêm hàng trăm dự án khác do học viên tại F8 tự làm.
              </Link>
            </Box>
            <Divider sx={{ marginBottom: '20px' }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArticleDetail;
