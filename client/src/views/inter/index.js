import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';
import HashtagApi from "../../apis/HashtagApi"; // Import Hashtag API

const Inter = () => {
  // State để lưu các hashtag lấy từ API
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const navigate = useNavigate();

  // Hàm lấy dữ liệu từ Hashtag API
  const fetchHashtags = async () => {
    try {
      const response = await HashtagApi.getHashtags(); // Gọi API lấy hashtags 
      setHashtags(response.data.hashtags); // Lưu hashtags vào state
    } catch (error) {
      console.error('Error fetching hashtags:', error);
    }
  };

  // Lấy dữ liệu từ localStorage khi trang load lại
  useEffect(() => {
    const savedHashtags = JSON.parse(localStorage.getItem('selectedHashtags')) || [];
    setSelectedHashtags(savedHashtags);
    fetchHashtags();
  }, []);

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn một hashtag
  const handleHashtagSelect = (hashtagId) => {
    setSelectedHashtags((prevSelected) => {
      let updatedSelection;

      if (prevSelected.includes(hashtagId)) {
        updatedSelection = prevSelected.filter((id) => id !== hashtagId); // Bỏ chọn nếu đã được chọn
      } else {
        updatedSelection = [...prevSelected, hashtagId]; // Thêm vào nếu chưa được chọn
      }

      // Lưu lựa chọn vào localStorage
      localStorage.setItem('selectedHashtags', JSON.stringify(updatedSelection));

      return updatedSelection;
    });
  };

  const handleContinue = () => {
    // Điều hướng đến một trang khác hoặc xử lý logic tiếp theo
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
              <h3
                style={{ display: 'flex', justifyContent: 'center' }}
                className="text-center mb-4"
              >
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
                      selectedHashtags.includes(hashtag.id) ? 'selected' : ''
                    }`}
                    onClick={() => handleHashtagSelect(hashtag.id)}
                  >
                    {hashtag.name} {/* Hiển thị tên hashtag */}
                  </button>
                ))}
              </Box>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleContinue}
                  disabled={selectedHashtags.length === 0} // Vô hiệu hóa nếu không có hashtag nào được chọn
                >
                  Hoàn thành
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Style cho nút được chọn */}
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
