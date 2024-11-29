// DashboardCard.js
import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { styled } from '@mui/system';

// Styled Card with Background Image
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  backgroundImage: 'url("../../layouts/img/bg-1.jpg")', // Đường dẫn tuyệt đối từ public
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: '#fff', // Đảm bảo văn bản hiển thị rõ trên nền ảnh
  padding: 0,
  elevation: 9,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Lớp phủ màu đen mờ
    zIndex: 1,
  },
  '& .MuiCardContent-root': {
    position: 'relative',
    zIndex: 2,
  },
}));

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}) => {
  return (
    <StyledCard>
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: "30px" }}>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={'center'}
              mb={3}
            >
              <Box>
                {title && <Typography variant="h5">{title}</Typography>}

                {subtitle && (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {action}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </StyledCard>
  );
};

export default DashboardCard;