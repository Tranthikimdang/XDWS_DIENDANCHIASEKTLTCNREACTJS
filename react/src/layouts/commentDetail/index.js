import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { Link, useParams } from 'react-router-dom';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import authorsTableData from "layouts/commentDetail/data/authorsTableData";
import ConfirmDialog from './data/formDeleteComment';
import apis from "../../apis/commentDetailApi";
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";
import './index.css';

function CommentDetail() {
  const { columns } = authorsTableData;
  const { articleId } = useParams(); // Lấy articleId từ URL
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchCommentsByArticle = async () => {
      try {
        setLoading(true);
        const response = await apis.getCommentsByArticleId(articleId);
        if (response.status === 200) {
          setRows(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentsByArticle();
  }, [articleId]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      await apis.deleteComment(deleteId);
      setRows(rows.filter((comment) => comment.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("Comment deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting comment:", error);
      setSnackbarMessage("Failed to delete comment.");
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

  const handleAddCommentSuccess = () => {
    fetchCommentsByArticle();
    setSnackbarMessage("Comment added successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Comment Detail Table
              </VuiTypography>
              <Link to={`/formAddCmt`}>
                <button className='text-light btn btn-outline-info' type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z" />
                  </svg>
                  Add
                </button>
              </Link>
            </VuiBox>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100px',
                }}
              >
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
              </div>
            ) : rows.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100px',
                  color: 'white',
                  fontSize: '18px'
                }}
              >
                Chưa có bình luận nào
              </div>
            ) : (
              <>
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
                    rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return {
                        ...row,
                        '#' : page * rowsPerPage + index + 1,
                        action: (
                          <div>                            
                            <button
                              className="text-light btn btn-outline-danger"
                              type="button"
                              onClick={() => handleDelete(row.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zM8 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zM11.5 5.5A.5.5 0 0 1 12 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zM13.5 2a.5.5 0 0 1 .5.5v.5h1a.5.5 0 0 1 0 1H1a.5.5 0 0 1 0-1h1V2.5A.5.5 0 0 1 2.5 2h11zM3 4v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4H3z" />
                              </svg>
                            </button>
                          </div>
                        ),
                      };
                    })}
                  />
                </VuiBox>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                  <button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0}>Previous</button>
                  <button onClick={() => handleChangePage(null, page + 1)} disabled={(page + 1) * rowsPerPage >= rows.length}>Next</button>
                </div>
              </>
            )}
            <ConfirmDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              onConfirm={() => confirmDelete(deleteId)}
              onCancel={cancelDelete}
            />
          </Card>
        </VuiBox>
      </VuiBox>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={<button onClick={handleSnackbarClose}>Close</button>}
        severity={snackbarSeverity}
      />
    </DashboardLayout>
  );
}

export default CommentDetail;
