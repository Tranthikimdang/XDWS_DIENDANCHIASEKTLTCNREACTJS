import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
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
import apis from "../../../apis/articleApi";
import userApi from "../../../apis/userApi";
function FormViewArticle() {
  const { id } = useParams(); // Get article index ID from URL
  const history = useHistory(); // Initialize history object for navigation
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [idMapping, setIdMapping] = useState({}); // State to hold the index-to-real-ID mapping
  const [users, setUsers] = useState([]);
  // Chuyển đổi đường dẫn hình ảnh sang định dạng URL hợp lệ
  const sanitizeImagePath = (path) => path.replace(/\\/g, "/");
  const getImageUrl = (path) => `${process.env.REACT_APP_BASE_URL}/${sanitizeImagePath(path)}`;

  // Fetch all articles and set up ID mapping
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apis.getList();
        if (response.status === 200) {
          const articles = response.data || [];
          const mapping = {};
          articles.forEach((article, index) => {
            mapping[index + 1] = article.id; // Map index + 1 to the actual article ID
          });
          setIdMapping(mapping);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setSnackbarMessage("Failed to fetch articles.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getList();
        if (response.status === 200) {
          const user = response.data || [];
          setUsers(user);
          console.log("Fetched users:", user);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch specific article details using the real ID
  useEffect(() => {
    const fetchArticleDetails = async () => {
      const realId = idMapping[id]; // Get the real ID from the mapping
      if (!realId) {
        setSnackbarMessage("Article not found.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      try {
        const response = await apis.getArticleDetails(realId);
        if (response.status === 200) {
          setArticle(response.data);
        }
      } catch (error) {
        console.error("Error fetching article details:", error);
        setSnackbarMessage("Failed to fetch article details.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false); // Stop loading spinner after data fetch
      }
    };

    if (Object.keys(idMapping).length > 0) {
      fetchArticleDetails();
    }
  }, [id, idMapping]);

  const removeSpecificHtmlTags = (htmlString, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, "gi");
    return htmlString?.replace(regex, "");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleBackButtonClick = () => {
    history.goBack(); // Navigate back to the previous page
  };

  const smallFontStyle = {
    fontSize: '0.9rem',
    color: '#ffffff'
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card >
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
              ) : article ? (
                <Paper elevation={3} style={{
                  padding: "24px",
                  borderRadius: "12px",
                  background: "linear-gradient(to bottom right, #19215c, #080d2d)"
                }}>
                  <Grid container>
                    <Grid item xs={6}>
                      {article.image && (
                        <img
                          src={(article.image)}
                          alt="Article"
                          style={{
                            width: "400px",
                            maxHeight: "300px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <VuiTypography variant="h3" gutterBottom style={smallFontStyle}>
                        {article.title}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                        <strong>Article category: </strong> {article.categories_id}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" style={smallFontStyle}>
                        <strong>Author: </strong>  {users?.filter(u => article?.user_id == u.id)?.[0]?.name}
                      </VuiTypography>
                      {/* <VuiTypography variant="subtitle1" gutterBottom style={{ color: "#ffffff" }}>
                        <strong>Views: </strong> {article.view}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" gutterBottom style={{ color: "#ffffff" }}>
                        <strong>Date: </strong> {new Date(article.updated_at).toLocaleDateString()}
                      </VuiTypography> */}
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "30px" }}>
                      <VuiTypography variant="body1" paragraph style={smallFontStyle}>
                        <strong>Content: </strong>
                        {/* {removeSpecificHtmlTags(article.content, "p")} */}
                        <div dangerouslySetInnerHTML={{__html: article.content}}></div>
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleBackButtonClick}
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
                  Loading article details...
                </VuiTypography>
              )}



            </VuiTypography>

          </VuiBox>
        </VuiBox>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default FormViewArticle;
