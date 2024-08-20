import React from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
// import SalesOverview from './components/SalesOverview';
// import YearlyBreakup from './components/YearlyBreakup';
// import RecentTransactions from './components/RecentTransactions';
// import ProductPerformance from './components/ProductPerformance';
// import Blog from './components/Blog';
// import MonthlyEarnings from './components/MonthlyEarnings';


const Home = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <h1>Đây là trang dashboard</h1>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Home;
