// TypographyPage.js
import React from 'react';
import { Typography, Grid, CardContent, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import { styled } from '@mui/system';

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("../../layouts/img/bg-1.jpg")', // Đường dẫn tuyệt đối từ public
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: theme.spacing(4),
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Lớp phủ màu đen mờ
  backgroundBlendMode: 'overlay',
}));

const TypographyPage = () => {
  return (
    <PageContainer title="Typography" description="this is Typography">
      <BackgroundBox>
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <DashboardCard title="Default Text">
              <Grid container spacing={3}>
                <Grid item sm={12}>
                  <BlankCard>
                    <CardContent>
                      <Typography variant="h1">h1. Heading</Typography>
                      <Typography variant="body1" color="textSecondary">
                        font size: 30 | line-height: 45 | font weight: 500
                      </Typography>
                    </CardContent>
                  </BlankCard>
                </Grid>
                {/* Thêm các Grid items khác */}
              </Grid>
            </DashboardCard>
          </Grid>
          {/* Thêm các DashboardCard khác nếu cần */}
        </Grid>
      </BackgroundBox>
    </PageContainer>
  );
};

export default TypographyPage;