import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, Button } from '@mui/material';
import { db } from '../../config/firebaseconfig'; 
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate, Link } from 'react-router-dom';

const Inter = () => {
  // State để lưu các danh mục lấy từ Firestore
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  // Hàm lấy dữ liệu từ Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories')); // Truy vấn dữ liệu từ Firestore
      const categoryList = [];
      querySnapshot.forEach((doc) => {
        categoryList.push({ id: doc.id, ...doc.data() });
      });
      setCategories(categoryList); // Lưu danh mục vào state
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Lấy dữ liệu từ localStorage khi trang load lại
  useEffect(() => {
    const savedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
    setSelectedCategories(savedCategories);
    fetchCategories();
  }, []);

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn một danh mục
  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      let updatedSelection;

      if (prevSelected.includes(categoryId)) {
        updatedSelection = prevSelected.filter((id) => id !== categoryId); // Bỏ chọn nếu đã được chọn
      } else {
        updatedSelection = [...prevSelected, categoryId]; // Thêm vào nếu chưa được chọn
      }

      // Lưu lựa chọn vào localStorage
      localStorage.setItem('selectedCategories', JSON.stringify(updatedSelection));

      return updatedSelection;
    });
  };

  const handleContinue = () => {
    // Điều hướng đến một trang khác hoặc xử lý logic tiếp theo
    // Ở đây, mình điều hướng đến trang "/next-page" (có thể thay bằng trang khác của bạn)
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
              <h3 style={{ display: 'flex', justifyContent: 'center' }} className="text-center mb-4">
                Bạn quan tâm đến những nội dung nào?
              </h3>
              <Box alignItems="center" justifyContent="center" mb={2} display="flex" flexWrap="wrap">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`btn btn-outline-secondary m-2 bigger-btn ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {category.name} {/* Hiển thị tên danh mục */}
                  </button>
                ))}
              </Box>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleContinue}
                  disabled={selectedCategories.length === 0} // Vô hiệu hóa nếu không có danh mục nào được chọn
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
        `}
      </style>
    </PageContainer>
  );
};

export default Inter;
