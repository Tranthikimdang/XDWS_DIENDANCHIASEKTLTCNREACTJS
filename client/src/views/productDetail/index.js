import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import ReplyIcon from '@mui/icons-material/Reply';

const ProductsDetail = () => {
  const { id } = useParams(); // Lấy id_product từ URL
  const [productDetail, setProductDetail] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null); // Video đang hiển thị
  const [currentName, setCurrentName] = useState(''); // Tên bài học đang hiển thị
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) {
        console.error('id_product is undefined');
        return;
      }

      setLoading(true);
      try {
        const q = query(collection(db, 'product_detail'), where('product_id', '==', id));
        const detailSnapshot = await getDocs(q);
        const detailData = detailSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductDetail(detailData);

        // Lấy bài học đầu tiên để hiển thị khi mới vào
        const firstLesson = detailData.find((lesson) => lesson.no == 1);
        if (firstLesson) {
          setCurrentVideo(firstLesson.video); // Đảm bảo firstLesson.video có định dạng HTML hợp lệ
          setCurrentName(firstLesson.name);
        } else {
          console.warn('No first lesson found');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer title="products" description="This is products">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '0px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Các khóa học của chúng tôi
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              A collection of products sharing experiences of self-learning programming online and
              web development techniques.
            </Typography>
          </Grid>

          {/* Left Column */}
          <Grid item md={8}>
            <div className="course-container">
              <div className="video-section">
                {currentVideo && (
                  <div className="video-embed" dangerouslySetInnerHTML={{ __html: currentVideo }} />
                )}
                
              </div>
              <div className="course-title">
                  <h2>{currentName}</h2>
                </div>
              <div className="nav-buttons mt-5">
                <h4>Bình luận</h4>
              </div>
            </div>

            <ListItem alignItems="flex-start">
              <Avatar
                alt=""
                src={'https://i.pinimg.com/474x/4a/ab/e2/4aabe24a11fd091690d9f5037169ba6e.jpg'}
              />
              <Box ml={1}>
                <Typography variant="body1" color="textPrimary">
                  fdsfd
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  sdfdsd
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <IconButton aria-label="reply">
                    <ReplyIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      Reply
                    </Typography>
                  </IconButton>
                  <Button variant="outlined" color="inherit" sx={{ marginLeft: 1 }}>
                    Hủy
                  </Button>
                </Box>
                <Box className="reply-input" mt={2}>
                  <TextField label="Viết trả lời" variant="outlined" multiline fullWidth rows={1} />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 1, padding: '6px 12px' }}
                  >
                    Gửi trả lời
                  </Button>
                </Box>
                <List>
                  <ListItem alignItems="flex-start">
                    <Avatar
                      alt="{reply.user_name}"
                      src={
                        'https://i.pinimg.com/474x/4a/ab/e2/4aabe24a11fd091690d9f5037169ba6e.jpg'
                      }
                    />
                    <Box ml={1}>
                      <Typography variant="body1" color="textPrimary">
                        fđfg
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        fgdg
                      </Typography>
                    </Box>
                  </ListItem>
                </List>
              </Box>
            </ListItem>
          </Grid>

          {/* Right Column */}
          <Grid item md={4}>
            <div className="course-content">
              <div className="course-progress">Số lượng bài học: {productDetail.length}</div>
              <ul className="course-list">
                {productDetail.map((lesson) => (
                  <li
                    key={lesson.id}
                    onClick={() => {
                      setCurrentVideo(lesson.video);
                      setCurrentName(lesson.name);
                    }}
                  >
                    <span>Bài {lesson.no}</span>
                    <h3>{lesson.name}</h3>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ProductsDetail;
