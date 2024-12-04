// Cart.js

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
import cartApi from '../../apis/cartsApi';
import courseApi from '../../apis/CourseApI';
import orderApi from '../../apis/OrderApI';

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
  const [countdown, setCountdown] = useState(60);
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
  const total_amount = cartItems.reduce((total, item) => {
    const price = products[item.course_id]?.price || 0;
    const discount = products[item.course_id]?.discount || 0;
    return total + (price - discount);
  }, 0);

  const courseNames = cartItems.map((item) => products[item.course_id]?.name).join(', ');

  // Update qrCodeUrl whenever cartItems or products change
  useEffect(() => {
    if (cartItems.length === 0) {
      setQRCodeUrl('');
      return;
    }

    const qrCodeContent = `Số tài khoản: 1907 1740 7060 18\nSố tiền: ${formatNumber(
      total_amount,
    )} VND\nNội dung: ${courseNames}`;
    setQRCodeUrl(qrCodeContent);
  }, [cartItems, products, total_amount, courseNames]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const data = await cartApi.getCartsList();
          const userCarts = data.data.carts.filter((cart) => cart.user_id === userId);
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
        data.data.courses.forEach((course) => {
          courseData[course.id] = course;
        });
        setProducts(courseData);

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
      await cartApi.deleteCart(id);
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
    return !Object.values(errors).some((error) => error);
  };

  // Updated handleCheckout function
  const handleCheckout = async (paymentMethod) => {
    if (paymentMethod === 'card' && !validateCardDetails()) {
      alert('Vui lòng nhập đầy đủ thông tin thẻ tín dụng.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn trống.');
      return;
    }

    if (!name || !email) {
      setNameError(!name);
      setEmailError(!email);
      return;
    }

    try {
      setLoadingCheckout(true);

      const cartId = cartItems[0]?.id;

      const orderData = {
        user_id: userId,
        username: name,
        user_email: email,
        item: JSON.stringify(
          cartItems.map((item) => ({
            course_id: item.course_id,
            quantity: item.quantity || 1,
            price: products[item.course_id]?.price || 0,
            discount: products[item.course_id]?.discount || 0,
          }))
        ),
        total_amount: total_amount,
        payment_method: paymentMethod,
        cart_id: cartId,
        status: paymentMethod === 'card' ? 'completed' : 'pending',
        ...(paymentMethod === 'card' && {
          card_details: JSON.stringify({
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
            cardholder_name: cardName,
          }),
        }),
      };

      const response = await orderApi.createOrder(orderData);

      if (response.status === 'success') {
        // Clear cart items
        await Promise.all(
          cartItems.map((item) => cartApi.deleteCart(item.id))
        );

        setCartItems([]);
        setSnackbarMessage(
          paymentMethod === 'card'
            ? 'Thanh toán thành công! Đơn hàng của bạn đã được tạo.'
            : 'Đơn hàng đã được tạo thành công!'
        );
        setOpenSnackbar(true);
        setShowQRCodeDialog(paymentMethod !== 'card');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(
        error.response?.data?.message ||
          'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.'
      );
    } finally {
      setLoadingCheckout(false);
    }
  };

  // Updated handleBuy function
  const handleBuy = async () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn trống.');
      return;
    }

    if (!name || !email) {
      setNameError(!name);
      setEmailError(!email);
      return;
    }

    try {
      setLoadingBuy(true);
      setCountdown(60);

      const cartId = cartItems[0]?.id;
      if (!cartId) {
        alert('Không tìm thấy ID giỏ hàng.');
        setLoadingBuy(false);
        return;
      }

      const orderData = {
        user_id: userId,
        username: name,
        user_email: email,
        item: JSON.stringify(
          cartItems.map((item) => ({
            course_id: item.course_id,
            quantity: item.quantity || 1,
            price: products[item.course_id]?.price || 0,
            discount: products[item.course_id]?.discount || 0,
          }))
        ),
        total_amount: total_amount,
        payment_method: 'bank_transfer',
        cart_id: cartId,
        status: 'pending',
      };

      setShowQRCodeDialog(true);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Create order after countdown
      setTimeout(async () => {
        try {
          const response = await orderApi.createOrder(orderData);

          if (response.status === 'success') {
            await Promise.all(
              cartItems.map((item) => cartApi.deleteCart(item.id))
            );

            setCartItems([]);
            setSnackbarMessage('Đơn hàng đã được tạo thành công!');
            setOpenSnackbar(true);
          }
        } catch (error) {
          console.error('Error creating order:', error);
          alert(
            error.response?.data?.message ||
              'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.'
          );
        } finally {
          clearInterval(timer);
          setLoadingBuy(false);
          setShowQRCodeDialog(false);
        }
      }, 60000);
    } catch (error) {
      console.error('Error during buying:', error);
      alert(
        error.response?.data?.message ||
          'Đã xảy ra lỗi khi xử lý đơn hàng.'
      );
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
                                    src={products[item.course_id].image}
                                    className="img-fluid rounded-3"
                                    alt={products[item.course_id]?.name || 'Course Image'}
                                    style={{ width: '65px' }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/uploads/placeholder.png';
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
                                  <span
                                    style={{
                                      textDecoration: 'line-through',
                                      marginRight: '5px',
                                      color: 'red',
                                    }}
                                  >
                                    {formatNumber(products[item.course_id]?.price || 0)} VND
                                  </span>
                                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                                    {formatNumber(
                                      products[item.course_id]?.price -
                                        (products[item.course_id]?.discount || 0),
                                    )}{' '}
                                    VND
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
                        <img
                          width="50"
                          height="50"
                          src="https://img.icons8.com/ios-filled/50/visa.png"
                          alt="visa"
                        />
                        <img
                          width="50"
                          height="50"
                          src="https://img.icons8.com/ios-filled/50/mastercard.png"
                          alt="mastercard"
                        />
                        <img
                          width="50"
                          height="50"
                          src="https://img.icons8.com/ios-filled/50/amex.png"
                          alt="amex"
                        />
                        <img
                          width="50"
                          height="50"
                          src="https://img.icons8.com/ios-filled/50/credit-card-front.png"
                          alt="credit-card-front"
                        />
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
                            setCardError((prev) => ({ ...prev, cardName: false }));
                          }}
                          error={cardError.cardName}
                          helperText={cardError.cardName ? 'Vui lòng nhập tên chủ thẻ' : ''}
                          InputLabelProps={{
                            style: { color: '#333' },
                          }}
                          InputProps={{
                            style: { color: '#333' },
                          }}
                          FormHelperTextProps={{
                            style: { color: '#f44336' },
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
                              setCardError((prev) => ({ ...prev, cardNumber: false }));
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
                                setCardError((prev) => ({ ...prev, expiryDate: false }));
                              }
                            }}
                            error={cardError.expiryDate}
                            helperText={
                              cardError.expiryDate ? 'Ngày hết hạn không hợp lệ' : ''
                            }
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
                                setCardError((prev) => ({ ...prev, cvv: false }));
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

                  {/* Buy Now Button Section */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#fff', borderRadius: '8px' }}>
                    <Typography variant="h6" gutterBottom>
                      Thông tin thanh toán
                    </Typography>

                    <TextField
                      label="Họ và tên"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError(false);
                      }}
                      error={nameError}
                      helperText={nameError ? 'Vui lòng nhập họ tên' : ''}
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
                      helperText={emailError ? 'Vui lòng nhập email' : ''}
                    />

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Tổng tiền: {formatNumber(total_amount)} VND
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{ mt: 2 }}
                      onClick={handleBuy}
                      disabled={loadingBuy}
                    >
                      {loadingBuy ? 'Đang xử lý...' : 'Mua ngay'}
                    </Button>
                  </Box>
                  {/* Add QR Code Dialog */}
                  <Modal
                    open={showQRCodeDialog}
                    onClose={() => setShowQRCodeDialog(false)}
                    aria-labelledby="qr-code-modal"
                    aria-describedby="qr-code-description"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" component="h2" gutterBottom>
                        Thông tin chuyển khoản
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }} paragraph>
                        {qrCodeUrl}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Thời gian còn lại: {countdown} giây
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setShowQRCodeDialog(false)}
                        sx={{ mt: 2 }}
                      >
                        Đóng
                      </Button>
                    </Box>
                  </Modal>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={100}
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