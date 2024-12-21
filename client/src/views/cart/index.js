import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PageContainer from 'src/components/container/PageContainer';
import cartApi from '../../apis/cartsApi'; // Adjust the path as needed
import courseApi from '../../apis/CourseApI'; // Import courseApi
import orderApi from '../../apis/OrderApI'; // Import orderApi

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [showQRCodeDialog, setShowQRCodeDialog] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // State for card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardError, setCardError] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
    cardName: false,
  });

  // Snackbar state for success messages
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // Calculate totalAmount and courseNames
  const totalAmount = cartItems.reduce((total, item) => {
    const price = products[item.course_id]?.price || 0;
    const discount = products[item.course_id]?.discount || 0;
    return total + (price - discount);
  }, 0);

  const courseNames = cartItems.map(item => products[item.course_id]?.name).join(', ');

  // Update qrCodeUrl whenever cartItems or products change
  useEffect(() => {
    if (cartItems.length === 0) {
      setQRCodeUrl('');
      return;
    }

    const qrCodeContent = `Số tài khoản: 1907 1740 7060 18\nSố tiền: ${formatNumber(
      totalAmount
    )} VND\nNội dung: ${courseNames}`;
    setQRCodeUrl(qrCodeContent);
  }, [cartItems, products, totalAmount, courseNames]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const data = await cartApi.getCartsList();
          const userCarts = data.data.carts.filter(cart => cart.user_id === userId);
          setCartItems(userCarts);
        } catch (error) {
          console.error('Error fetching carts:', error);
          alert('Đã xảy ra lỗi khi lấy dữ liệu giỏ hàng.');
        }
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseApi.getCoursesList();
        const courseData = {};
        data.data.courses.forEach(course => {
          courseData[course.id] = course;
        });
        setProducts(courseData);

        // Log the course data to verify the image field
        console.log('Fetched Courses:', courseData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Đã xảy ra lỗi khi lấy dữ liệu khóa học.');
      }
    };

    fetchCourses();
  }, []);

  const handleRemove = async (id) => {
    try {
      // Gọi API xóa giỏ hàng (cùng với các đơn hàng liên quan)
      await cartApi.deleteCart(id);
  
      // Sau khi xóa, cập nhật lại giỏ hàng trên frontend
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.');
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const validateCardDetails = () => {
    const errors = {
      cardNumber: cardNumber.length !== 16,
      expiryDate: !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate),
      cvv: cvv.length !== 3,
      cardName: cardName.trim() === '',
    };
    setCardError(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleCheckout = async (paymentMethod) => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn trống.');
      return;
    }
  
    if (!name || !email) {
      setNameError(!name);
      setEmailError(!email);
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ.');
      return;
    }
  
    if (paymentMethod === 'card' && !validateCardDetails()) {
      alert('Vui lòng nhập đầy đủ thông tin thẻ tín dụng.');
      return;
    }
  
    try {
      setLoadingCheckout(true);
  
      const cartId = cartItems[0]?.id || null; // Fallback nếu id không tồn tại 
      if (!cartId) {
        alert('Không tìm thấy ID giỏ hàng.');
        return;
      }
  
      const orderData = {
        user_id: userId,
        username: name,
        user_email: email,
        item: JSON.stringify(cartItems.map((item) => ({
          course_id: item.course_id,
          quantity: item.quantity || 1,
          price: products[item.course_id]?.price || 0,
          discount: products[item.course_id]?.discount || 0,
        }))),
        totalAmount,
        payment: paymentMethod,
        ...(paymentMethod === 'card' && {
          card_details: {
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
            cardholder_name: cardName,
          },
        }),
        cart_id: cartId,
      };
      console.log('Order Data:', orderData);
  
      const response = await orderApi.addOrder(orderData);
      if (response.status === 'success') {
        setCartItems([]);
        for (const item of cartItems) {
          await handleRemove(item.id); // Gọi hàm handleRemove để xóa sản phẩm khỏi giỏ hàng
        }
        setSnackbarMessage('Thanh toán thành công! Đơn hàng của bạn đã được tạo.');
        setOpenSnackbar(true);
  
        if (paymentMethod === 'e_wallet') {
          setShowQRCodeDialog(true);
        }
      } else {
        alert(`Thanh toán thất bại: ${response.message || 'Lỗi không xác định.'}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(error.message || 'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.');
    } finally {
      setLoadingCheckout(false);
    }
  };
  

  // Updated handleBuy function
  const handleBuy = async () => {
    // Kiểm tra giỏ hàng trống
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn trống.');
      return;
    }
  
    // Kiểm tra thông tin người dùng
    if (!name || !email) {
      setNameError(!name);
      setEmailError(!email);
      return;
    }
  
    const cartId = cartItems[0]?.id; // Lấy 'id' của giỏ hàng
    if (!cartId) {
      alert('Không tìm thấy ID giỏ hàng.');
      return;
    }
  
    try {
      setLoadingBuy(true);
  
      // Dữ liệu đơn hàng
      const orderData = {
        user_id: userId,
        username: name,
        user_email: email,
        item: cartItems.map((item) => ({
          course_id: item.course_id,
          quantity: item.quantity || 1,
          price: products[item.course_id]?.price || 0,
          discount: products[item.course_id]?.discount || 0,
        })),
        totalAmount,
        payment: 'addOrder', // Xác định phương thức thanh toán (có thể sửa nếu cần)
        cart_id: cartId,
      };
  
      console.log('Dữ liệu đơn hàng gửi đi:', orderData);  // Kiểm tra dữ liệu gửi đi
  
      // Gọi API để thêm đơn hàng
      const response = await orderApi.addOrder(orderData); // Gọi API để thêm đơn hàng
  
      // Kiểm tra phản hồi
      console.log('Phản hồi từ server:', response);
  
      // Xử lý kết quả phản hồi từ API
      if (response && response.status === 'success') {
        setCartItems([]); // Xóa giỏ hàng sau khi gửi thành công
        for (const item of cartItems) {
          await handleRemove(item.id); // Gọi hàm handleRemove để xóa sản phẩm khỏi giỏ hàng
        }
        setSnackbarMessage('Đơn hàng đã được gửi đi thành công!');
        setOpenSnackbar(true);
      } else {
        // Xử lý khi API không trả về 'success'
        alert('Đã xảy ra lỗi trong quá trình gửi đơn hàng.');
      }
    } catch (error) {
      console.error('Error during buying:', error);
      alert('Đã xảy ra lỗi khi gửi đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoadingBuy(false);
    }
  };
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage('');
  };

  return (
    <PageContainer title="Giỏ hàng" description="Danh sách sản phẩm trong giỏ hàng của bạn">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item md={8}>
            <div className="course-content">
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col">
                    <div className="p-4">
                      <Typography variant="h4" component="h1" className="heading">
                        Giỏ hàng của bạn
                      </Typography>
                      <Typography variant="body1" paragraph className="typography-body">
                        Bạn có {cartItems.length} sản phẩm trong giỏ hàng
                      </Typography>

                      {cartItems.map((item) => (
                        <div className="card mb-3" key={item.id}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div className="d-flex flex-row align-items-center">
                                {products[item.course_id]?.image && (
                                  <img
                                    src={products[item.course_id].image} // Ensure this field is correct
                                    className="img-fluid rounded-3"
                                    alt={products[item.course_id]?.name || 'Course Image'}
                                    style={{ width: '65px' }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/uploads/placeholder.png'; // Path to your placeholder image
                                    }}
                                  />
                                )}
                                <div className="ms-3">
                                  <h5>{products[item.course_id]?.name || ''}</h5>
                                  <p className="small mb-0">ID sản phẩm: {item.course_id}</p>
                                </div>
                              </div>
                              <div className="d-flex flex-row align-items-center">
                                <h6 className="mb-0">
                                  <span style={{ textDecoration: 'line-through', marginRight: '5px', color: 'red' }}>
                                    {formatNumber(products[item.course_id]?.price || 0)} VND
                                  </span>
                                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                                    {formatNumber(
                                      (products[item.course_id]?.price - (products[item.course_id]?.discount || 0))
                                    )} VND
                                  </span>
                                </h6>
                                <DeleteIcon
                                  onClick={() => handleRemove(item.id)}
                                  style={{ color: '#cecece', cursor: 'pointer' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item md={4}>
            <div className="course-content pt-5 mt-5">
              <Card sx={{ backgroundColor: '#f5f5f5', color: '#333', borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h5" className="mb-4" align="center">
                    Phương thức thanh toán
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {/* Credit/Debit Card Payment */}
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="card-payment-content"
                      id="card-payment-header"
                    >
                      <CreditCardIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Thẻ tín dụng / Thẻ ghi nợ</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/visa.png" alt="visa"/>
                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/mastercard.png" alt="mastercard"/>
                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/amex.png" alt="amex"/>
                        <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/credit-card-front.png" alt="credit-card-front"/>
                        {/* Add more card logos as needed */}
                      </Box>
                      {/* Card Information Inputs */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Tên chủ thẻ"
                          variant="outlined"
                          fullWidth
                          value={cardName}
                          onChange={(e) => {
                            setCardName(e.target.value);
                            setCardError(prev => ({ ...prev, cardName: false }));
                          }}
                          error={cardError.cardName}
                          helperText={cardError.cardName ? 'Vui lòng nhập tên chủ thẻ' : ''}
                          InputLabelProps={{
                            style: { color: '#333' }, // Label color
                          }}
                          InputProps={{
                            style: { color: '#333' }, // Input text color
                          }}
                          FormHelperTextProps={{
                            style: { color: '#f44336' }, // Helper text color
                          }}
                        />
                        <TextField
                          label="Số thẻ"
                          variant="outlined"
                          fullWidth
                          value={cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 16) {
                              setCardNumber(value);
                              setCardError(prev => ({ ...prev, cardNumber: false }));
                            }
                          }}
                          error={cardError.cardNumber}
                          helperText={cardError.cardNumber ? 'Số thẻ không hợp lệ' : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CreditCardIcon />
                              </InputAdornment>
                            ),
                            style: { color: '#333' },
                          }}
                          InputLabelProps={{
                            style: { color: '#333' },
                          }}
                          FormHelperTextProps={{
                            style: { color: '#f44336' },
                          }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            label="Ngày hết hạn (MM/YY)"
                            variant="outlined"
                            fullWidth
                            value={expiryDate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 5) {
                                setExpiryDate(value);
                                setCardError(prev => ({ ...prev, expiryDate: false }));
                              }
                            }}
                            error={cardError.expiryDate}
                            helperText={cardError.expiryDate ? 'Ngày hết hạn không hợp lệ' : ''}
                            InputProps={{
                              style: { color: '#333' },
                            }}
                            InputLabelProps={{
                              style: { color: '#333' },
                            }}
                            FormHelperTextProps={{
                              style: { color: '#f44336' },
                            }}
                          />
                          <TextField
                            label="CVV"
                            variant="outlined"
                            fullWidth
                            value={cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 3) {
                                setCvv(value);
                                setCardError(prev => ({ ...prev, cvv: false }));
                              }
                            }}
                            error={cardError.cvv}
                            helperText={cardError.cvv ? 'CVV không hợp lệ' : ''}
                            InputProps={{
                              style: { color: '#333' },
                            }}
                            InputLabelProps={{
                              style: { color: '#333' },
                            }}
                            FormHelperTextProps={{
                              style: { color: '#f44336' },
                            }}
                          />
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => handleCheckout('card')}
                          disabled={loadingCheckout}
                        >
                          {loadingCheckout ? 'Đang xử lý...' : 'Thanh toán bằng thẻ'}
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <Divider sx={{ my: 3 }} />

                  {/* QR Code Banking */}
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="qr-code-payment-content"
                      id="qr-code-payment-header"
                    >
                      <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Thanh toán qua ngân hàng</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" gutterBottom>
                          Số tài khoản: 1907 1740 7060 18
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Số tiền: {formatNumber(totalAmount)} VND
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Nội dung: {courseNames}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <img
                            src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(qrCodeUrl)}`}
                            alt="QR Code"
                            style={{ width: '200px', height: '200px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/uploads/qr-code.jpg'; // Ensure fallback image exists
                            }}
                          />
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* MUA Button */}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={handleBuy}
                      disabled={loadingBuy}
                    >
                      {loadingBuy ? 'Đang xử lý...' : 'MUA'}
                    </Button>
                  </Box>

                  {/* Name and Email Fields */}
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      label="Tên người mua"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError(false);
                      }}
                      error={nameError}
                      helperText={nameError ? 'Vui lòng nhập tên của bạn' : ''}
                      InputLabelProps={{
                        style: { color: '#333' }, // Label color
                      }}
                      InputProps={{
                        style: { color: '#333' }, // Input text color
                      }}
                      FormHelperTextProps={{
                        style: { color: '#f44336' }, // Helper text color
                      }}
                    />

                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                      error={emailError}
                      helperText={emailError ? 'Vui lòng nhập email của bạn' : ''}
                      InputLabelProps={{
                        style: { color: '#333' }, // Label color
                      }}
                      InputProps={{
                        style: { color: '#333' }, // Input text color
                      }}
                      FormHelperTextProps={{
                        style: { color: '#f44336' }, // Helper text color
                      }}
                    />
                  </Box>

                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>

        {/* QR Code Modal */}
        <Modal open={showQRCodeDialog} onClose={() => setShowQRCodeDialog(false)}>
          <Box
            sx={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '10px',
              width: '350px',
              margin: 'auto',
              mt: '15%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" className="mb-4">
              Thanh toán bằng Ví điện tử
            </Typography>
            <img
              src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(qrCodeUrl)}`}
              alt="QR Code"
              style={{ width: '200px', height: '200px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/uploads/qr-code.jpg'; // Ensure fallback image exists
              }}
            />
            <Typography variant="body1" className="mt-3">
              Số tiền: {formatNumber(totalAmount)} VND
            </Typography>
            <Typography variant="body1" className="mt-1">
              Nội dung: {courseNames}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 3 }}
              onClick={() => setShowQRCodeDialog(false)}
            >
              Đóng
            </Button>
          </Box>
        </Modal>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </PageContainer>
  );
};

export default Cart;