import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Modal, Button, TextField } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { collection, onSnapshot, query, where, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './index.css';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [showQRCodeDialog, setShowQRCodeDialog] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'orders'), where('user_id', '==', userId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cartData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCartItems(cartData);

        if (cartData.length === 0) {
          setShowQRCodeDialog(false);
        }
      });

      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsQuery = collection(db, 'products');
      const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
        const productData = {};
        snapshot.docs.forEach((doc) => {
          productData[doc.id] = doc.data();
        });
        setProducts(productData);
      });

      return () => unsubscribe();
    };

    fetchProducts();
  }, []);

  const handleRemove = (id) => {
    // Do not delete the document in Firestore, just update the UI
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const handleCheckout = async () => {
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

      const totalAmount = cartItems.reduce((total, item) => {
        const discount = products[item.product_id]?.discount || 0;
        return total + discount;
      }, 0);

      const productNames = cartItems
        .map((item) => products[item.product_id]?.name || 'Sản phẩm không tìm thấy')
        .join(', ');

      // Create order in the 'orders' collection
      await setDoc(doc(collection(db, 'orders')), {
        user_id: userId,
        user_name: name,
        user_email: email,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity || 1,
          price: products[item.product_id]?.discount || 0,
        })),
        totalAmount,
        paymentMethod: 'e_wallet',
        createdAt: new Date(),
      });

      // Remove items from cart after successful checkout
      await Promise.all(
        cartItems.map((item) => deleteDoc(doc(db, 'orders', item.id)))
      );

      alert('Thanh toán thành công! Đơn hàng của bạn đã được tạo.');

      // Generate QR code URL with total amount and product names as a note
      const qrCodeUrl = `https://qr.sepay.vn/img?bank=Techcombank&acc=19071740706018&amount=${totalAmount}&des='Khoá Học '${encodeURIComponent(
        productNames,
      )}`;
      setQRCodeUrl(qrCodeUrl);

      // Show QR code dialog for e-wallet payment
      setShowQRCodeDialog(true);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.');
    } finally {
      setLoadingCheckout(false);
    }
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
                                {products[item.product_id] && (
                                  <img
                                    src={products[item.product_id].image_url}
                                    className="img-fluid rounded-3"
                                    alt={products[item.product_id].name}
                                    style={{ width: '65px' }}
                                  />
                                )}
                                <div className="ms-3">
                                  <h5>
                                    {products[item.product_id]?.name || 'Sản phẩm không tìm thấy'}
                                  </h5>
                                  <p className="small mb-0">ID sản phẩm: {item.product_id}</p>
                                </div>
                              </div>
                              <div className="d-flex flex-row align-items-center">
                                <h6 className="mb-0">
                                  {formatNumber(products[item.product_id]?.discount || 0)} VND
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
              <div className="card bg-primary text-white rounded-3">
                <div className="card-body p-4">
                  <Typography variant="h5" className="mb-4">
                    Chi tiết thanh toán
                  </Typography>
                  <div className="d-flex justify-content-between mb-2">
                    <p className="mb-0">Tổng cộng</p>
                    <p className="mb-0">
                      {formatNumber(
                        cartItems.reduce((total, item) => {
                          const discount = products[item.product_id]?.discount || 0;
                          return total + discount;
                        }, 0),
                      )}{' '}
                      VND
                    </p>
                  </div>

                  {/* Name and Email Fields */}
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
                      style: { color: 'white' }, // Label color
                    }}
                    InputProps={{
                      style: { color: 'white' }, // Input text color
                    }}
                    FormHelperTextProps={{
                      style: { color: 'white' }, // Helper text color
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
                      style: { color: 'white' }, // Label color
                    }}
                    InputProps={{
                      style: { color: 'white' }, // Input text color
                    }}
                    FormHelperTextProps={{
                      style: { color: 'white' }, // Helper text color
                    }}
                  />

                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    sx={{ mt: 3, borderRadius: '0.5rem' }}
                    onClick={handleCheckout}
                    disabled={loadingCheckout}
                  >
                    {loadingCheckout ? 'Đang xử lý...' : 'Thanh toán'}
                  </Button>

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
                        src={qrCodeUrl}
                        alt="QR Code"
                        style={{ width: '200px', height: '200px' }}
                      />
                      <Typography variant="body1" className="mt-3">
                        Vui lòng quét mã QR để thanh toán
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
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Cart;