

import React, { useState, useEffect } from "react";
import { Card, Icon } from "@mui/material";
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";

import gif from "src/assets/admin/images/cardimgfree.png";
//icon
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const WelcomeMark = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Nếu có thông tin người dùng, cập nhật tên người dùng
    if (user) {
      setUserName(user.name);  // Giả sử tên người dùng là 'name' trong đối tượng 'user'
    }
  }, []);

  return (
    <Card
      sx={() => ({
        height: "340px",
        py: "32px",
        position: "relative", // Để định vị pseudo-element chính xác
        overflow: "hidden",   // Đảm bảo pseudo-element không tràn ra ngoài
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${gif})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          opacity: 0.5, // Độ mờ
          zIndex: -1,  // Đặt lớp phủ phía sau nội dung thẻ
        },
      })}
    >
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <VuiBox>
          <VuiTypography color="text" variant="button" fontWeight="regular" mb="12px">
            Chào mừng quản trị viên,
          </VuiTypography>
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="18px">
            {userName ? userName : "Quản trị viên"}
          </VuiTypography>
          <VuiTypography color="text" variant="h6" fontWeight="regular" mb="auto">
            Sẵn sàng quản lý và cải thiện cộng đồng lập trình.<br /> Đừng quên kiểm tra hoạt động người dùng!
          </VuiTypography>
        </VuiBox>
        <VuiTypography
          component="a"
          href="#"
          variant="button"
          color="white"
          fontWeight="regular"
          sx={{
            mr: "5px",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",

            "& .material-icons-round": {
              fontSize: "1.125rem",
              transform: `translate(2px, -0.5px)`,
              transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
            },

            "&:hover .material-icons-round, &:focus  .material-icons-round": {
              transform: `translate(6px, -0.5px)`,
            },
          }}
        >
          Xem thống kê quản lý
            <ArrowForwardIcon sx={{ fontWeight: "bold", ml: "5px" }} />
        </VuiTypography>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;

