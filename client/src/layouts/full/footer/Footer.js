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
import './Footer.css';

export default function Footer() {
  return (
    <Box component="footer" className="footer">
      {/* Kết Nối Mạng Xã Hội */}
      <Box className="social-section">
        <Typography variant="h6" align="center" gutterBottom>
          Kết nối với chúng tôi
        </Typography>
        <Box display="flex" justifyContent="center" className="social-icons">
          <IconButton href="https://facebook.com" target="_blank" aria-label="facebook">
            <FacebookIcon />
          </IconButton>
          <IconButton href="https://twitter.com" target="_blank" aria-label="twitter">
            <TwitterIcon />
          </IconButton>
          <IconButton href="https://google.com" target="_blank" aria-label="google">
            <GoogleIcon />
          </IconButton>
          <IconButton href="https://instagram.com" target="_blank" aria-label="instagram">
            <InstagramIcon />
          </IconButton>
          <IconButton href="https://linkedin.com" target="_blank" aria-label="linkedin">
            <LinkedInIcon />
          </IconButton>
          <IconButton href="https://github.com" target="_blank" aria-label="github">
            <GitHubIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Nội Dung Footer */}
      <Box className="content-section">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              ShareCode
            </Typography>
            <Typography variant="body2">
              Diễn đàn chia sẻ kiến thức lập trình, nơi bạn có thể học hỏi và trao đổi từ cộng đồng.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm
            </Typography>
            <ul className="footer-list">
              <li>
                <Link href="#" underline="hover">Angular</Link>
              </li>
              <li>
                <Link href="#" underline="hover">React</Link>
              </li>
              <li>
                <Link href="#" underline="hover">Vue</Link>
              </li>
              <li>
                <Link href="#" underline="hover">Laravel</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Liên kết hữu ích
            </Typography>
            <ul className="footer-list">
              <li>
                <Link href="#" underline="hover">Bảng giá</Link>
              </li>
              <li>
                <Link href="#" underline="hover">Cài đặt</Link>
              </li>
              <li>
                <Link href="#" underline="hover">Đơn hàng</Link>
              </li>
              <li>
                <Link href="#" underline="hover">Trợ giúp</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
      <Box className="copyright">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Bản quyền thuộc về:
          <Link href="https://sharecode.vn/" sx={{ ml: 1, fontWeight: 'bold' }}>
            ShareCode.vn
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
