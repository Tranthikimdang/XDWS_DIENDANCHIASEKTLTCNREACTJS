import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './index.css';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});

  // Lấy userId từ local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // Lấy dữ liệu từ bảng `order` theo `userId`
  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'orders'), where('user_id', '==', userId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cartData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  // Lấy thông tin sản phẩm từ bảng `product`
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

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = async (id) => {
    await deleteDoc(doc(db, 'orders', id));
  };

  // Hàm định dạng số
  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  return (
    <PageContainer title="Giỏ hàng" description="Danh sách sản phẩm trong giỏ hàng của bạn">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          {/* Right Column */}
          <Grid item md={8}>
            <div className="course-content">
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col">
                    <div className=" p-4">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <Grid
                              item
                              xs={12}
                              sx={{ marginBottom: { xs: '50px', md: '0px' }, marginTop: '30px' }}
                            >
                              <Typography variant="h4" component="h1" className="heading">
                                Giỏ hàng của bạn
                              </Typography>
                              <Typography variant="body1" paragraph className="typography-body">
                                <p className="mb-0">
                                  Bạn có {cartItems.length} sản phẩm trong giỏ hàng
                                </p>
                              </Typography>
                            </Grid>
                          </div>

                          {cartItems.map((item) => (
                            <div className="card mb-3" key={item.id}>
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex flex-row align-items-center">
                                    <div>
                                      {products[item.product_id] && (
                                        <img
                                          src={products[item.product_id].image_url}
                                          className="img-fluid rounded-3"
                                          alt={products[item.product_id].name}
                                          style={{ width: '65px' }}
                                        />
                                      )}
                                    </div>
                                    <div className="ms-3">
                                      <h5>
                                        {products[item.product_id]?.name || 'Sản phẩm không tìm thấy'}
                                      </h5>
                                      <p className="small mb-0">ID sản phẩm: {item.product_id}</p>
                                    </div>
                                  </div>
                                  <div className="d-flex flex-row align-items-center">
                                    <div style={{ width: '150px' }}>
                                      <h6 className="mb-0">
                                        {formatNumber(products[item.product_id]?.discount || 0)} VND
                                      </h6>
                                    </div>
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
              </div>
            </div>
          </Grid>
          <Grid item md={4}>
            <div className="course-content pt-5 mt-5">
              <div className="card bg-primary text-white rounded-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Chi tiết thanh toán</h5>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <p className="mb-0">Tổng cộng</p>
                    <p className="mb-0">
                      {formatNumber(
                        cartItems.reduce((total, item) => {
                          const discount = products[item.product_id]?.discount || 0;
                          return total + discount;
                        }, 0)
                      )}{' '}
                      VND
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-info btn-lg w-100 mt-3"
                    style={{ borderRadius: '0.5rem' }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="ms-2">Thanh toán</span>
                    </div>
                  </button>
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
