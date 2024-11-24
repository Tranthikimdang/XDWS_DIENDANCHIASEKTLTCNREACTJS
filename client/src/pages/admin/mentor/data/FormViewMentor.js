import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {
  Snackbar,
  CircularProgress,
  Typography,
  Alert,
  Box,
} from "@mui/material";
// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";

import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import DefaultProjectCard from "src/examples/Cards/ProjectCards/DefaultProjectCard";
import Skillcertificate from "src/examples/Mentorinfomanagement/Skillcertificate";
import Contactinformation from "src/examples/Mentorinfomanagement/Contactinformation";
import Personalinformation from "src/examples/Mentorinfomanagement/Personalinformation";
import Activate from "src/examples/Mentorinfomanagement/Activate";

//Icon
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
//Sql
import api from "../../../../apis/mentorApi";
import apiUser from "../../../../apis/UserApI";
//
import team1 from "src/assets/admin/images/avatar1.png";
import team2 from "src/assets/admin/images/avatar2.png";
import team3 from "src/assets/admin/images/avatar3.png";
import team4 from "src/assets/admin/images/avatar4.png";
// Images
import imageMentor from "src/assets/images/profile/user-1.jpg";
import profile1 from "src/assets/admin/images/profile-1.png";
import profile2 from "src/assets/admin/images/profile-2.png";
import profile3 from "src/assets/admin/images/profile-3.png";

function FormViewMentor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [users, setUsers] = useState([]);

  // Fetching mentor details by ID
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await api.detailMentor(id);
        if (response?.data) {
          setMentor(response.data);
        } else {
          setSnackbarMessage("Không tìm thấy thông tin mentor.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Không thể tải thông tin mentor.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    console.log(mentor?.skills);

    fetchMentor();
  }, [id]);

  // Fetching users list to get user details for mentor
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiUser.getUsersList();
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle closing the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Get user data for the mentor's user_id
  const mentorUser = users.find((user) => user.id === mentor?.user_id);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3 }}>
        {loading ? (
          <CircularProgress sx={{ margin: "auto", display: "block" }} />
        ) : mentor ? (
          <><VuiBox mt={5} mb={3}>
            <Grid
              container
              spacing={3}
              sx={({ breakpoints }) => ({
                [breakpoints.only("xl")]: {
                  gridTemplateColumns: "repeat(2, 1fr)",
                },
              })}
            >
              <Grid
                item
                xs={12}
                xl={4}
                xxl={3}
                sx={({ breakpoints }) => ({
                  minHeight: "400px",
                  [breakpoints.only("xl")]: {
                    gridArea: "1 / 1 / 2 / 2",
                  },
                })}
              >
                <Personalinformation
                  titlePersonalinformation="Thông tin cá nhân"
                  avatar={
                    <VuiBox
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ margin: "auto" }}
                    >
                      <img
                        src={mentorUser?.imageUrl ? mentorUser.imageUrl : imageMentor}
                        alt="hình ảnh người cố vấn"
                        style={{
                          width: "150px",
                          height: "150px",
                          margin: "auto",
                          borderRadius: "50%",
                          border: "3px solid #0075ff",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = imageMentor; // Hiển thị ảnh mặc định nếu ảnh không tải được
                        }}
                      />

                    </VuiBox>
                  }
                  description={` ${mentor?.bio || "Mentor không có mô tả"}`}
                  name={`${mentorUser?.name || "Không rõ tên"}`}
                  birthday={`${mentorUser?.birthday || "Không rõ ngày sinh"}`}
                  location={`${mentorUser?.location || "Không rõ địa chỉ"}`}
                />
              </Grid>
              <Grid
                item
                xs={12}
                xl={5}
                xxl={6}
                sx={({ breakpoints }) => ({
                  [breakpoints.only("xl")]: {
                    gridArea: "2 / 1 / 3 / 3",
                  },
                })}
              >
                <Contactinformation
                  titleContact="Thông tin liên hệ"
                  email={`${mentorUser?.email || "Không rõ email"}`}
                  phone={`${mentorUser?.phone || "Không rõ tên"}`}
                  social={[
                    {
                      link: "https://www.facebook.com/CreativeTim/",
                      icon: <FacebookIcon />,
                      color: "facebook",
                    },
                    {
                      link: "https://twitter.com/creativetim",
                      icon: <TwitterIcon />,
                      color: "twitter",
                    },
                    {
                      link: "https://www.instagram.com/creativetimofficial/",
                      icon: <InstagramIcon />,
                      color: "instagram",
                    },
                  ]}
                />
              </Grid>
              <Grid
                item
                xs={12}
                xl={3}
                xxl={3}
                sx={({ breakpoints }) => ({
                  [breakpoints.only("xl")]: {
                    gridArea: "1 / 2 / 2 / 3",
                  },
                })}
              >
                <Skillcertificate
                  titleskill="Chứng chỉ và Kỹ năng"
                  skills={` ${mentor?.skills || "Người dùng không nhập kỹ năng"}`}
                  experience_years={` ${mentor?.experience_years || "Người dùng không nhập kinh nghiệm"}`}
                  cv_url={` ${mentor?.cv_url || "Người dùng không có CV"}`}
                  certificate_url={` ${mentor?.certificate_url || "Người dùng không có chứng chi"}`}
                />
              </Grid>
            </Grid>
          </VuiBox><Grid container spacing={3} mb="30px">
              <Grid item xs={12} xl={3} height="100%">
                <Activate
                    titleActivate="Hoạt động"
                    
                   />
              </Grid>
              <Grid item xs={12} xl={9} height="100%">
                <Card>
                  <VuiBox display="flex" flexDirection="column" height="100%">
                    <VuiBox display="flex" flexDirection="column" mb="24px">
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                        Tổng quan
                      </VuiTypography>
                      <VuiTypography color="text" variant="button" fontWeight="regular">
                        Hoạt động của người hướng dẫn
                      </VuiTypography>
                    </VuiBox>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6} xl={4}>
                        <DefaultProjectCard
                          image={profile1}
                          label="project #2"
                          title="Khóa học"
                          description="Hiện tại có [số lượng khóa học] khóa học trong hệ thống, với [số lượng học viên] học viên đã tham gia."
                          action={{
                            type: "internal",
                            route: "/pages/profile/profile-overview",
                            color: "white",
                            label: "XEM TẤT CẢ",
                          }}
                          authors={[
                            { image: team1, name: "Elena Morison" },
                            { image: team2, name: "Ryan Milly" },
                            { image: team3, name: "Nick Daniel" },
                            { image: team4, name: "Peterson" },
                          ]} />
                      </Grid>
                      <Grid item xs={12} md={6} xl={4}>
                        <DefaultProjectCard
                          image={profile2}
                          label="project #1"
                          title="Bài viết"
                          description="Hiện tại có [số lượng bài viết] bài viết được đăng, với [số lượt xem] lượt xem tổng cộng."
                          action={{
                            type: "internal",
                            route: "/pages/profile/profile-overview",
                            color: "white",
                            label: "XEM TẤT CẢ",
                          }}
                          authors={[
                            { image: team3, name: "Nick Daniel" },
                            { image: team4, name: "Peterson" },
                            { image: team1, name: "Elena Morison" },
                            { image: team2, name: "Ryan Milly" },
                          ]} />
                      </Grid>
                      <Grid item xs={12} md={6} xl={4}>
                        <DefaultProjectCard
                          image={profile3}
                          label="project #3"
                          title="Học viên"
                          description="Hiện tại có [số lượng học viên] học viên đang tham gia, với [số khóa học đã đăng ký] khóa học được đăng ký."                          
                          action={{
                            type: "internal",
                            route: "/pages/profile/profile-overview",
                            color: "white",
                            label: "XEM TẤT CẢ",
                          }}
                          authors={[
                            { image: team4, name: "Peterson" },
                            { image: team3, name: "Nick Daniel" },
                            { image: team2, name: "Ryan Milly" },
                            { image: team1, name: "Elena Morison" },
                          ]} />
                      </Grid>
                    </Grid>
                  </VuiBox>
                </Card>
              </Grid>
            </Grid></>

        ) : (
          <Typography variant="h6" align="center">
            Không tìm thấy chi tiết mentor.
          </Typography>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout >
  );
}

export default FormViewMentor;
