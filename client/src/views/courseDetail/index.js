import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  ListItem,
  Avatar,
  IconButton,
  Button,
  Alert,
  Tabs,
  Tab,
  Paper,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import './index.css';
import ReplyIcon from '@mui/icons-material/Reply';
import CourseDetailApi from '../../apis/CourseDetailApI';
import StudyTimeApi from '../../apis/StudyTimeApI';
import { getExercise, getExerciseByIdCourseDetail } from '../../apis/ExerciseApi';
import Player from '@vimeo/player';

const ProductsDetail = () => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentName, setCurrentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [questionData, setQuestionData] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [studyTime, setStudyTime] = useState([]);
  const [reload, setReload] = useState(false);
  const [videoWatchedEnough, setVideoWatchedEnough] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã gửi câu trả lời
  const [isCorrect, setIsCorrect] = useState(null);
  const navigate = useNavigate();

  const count = useRef(0);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const questionsData = useRef([]);
  const currentIndex = useRef(0);
  const studyItem = useRef(0);
  // Fetch StudyTime
  useEffect(() => {
    const fetchStudyTime = async () => {
      setLoading(true);
      try {
        const response = await StudyTimeApi.getStudyTimesList();
        const studyTimes = response.data.studyTimes;
        setStudyTime(studyTimes);

        const currentStudyTime = studyTimes.find(
          (item) => item.user_id === userId && item.course_id == id,
        );

        if (!currentStudyTime) {
          navigate('/products');
        } else {
          studyItem.current = currentStudyTime;
          const endDate = new Date(currentStudyTime.enddate);
          const currentDate = new Date();
          const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
          const getVideo = productDetail.find(
            (lesson) => lesson.no == currentStudyTime?.lesson_current + 1,
          );
          console.log(getVideo);
          setCurrentVideo(getVideo?.video);
          setCurrentName(getVideo?.name);
          currentIndex.current = currentStudyTime?.lesson_current;
          if (daysLeft <= 3 && daysLeft > 0) {
            alert('Hạn học của bạn sắp hết, vui lòng đẩy nhanh tiến độ học!');
          } else if (daysLeft <= 0) {
            alert('Bạn đã hết thời gian cho khóa học này');
            await StudyTimeApi.deleteStudyTime(currentStudyTime.id);
            navigate('/products');
          }
        }
      } catch (error) {
        console.error('Error fetching study time:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyTime();
  }, [id, productDetail, navigate, userId, reload]);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) {
        console.error('id_product is undefined');
        return;
      }
      setLoading(true);
      try {
        const allProducts = await CourseDetailApi.getCourseDetailsList();
        const filteredDetails = allProducts.data.courseDetails
          .filter((detail) => detail.course_id == id)
          .sort((a, b) => a.no - b.no);

        setProductDetail(filteredDetails);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  // Sử dụng Vimeo Player API để lấy tiến độ video
  useEffect(() => {
    setShowNextButton(false);
    if (currentVideo) {
      // Dọn dẹp Player cũ nếu có
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      // Tạo Player mới
      playerRef.current = new Player(videoRef.current, {
        url: currentVideo,
        width: 640,
      });

      // Lắng nghe sự kiện
      playerRef.current.on('timeupdate', handlePlayerProgress);

      // Cleanup
      return () => {
        if (playerRef.current) {
          playerRef.current.off('timeupdate', handlePlayerProgress);
        }
      };
    }
  }, [currentVideo]);

  const fetchQuestion = async (id) => {
    try {
      const res = await getExerciseByIdCourseDetail(id);
      if (res.status == 'success') {
        questionsData.current = res.data.questions;
        count.current = 0;
        setQuestionData(questionsData.current[0]);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestionData({ question_text: 'Không có câu hỏi' });
    }
  };

  const handlePlayerProgress = (data) => {
    const percentage = (data.seconds / data.duration) * 100;
    setProgress(percentage);

    if (percentage >= 1) {
      console.log(studyItem.current);
      setShowNextButton(true);
    }
    if (percentage < 100) {
      setVideoWatchedEnough(false);
    } else {
      setVideoWatchedEnough(true);
    }
  };

  const updateLesson = async () => {
    const res = await StudyTimeApi.updateStudyTime(studyItem.current?.id, {
      ...studyItem.current,
      lesson_current: studyItem.current?.lesson_current + 1,
    });
    if (res.status == 'success') {
      setReload((reload) => !reload);
    }
    console.log(res);
  };

  // Chuyển sang video tiếp theo
  const handleNextVideo = () => {
    const currentLesson = productDetail.find((lesson) => lesson.video === currentVideo);
    const nextLesson = productDetail.find((lesson) => lesson.no === currentLesson.no + 1);

    if (nextLesson) {
      setCurrentVideo(nextLesson.video);
      setCurrentName(nextLesson.name);
      setShowNextButton(false);
    } else {
      alert('Đây là bài học cuối cùng.');
    }
  };

  const handleLessonClick = async (lesson, index) => {
    if (currentIndex.current == index) return;
    if (!videoWatchedEnough && studyItem.current.lesson_current < index) {
      alert('Bạn phải xem đủ video trước khi chuyển bài!');
      return;
    }
    if (index > studyItem.current.lesson_current) {
      await updateLesson();
    }
    console.log(lesson.video);
    
    setCurrentVideo(lesson.video);
    setCurrentName(lesson.name);
    setShowNextButton(false);
    currentIndex.current = index;
  };

  if (loading) {
    return <CircularProgress />;
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAnswerClick = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer); // Cập nhật lựa chọn khi chưa gửi
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return; // Không cho gửi nếu chưa chọn đáp án
    const correct = selectedAnswer === questionData.correct_answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
  };
  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setIsCorrect(null);
    setQuestionData(questionsData.current[count.current++]);
  };
  return (
    <PageContainer title="products" description="This is products">
      <Grid item xs={12}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="course tabs">
          <Tab label="Lý thuyết" />
          <Tab label="Bài tập" />
        </Tabs>
      </Grid>
      {selectedTab === 0 && (
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
            <Grid item md={8}>
              <div className="course-container">
                <div className="video-section">
                  {currentVideo && (
                    <div className="video-embed">
                      <div ref={videoRef}></div>
                    </div>
                  )}
                </div>
                <div className="course-title">
                  <h2>{currentName}</h2>
                </div>
                {showNextButton && (
                  <Button variant="contained" color="primary" onClick={handleNextVideo}>
                    Chuyển Bài Tiếp
                  </Button>
                )}
                <div className="nav-buttons mt-5">
                  <h4>Bình luận</h4>
                </div>
              </div>
             
            </Grid>

            <Grid item md={4}>
              <div className="course-content">
                <div className="course-progress">Số lượng bài học: {productDetail.length}</div>
                <ul className="course-list">
                  {productDetail.map((lesson, index) => (
                    <li
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson, index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>Bài {lesson.no}</span>
                      <h3>{lesson.name}</h3>
                    </li>
                  ))}
                </ul>
              </div>
            </Grid>
          </Grid>
          {!videoWatchedEnough && (
            <Alert severity="warning">
              Bạn cần xem hết video này trước khi chuyển bài tiếp theo!
            </Alert>
          )}
        </Box>
      )}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item md={8}>
            {questionData?.question_text ? (
              <Paper sx={{ padding: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {questionData?.question_text}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginY: 2 }}>
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <Box
                      key={option}
                      onClick={() => handleAnswerClick(`option_${option.toLowerCase()}`)} // Xử lý khi người dùng bấm chọn
                      sx={{
                        padding: 2,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: isSubmitted
                          ? option === selectedAnswer
                            ? isCorrect
                              ? 'green' // Đúng -> Xanh
                              : 'red' // Sai -> Đỏ
                            : option === questionData.correct_answer
                            ? 'green' // Hiển thị đáp án đúng
                            : 'grey.400'
                          : selectedAnswer === option
                          ? 'primary.main' // Khi chọn đáp án
                          : 'grey.400',
                        cursor: isSubmitted ? 'default' : 'pointer',
                        backgroundColor:
                          isSubmitted && option === questionData.correct_answer
                            ? 'rgba(0, 255, 0, 0.8)' // Đúng -> Nền xanh nhạt
                            : isSubmitted && option === selectedAnswer && !isCorrect
                            ? 'rgba(255, 0, 0, 0.8)' // Sai -> Nền đỏ nhạt
                            : 'transparent',
                        '&:hover': {
                          borderColor: !isSubmitted ? 'primary.light' : undefined,
                        },
                      }}
                    >
                      <Typography>
                        {option}: {questionData[`option_${option.toLowerCase()}`]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {isSubmitted && !isCorrect && (
                  <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
                    Sai! Đáp án đúng là{' '}
                    {questionData.correct_answer + ':' + questionData.explanation}:{' '}
                    {questionData[`option_${questionData.correct_answer.toLowerCase()}`]}.
                  </Typography>
                )}

                {/* Hiển thị giải thích nếu đúng */}
                {isSubmitted && isCorrect && (
                  <Typography variant="body1" color="success.main" sx={{ marginTop: 2 }}>
                    Chính xác! {questionData.explanation}
                  </Typography>
                )}

                {/* Nút chuyển câu hỏi */}
                {!isSubmitted ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ marginTop: 2 }}
                    disabled={!selectedAnswer}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNextQuestion}
                    sx={{ marginTop: 2 }}
                  >
                    Next Question
                  </Button>
                )}
              </Paper>
            ) : (
              <p>Không có câu hỏi</p>
            )}
          </Grid>

          <Grid item md={4}>
            <div className="course-content">
              <div className="course-progress">Số lượng bài học: {productDetail.length}</div>
              <ul className="course-list">
                {productDetail.map((lesson, index) => (
                  <li
                    key={lesson.id}
                    onClick={() => fetchQuestion(lesson?.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>Bài {lesson.no}</span>
                    <h3>{lesson.name}</h3>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
};

export default ProductsDetail;
