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

// Import Firebase
import { db } from '../../../../config/firebaseconfig';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

function FormViewArticle() {
  const { id } = useParams(); // Lấy ID của bài viết từ URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null); // Trạng thái cho bài viết
  const [loading, setLoading] = useState(true); // Trạng thái cho spinner
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Trạng thái cho Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Thông điệp của Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Độ nghiêm trọng của Snackbar
  const [users, setUsers] = useState([]); // Trạng thái cho danh sách người dùng
  const [cates, setCates] = useState([]);
  // Lấy danh sách người dùng từ Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollectionRef = collection(db, "users");
        const userSnapshot = await getDocs(userCollectionRef);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
        console.log("Lấy người dùng:", userList);
      } catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Lấy chi tiết bài viết từ Firestore
  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const articleDocRef = doc(db, "articles", id);
        const articleSnapshot = await getDoc(articleDocRef);
        if (articleSnapshot.exists()) {
          setArticle(articleSnapshot.data());
        } else {
          setSnackbarMessage("Không tìm thấy bài viết.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài viết:", error);
        setSnackbarMessage("Không thể lấy chi tiết bài viết.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetails();
    }
  }, [id]);
  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCates(categoriesData);

        // Create a mapping of category ID to name
        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCates(categoriesMap);

        console.log("Fetched categories:", categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
              ) : article ? (
                <Paper elevation={3} style={{
                  padding: "24px",
                  borderRadius: "12px",
                  background: "linear-gradient(to bottom right, #19215c, #080d2d)"
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
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
                        <strong>Tiêu đề: </strong>{article.title}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" gutterBottom style={smallFontStyle}>
                        <strong>Thể loại bài viết: </strong>  {cates[article.categories_id] || 'không có danh mục'}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" style={smallFontStyle}>
                        <strong>Tác giả: </strong>  {users?.filter(u => article?.user_id === u.id)?.[0]?.name}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" style={smallFontStyle}>
                        <strong>Thời gian: </strong>   {formatUpdatedAt(article.updated_at)}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "30px" }}>
                      <VuiTypography variant="h1" paragraph style={smallFontStyle}>
                        <strong>Nội dung: </strong>
                        <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate("/admin/article")}
                          startIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                            </svg>
                          }
                        >
                          Quay Lại
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ) : (
                <VuiTypography variant="h5" color="text.secondary" align="center">
                 Đang tải chi tiết bài viết...

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