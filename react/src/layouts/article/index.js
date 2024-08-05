import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { Link } from 'react-router-dom';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import authorsArticleData from "layouts/article/data/authorsArticleData";
import ConfirmDialog from './data/FormDeleteArticle';
import apis from "../../apis/articleApi";
import { Alert, Snackbar } from "@mui/material";

// Chuyển đổi đường dẫn hình ảnh sang định dạng URL hợp lệ
const sanitizeImagePath = (path) => path.replace(/\\/g, '/');
const getImageUrl = (path) => `/assets/uploads/${sanitizeImagePath(path)}`;

function Article() {
  const { columns } = authorsArticleData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Lấy danh sách bài viết từ API
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apis.getList();
        if (response.status === 200) {
          console.log(response.data);
          const article = response.data || [];
          setRows(article);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, []);

  const handleEdit = (id) => {
    console.log("Edit button clicked", id);
  };
  const handleView = (id) => {
    console.log("Edit button clicked", id);
  };
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };



  const confirmDelete = async (deleteId) => {
    try {
      await apis.deleteArticle(deleteId);
      setRows(rows.filter((article) => article.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("Article deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting Article:", error);
      setSnackbarMessage("Failed to delete Article.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };



  const removeSpecificHtmlTags = (htmlString, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, 'gi');
    return htmlString?.replace(regex, '');
  };

  const handleAddArticleSuccess = () => {
    setSnackbarMessage("Article added successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Article table
              </VuiTypography>
              <Link to="/formandarticle">
                <button className='text-light btn btn-outline-info' type="button" onClick={handleAddArticleSuccess}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z" />
                  </svg>
                  Add
                </button>
              </Link>
            </VuiBox>

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
                  id: index+1,  // Thay thế ID bằng index + 1
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
                  content: removeSpecificHtmlTags(row.content, 'p')?.length > 20
                    ? `${removeSpecificHtmlTags(row.content, 'p')?.substring(0, 20)}...`
                    : removeSpecificHtmlTags(row.content, 'p'),
                  action: (
                    <div className="action-buttons">
                      <Link to={`/formviewarticle/${row.id}`}>
                        <button className="text-light btn btn-outline-info me-2" type="button" onClick={() => handleView(row.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </button>
                      </Link>
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

export default Article;