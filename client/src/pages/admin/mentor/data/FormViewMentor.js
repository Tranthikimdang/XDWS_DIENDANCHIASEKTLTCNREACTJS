import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Snackbar,
  CircularProgress,
  Grid,
  Typography,
  Avatar,
  Alert,
  Card,
  Box,
} from "@mui/material";
import ProfileInfoCard from "src/examples/Cards/InfoCards/ProfileInfoCard";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
//Icon
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
//Sql
import api from "../../../../apis/mentorApi";
import apiUser from "../../../../apis/UserApI";

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
          <Grid container spacing={3}>
            {/* Avatar and basic information */}
            <Grid
              item
              xs={12}
              xl={4}
              xxl={3}
              sx={({ breakpoints }) => ({
                [breakpoints.only("xl")]: {
                  gridArea: "1 / 2 / 2 / 3",
                },
              })}
            >
              <Card sx={{ textAlign: "center", p: 3 }}>
                <Avatar
                  src={
                    mentorUser?.imageUrl ||
                    "https://via.placeholder.com/150" // Default image
                  }
                  alt="User Avatar"
                  sx={{
                    width: "150px",
                    height: "150px",
                    margin: "auto",
                    border: "3px solid #FFF",
                  }}
                />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  {`Mô tả: ${mentor?.bio || "Mentor không có bio"}`}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {`Tác giả: ${mentorUser?.name || "Không xác định"}`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {`Email: ${mentorUser?.email || "Không có email"}`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {`Số điện thoại: ${mentorUser?.phone || "Không có số điện thoại"}`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {`Địa chỉ: ${mentorUser?.location || "Không có địa chỉ"}`}
                </Typography>
              </Card>
            </Grid>

            {/* Mentor detailed information */}
            {/* <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box mb={2}>
                  <Typography variant="h4" gutterBottom>
                    Thông tin Mentor
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body1">
                    <strong>Kỹ năng:</strong> {mentor?.skills || "Không có kỹ năng"}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body1">
                    <strong>Kinh nghiệm:</strong>{" "}
                    {mentor?.experience_years
                      ? `${mentor.experience_years} năm`
                      : "Không có kinh nghiệm"}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body1">
                    <strong>Đánh giá:</strong> {mentor?.rating || 0}/5
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body1">
                    <strong>Số lượt nhận xét:</strong>{" "}
                    {mentor?.reviews_count || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>Chứng chỉ:</strong>{" "}
                    {mentor?.certificate_url ? (
                      <a
                        href={mentor?.certificate_url}
                        style={{
                          color: "#4CAF50",
                          textDecoration: "underline",
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem chứng chỉ
                      </a>
                    ) : (
                      "Không có chứng chỉ"
                    )}
                  </Typography>
                </Box>
              </Card>
            </Grid> */}
            <Grid
              item
              xs={12}
              xl={4}
              xxl={3}
              sx={({ breakpoints }) => ({
                [breakpoints.only("xl")]: {
                  gridArea: "1 / 2 / 2 / 3",
                },
              })}
            >
              <ProfileInfoCard
                title="Profile Information"
                description={`Mô tả: ${mentor?.bio || "Mentor không có bio"}`}
                info={{
                  fullName: mentorUser?.name || "Không xác định",
                  mobile: mentorUser?.phone || "Không có số điện thoại",
                  email: mentorUser?.email || "Không có email",
                  location: mentorUser?.location || "Không có địa chỉ",
                }}
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
          </Grid>
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
    </DashboardLayout>
  );
}

export default FormViewMentor;
