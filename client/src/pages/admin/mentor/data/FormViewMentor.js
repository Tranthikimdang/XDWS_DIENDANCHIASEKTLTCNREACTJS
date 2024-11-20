import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Snackbar,
  CircularProgress,
  Grid,
  Typography,
  Avatar,
  Alert,
  Box,
} from "@mui/material";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
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
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px',
          background: '#060c28',
        }}
      >
        {loading ? (
          <CircularProgress sx={{ margin: "auto", display: "block" }} />
        ) : mentor ? (
          <Grid container spacing={4}>
            {/* Avatar and basic information */}
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Avatar
                src={
                  mentorUser?.imageUrl ||
                  "https://via.placeholder.com/150" // Default image if not available
                }
                alt="User Avatar"
                sx={{
                  width: "150px",
                  height: "150px",
                  margin: "auto",
                  border: "3px solid #FFF",
                }}
              />
              <Typography variant="h5" sx={{ mt: 2, color: "#fff" }}>
                {mentor?.bio || "Mentor không có bio"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: "#fff" }}>
                {`Tác giả: ${mentorUser?.name || "Không xác định"}`}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "#fff" }}>
                {`Email: ${mentorUser?.email || "Không có email"}`}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "#fff" }}>
                {`Số điện thoại: ${mentorUser?.phone || "Không có số điện thoại"}`}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "#fff" }}>
                {`Địa chỉ: ${mentorUser?.location || "Không có địa chỉ"}`}
              </Typography>
            </Grid>

            {/* Mentor detailed information */}
            <Grid item xs={12} md={8}>
              <Box mb={2}>
                <Typography variant="h4" sx={{ color: "#fff" }} gutterBottom>
                  Thông tin Mentor
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <strong>Kỹ năng:</strong> {mentor?.skills || "Không có kỹ năng"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <strong>Kinh nghiệm:</strong>{" "}
                  {mentor?.experience_years
                    ? `${mentor.experience_years} năm`
                    : "Không có kinh nghiệm"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <strong>Đánh giá:</strong> {mentor?.rating || 0}/5
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <strong>Số lượt nhận xét:</strong>{" "}
                  {mentor?.reviews_count || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: "#fff" }}>
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
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h6" align="center" sx={{ color: "#fff" }}>
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
