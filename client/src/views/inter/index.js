import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';
import HashtagApi from "../../apis/HashtagApi"; // Import Hashtag API

const Inter = () => {
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const navigate = useNavigate();

  const fetchHashtags = async () => {
    try {
      const response = await HashtagApi.getHashtags(); // Gọi API lấy hashtags
      setHashtags(response.data.hashtags); // Lưu hashtags vào state
    } catch (error) {
      console.error('Error fetching hashtags:', error);
    }
  };

  useEffect(() => {
    const savedHashtags = JSON.parse(localStorage.getItem('selectedHashtags')) || [];
    setSelectedHashtags(savedHashtags);
    fetchHashtags();
  }, []);

  const handleHashtagSelect = (hashtag) => {
    setSelectedHashtags((prevSelected) => {
      let updatedSelection;

      const isAlreadySelected = prevSelected.some((item) => item.id === hashtag.id);

      if (isAlreadySelected) {
        // Loại bỏ hashtag đã chọn
        updatedSelection = prevSelected.filter((item) => item.id !== hashtag.id);
      } else {
        // Thêm hashtag mới vào danh sách
        updatedSelection = [...prevSelected, hashtag];
      }

      // Lưu vào localStorage toàn bộ danh sách
      localStorage.setItem('selectedHashtags', JSON.stringify(updatedSelection));

      return updatedSelection;
    });
  };

  const handleContinue = () => {
    console.log('Selected Hashtags:', selectedHashtags);
    navigate('/home');
  };

  return (
    <PageContainer title="Interests" description="Select your interests">
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            opacity: 0.3,
            zIndex: -1,
          },
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card elevation={9} sx={{ p: 4 }}>
              <h3 style={{ display: 'flex', justifyContent: 'center' }}>
                Bạn quan tâm đến những nội dung nào?
              </h3>
              <Box
                alignItems="center"
                justifyContent="center"
                mb={2}
                display="flex"
                flexWrap="wrap"
              >
                {hashtags.map((hashtag) => (
                  <button
                    key={hashtag.id}
                    type="button"
                    className={`btn btn-outline-secondary m-2 bigger-btn ${
                      selectedHashtags.some((item) => item.id === hashtag.id) ? 'selected' : ''
                    }`}
                    onClick={() => handleHashtagSelect(hashtag)}
                  >
                    {hashtag.name}
                  </button>
                ))}
              </Box>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleContinue}
                  disabled={selectedHashtags.length === 0}
                >
                  Hoàn thành
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <style>
        {`
          .bigger-btn.selected {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
          }
          .bigger-btn {
            border-radius: 50px !important;
          }
        `}
      </style>
    </PageContainer>
  );
};

export default Inter;
