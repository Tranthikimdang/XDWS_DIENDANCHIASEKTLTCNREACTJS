// Footer.js
import React from "react";
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";

function Footer() {
  return (
    <VuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      component="footer"
      py={2}
      sx={{
        mt: "auto", // Đảm bảo footer tự đẩy xuống khi nội dung ít
        
        width: "100%", // Đảm bảo footer bao phủ toàn bộ chiều rộng
      }}
    >
      <VuiTypography
        variant="button"
        sx={{ fontWeight: "400 !important", fontSize: "14px" }}
      >
        © 2024, Website diễn đàn chia sẻ kiến thức lập trình - Code by{" "}
        <VuiTypography
          component="a"
          variant="button"
          href="/"
          sx={{
            fontWeight: "500 !important",
            textDecoration: "none",
          }}
        >
          SHARE CODE
        </VuiTypography>
      </VuiTypography>
    </VuiBox>
  );
}

export default Footer;
