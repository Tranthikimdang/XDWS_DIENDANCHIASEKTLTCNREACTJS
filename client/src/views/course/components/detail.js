import React, { useEffect, useState, useRef } from 'react';
import { Grid, Box, Typography, CircularProgress, Button, IconButton } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // Lấy id từ URL
import { doc, getDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore'; // Sử dụng để lấy dữ liệu cụ thể từ Firestore


import { formatDistanceToNow } from 'date-fns'; // Format ngày
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CourseApi from '../../../apis/CourseApI';
import StudyTimeApi from '../../../apis/StudyTimeApI';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';
import { getCourseComments } from 'src/apis/CommentCourseApi'
import userApis from 'src/apis/UserApI';
import cartsApi from '../../../apis/cartsApi'; // Import cartsApi
import './detail.css';

const ProductsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading khi fetch dữ liệu
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [StudyTime, setStudyTime] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentImages, setCommentImages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReplies, setNewReplies] = useState({}); // Quản lý phản hồi theo ID bình luận
  const [replyingToUsername, setReplyingToUsername] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const location = useLocation();
  const { id: course_id } = useParams();
  const [imageFile, setImageFile] = useState('');
  const [file, setFile] = useState('');
  const [replyImageFile, setReplyImageFile] = useState('');
  const [replyFile, setReplyFile] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [dataTemp, setDataTemp] = useState([]);
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchStudyTime = async () => {
      setLoading(true);
      try {
        const response = await StudyTimeApi.getStudyTimesList();
        const course = response.data.studyTimes;
        console.log(course);

        setStudyTime(course);
      } catch (error) {
        console.error('Error fetching study times:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyTime();
  }, []);

  const hasStudyAccess = (productId) => {
    return StudyTime.some(
      (study) => study.user_id === userId && study.course_id === productId
    );
  };

  useEffect(() => {
    const handleLoad = () => {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;


      // Tìm và ẩn các nút cụ thể trong iframe
      const header = iframeDoc.querySelector('.drive-viewer-header');
      const downloadBtn = iframeDoc.querySelector('.drive-viewer-download');
      const btn = iframeDoc.querySelector('.ndfHFb-c4YZDc-Wrql6b');
      if (btn) btn.style.display = 'none';
      if (header) header.style.display = 'none';
      if (downloadBtn) downloadBtn.style.display = 'none';
    };

    const iframeElement = iframeRef.current;
    if (iframeElement) {
      iframeElement.addEventListener('load', handleLoad);
    }

    // Cleanup event listener
    return () => {
      if (iframeElement) {
        iframeElement.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  // Lấy dữ liệu sản phẩm theo ID từ API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await CourseApi.getCoursesList(); // Lấy toàn bộ dữ liệu khóa học
        const allCourses = response.data.courses;
        // Tìm khóa học có id phù hợp sau khi chuyển đổi id từ useParams sang số
        const foundCourse = allCourses.find((course) => course.id === Number(id));


        if (foundCourse) {
          setProduct(foundCourse);
        } else {
          console.error('Không tìm thấy khóa học với ID này');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const addToCart = async (product) => {
    if (userId) {
      try {
        // Fetch current user's cart items
        const response = await cartsApi.getCartsList();
        const userCarts = response.data.carts.filter(
          (cart) => cart.user_id === userId && cart.course_id === product.id
        );

        if (userCarts.length > 0) {
          setSnackbarMessage('Sản phẩm đã có trong giỏ hàng');
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
        } else {
          // Prepare cart data
          const cartData = {
            user_id: userId,
            course_id: product.id,
            quantity: 1, // You can modify quantity as needed
            price: product.price,
            discount: product.discount || 0,
            // Add other necessary fields if required
          };

          // Add product to cart
          await cartsApi.addCart(cartData);

          setSnackbarMessage('Đã thêm sản phẩm vào giỏ hàng');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
        setSnackbarMessage('Lỗi khi thêm sản phẩm vào giỏ hàng');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      console.error('User is not logged in');
      setSnackbarMessage('Bạn vẫn chưa đăng nhập');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const userData = useRef(null);

  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    userData.current = userDataFromLocalStorage;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await userApis.getUsersList()
        if (res.status === "success") {
          setUsers(res?.data.users);
        }
        // Tìm thông tin người dùng hiện tại dựa trên user ID trong localStorage
        // const currentUserInfo = userList.find((user) => user.id === userDataFromLocalStorage?.id);

        // Cập nhật hình ảnh người dùng hiện tại
        // if (currentUserInfo && currentUserInfo.imageUrl) {
        //   setCurrentUserImage(currentUserInfo.imageUrl);
        // } else {
        //   setCurrentUserImage('default-image-url.jpg'); // Hình ảnh mặc định nếu không có
        // }
      } catch (error) {
        console.error('Lỗi khi lấy người dùng:', error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchUsers(); // Gọi hàm lấy người dùng khi component mount
  }, []);

  // Load comments from localStorage on initial load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCourseComments(id);
        console.log('Comments from API:', response.data);

        if (Array.isArray(response.data)) {
          const mergedData = response.data.map((apiComment) => {
            const storedComments = JSON.parse(localStorage.getItem(`comment_course_${id}`)) || [];
            const storedComment = storedComments.find((item) => item.id === apiComment.id);
            return {
              ...apiComment,
              replies: storedComment?.replies || apiComment.replies || [],
            };
          });

          setDataTemp(mergedData);
          localStorage.setItem(`comment_course_${id}`, JSON.stringify(mergedData));
        } else {
          console.error("API did not return an array. Response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const storedComments = localStorage.getItem(`comment_course_${id}`);
    if (storedComments) {
      const parsedComments = JSON.parse(storedComments);
      if (Array.isArray(parsedComments)) {
        setDataTemp(parsedComments);
      } else {
        console.error("Stored comments are not an array. Clearing localStorage.");
        localStorage.removeItem(`comment_course_${id}`);
      }
    }

    fetchComments();
  }, [id]);


  // Save comments to localStorage after adding a new comment or reply
  const sensitiveWords = [
    // Xúc phạm trí tuệ
    "ngu", "ngu ngốc", "ngu si", "dốt", "dốt nát", "đần", "đần độn", "hâm", "khùng", "điên", "đồ ngu", 
    "đồ dốt", "thiểu năng", "chậm hiểu", "đần thối", "hâm hấp", "óc", "con",
  
    // Xúc phạm nhân phẩm
    "mất dạy", "vô học", "đồ chó", "đồ điếm", "con điếm", "lừa đảo", "bẩn thỉu", "rác rưởi", 
    "hèn mọn", "vô liêm sỉ", "mặt dày", "khốn nạn", "đồ khốn", "thất đức", "kẻ thù", 
    "phản bội", "vô dụng", "đáng khinh", "nhục nhã",
  
    // Chửi tục thô lỗ
    "địt", "đụ", "lồn", "buồi", "chịch", "cặc", "đéo", "vãi lồn", "vãi buồi", "đái", "ỉa", 
    "đéo mẹ", "đéo biết", "mẹ kiếp", "chết mẹ", "chết tiệt", "cái lồn", "cái buồi", 
    "cái đít", "mặt lồn", "mặt c*",
  
    // Xúc phạm gia đình
    "bố mày", "mẹ mày", "ông mày", "bà mày", "con mày", "chó má", "cút mẹ", "xéo mẹ", "bố láo",
    "đồ mất dạy", "không biết điều", "con hoang", "đồ rẻ rách", "đồ phế thải", "đồ vô ơn",
  
    // Từ viết tắt thô tục
    "dm", "vcl", "vkl", "clgt", "vl", "cc", "dcm", "đmm", "dkm", "vãi cả lồn", "vc", "đb",
  
    // Kích động/hạ bệ
    "đập chết", "cút xéo", "đâm đầu", "tự tử", "biến đi", "mày đi chết đi", "vô giá trị", 
    "không xứng đáng", "đồ thừa", "kẻ vô ơn", "đồ bất tài",
  
    // Các từ vùng miền hoặc ẩn ý tiêu cực
    "mất nết", "dơ dáy", "đồ rác", "đồ hèn", "hết thuốc", "chó cắn", "ngu như bò", "câm mồm", 
    "hèn hạ", "ngu xuẩn", "đồ quỷ", "đồ xấu xa", "đồ ác độc"
  ];
  

  const containsSensitiveWords = (text) => {
    return sensitiveWords.some(word => text.includes(word));
  };
  
  const handleAddComment = async (course_id) => {
    if (!userData?.current?.id) {
      setSnackbarMessage("Bạn cần đăng nhập để gửi bình luận.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    try {
      if (!newComment || newComment.trim() === '') {
        setSnackbarMessage("Nội dung bình luận không được để trống.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Ngừng thực hiện hàm nếu bình luận rỗng
      }
  
      if (containsSensitiveWords(newComment)) {
        setSnackbarMessage("Nội dung bình luận không hợp lệ.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Stop execution if comment contains sensitive words
      }
  
      let imageUrl = [];
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);
        const imageResponse = await axios.post("http://localhost:3000/api/upload", formDataImage);
        if (imageResponse.data && imageResponse.data.imagePath) {
          imageUrl = imageResponse.data.imagePath;
        }
      }
  
      const newCommentData = {
        course_id,
        user_id: userData.current.id,
        content: newComment || '',
        imageUrls: imageUrl,
        created_at: new Date(),
        updated_at: new Date(),
        replies: []
      };
  
      const response = await axios.post('http://localhost:3000/api/commentCourse', newCommentData);
  
      if (response.data.status === 'success') {
        setDataTemp((prevComments) => {
          const updatedComments = [...prevComments, { ...newCommentData, id: response.data.data.comment.id }];
          localStorage.setItem('comment_course', JSON.stringify(updatedComments)); // Save updated comments
          return updatedComments;
        });
        setNewComment('');
        setCommentImages([]);
        setImageFile(null);
        setSnackbarMessage("Bình luận của bạn đã được gửi.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setSnackbarMessage("Đã xảy ra lỗi khi gửi bình luận.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  
  const handleAddReply = async (course_id, commentId, parentId = null) => {
    if (!userData?.current?.id) {
      setSnackbarOpen(false);
      setTimeout(() => {
        setSnackbarMessage("Bạn cần đăng nhập để gửi trả lời.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }, 100);
      return;
    }
  
    const replyContent = newReplies[parentId || commentId];
  
    if (!replyContent || replyContent.trim() === '') {
      setSnackbarMessage("Nội dung phản hồi không được để trống.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  
    if (containsSensitiveWords(replyContent)) {
      setSnackbarMessage("Nội dung phản hồi không hợp lệ.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Stop execution if reply contains sensitive words
    }
  
    try {
      let imageUrls = [];
      if (replyImageFile && replyImageFile.length > 0) {
        const formDataImage = new FormData();
        replyImageFile.forEach((image) => {
          formDataImage.append("image", image);
        });
  
        // Log FormData content
        for (let pair of formDataImage.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
  
        const imageResponse = await axios.post("http://localhost:3000/api/uploads", formDataImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Log response from the upload API
        console.log("Upload response:", imageResponse.data);
  
        if (imageResponse.data && Array.isArray(imageResponse.data.imagePaths)) {
          imageUrls = imageResponse.data.imagePaths;
        }
      }
  
      console.log("Image URLs to be sent:", imageUrls); // Log image URLs
  
      const newReply = {
        user_id: userData.current.id,
        content: replyContent || '',
        imageUrls: imageUrls,
        created_at: new Date(),
      };
  
      const response = await axios.post(`http://localhost:3000/api/commentCourse/${commentId}/replies`, newReply);
  
      if (response.data.status === 'success') {
        setDataTemp((prevComments) => {
          const updatedComments = prevComments.map((item) => {
            if (item.id === commentId) {
              const repliesArray = Array.isArray(item.replies) ? item.replies : [];
              return {
                ...item,
                replies: [
                  ...repliesArray,
                  {
                    ...newReply,
                    id: response.data.data.reply.id, // Thêm id từ API
                  },
                ],
              };
            }
            return item;
          });
  
          // Cập nhật đầy đủ vào localStorage
          localStorage.setItem(`comment_course_${course_id}`, JSON.stringify(updatedComments));
          return updatedComments;
        });
  
        setNewReplies((prev) => ({ ...prev, [parentId || commentId]: '' }));
        setReplyingTo(null);
        setReplyImageFile(null);
        setSnackbarMessage("Trả lời của bạn đã được gửi.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      setSnackbarMessage("Đã xảy ra lỗi khi gửi phản hồi.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmittingReply(false);
    }
  };
  

  const formatDate = (createdAt) => {
    if (!createdAt) return 'Không rõ thời gian'; // Nếu giá trị không hợp lệ, trả về mặc định

    const date = new Date(createdAt);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const getEmbedLink = (videoDemo) => {
    // Kiểm tra nếu link có dạng "/view", chuyển thành "/preview"
    if (videoDemo.includes('/view')) {
      return videoDemo.replace('/view', '/preview');
    }

    // Kiểm tra nếu link là dạng link YouTube và chuyển thành dạng nhúng
    if (videoDemo.includes('youtube.com') || videoDemo.includes('youtu.be')) {
      const videoId = videoDemo.includes('youtube.com')
        ? videoDemo.split('v=')[1] // Lấy ID từ link YouTube dài
        : videoDemo.split('youtu.be/')[1]; // Lấy ID từ link YouTube ngắn
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return videoDemo; // Trả về videoDemo nếu không có thay đổi
  };

  return (
    <Box sx={{ padding: { xs: '10px' } }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            border: '1px solid #ccc', // Thêm đường viền 1px với màu #ccc (màu xám nhạt)
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {loading ? (
        <CircularProgress /> // Hiển thị spinner khi đang fetch dữ liệu
      ) : product ? (
        <Grid container spacing={3}>
          {/* Bố cục giao diện sản phẩm */}
          <Grid item md={12}>
            <div className="container">
              <div className="card">
                <div className="container-fliud">
                  <div className="wrapper row">
                    {/* Cột hiển thị video demo */}
                    <div className="preview col-md-6">
                      <div className="ratio ratio-16x9">
                        <iframe
                          ref={iframeRef}
                          src={getEmbedLink(product.video_demo)}
                          width="640"
                          height="480"
                          allow="autoplay"
                          allowFullScreen
                          title="Video Demo"
                        ></iframe>
                      </div>
                      <div className="overlay" id="overlay"></div>
                    </div>
                    {/* Cột hiển thị chi tiết sản phẩm */}
                    <div className="details col-md-6">
                      <h3 className="product-title d-flex flex-row">
                        {product.name}
                      </h3>
                      <div className="rating">
                        <div className="stars d-flex flex-row">
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                        </div>
                        <span className="review-no d-flex flex-row">
                          41 người xem khóa học này
                        </span>
                      </div>
                      <p className="product-description d-flex flex-row">
                        Mô tả:{' '}
                        {product.description
                          ? product.description.replace(/(<([^>]+)>)/gi, '')
                          : 'No description available'}
                      </p>
                      <h5 className="price d-flex flex-row ">
                        Giá khóa học:{' '}
                        <span> {product.price} VND</span>
                      </h5>
                      <p className="vote d-flex flex-row">
                        <strong>91%</strong>
                        người mua rất thích sản phẩm này!{' '}
                        <strong>(87 votes)</strong>
                      </p>
                      <div className="action">
                        <div className="d-flex flex-column mt-4">
                          {/* Kiểm tra quyền truy cập để hiển thị nút */}
                          {hasStudyAccess(product.id) ? (
                            <button
                              className="btn btn-success btn-sm"
                              type="button"
                              onClick={() => navigate(`/productDetailUser/${product.id}`)}

                            >
                              Bắt đầu học
                            </button>
                          ) : (
                            <>
                              <button className="btn btn-primary btn-sm" type="button">
                                Mua ngay
                              </button>
                              <button
                                className="btn btn-outline-primary btn-sm mt-2"
                                type="button"
                                onClick={() => addToCart(product)}
                              >
                                Thêm vào giỏ hàng
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <Typography variant="body2" color="textSecondary" mt={2}>
                        Ngày tạo: {formatDate(product.created_at)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Typography>Không tìm thấy sản phẩm.</Typography>
      )}
      {/* Khung nhập bình luận và danh sách bình luận */}
      <Box mt={4}>
        <Typography variant="h6">Bình luận</Typography>
        {/* Form nhập bình luận */}
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <textarea
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Nhập bình luận của bạn..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'none',
            }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%', marginLeft: '0', marginTop: '-10px' }}
          >
            {/* Chỉ giữ lại nút upload ảnh */}
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                sx={{
                  borderRadius: '16px',
                  textTransform: 'none',
                }}
                component="label"
              >
                Hình ảnh
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </Button>
            </Box>

            {/* Nút Gửi */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'none',
                borderRadius: '16px',
                padding: '5px 20px',
                fontWeight: 'bold',
                marginRight: '950px',
              }}
              onClick={() => handleAddComment(product.id)}
            >
              Gửi
            </Button>
          </Box>
        </Box>

        {/* Danh sách bình luận */}
        <Box mt={3}>
          {loading ? (
            <CircularProgress size={20} />
          ) : dataTemp.length > 0 ? (
            dataTemp.map((comment, index) => (
              <Box key={comment.id || index} mb={2} p={2} border="1px solid #ddd" borderRadius="4px">
                <Box display="flex" alignItems="center">
                  <img
                    src={'https://i.pinimg.com/474x/5d/54/46/5d544626add5cbe8dce09b695164633b.jpg'}
                    alt="Commenter Avatar"
                    style={{ borderRadius: '50%', marginRight: '10px' }}
                    width="30px"
                  />
                  <Typography variant="subtitle2" color="black">
                    {users.find((user) => user.id === comment.user_id)?.name}
                  </Typography>
                </Box>

                <Typography variant="body2" mt={1}>
                  {comment.content}
                </Typography>

                {Array.isArray(comment.imageUrls) && comment.imageUrls.length > 0 ? (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {comment.imageUrls.map((imageUrl, index) => (
                      <Box key={index} sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}>
                        <img
                          src={`http://localhost:3000${imageUrl}`}  // Ensure correct URL path
                          alt={`Comment image ${index + 1}`}
                          style={{ width: '25%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  comment.imageUrls && typeof comment.imageUrls === 'string' && ( // Ensure it's a string before rendering
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      <Box sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}>
                        <img
                          src={comment.imageUrls}
                          alt="Comment image"
                          style={{ width: '25%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }}
                        />
                      </Box>
                    </Box>
                  )
                )}

                <Typography
                  variant="caption"
                  color="textSecondary"
                  mt={1}
                  display="flex"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>{formatDate(comment.created_at)}</span>

                  <Button
                    variant="text"
                    size="small"
                    color="primary"
                    sx={{ textTransform: 'none', marginRight: '950px' }}
                    onClick={() => setReplyingTo(replyingTo?.id === comment.id && replyingTo?.type === 'comment' ? null : { id: comment.id, type: 'comment' })}
                  >
                    Trả lời
                  </Button>
                </Typography>

                {replyingTo?.id === comment.id && replyingTo?.type === 'comment' && (
                  <Box mt={2}>
                    <textarea
                      rows={2}
                      value={newReplies[comment.id] || ''}
                      onChange={(e) =>
                        setNewReplies((prev) => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      placeholder="Nhập phản hồi của bạn..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        resize: 'none',
                      }}
                    />
                    <Box mt={1} display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
                      <Button
                        variant="outlined"
                        startIcon={<ImageIcon />}
                        sx={{
                          borderRadius: '16px',
                          textTransform: 'none',
                        }}
                        component="label"
                      >
                        Hình ảnh
                        <input
                          name="image"
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => setReplyImageFile(Array.from(e.target.files))}
                        />
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          textTransform: 'none',
                          borderRadius: '16px',
                          fontWeight: 'bold',
                        }}
                        onClick={() => handleAddReply(product.id, comment.id)}
                      >
                        Gửi trả lời
                      </Button>
                    </Box>
                  </Box>
                )}

                {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                  <Box mt={2} pl={2}>
                    {comment.replies.map((reply, index) => (
                      <Box key={reply.id || index} mb={1} p={1} borderRadius="4px">
                        <Box display="flex" alignItems="center">
                          <img
                            src={'https://i.pinimg.com/474x/5d/54/46/5d544626add5cbe8dce09b695164633b.jpg'}
                            alt="Commenter Avatar"
                            style={{ borderRadius: '50%', marginRight: '10px' }}
                            width="30px"
                          />
                          <Typography variant="subtitle2" color="secondary">
                            {users.find((user) => user.id === reply.user_id)?.name}
                          </Typography>
                        </Box>

                        <Typography variant="body2" mt={1}>
                          {reply.content}
                        </Typography>

                        {Array.isArray(reply.imageUrls) && reply.imageUrls.length > 0 && (
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {reply.imageUrls.map((imageUrl, idx) => (
                              <Box key={idx} sx={{ flexBasis: 'calc(50% - 5px)', flexGrow: 1 }}>
                                <img
                                  src={imageUrl}  // Ensure correct URL path
                                  alt={`Comment image ${idx + 1}`}
                                  style={{ width: '25%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }}
                                />
                              </Box>
                            ))}
                          </Box>
                        )}

                        <Typography
                          variant="caption"
                          color="textSecondary"
                          mt={1}
                          display="flex"
                          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span>{formatDate(reply.created_at)}</span>

                          <Button
                            variant="text"
                            size="small"
                            color="primary"
                            sx={{ textTransform: 'none', marginRight: '910px' }}
                            onClick={() => setReplyingTo(replyingTo?.id === reply.id && replyingTo?.type === 'reply' ? null : { id: reply.id, type: 'reply' })}
                          >
                            Trả lời
                          </Button>
                        </Typography>

                        {replyingTo?.id === reply.id && replyingTo?.type === 'reply' && (
                          <Box mt={2}>
                            <textarea
                              rows={2}
                              value={newReplies[reply.id] || ''}
                              onChange={(e) =>
                                setNewReplies((prev) => ({ ...prev, [reply.id]: e.target.value }))
                              }
                              placeholder="Nhập phản hồi của bạn..."
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                              }}
                            />
                            <Box mt={1} display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
                              <Button
                                variant="outlined"
                                startIcon={<ImageIcon />}
                                sx={{
                                  borderRadius: '16px',
                                  textTransform: 'none',
                                }}
                                component="label"
                              >
                                Hình ảnh
                                <input
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  hidden
                                  onChange={(e) => setReplyImageFile(Array.from(e.target.files))}
                                />
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  textTransform: 'none',
                                  borderRadius: '16px',
                                  fontWeight: 'bold',
                                }}
                                onClick={() => handleAddReply(product.id, comment.id, reply.id)}
                              >
                                Gửi trả lời
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}


              </Box>
            ))
          ) : (
            <Typography variant="body2">Chưa có bình luận nào.</Typography>
          )}
        </Box>


      </Box>

    </Box>
  );
};

export default ProductsDetail;