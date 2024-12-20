import React, { useEffect, useState, useRef } from 'react';
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
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import './index.css';
import ReplyIcon from '@mui/icons-material/Reply';
import CourseDetailApi from '../../apis/CourseDetailApI';
import CourseApi from '../../apis/CourseApI';
import StudyTimeApi from '../../apis/StudyTimeApI';
import CertificateApi from '../../apis/CertificateApI';
import { getExerciseByIdCourse } from '../../apis/ExerciseApi';
import Player from '@vimeo/player';
import { jsPDF } from 'jspdf';

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
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [studyTime, setStudyTime] = useState([]);
  const [reload, setReload] = useState(false);
  const [videoWatchedEnough, setVideoWatchedEnough] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã gửi câu trả lời
  const [isCorrect, setIsCorrect] = useState(null);
  const [courseName, setCourseName] = useState('');
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState([]); // Dữ liệu chứng chỉ
  const [isEligibleForCertificate, setIsEligibleForCertificate] = useState(false);
  const [error, setError] = useState(null);

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

  const updateLesson = async () => {
    const res = await StudyTimeApi.updateStudyTime(studyItem.current?.id, {
      ...studyItem.current,
      lesson_current: studyItem.current?.lesson_current + 1,
    });
    if (res.status == 'success') {
      setReload((reload) => !reload);
    }
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

    setCurrentVideo(lesson.video);
    setCurrentName(lesson.name);
    setShowNextButton(false);
    currentIndex.current = index;
  };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAnswerClick = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer); // Cập nhật lựa chọn khi chưa gửi
    }
  };

  useEffect(() => {
    if (selectedTab === 1) {
      const fetchQuestions = async () => {
        try {
          const response = await getExerciseByIdCourse(id); // Gọi API lấy câu hỏi

          if (response.status === 'success') {
            const exercises = response.data.courseDetails;
            setQuestions(exercises); // Cập nhật danh sách câu hỏi
            if (exercises.length > 0) {
              questionsData.current = exercises;
              count.current = 0; // Reset vị trí câu hỏi hiện tại
              setQuestionData(exercises[0]); // Hiển thị câu hỏi đầu tiên
              setTotalQuestions(exercises.length);
            }
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách câu hỏi:', error);
        }
      };
      fetchQuestions();
    }
  }, [selectedTab, id]);

  const handleCompleteCourse = async () => {
    const incorrectAnswers = totalQuestions - correctAnswers; // Tính số câu trả lời sai
    const successRate = correctAnswers / totalQuestions; // Tỷ lệ trả lời đúng

    if (successRate >= 0.8) {
      alert(`🎉 Chúc mừng bạn đã hoàn thành khóa học!
      - Số câu trả lời đúng: ${correctAnswers}/${totalQuestions}
      - Tỷ lệ chính xác: ${(successRate * 100).toFixed(2)}%
      - Nhận chứng chỉ ngay!
      `);

      try {

        await CertificateApi.addCertificate({
          user_id: userId, // ID người dùng
          course_id: id, // ID khóa học
          certificate_code: generateCertificateCode(), // Hàm tạo mã chứng chỉ
          issue_date: new Date().toISOString(), // Ngày cấp chứng chỉ
        });

        navigate('/certificate'); // Điều hướng về danh sách sản phẩm
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái hoặc cấp chứng chỉ:', error);
      }
    } else {
      alert(`Bạn cần xem hết video và trả lời ít nhất 80% câu hỏi đúng! 
      - Số câu trả lời đúng: ${correctAnswers}/${totalQuestions}
      - Tỷ lệ chính xác: ${(successRate * 100).toFixed(2)}%
      `);
    }
  };

  // Hàm tạo mã chứng chỉ ngẫu nhiên
  const generateCertificateCode = () => {
    return `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handlePlayerProgress = (data) => {
    const percentage = (data.seconds / data.duration) * 100;
    setProgress(percentage);

    if (percentage >= 1) {
      setShowNextButton(true);
    }
    if (percentage < 100) {
      setVideoWatchedEnough(false);
    } else {
      setVideoWatchedEnough(true);
    }
  };

  const handleSubmit = () => {
    // Kiểm tra xem người dùng đã chọn câu trả lời chưa
    if (!selectedAnswer) {
      console.log('Chưa chọn đáp án!');
      return; // Không cho phép gửi nếu chưa chọn
    }

    // Kiểm tra xem câu trả lời đã được gửi chưa
    if (isSubmitted) return; // Tránh gửi câu trả lời nhiều lần

    // Kiểm tra đáp án đúng hay sai
    const correct = selectedAnswer === questionData.correct_answer;
    setIsCorrect(correct); // Cập nhật trạng thái đúng/sai

    // Cập nhật số câu trả lời đúng và sai
    if (correct) {
      setCorrectAnswers((prev) => prev + 1); // Đúng: tăng số câu đúng
    } else {
      setIncorrectAnswers((prev) => prev + 1); // Sai: tăng số câu sai
    }

    // Đánh dấu là đã nộp câu trả lời
    setIsSubmitted(true);
    console.log('Đáp án được gửi:', selectedAnswer, 'Đúng:', correct);
  };

  const handleNextQuestion = () => {
    // Kiểm tra nếu còn câu hỏi tiếp theo
    if (count.current < (questionsData.current?.length || 0) - 1) {
      count.current++;
      setQuestionData(questionsData.current[count.current]); // Cập nhật câu hỏi mới

      // Reset trạng thái để chuẩn bị cho câu hỏi mới
      setIsSubmitted(false); // Đánh dấu chưa gửi câu trả lời
      setSelectedAnswer(null); // Reset câu trả lời đã chọn
      setIsCorrect(null); // Reset câu trả lời đúng/sai
    } else {
      alert('Đã hết câu hỏi!');
    }
  };
  useEffect(() => {
    if (correctAnswers / totalQuestions >= 0.8) {
      setIsCourseCompleted(true); // Hoàn thành khóa học nếu đủ điều kiện
    }
  }, [correctAnswers, totalQuestions]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CourseApi.getCoursesList(); // Gọi API để lấy dữ liệu khóa học
        const courses = response.data.courses; // Giả sử dữ liệu trả về là một mảng khóa học

        // Tìm khóa học có id trùng khớp
        const foundCourse = courses.find((course) => course.id == id);

        if (foundCourse) {
          setCourseName(foundCourse.name);
        } else {
          console.log('Không tìm thấy khóa học với id:', id);
        }
      } catch (error) {
        console.error('Lỗi khi lấy khóa học:', error);
      }
    };

    fetchCourses();
  }, [id]);

  const handleDownloadCertificate = () => {
    // Tạo tài liệu PDF
    const doc = new jsPDF();

    // Thêm background cho chứng chỉ
    doc.setFillColor(240, 240, 240); // Màu nền sáng
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F'); // Vẽ hình chữ nhật nền

    // Thêm khung cho chứng chỉ
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); // Màu khung đen
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20); // Khung bao quanh chứng chỉ
    console.log(courseName);

    // Thêm logo ở giữa chứng chỉ
    const logoUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUkSURBVHgB7Z2NcdpMEIaXb1IAXweiAkMFhgpiKjCuwHEFmApsKjCuwLgClAqMK0CpwHRw2RdORAGZHyHdbqx9Zi5yzDjx7N7+3N6dtkEV4ZyL+NHlccEDX7f9RxHpJuGx9GPO4yeejUYjoQpoUImw0Lv8+M7jivQL+lSgjJjHMytjTiVxtgJY6E1+DGgt+C7VAyhgzIqY0JmcpQAW/oAfDzyaVE8SHqNzFFFIAd7VDKk+M/4QCY9ekTjxH50ICx8zfkYm/CwRjwXLZkgncrQF+KzmiUzwh0B86B9rDUcpwAsfsz4i4xgSOtIlHXRBLHzk729kwj+FiMfMy24vey3AZv7ZYDHX2WcJn1qACb8UkJ7PvCxz+dQC+IcWZMIvC5QyOnkf5FqAT6ciMsqi7dP3HXYswC+yZmRUATKjOPuNPAWY66mOhBXQyn7jLxfkazsRGVURsYzvs9/4ywJs9gcBqWmLLQHPPxZgsz8YSE1/pH/ZWIDN/qAs2QL+xxcrC/CZT0RGKJpe5hsXdE1GaLBtu3ZB5n5EWLmhRqbaaYQnggs6WDI1KqNnCpCl/Y3WB6fUEscxvb6+UpIkq7FcLqlMut0uPT09kRARFKDuSAmEPB6P6fHxsXSBbwOlCnIBBUSkCMz4m5ubYIJpt0U9cBMxQI0FjEYj6vV6QWflxYWoB25iDaCC+/t7x79Q8LFYLJwkKhTAQVBE+IPBwEkjrgDMwCiKajn7wclHE8sGfl8iExkOh8SKJ3GcMBKz//b21mlBVAHT6TS48K+vr50mRF0Qcv6QPDw80GQyIU18I0Hm89Ju+uwlLTeo8PlbiCqgKiBorHAvLy+JU01qNvVe4MF+gCNDDPE0tO6YAoQRjQH9fr+SQIwYAL9/dXW1igMag+8GJwgLKEjuj5qPhrJDHqIuKNTMRO7farVWZQ9tiCogdC2eS950d3dHqnCCfHx8OPbVwcsRGsrQKaIWkAbK0MAlYc9ZA+ILMZSiO51O5ZvveXBgFs+QxNcBEABq8xJg818cp4RQKen2QBySRM1KGNVKVC1D8/z8TJKoUQAC8mw2C+6OQu9J7OAU8vb2FmyrEv+PJKrL0ZidcBGoF1W5eSMpgn9mPwBpalWpqmQqahsywth+gDDq94QRB97f31cxoIoDXNg7xmkJKVQqIOT9AGnUKaBm9wN0xYAa3g/QsxCz+wGCvLy8iAjf7gc4ux8gHgNQarD7AYJIzH5NR9TtfoAwcEFiK53QtXi4HWX3A5ZYiEEBIue3Q94PQLlBetGVQwIFQAoRfSGwu5a9H6D4bOjKAn6RENiCrDnviAFh/ICRxxwKiMmQYp6+M+6D6tsJSYrVa4zTlbDs4Zh6EuOPVAFTMkKzmvTZN+eaGwrH5i3q2WKcjvPa9WBzVSdrAZj9CzIrqJqEMi2uNhbgX6duVlA942xXJeugEZb9HTQ8Cm4tfFl2ZLujAN9kxlxR+Yy2G/iAfX3E8EJve61xOey4npR9e8J9Wkds4zwSHr3PPmzQHty6BR8swVLTYhTvJQn8D0J7CRmnAuEfbGm71wJSnDX2PJWEyuonDDKWYJs3h4nphP7yRx/Mwj/oO4Lqe+WIHrDKPVr44CgXtI25pB3gGe7y8vxDFDqa6K0BeS1WdgnVFwRaCL5TRPigkAVs49ZtEG+pPgu3mMcrj0naE7IopSggxa1bYg14XNLXU0ZCa6FPi872PEpVQBYfJ6CELq0bBWExF5H+RV3in/Drv/wzPiWwGv8QvwHu5t44+FRvkgAAAABJRU5ErkJggg=='; // Đảm bảo bạn thay logo này bằng logo phù hợp
    const logoWidth = 50; // Chiều rộng của logo
    const logoHeight = 50; // Chiều cao của logo
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2; // Căn giữa logo theo trục X
    const logoY = 50; // Vị trí logo theo trục Y
    doc.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight); // Thêm logo vào chứng chỉ

    // Thêm tiêu đề cho giấy khen và canh giữa
    doc.setFont('times', 'normal'); // Chuyển sang font Times New Roman
    doc.setFontSize(22);
    doc.text('SHARE CODE', doc.internal.pageSize.width / 2, 120, { align: 'center' });

    // Thêm thông tin học viên
    doc.setFont('times', 'normal'); // Sử dụng font Times New Roman
    doc.setFontSize(16);
    doc.text(`Name: ${user.name}`, 20, 150);
    doc.text(`Course: ${courseName}`, 20, 160);
    doc.text(`Issue_date: ${new Date().toLocaleDateString()}`, 20, 170);

    // Thêm thông tin về tỷ lệ hoàn thành khóa học
    doc.text(`Completion rate: 100%`, 20, 180);

    // Thêm dòng chữ cuối cùng như lời chúc hoặc thông báo hoàn thành
    doc.setFont('times', 'italic'); // Sử dụng font Times New Roman với kiểu chữ nghiêng
    doc.setFontSize(14);
    doc.text('Thank you for participating and good luck!', doc.internal.pageSize.width / 2, 220, {
      align: 'center',
    });

    // Lưu PDF dưới dạng file
    doc.save('certificate.pdf');
  };

  useEffect(() => {
    // Gọi API để lấy toàn bộ dữ liệu chứng chỉ
    const fetchCertificateData = async () => {
      try {
        const response = await CertificateApi.getCertificatesList(); // Gọi API lấy toàn bộ chứng chỉ
        setCertificateData(response.data.certificates); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Error fetching certificate data:', error);
        setError('Không thể tải dữ liệu chứng chỉ. Vui lòng thử lại sau.'); // Hiển thị lỗi
      }
    };

    if (userId) {
      fetchCertificateData();
    }
  }, [userId]); // Thực hiện lại khi userId thay đổi

  useEffect(() => {
    // Kiểm tra xem người dùng đã hoàn thành khóa học chưa
    if (userId && certificateData.length > 0) {
      console.log(certificateData);
      const isCompleted = certificateData.some(
        (cert) => cert.user_id === userId && cert.course_id === parseInt(id)
      );
      setIsEligibleForCertificate(isCompleted); // Cập nhật trạng thái
    }
  }, [certificateData, userId, id]);
  

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
              </div>
              {!videoWatchedEnough && (
                <Alert severity="warning">
                  Bạn cần xem hết video này trước khi chuyển bài tiếp theo!
                </Alert>
              )}
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
                      onClick={() => handleAnswerClick(`${option.toLowerCase()}`)} // Xử lý khi người dùng bấm chọn
                      sx={{
                        padding: 2,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: isSubmitted
                          ? option.toLowerCase() === selectedAnswer
                            ? isCorrect
                              ? 'green' // Đúng: viền xanh
                              : 'red' // Sai: viền đỏ
                            : option.toLowerCase() === questionData.correct_answer
                            ? 'green' // Đáp án đúng: viền xanh
                            : 'grey' // Đáp án khác: viền xám
                          : selectedAnswer === option.toLowerCase()
                          ? 'grey' // Khi chọn: viền xanh
                          : 'grey', // Chưa chọn: viền xám
                        backgroundColor: isSubmitted
                          ? option.toLowerCase() === questionData.correct_answer
                            ? 'rgba(0, 255, 0, 0.2)' // Đúng: nền xanh nhạt
                            : option.toLowerCase() === selectedAnswer && !isCorrect
                            ? 'rgba(255, 0, 0, 0.2)' // Sai: nền đỏ nhạt
                            : 'transparent' // Nền trong suốt
                          : 'transparent', // Chưa gửi: nền trong suốt
                        cursor: isSubmitted ? 'default' : 'pointer', // Đổi con trỏ khi đã gửi
                        '&:hover': {
                          borderColor: !isSubmitted ? 'blue' : undefined, // Hover chỉ hoạt động khi chưa gửi
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
                    { questionData.explanation}:
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
                    Trả lời
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNextQuestion}
                    sx={{ marginTop: 2 }}
                  >
                    Câu hỏi tiếp theo
                  </Button>
                )}
              </Paper>
            ) : (
              <p>Không có câu hỏi</p>
            )}
            {
              <Button
                variant="contained"
                color="success"
                onClick={handleCompleteCourse}
                sx={{ marginTop: 3 }}
              >
                Hoàn thành khóa học
              </Button>
            }
          </Grid>

          <Grid item md={4}>
            <div className="course-content">
              <div className="course-progress mb-4">
                <span className="text-success font-weight-bold">
                  Số câu hỏi đúng: {correctAnswers} / {questions.length}
                </span>
                <span className="text-danger font-weight-bold ml-3">
                  Số câu hỏi sai: {incorrectAnswers} / {questions.length}
                </span>
              </div>

              {isEligibleForCertificate ? (
                <div className="course-completion text-center">
                  <p className="font-weight-bold">Bạn đã hoàn thành khóa học!</p>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadCertificate}
                    className="btn btn-primary"
                  >
                    Xuất Chứng Chỉ PDF
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p>Bạn chưa hoàn thành khóa học này.</p>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
};

export default ProductsDetail;
