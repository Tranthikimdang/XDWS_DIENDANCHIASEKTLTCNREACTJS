import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom'; // Lấy id từ URL
import { doc, getDoc } from 'firebase/firestore'; // Sử dụng để lấy dữ liệu cụ thể từ Firestore
import { db } from '../../../config/firebaseconfig';
import { formatDistanceToNow } from 'date-fns'; // Format ngày
import './detail.css';

const ProductsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading khi fetch dữ liệu

  // Lấy dữ liệu sản phẩm theo ID từ Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productRef = doc(db, 'products', id); // Lấy reference của sản phẩm
        const productSnap = await getDoc(productRef); // Fetch dữ liệu từ Firestore

        if (productSnap.exists()) {
          setProduct(productSnap.data()); // Set dữ liệu sản phẩm vào state
        } else {
          console.error('Sản phẩm không tồn tại');
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct(); // Gọi hàm nếu có ID
    }
  }, [id]);

  // Hàm định dạng ngày
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Box sx={{ padding: { xs: '10px' } }}>
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
                    {/* Cột hiển thị hình ảnh sản phẩm */}
                    <div className="preview col-md-6">
                      <div class="ratio ratio-16x9" dangerouslySetInnerHTML={{ __html: product.video_demo}}>
                       
                      </div>
                    </div>

                    {/* Cột hiển thị chi tiết sản phẩm */}
                    <div className="details col-md-6 ">
                      <h3 className="product-title d-flex flex-row">{product.name}</h3>
                      <div className="rating">
                        <div className="stars">
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                        </div>
                        <span className="review-no d-flex flex-row">41 reviews</span>
                      </div>
                      <p className="product-description d-flex flex-row">
                        Mô tả:{' '}
                        {product.description
                          ? product.description.replace(/(<([^>]+)>)/gi, '')
                          : 'No description available'}
                      </p>
                      <h4 className="price d-flex flex-row">
                        current price: <span> {product.price} VND</span>
                      </h4>
                      <p className="vote d-flex flex-row">
                        <strong>91%</strong> of buyers enjoyed this product!{' '}
                        <strong>(87 votes)</strong>
                      </p>
                      <div className="action">
                        <div className="d-flex flex-column mt-4">
                          <button className="btn btn-primary btn-sm" type="button">
                            Mua ngay
                          </button>
                          <button className="btn btn-outline-primary btn-sm mt-2" type="button">
                            Thêm vào giỏ hàng
                          </button>
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
    </Box>
  );
};

export default ProductsDetail;
