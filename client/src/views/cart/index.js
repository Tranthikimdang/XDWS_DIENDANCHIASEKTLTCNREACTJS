import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Button, TextField } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { collection, onSnapshot, query, where, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './index.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { FaCcMastercard, FaCcVisa, FaCcPaypal } from 'react-icons/fa';
import { QrReader } from 'react-qr-reader';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [showQRCodeDialog, setShowQRCodeDialog] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Thẻ tín dụng');
  const [qrScanResult, setQrScanResult] = useState('');

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

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.');
    }
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
        .map((item) => products[item.product_id]?.name || '.')
        .join(', ');

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
        paymentMethod: 'ví điện tử',
        createdAt: new Date(),
      });

      await Promise.all(
        cartItems.map((item) => deleteDoc(doc(db, 'orders', item.id)))
      );

      alert('Thanh toán thành công! Đơn hàng của bạn đã được tạo.');

      const qrCodeUrl = `https://qr.sepay.vn/img?bank=Techcombank&acc=19071740706018&amount=${totalAmount}&des=${encodeURIComponent(
        `Khoá Học ${productNames}`
      )}`;
      setQRCodeUrl(qrCodeUrl);

      setShowQRCodeDialog(true);
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity < 1 ? 1 : quantity } : item
      )
    );
  };

  const handleScan = (data) => {
    if (data) {
      setQrScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <PageContainer title="Giỏ hàng" description="Danh sách sản phẩm trong giỏ hàng của bạn">
      <Box sx={{ padding: { xs: '10px' } }}>
        <section className="h-100 h-custom">
          <div className="container h-100 py-5">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col" className="h5">Giỏ hàng</th>
                        <th scope="col">Định dạng</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">
                            <div className="d-flex align-items-center">
                              <img
                                src={products[item.product_id]?.image_url || 'https://i.imgur.com/2DsA49b.webp'}
                                className="img-fluid rounded-3"
                                style={{ width: '120px' }}
                                alt={products[item.product_id]?.name || 'Sản phẩm'}
                              />
                              <div className="flex-column ms-4">
                                <p className="mb-2">{products[item.product_id]?.name || 'Tên sản phẩm'}</p>
                                <p className="mb-0">ID sản phẩm: {item.product_id}</p>
                              </div>
                            </div>
                          </th>
                          <td className="align-middle">
                            <p className="mb-0" style={{ fontWeight: 500 }}>Kỹ thuật số</p>
                          </td>
                          <td className="align-middle">
                            <div className="d-flex flex-row">
                              <button
                                className="btn btn-link px-2"
                                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                              >
                                <RemoveIcon />
                              </button>
                              <input
                                min="1"
                                name="quantity"
                                value={item.quantity || 1}
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: '50px' }}
                                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                              />
                              <button
                                className="btn btn-link px-2"
                                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                              >
                                <AddIcon />
                              </button>
                            </div>
                          </td>
                          <td className="align-middle">
                            <p className="mb-0" style={{ fontWeight: 500 }}>
                              {formatNumber(products[item.product_id]?.discount || 0)} VND
                            </p>
                          </td>
                          <td className="align-middle">
                            <DeleteForeverIcon
                              onClick={() => handleRemove(item.id)}
                              style={{ color: '#cecece', cursor: 'pointer' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card shadow-2-strong mb-5 mb-lg-0" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="row">
                      <div className="col-md-6 col-lg-4 col-xl-3 mb-4 mb-md-0">
                        <form>
                          <div className="d-flex flex-row pb-3">
                            <div className="d-flex align-items-center pe-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="creditCard"
                                value="Thẻ tín dụng"
                                defaultChecked
                                onChange={() => setPaymentMethod('Thẻ tín dụng')}
                              />
                            </div>
                            <div className="rounded border w-100 p-3">
                              <p className="d-flex align-items-center mb-0">
                                <FaCcMastercard size={32} className="text-body pe-2" />Thẻ tín dụng
                              </p>
                            </div>
                          </div>
                          <div className="d-flex flex-row pb-3">
                            <div className="d-flex align-items-center pe-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="debitCard"
                                value="Thẻ ghi nợ"
                                onChange={() => setPaymentMethod('Thẻ ghi nợ')}
                              />
                            </div>
                            <div className="rounded border w-100 p-3">
                              <p className="d-flex align-items-center mb-0">
                                <FaCcVisa size={32} className="text-body pe-2" />Thẻ ghi nợ
                              </p>
                            </div>
                          </div>
                          <div className="d-flex flex-row">
                            <div className="d-flex align-items-center pe-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="paypal"
                                value="PayPal"
                                onChange={() => setPaymentMethod('PayPal')}
                              />
                            </div>
                            <div className="rounded border w-100 p-3">
                              <p className="d-flex align-items-center mb-0">
                                <FaCcPaypal size={32} className="text-body pe-2" />PayPal
                              </p>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-xl-6">
                            <div className="form-outline mb-4 mb-xl-5">
                              <TextField
                                label="Tên trên thẻ"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={nameError}
                                helperText={nameError ? 'Vui lòng nhập tên của bạn' : ''}
                              />
                            </div>

                            <div className="form-outline mb-4 mb-xl-5">
                              <TextField
                                label="Ngày hết hạn"
                                variant="outlined"
                                fullWidth
                                value={expiration}
                                onChange={(e) => setExpiration(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-xl-6">
                            <div className="form-outline mb-4 mb-xl-5">
                              <TextField
                                label="Số thẻ"
                                variant="outlined"
                                fullWidth
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                            </div>

                            <div className="form-outline mb-4 mb-xl-5">
                              <TextField
                                label="Cvv"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-xl-3">
                        <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                          <p className="mb-2">Tổng phụ</p>
                          <p className="mb-2">
                            {formatNumber(
                              cartItems.reduce((total, item) => {
                                const discount = products[item.product_id]?.discount || 0;
                                return total + discount;
                              }, 0)
                            )} VND
                          </p>
                        </div>

                        <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                          <p className="mb-0">Vận chuyển</p>
                          <p className="mb-0">$2.99</p>
                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between mb-4" style={{ fontWeight: 500 }}>
                          <p className="mb-2">Tổng cộng (đã bao gồm thuế)</p>
                          <p className="mb-2">
                            {formatNumber(
                              cartItems.reduce((total, item) => {
                                const discount = products[item.product_id]?.discount || 0;
                                return total + discount;
                              }, 0)
                            )} VND
                          </p>
                        </div>

                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          size="large"
                          onClick={handleCheckout}
                          disabled={loadingCheckout}
                        >
                          <div className="d-flex justify-content-between" style={{ width: '100%' }}>
                            <span>Thanh toán</span>
                            <span>
                              {formatNumber(
                                cartItems.reduce((total, item) => {
                                  const discount = products[item.product_id]?.discount || 0;
                                  return total + discount;
                                }, 0)
                              )} VND
                            </span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Box>

      
      
    </PageContainer>
  );
};

export default Cart;