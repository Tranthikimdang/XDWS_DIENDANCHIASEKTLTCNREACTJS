import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Divider, CircularProgress, IconButton } from '@mui/material';
import { IconHeart, IconMessageCircle } from '@tabler/icons';
import { useParams } from 'react-router-dom';
//thư viện hổ trợ up_code
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
//icon upfile
import DescriptionIcon from '@mui/icons-material/Description';
//api
import QuestionsApis from 'src/apis/QuestionsApis';  // API để lấy câu hỏi
import UsersApis from 'src/apis/UserApI';  // API để lấy thông tin người dùng

const QuestionDetail = () => {
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [user, setUser] = useState(null);  // Lưu thông tin người dùng

  // Lấy dữ liệu câu hỏi và người dùng
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        // Lấy thông tin câu hỏi từ API
        const questionResponse = await QuestionsApis.getQuestionId(questionId);
        setQuestion(questionResponse.data.question);

        // Lấy thông tin người dùng dựa trên user_id từ câu hỏi
        const userId = questionResponse.data.question.user_id;
        if (userId) {
          const userResponse = await UsersApis.getUserId(userId);  // Gọi API với user_id
          setUser(userResponse.data.user);  // Lưu thông tin người dùng (tên, ảnh, v.v.)
        }
      } catch (error) {
        console.error('Lỗi khi lấy câu hỏi hoặc người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

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
        <Grid item xs={2} sx={{ position: 'sticky', top: '85px', backgroundColor: 'white', zIndex: 1, padding: '16px' }}>
          <Typography variant="subtitle1">{user?.name || 'Chưa có tên'}</Typography>
          <Typography variant="body2" color="textSecondary">
            Lập trình là đam mê
          </Typography>
          <Divider sx={{ marginTop: '10px' }} />
          <Box sx={{ marginTop: '10px' }}>
            <IconButton aria-label="like">
              <IconHeart />
            </IconButton>
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>15</Typography>
            <IconButton aria-label="comments" sx={{ marginLeft: '16px' }}>
              <IconMessageCircle />
            </IconButton>
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
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ccc' }} />
            )}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <strong>
                  {user?.name || 'Chưa có tên'}
                </strong>
              </Typography>
              <Typography variant="body2">
                {formatUpdatedAt(question.updatedAt)}
              </Typography>
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
            <Typography variant="body1" paragraph>{question.questions}</Typography>
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
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>
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
            <Typography variant="body2" sx={{ display: 'inline-block', marginLeft: '8px' }}>15</Typography>
            <IconButton aria-label="comments" sx={{ marginLeft: '16px' }}>
              <IconMessageCircle />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionDetail;
