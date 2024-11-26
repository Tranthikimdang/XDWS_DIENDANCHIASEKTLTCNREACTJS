// src/components/ShoppingBag.js

import React, { useState } from 'react';
import { Button, Modal, Box, Typography, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import PayPalIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCode2Icon from '@mui/icons-material/QrCode2'; // Thêm icon QR Code
import orderApi from '../../apis/OrderApI'; // Import Order API

const ShoppingBag = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      format: 'Số điện tử',
      quantity: 2,
      price: 229000, // 9.99 USD ≈ 229,000 VND
      image: 'https://i.imgur.com/2DsA49b.webp',
    },
    {
      id: 2,
      title: 'Homo Deus: Lược Sử Tương Lai',
      author: 'Yuval Noah Harari',
      format: 'Bìa mềm',
      quantity: 1,
      price: 310000, // 13.50 USD ≈ 310,000 VND
      image: 'https://i.imgur.com/Oj1iQUX.webp',
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [name, setName] = useState('');
  const [exp, setExp] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return (
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('vi-VN') +
      ' ₫'
    );
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 29900; // 2.99 USD ≈ 29,900 VND
    const total = subtotal + shipping;
    return total.toLocaleString('vi-VN') + ' ₫';
  };

  const handleCheckout = async () => {
    const orderData = {
      items: cartItems,
      paymentMethod,
      total: calculateTotal(),
      // Thêm các thông tin khác nếu cần
    };

    try {
      const response = await orderApi.createOrder(orderData);
      if (response.status === 201) {
        setOrderSuccess(true);
        setOpenModal(true);
        // Làm mới giỏ hàng hoặc thực hiện các hành động khác
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.');
      setOpenModal(true);
    }
  };

  return (
    <section className="h-100 h-custom">
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="h5">Giỏ Hàng</th>
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
                            src={item.image}
                            className="img-fluid rounded-3"
                            style={{ width: '120px' }}
                            alt={item.title}
                          />
                          <div className="flex-column ms-4">
                            <p className="mb-2">{item.title}</p>
                            <p className="mb-0">{item.author}</p>
                          </div>
                        </div>
                      </th>
                      <td className="align-middle">
                        <p className="mb-0" style={{ fontWeight: 500 }}>{item.format}</p>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex flex-row align-items-center">
                          <IconButton
                            aria-label="giảm số lượng"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <RemoveIcon />
                          </IconButton>

                          <TextField
                            type="number"
                            inputProps={{ min: 0, style: { textAlign: 'center', width: '50px' } }}
                            value={item.quantity}
                            variant="outlined"
                            size="small"
                            disabled
                          />

                          <IconButton
                            aria-label="tăng số lượng"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </div>
                      </td>
                      <td className="align-middle">
                        <p className="mb-0" style={{ fontWeight: 500 }}>
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </p>
                        <IconButton
                          aria-label="xóa sản phẩm"
                          onClick={() => handleRemove(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card shadow-2-strong mb-5 mb-lg-0" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="row">
                  {/* Phương thức thanh toán */}
                  <div className="col-md-6 col-lg-4 col-xl-3 mb-4 mb-md-0">
                    <form>
                      <div className="d-flex flex-row pb-3">
                        <div className="d-flex align-items-center pe-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="creditCard"
                            value="creditCard"
                            checked={paymentMethod === 'creditCard'}
                            onChange={() => setPaymentMethod('creditCard')}
                            aria-label="Thẻ tín dụng"
                          />
                        </div>
                        <div className="rounded border w-100 p-3">
                          <Typography variant="body1" component="p" className="d-flex align-items-center mb-0">
                            <CreditCardIcon fontSize="large" className="text-body pe-2" /> Thẻ tín dụng
                          </Typography>
                        </div>
                      </div>
                      <div className="d-flex flex-row pb-3">
                        <div className="d-flex align-items-center pe-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="debitCard"
                            value="debitCard"
                            checked={paymentMethod === 'debitCard'}
                            onChange={() => setPaymentMethod('debitCard')}
                            aria-label="Thẻ ghi nợ"
                          />
                        </div>
                        <div className="rounded border w-100 p-3">
                          <Typography variant="body1" component="p" className="d-flex align-items-center mb-0">
                            <CreditCardOffIcon fontSize="large" className="text-body pe-2" /> Thẻ ghi nợ
                          </Typography>
                        </div>
                      </div>
                      <div className="d-flex flex-row pb-3">
                        <div className="d-flex align-items-center pe-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="qrCode"
                            value="qrCode"
                            checked={paymentMethod === 'qrCode'}
                            onChange={() => setPaymentMethod('qrCode')}
                            aria-label="Chuyển khoản QR"
                          />
                        </div>
                        <div className="rounded border w-100 p-3">
                          <Typography variant="body1" component="p" className="d-flex align-items-center mb-0">
                            <QrCode2Icon fontSize="large" className="text-body pe-2" /> Chuyển khoản QR
                          </Typography>
                        </div>
                      </div>
                      <div className="d-flex flex-row">
                        <div className="d-flex align-items-center pe-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="paypal"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                            aria-label="PayPal"
                          />
                        </div>
                        <div className="rounded border w-100 p-3">
                          <Typography variant="body1" component="p" className="d-flex align-items-center mb-0">
                            <PayPalIcon fontSize="large" className="text-body pe-2" /> PayPal
                          </Typography>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Chi tiết thanh toán */}
                  <div className="col-md-6 col-lg-4 col-xl-6">
                    <div className="row">
                      <div className="col-12 col-xl-6">
                        {paymentMethod !== 'qrCode' && (
                          <>
                            <Box className="mb-4 mb-xl-5">
                              <TextField
                                type="text"
                                id="nameOnCard"
                                label="Tên trên thẻ"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </Box>

                            <Box className="mb-4 mb-xl-5">
                              <TextField
                                type="text"
                                id="expiration"
                                label="Hạn sử dụng"
                                variant="outlined"
                                fullWidth
                                placeholder="MM/YY"
                                inputProps={{ maxLength: 5 }}
                                value={exp}
                                onChange={(e) => setExp(e.target.value)}
                              />
                            </Box>
                          </>
                        )}
                      </div>
                      <div className="col-12 col-xl-6">
                        {paymentMethod !== 'qrCode' && (
                          <>
                            <Box className="mb-4 mb-xl-5">
                              <TextField
                                type="text"
                                id="cardNumber"
                                label="Số thẻ"
                                variant="outlined"
                                fullWidth
                                placeholder="1111 2222 3333 4444"
                                inputProps={{ maxLength: 19 }}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                            </Box>

                            <Box className="mb-4 mb-xl-5">
                              <TextField
                                type="password"
                                id="cvv"
                                label="Cvv"
                                variant="outlined"
                                fullWidth
                                placeholder="•••"
                                inputProps={{ maxLength: 3 }}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                              />
                            </Box>
                          </>
                        )}
                        {paymentMethod === 'qrCode' && (
                          <Box className="text-center">
                            <Typography variant="body1" gutterBottom>
                              Quét mã QR dưới đây để chuyển khoản:
                            </Typography>
                            <img
                              src="https://i.imgur.com/your-qr-code-image.png" // Thay bằng URL hình ảnh QR code thực tế
                              alt="QR Code Chuyển Khoản"
                              style={{ width: '150px', height: '150px' }}
                            />
                          </Box>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tóm tắt */}
                  <div className="col-lg-4 col-xl-3">
                    <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 500 }}>
                      <Typography variant="subtitle1">Tạm tính</Typography>
                      <Typography variant="subtitle1">{calculateSubtotal()}</Typography>
                    </div>

                    <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 500 }}>
                      <Typography variant="subtitle1">Vận chuyển</Typography>
                      <Typography variant="subtitle1">29.900 ₫</Typography>
                    </div>

                    <hr className="my-4" />

                    <div className="d-flex justify-content-between mb-4" style={{ fontWeight: 500 }}>
                      <Typography variant="h6">Tổng cộng (đã bao gồm thuế)</Typography>
                      <Typography variant="h6">{calculateTotal()}</Typography>
                    </div>

                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={handleCheckout}
                    >
                      <Box className="d-flex justify-content-between" width="100%">
                        <Typography>Thanh toán</Typography>
                        <Typography>{calculateTotal()}</Typography>
                      </Box>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Thanh toán */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="checkout-success-title"
          aria-describedby="checkout-success-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              bgcolor: 'background.paper',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
            }}
          >
            {orderSuccess ? (
              <>
                <Typography id="checkout-success-title" variant="h6" component="h2" gutterBottom>
                  Thanh toán thành công!
                </Typography>
                <Typography id="checkout-success-description" sx={{ mt: 2 }}>
                  Đơn hàng của bạn đã được đặt thành công.
                </Typography>
              </>
            ) : (
              <>
                <Typography id="checkout-success-title" variant="h6" component="h2" gutterBottom>
                  Lỗi Thanh toán
                </Typography>
                <Typography id="checkout-success-description" sx={{ mt: 2 }}>
                  {orderError}
                </Typography>
              </>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => setOpenModal(false)}
            >
              Đóng
            </Button>
          </Box>
        </Modal>
      </div>
    </section>
  );
};

export default ShoppingBag;