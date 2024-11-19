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

// sql
//sql
import api from '../../../../apis/mentorApi';
import apiUser from '../../../../apis/UserApI';

function FormViewMentor() {
  const { id } = useParams(); // Lấy ID của mentor từ URL
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null); // Trạng thái cho mentor
  const [loading, setLoading] = useState(true); // Trạng thái cho spinner
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Trạng thái cho Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Thông điệp của Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Độ nghiêm trọng của Snackbar
  const [users, setUsers] = useState([]);

  //lấy chi tiết mentors
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await api.detailMentor();
        // Gán mảng mentors từ response.data.mentors
        setMentor(Array.isArray(response?.data?.mentors) ? response.data.mentors : []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setMentor([]); // Set rows to empty array in case of error
      }
    };
    fetchMentor();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const user = await apiUser.getUsersList();
        console.log('Users data:', user.data); // Kiểm tra dữ liệu
        // Gán mảng users từ response.data.users
        setUsers(Array.isArray(user.data.users) ? user.data.users : []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Đóng Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };


  const smallFontStyle = {
    fontSize: '0.9rem',
    color: '#ffffff'
  };

  //date
  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt.seconds * 1000); // Chuyển đổi giây thành milliseconds
      const now = new Date();
      const diff = now - date; // Tính toán khoảng cách thời gian

      const seconds = Math.floor(diff / 1000); // chuyển đổi ms thành giây
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        updatedAtString = `${days} ngày trước`;
      } else if (hours > 0) {
        updatedAtString = `${hours} giờ trước`;
      } else if (minutes > 0) {
        updatedAtString = `${minutes} phút trước`;
      } else {
        updatedAtString = `${seconds} giây trước`;
      }
    } else {
      updatedAtString = 'Không rõ thời gian';
    }

    return updatedAtString;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <VuiBox>
          <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            <VuiTypography>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="300px"
                >
                  <CircularProgress color="primary" size={60} />
                </Box>
              ) : mentor ? (
                <Paper elevation={3} style={{
                  padding: "24px",
                  borderRadius: "12px",
                  background: "linear-gradient(to bottom right, #19215c, #080d2d)"
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {mentor.cv_url && (
                        <img
                          src={mentor.cv_url} // Assuming cv_url is the image URL
                          alt={mentor.bio} // Bio can be used as alternative text
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
                      <VuiTypography variant="h3" gutterBottom style={smallFontStyle}>
                        <strong>Bio: </strong>{mentor.bio}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" style={smallFontStyle}>
                        <strong>Skills: </strong>  {mentor.skills}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" style={smallFontStyle}>
                        <strong>Experience: </strong> {mentor.experience_years} years
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" style={smallFontStyle}>
                        <strong>Author: </strong>  {users?.filter(u => mentor?.user_id === u.id)?.[0]?.name}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" style={smallFontStyle}>
                        <strong>Updated at: </strong> {formatUpdatedAt(mentor.updated_at)}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "30px" }}>
                      <VuiTypography variant="h1" paragraph style={smallFontStyle}>
                        <strong>CV URL: </strong>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
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
                  Loading mentor details...
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ transform: 'translateY(100px)' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );

}

export default FormViewMentor;