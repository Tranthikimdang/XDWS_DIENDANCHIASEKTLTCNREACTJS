import React, { useState } from "react";
import { styled, Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './header/Header';
import Footer from './footer/Footer';
import Sidebar from './sidebar/Sidebar';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  paddingBottom: '60px',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

const ContentWrapper = styled('div')(() => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        {/* Content Wrapper */}
        <ContentWrapper>
          {/* PageContent */}
          <Container sx={{ paddingTop: "20px", maxWidth: '1200px' }}>
            {/* Page Route */}
            <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
              <Outlet />
            </Box>
          </Container>
          {/* Footer */}
          <Footer />
        </ContentWrapper>
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;