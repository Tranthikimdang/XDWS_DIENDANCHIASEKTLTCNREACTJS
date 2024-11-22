


import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Xử lý gửi form tại đây (VD: gửi đến server hoặc Firebase)
  };

  const PartnerSection = () => {
    return (
      <Box sx={{ mt: 6, padding: "40px", backgroundColor: "#f4f4f4" }}>
        {/* Phần 1: Các đối tác đồng hành */}
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          mb={4}
          color="green"
        >
          Các đối tác đồng hành cùng chúng tôi với các chương trình mentoring
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <img
                  src="https://mentori.vn/assets/images/page/home/p1.png?v=1" // Đường dẫn đến hình ảnh
                  alt="FIIS"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <Typography variant="body1" mt={2}>
                  Chương trình fMentoring - kết hợp với Trung tâm Sáng tạo và Ươm
                  tạo FIIS - Đại học Ngoại thương
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <img
                  src="https://mentori.vn/assets/images/page/home/p2.png?v=1" // Đường dẫn đến hình ảnh
                  alt="DynaGen"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <Typography variant="body1" mt={2}>
                  Chương trình "Cố vấn nghề nghiệp" cho học viên của DynaGen -
                  Live United khóa 3.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <img
                  src="https://mentori.vn/assets/images/page/home/p3.png?v=1" // Đường dẫn đến hình ảnh
                  alt="VNU-IS"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <Typography variant="body1" mt={2}>
                  Chương trình VNU-IS mentoring cùng trường Quốc tế - Đại học
                  Quốc gia Hà Nội (VNU-IS).
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Phần 2: Logo các doanh nghiệp */}
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          mt={6}
          mb={4}
          color="green"
        >
          Các doanh nghiệp đã đồng hành cùng chúng tôi
        </Typography>
        <Typography variant="body2" align="center" mb={4}>
          200+ doanh nghiệp, tổ chức phi chính phủ và các CLB sinh viên
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {[
            "https://news-cdn.softpedia.com/images/news2/Microsoft-Redesigns-Its-Logo-for-the-First-Time-in-25-Years-Here-It-Is-3.png", // Thay thế đường dẫn ảnh logo
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
        HÃY ĐỂ <span style={{ color: "#e53935" }}>SEOVIET</span> TƯ VẤN CHO BẠN
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* Phần bên trái */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#e53935",
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
                LIÊN HỆ TRỰC TIẾP VỚI SEOVIET
              </Typography>
              <Divider sx={{ my: 2, borderColor: "#fff" }} />
              <Typography variant="body1" align="center">
                Trụ sở Hà Nội
              </Typography>
              <Typography
                variant="h5"
                align="center"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                034.304.5555
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Phần bên phải */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: "20px", borderRadius: "8px" }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Họ và tên"
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
                    label="Số điện thoại"
                    variant="outlined"
                    fullWidth
                    name="phone"
                    value={formData.phone}
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
                    color="error"
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
      {/* Phần giao diện đối tác */}
      <PartnerSection />
    </Box>
  );
};

export default ContactPage;

