import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { Alert, Snackbar } from "@mui/material";
import { Link } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import apis from "../../../apis/articleApi";


const FormViewArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchArticle = async () => {
      // ID bài viết từ URL sẽ là `index + 1`
      const articleId = id ? parseInt(id) : null;
      
      if (!articleId || isNaN(articleId)) {
        setError("ID bài viết không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        // Giả sử API hỗ trợ tìm kiếm bài viết dựa trên ID
        const response = await apis.getArticleDetails(articleId);
        console.log("Dữ liệu bài viết đã tải:", response);
        setArticle(response); // Sử dụng dữ liệu trả về từ API
        setError(null);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error.response ? error.response.data : error.message);
        setError("Không thể tải bài viết.");
        setSnackbarMessage("Không thể tải bài viết.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox p={3}>
              <VuiTypography variant="h4" gutterBottom>
                {article.title}
              </VuiTypography>
              {article.image && <img src={article.image} alt="Article" style={{ width: '100%', height: 'auto' }} />}
              <VuiTypography variant="body1" gutterBottom>
                {article.content}
              </VuiTypography>
              <VuiBox display="flex" justifyContent="space-between" mt={2}>
                <VuiTypography variant="caption" color="textSecondary">
                  {`Danh mục: ${article.category}`}
                </VuiTypography>
                <VuiTypography variant="caption" color="textSecondary">
                  {`Lượt xem: ${article.view}`}
                </VuiTypography>
                <VuiTypography variant="caption" color="textSecondary">
                  {`Ngày đăng: ${new Date(article.created_date).toLocaleDateString()}`}
                </VuiTypography>
              </VuiBox>
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default FormViewArticle;
