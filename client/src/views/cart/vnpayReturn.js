// src/components/VnpayReturn.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Button } from '@mui/material';

const VnpayReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const vnp_ResponseCode = query.get('vnp_ResponseCode');

    if (vnp_ResponseCode === '00') {
      setStatus('Thanh toán thành công!');
    } else if (vnp_ResponseCode === '24') {
      setStatus('Thanh toán bị hủy.');
    } else {
      setStatus('Thanh toán thất bại.');
    }

    // Optionally, fetch order details from your backend using query params
  }, [location.search]);

  if (status === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {status}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/orders')}>
        Xem Đơn Hàng
      </Button>
      <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => navigate('/')}>
        Quay Lại Trang Chủ
      </Button>
    </Box>
  );
};

export default VnpayReturn;