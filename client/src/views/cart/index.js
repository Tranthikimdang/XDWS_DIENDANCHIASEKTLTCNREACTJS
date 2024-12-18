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
  const [state, setState] = useState({
    cartItems: [],
    products: {},
    loadingCheckout: false,
    loadingBuy: false,
    showQRCodeDialog: false,
    qrCodeUrl: '',
    name: '',
    email: '',
    nameError: false,
    emailError: false,
    cardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      errors: { cardNumber: false, expiryDate: false, cvv: false, cardName: false },
    },
    snackbar: { open: false, message: '', severity: 'success' },
  });

  const { cartItems, products, loadingCheckout, loadingBuy, showQRCodeDialog, qrCodeUrl, name, email, nameError, emailError, cardDetails, snackbar } = state;
  const { cardNumber, expiryDate, cvv, cardName, errors } = cardDetails;

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id || null;

  const totalAmount = cartItems.reduce((total, item) => {
    const price = products[item.course_id]?.price || 0;
    const discount = products[item.course_id]?.discount || 0;
    return total + (price - discount);
  }, 0);

  const courseNames = cartItems.map(item => products[item.course_id]?.name).join(', ');

  useEffect(() => {
    if (cartItems.length === 0) {
      setState(prev => ({ ...prev, qrCodeUrl: '' }));
      return;
    }
    const qrCodeContent = `Số tài khoản: 1907 1740 7060 18\nSố tiền: ${formatNumber(totalAmount)} VND\nNội dung: ${courseNames}`;
    setState(prev => ({ ...prev, qrCodeUrl: qrCodeContent }));
  }, [cartItems, products, totalAmount, courseNames]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const { data } = await cartApi.getCartsList();
          const userCarts = data.carts.filter(cart => cart.user_id === userId);
          setState(prev => ({ ...prev, cartItems: userCarts }));
        } catch (error) {
          console.error('Error fetching carts:', error);
          setState(prev => ({
            ...prev,
            snackbar: { open: true, message: 'Đã xảy ra lỗi khi lấy dữ liệu giỏ hàng.', severity: 'error' },
          }));
        }
      }
    };
    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await courseApi.getCoursesList();
        const courseData = data.courses.reduce((acc, course) => ({ ...acc, [course.id]: course }), {});
        setState(prev => ({ ...prev, products: courseData }));
        console.log('Fetched Courses:', courseData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setState(prev => ({
          ...prev,
          snackbar: { open: true, message: 'Đã xảy ra lỗi khi lấy dữ liệu khóa học.', severity: 'error' },
        }));
      }
    };
    fetchCourses();
  }, []);

  const handleRemove = async (id) => {
    try {
      await cartApi.deleteCart(id);
      setState(prev => ({
        ...prev,
        cartItems: prev.cartItems.filter(item => item.id !== id),
        snackbar: { open: true, message: 'Sản phẩm đã được xóa khỏi giỏ hàng.', severity: 'success' },
      }));
    } catch (error) {
      console.error('Error removing item:', error);
      setState(prev => ({
        ...prev,
        snackbar: { open: true, message: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.', severity: 'error' },
      }));
    }
  };

  const formatNumber = (number) => new Intl.NumberFormat('vi-VN').format(number);

  const validateCardDetails = () => {
    const errors = {
      cardNumber: cardNumber.length !== 16,
      expiryDate: !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate),
      cvv: cvv.length !== 3,
      cardName: cardName.trim() === '',
    };
    setState(prev => ({
      ...prev,
      cardDetails: { ...prev.cardDetails, errors },
    }));
    return !Object.values(errors).some(error => error);
  };

  const handleCheckout = async (paymentMethod) => {
    if (cartItems.length === 0) {
      setState(prev => ({
        ...prev,
        snackbar: { open: true, message: 'Giỏ hàng của bạn trống.', severity: 'warning' },
      }));
      return;
    }
    if (!name || !email) {
      setState(prev => ({ ...prev, nameError: !name, emailError: !email }));
      setState(prev => ({
        ...prev,
        snackbar: { open: true, message: 'Vui lòng nhập đầy đủ thông tin.', severity: 'warning' },
      }));
      return;
    }
    if (paymentMethod === 'card' && !validateCardDetails()) {
      setState(prev => ({
        ...prev,
        snackbar: { open: true, message: 'Vui lòng nhập đầy đủ thông tin thẻ tín dụng.', severity: 'error' },
      }));
      return;
    }
    try {
      setState(prev => ({ ...prev, loadingCheckout: true }));
      const cartId = cartItems[0]?.id;
      const orderData = {
        user_id: userId,
        username: name,
        user_email: email,
        item: cartItems.map(item => ({
          course_id: item.course_id,
          quantity: item.quantity || 1,
          price: products[item.course_id]?.price || 0,
          discount: products[item.course_id]?.discount || 0,
        })),
        totalAmount,
        payment: paymentMethod,
        ...(paymentMethod === 'card' && {
          card_details: {
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv,
            cardholder_name: cardName,
          },
        }),
        cart_id: cartId,
      };
      const response = await orderApi.createOrder(orderData);
      if (response.status === 'success') {
        setState(prev => ({
          ...prev,
          cartItems: [],
          snackbar: { open: true, message: 'Thanh toán thành công! Đơn hàng của bạn đã được tạo.', severity: 'success' },
          showQRCodeDialog: paymentMethod === 'e_wallet',
        }));
      } else {
        setState(prev => ({
          ...prev,
          snackbar: { open: true, message: 'Thanh toán không thành công.', severity: 'error' },
        }));
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setState(prev => ({
        ...prev,
        snackbar: { open: true, message: 'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.', severity: 'error' },
      }));
    } finally {
      setState(prev => ({ ...prev, loadingCheckout: false }));
    }
  };

  const handleBuy = () => handleCheckout('addOrder');

  const handleCloseSnackbar = () => setState(prev => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }));

  const handleInputChange = (field, value) => {
    setState(prev => ({ ...prev, [field]: value, [`${field}Error`]: false }));
  };

  const handleCardInputChange = (field, value) => {
    setState(prev => ({
      ...prev,
      cardDetails: { ...prev.cardDetails, [field]: value, errors: { ...prev.cardDetails.errors, [field]: false } },
    }));
  };

  return (
    <PageContainer title="Giỏ hàng" description="Danh sách sản phẩm trong giỏ hàng của bạn">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item md={8}>
            <Box className="course-content">
              <Box className="container py-5 h-100">
                <Box className="row d-flex justify-content-center align-items-center h-100">
                  <Box className="col">
                    <Box className="p-4">
                      <Typography variant="h4" component="h1" className="heading">
                        Giỏ hàng của bạn
                      </Typography>
                      <Typography variant="body1" paragraph className="typography-body">
                        Bạn có {cartItems.length} sản phẩm trong giỏ hàng
                      </Typography>
                      {cartItems.map((item) => (
                        <Box className="card mb-3" key={item.id}>
                          <Box className="card-body">
                            <Box className="d-flex justify-content-between">
                              <Box className="d-flex flex-row align-items-center">
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
                                <Box className="ms-3">
                                  <Typography variant="h5">{products[item.course_id]?.name || ''}</Typography>
                                  <Typography variant="body2">ID sản phẩm: {item.course_id}</Typography>
                                </Box>
                              </Box>
                              <Box className="d-flex flex-row align-items-center">
                                <Typography variant="h6" className="mb-0">
                                  <span style={{ textDecoration: 'line-through', marginRight: '5px', color: 'red' }}>
                                    {formatNumber(products[item.course_id]?.price || 0)} VND
                                  </span>
                                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                                    {formatNumber(products[item.course_id]?.price - (products[item.course_id]?.discount || 0))} VND
                                  </span>
                                </Typography>
                                <DeleteIcon
                                  onClick={() => handleRemove(item.id)}
                                  style={{ color: '#cecece', cursor: 'pointer' }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box className="course-content pt-5 mt-5">
              <Card sx={{ backgroundColor: '#f5f5f5', color: '#333', borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h5" className="mb-4" align="center">
                    Phương thức thanh toán
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {/* Credit/Debit Card Payment */}
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="card-payment-content" id="card-payment-header">
                      <CreditCardIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Thẻ tín dụng / Thẻ ghi nợ</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {['visa', 'mastercard', 'amex', 'credit-card-front'].map((icon) => (
                          <img
                            key={icon}
                            width="50"
                            height="50"
                            src={`https://img.icons8.com/ios-filled/50/${icon}.png`}
                            alt={icon}
                          />
                        ))}
                      </Box>
                      {/* Card Information Inputs */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Tên chủ thẻ"
                          variant="outlined"
                          fullWidth
                          value={cardName}
                          onChange={(e) => handleCardInputChange('cardName', e.target.value)}
                          error={errors.cardName}
                          helperText={errors.cardName && 'Vui lòng nhập tên chủ thẻ'}
                          InputLabelProps={{ style: { color: '#333' } }}
                          InputProps={{ style: { color: '#333' } }}
                          FormHelperTextProps={{ style: { color: '#f44336' } }}
                        />
                        <TextField
                          label="Số thẻ"
                          variant="outlined"
                          fullWidth
                          value={cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 16) handleCardInputChange('cardNumber', value);
                          }}
                          error={errors.cardNumber}
                          helperText={errors.cardNumber && 'Số thẻ không hợp lệ'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CreditCardIcon />
                              </InputAdornment>
                            ),
                            style: { color: '#333' },
                          }}
                          InputLabelProps={{ style: { color: '#333' } }}
                          FormHelperTextProps={{ style: { color: '#f44336' } }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            label="Ngày hết hạn (MM/YY)"
                            variant="outlined"
                            fullWidth
                            value={expiryDate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 5) handleCardInputChange('expiryDate', value);
                            }}
                            error={errors.expiryDate}
                            helperText={errors.expiryDate && 'Ngày hết hạn không hợp lệ'}
                            InputProps={{ style: { color: '#333' } }}
                            InputLabelProps={{ style: { color: '#333' } }}
                            FormHelperTextProps={{ style: { color: '#f44336' } }}
                          />
                          <TextField
                            label="CVV"
                            variant="outlined"
                            fullWidth
                            value={cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 3) handleCardInputChange('cvv', value);
                            }}
                            error={errors.cvv}
                            helperText={errors.cvv && 'CVV không hợp lệ'}
                            InputProps={{ style: { color: '#333' } }}
                            InputLabelProps={{ style: { color: '#333' } }}
                            FormHelperTextProps={{ style: { color: '#f44336' } }}
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
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="qr-code-payment-content" id="qr-code-payment-header">
                      <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Thanh toán qua ngân hàng</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" gutterBottom>Số tài khoản: 1907 1740 7060 18</Typography>
                        <Typography variant="body1" gutterBottom>Số tiền: {formatNumber(totalAmount)} VND</Typography>
                        <Typography variant="body1" gutterBottom>Nội dung: {courseNames}</Typography>
                        {qrCodeUrl && (
                          <Box sx={{ mt: 2 }}>
                            <img
                              src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(qrCodeUrl)}`}
                              alt="QR Code"
                              style={{ width: '200px', height: '200px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/uploads/qr-code.jpg';
                              }}
                            />
                          </Box>
                        )}
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
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={nameError}
                      helperText={nameError && 'Vui lòng nhập tên của bạn'}
                      InputLabelProps={{ style: { color: '#333' } }}
                      InputProps={{ style: { color: '#333' } }}
                      FormHelperTextProps={{ style: { color: '#f44336' } }}
                    />
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={emailError}
                      helperText={emailError && 'Vui lòng nhập email của bạn'}
                      InputLabelProps={{ style: { color: '#333' } }}
                      InputProps={{ style: { color: '#333' } }}
                      FormHelperTextProps={{ style: { color: '#f44336' } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* QR Code Modal */}
        <Modal open={showQRCodeDialog} onClose={() => setState(prev => ({ ...prev, showQRCodeDialog: false }))}>
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
            <Typography variant="h6" className="mb-4">Thanh toán bằng Ví điện tử</Typography>
            <img
              src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(qrCodeUrl)}`}
              alt="QR Code"
              style={{ width: '200px', height: '200px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/uploads/qr-code.jpg';
              }}
            />
            <Typography variant="body1" className="mt-3">Số tiền: {formatNumber(totalAmount)} VND</Typography>
            <Typography variant="body1" className="mt-1">Nội dung: {courseNames}</Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 3 }}
              onClick={() => setState(prev => ({ ...prev, showQRCodeDialog: false }))}
            >
              Đóng
            </Button>
          </Box>
        </Modal>

        {/* Success and Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageContainer>
  );
};

export default Cart;