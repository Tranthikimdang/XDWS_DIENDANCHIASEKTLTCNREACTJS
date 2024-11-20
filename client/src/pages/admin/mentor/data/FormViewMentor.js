import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import api from "../../../../apis/mentorApi";
import apiUser from "../../../../apis/UserApI";

function FormViewMentor() {
  const { id } = useParams(); // Lấy ID của mentor từ URL
  const navigate = useNavigate();

  // Trạng thái
  const [mentor, setMentor] = useState(null); // Chi tiết mentor
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Hiển thị thông báo
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Nội dung thông báo
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Mức độ thông báo
  const [users, setUsers] = useState([]); // Danh sách users

  // Lấy chi tiết mentor
  useEffect(() => {
    const fetchMentor = async () => {
      console.log("Mentor ID:", id); // Kiểm tra giá trị id
      try {
        const response = await api.detailMentor(id); // Gọi API với ID
        setMentor(response?.data || null); // Gán dữ liệu mentor
      } catch (error) {
        console.error("Error fetching mentor details:", error);
        setSnackbarMessage("Không thể tải thông tin mentor.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false); // Dừng trạng thái loading
      }
    };

    if (id) {
      fetchMentor();
    } else {
      setSnackbarMessage("Không tìm thấy ID mentor.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setLoading(false);
    }
  }, [id]);

  // Lấy danh sách users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await apiUser.getUsersList();
        setUsers(Array.isArray(user?.data?.users) ? user.data.users : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Đóng Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Định dạng thời gian cập nhật
  const formatUpdatedAt = (updatedAt) => {
    if (!updatedAt) return "Không rõ thời gian";

    const date = new Date(updatedAt.seconds * 1000);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <VuiBox>
          <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            <VuiTypography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress color="primary" size={60} />
                </Box>
              ) : mentor ? (
                <Paper
                  elevation={3}
                  style={{
                    padding: "24px",
                    borderRadius: "12px",
                    background: "linear-gradient(to bottom right, #19215c, #080d2d)",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {mentor.cv_url && (
                        <img
                          src={mentor.cv_url}
                          alt={mentor.bio}
                          style={{
                            width: "100%",
                            maxHeight: "300px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <VuiTypography variant="h3" gutterBottom>
                        <strong>Bio:</strong> {mentor.bio}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1">
                        <strong>Skills:</strong> {mentor.skills}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1">
                        <strong>Experience:</strong> {mentor.experience_years} years
                      </VuiTypography>
                      <VuiTypography variant="subtitle1">
                        <strong>Author:</strong>{" "}
                        {users.find((user) => user.id === mentor.user_id)?.name || "Không rõ"}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1">
                        <strong>Updated at:</strong> {formatUpdatedAt(mentor.updated_at)}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "30px" }}>
                      <VuiTypography variant="h1" paragraph>
                        <strong>CV URL:</strong>
                        <div>{mentor.cv_url}</div>
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate("/admin/mentor")}
                          startIcon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-arrow-return-left"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"
                              />
                            </svg>
                          }
                        >
                          Back
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ) : (
                <VuiTypography variant="h5" color="text.secondary" align="center">
                  Không tìm thấy chi tiết mentor.
                </VuiTypography>
              )}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ transform: "translateY(100px)" }}
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
