import React, { useState } from "react";
import PageContainer from "src/components/container/PageContainer";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import emailjs from "emailjs-com";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const sendEmail = (data) => {
    emailjs
      .send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        {
          to_name: `${data.name} (${data.email})`, // Nối tên và email
          to_email: "phideptroai337@gmail.com",
          message: data.message,
        },
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        (result) => {
          setSnackbarMessage("Tin nhắn đã được gửi thành công!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          console.log(result.text);
        },
        (error) => {
          setSnackbarMessage("Đã xảy ra lỗi, vui lòng thử lại.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.log(error.text);
        }
      );
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmail(formData);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  const PartnerSection = () => {
    return (
      <PageContainer
        title="Share Code | Diễn đàn chia sẻ lập trình code"
        description="Đây là trang chủ"
      >
        <Box sx={{ mt: 6, padding: "40px", backgroundColor: "#f4f4f4" }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            mb={4}
            color="primary"
          >
            Các đối tác đồng hành cùng chúng tôi với các chương trình mentoring
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <img
                    src="https://mentori.vn/assets/images/page/home/p1.png?v=1"
                    alt="FIIS"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <Typography variant="body1" mt={2}>
                    Chương trình fMentoring - kết hợp với Trung tâm Sáng tạo và
                    Ươm tạo FIIS - Đại học Ngoại thương
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <img
                    src="https://mentori.vn/assets/images/page/home/p2.png?v=1"
                    alt="DynaGen"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <Typography variant="body1" mt={2}>
                    Vinh dự nhận giải thưởng của quốc tế về wedsite diễn đàn đạt
                    chuẩn thế giới
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <img
                    src="https://mentori.vn/assets/images/page/home/p3.png?v=1"
                    alt="VNU-IS"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <Typography variant="body1" mt={2}>
                    Kí hết hợp tác với công ty GOLDEN BEE INFORMATION
                    TECHONOLOGY SOLUTION LIMITED LIABILITY COMPANY tại Việt Nam
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            mt={6}
            mb={4}
            color="primary"
          >
            Các doanh nghiệp đã đồng hành cùng chúng tôi
          </Typography>
          <Typography variant="body2" align="center" mb={4}>
            200+ doanh nghiệp, tổ chức phi chính phủ và các CLB sinh viên
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {[
              "https://news-cdn.softpedia.com/images/news2/Microsoft-Redesigns-Its-Logo-for-the-First-Time-in-25-Years-Here-It-Is-3.png",
              "https://static.topcv.vn/company_logos/HtcNQ0zLJLZtAGN1W5rSWdnDX4utXrCs_1656651675____09bfda20e5a2949ab5e920f6dc13cec8.png",
              "https://cdn-new.topcv.vn/unsafe/140x/filters:format(webp)/https://static.topcv.vn/company_logos/8eaa93092eb52bcf661db0462450fc96-649513290a424.jpg",
              "https://logos-download.com/wp-content/uploads/2022/01/Viettel_Logo_white.png",
            ].map((logo, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <img
                  src={logo}
                  alt={`Logo ${index + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "80px",
                    objectFit: "contain",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </PageContainer>
    );
  };

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
        HÃY ĐỂ <span style={{ color: "#5d87ff" }}>SHARECODE</span> HỖ TRỢ CHO
        BẠN
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#5d87ff",
              color: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Box textAlign="center" mb={2}>
                <PhoneIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" align="center" fontWeight="bold">
                LIÊN HỆ TRỰC TIẾP VỚI CHÚNG TÔI
              </Typography>
              <Divider sx={{ my: 2, borderColor: "#fff" }} />
              <Typography variant="body1" align="center">
                Trụ sở cần Thơ
              </Typography>
              <Typography
                variant="h5"
                align="center"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                070.2912.140
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: "20px", borderRadius: "8px" }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Tên của bạn"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Lời nhắn"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ fontWeight: "bold" }}
                  >
                    GỬI NGAY
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
      <PartnerSection />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
