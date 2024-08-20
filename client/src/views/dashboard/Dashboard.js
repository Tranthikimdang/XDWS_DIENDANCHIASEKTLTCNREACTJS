import React from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
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
        <Grid container spacing={3} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
          
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Home;
