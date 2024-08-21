import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Article from '../article/Article';

const Home = () => {
  return (
    <PageContainer title="Home" description="This is the dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography 
              variant="h1" // Adjusted for a larger size
              component="h1" 
              gutterBottom 
              align="left" // Aligned to the left
            >
              Top Questions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Article />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Home;
