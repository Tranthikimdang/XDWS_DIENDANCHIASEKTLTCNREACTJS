// Footer.js
import React from 'react';
import { Box, Typography, Grid, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PrintIcon from '@mui/icons-material/Print';
import './Footer.css'; // Import file CSS mới

export default function Footer() {
  return (
    <Box component="footer" className='footer'>
      {/* Kết Nối Mạng Xã Hội */}
      <Box className='social-section' sx={{ py: 4, borderBottom: '1px solid #ccc' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">
              Kết nối với chúng tôi trên các mạng xã hội:
            </Typography>
          </Grid>
          <Grid item className='social-icons'>
            <IconButton component="a" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton component="a" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton component="a" href="https://google.com" target="_blank" rel="noopener noreferrer" aria-label="google">
              <GoogleIcon />
            </IconButton>
            <IconButton component="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton component="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
              <LinkedInIcon />
            </IconButton>
            <IconButton component="a" href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="github">
              <GitHubIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      {/* Nội Dung Footer */}
      <Box className='content-section' sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Giới Thiệu Công Ty */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              ShareCode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ShareCode là diễn đàn chia sẻ kiến thức lập trình, nơi bạn có thể trao đổi và học hỏi từ cộng đồng.
            </Typography>
          </Grid>

          {/* Sản Phẩm */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                Angular
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                React
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                Vue
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                Laravel
              </Link>
            </Typography>
          </Grid>

          {/* Liên Kết Hữu Ích */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Liên kết hữu ích
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                Bảng giá
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                Cài đặt
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                Đơn hàng
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="hover">
                Trợ giúp
              </Link>
            </Typography>
          </Grid>

          {/* Thông Tin Liên Hệ */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Liên hệ
            </Typography>
            <Typography variant="body2" display="flex" alignItems="center">
              <HomeIcon sx={{ mr: 1 }} /> Cần Thơ, Việt Nam
            </Typography>
            <Typography variant="body2" display="flex" alignItems="center">
              <EmailIcon sx={{ mr: 1 }} /> support@sharecode.vn
            </Typography>
            <Typography variant="body2" display="flex" alignItems="center">
              <PhoneIcon sx={{ mr: 1 }} /> + 84 123 456 789
            </Typography>
            <Typography variant="body2" display="flex" alignItems="center">
              <PrintIcon sx={{ mr: 1 }} /> + 84 987 654 321
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Bản Quyền */}
      <Box className='copyright' sx={{ py: 2, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Bản quyền thuộc về:
          <Link href="https://sharecode.vn/" color="inherit" sx={{ ml: 1, fontWeight: 'bold' }}>
            ShareCode.vn
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}