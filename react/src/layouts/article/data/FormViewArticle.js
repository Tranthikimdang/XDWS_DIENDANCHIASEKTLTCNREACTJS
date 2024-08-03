import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apis from "../../../apis/articleApi";
import Card from "@mui/material/Card";
import { Link } from 'react-router-dom';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import authorsArticleData from "./authorsArticleData";
import ConfirmDialog from '../data/FormDeleteArticle';
import { Alert, Snackbar } from "@mui/material";
const { columns } = authorsArticleData;
const FormViewArticle = () => {
  const { id } = useParams(); // Nhận ID từ URL
  const [article, setArticle] = useState(null); // Khai báo state article
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Invalid article ID.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await apis.getArticleById(id);
        console.log("Fetched article data:", data); // Kiểm tra dữ liệu API
        setArticle(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Failed to fetch article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox
              sx={{
                "& th": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                },
              }}
            >
              <Table
                columns={columns}
                rows={rows.map((row, index) => ({
                  // Hiển thị thông tin của mỗi bài viết trong bảng
                  id: index + 1,  // Thay thế ID bằng index + 1
                  fuction: (
                    <div className="container">
                      <div className="row">
                        <div className="col">
                          <img
                            src={row.image}  // Sử dụng hàm getImageUrl để lấy đường dẫn chính xác
                            alt="Image"
                            style={{ width: '160px', height: '93.99px' }}
                          />

                        </div>
                        <div className="col">
                          <VuiBox display="flex" flexDirection="column">
                            <VuiTypography variant="caption" fontWeight="medium" color="white">
                              <strong>{row.title.toUpperCase()}</strong>
                            </VuiTypography>
                            <VuiTypography variant="caption" color="text">
                              {row.category}
                            </VuiTypography>
                            <div className="style-scope ytd-video-meta-block" style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="inline-metadata-item">{row.view}</span>
                              <span className="inline-metadata-item style-scope ytd-video-meta-block">
                                {new Date(row.created_date).toLocaleDateString()}
                              </span>
                            </div>
                          </VuiBox>
                        </div>
                      </div>
                    </div>
                  ),
                  Author: (
                    <VuiBox display="flex" flexDirection="column">
                      <VuiTypography variant="button" color="white" fontWeight="medium">
                        {row.name}
                      </VuiTypography>
                      <VuiTypography variant="caption" color="text">
                        {row.email}
                      </VuiTypography>
                    </VuiBox>
                  ),
                  content: 
                    removeSpecificHtmlTags(row.content, 'p')
                    ,
                  action: (
                    <div className="action-buttons">
                      <Link to={{ pathname: "/formeditarticle", state: { data: row } }}>
                        <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(row.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                          </svg>
                        </button>
                      </Link>
                      <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(row.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </button>
                    </div>
                  ),
                }))}
              />

            
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>
      <Footer />
      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemId={deleteId}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default FormViewArticle;
