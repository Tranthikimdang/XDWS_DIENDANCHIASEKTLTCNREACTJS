import React, { useState } from "react";
import { styled, Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Footer from './footer/Footer';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  backgroundImage: 'url("../img/bg-1.jpg")', // Đường dẫn tuyệt đối từ thư mục public
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền trắng mờ để nội dung dễ đọc
  // Nếu bạn muốn thêm hình nền khác, hãy sử dụng điều kiện hoặc loại bỏ backgroundImage từ MainWrapper
}));
const FullLayout = () => {

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  return (
    <MainWrapper className='mainwrapper'>
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)} 
      />
      {/* Main Wrapper */}
      <PageWrapper className="page-wrapper">
        {/* Header */}
        <Header 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          toggleMobileSidebar={() => setMobileSidebarOpen(true)} 
        />
        {/* Page Content */}
        <Container sx={{ paddingTop: "20px", maxWidth: '1200px' }}>
          {/* Page Route */}
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
            <Outlet />
          </Box>
          {/* End Page */}
        </Container>
        <Footer />
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;