import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
<<<<<<< Updated upstream
import { Link,useLocation } from 'react-router-dom';
=======
>>>>>>> Stashed changes
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import authorsTableData from "layouts/commentDetail/data/authorsTableData";
import ConfirmDialog from './data/formDeleteComment';
import apis from "../../apis/commentDetailApi"; // Adjust import path
import { Snackbar, IconButton } from "@mui/material";
import { ClipLoader } from "react-spinners";
import CloseIcon from '@mui/icons-material/Close';
import './index.css';

function CommentDetail() {
  const { columns } = authorsTableData;
<<<<<<< Updated upstream
=======
  const { articleId } = useParams(); // Get articleId from URL
>>>>>>> Stashed changes
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);

  useEffect(() => {
    const fetchCommentsByArticle = async () => {
      try {
        setLoading(true);
        const response = await apis.getList(id);
        if (response.status === 200) {
         const newData = response.data?.filter(cmt=>cmt.article_id == id)
         console.log(newData);
          setRows(newData || []);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentsByArticle();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };
<<<<<<< Updated upstream
  
  const confirmDelete = async (deleteId) => {
=======

  const confirmDelete = async () => {
>>>>>>> Stashed changes
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
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
<<<<<<< Updated upstream
              <Link to={{ pathname: "/formAddCmt", state: { id: id } }}>
                <button className='text-light btn btn-outline-info' type="button" onClick={handleAddCommentSuccess}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z" />
                  </svg>
                  Add
                </button>
              </Link>
=======
>>>>>>> Stashed changes
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
                No comments available
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
<<<<<<< Updated upstream
                    rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return {
                        ...row,
                        '#' : page * rowsPerPage + index + 1,
                        action: (
                          <div> 
                            <Link to={{ pathname: "/formEditCmt" , state: { data: row } }}>
                              <button className="text-light btn btn-outline-warning me-2" type="button" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                              </button>
                            </Link>                           
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
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </button>
                          </div>
                        ),
                      };
                    })}
                  />
                </VuiBox>
                <div className="d-flex justify-content-center p-2 custom-pagination">
                  <div className="btn-group btn-group-sm" role="group" aria-label="Pagination">
                    <button
                      className="btn btn-light"
                      onClick={() => handleChangePage(null, page - 1)}
                      disabled={page === 0}
                    >
                      &laquo;
                    </button>
                    <span className="btn btn-light disabled">
                      Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
                    </span>
                    <button
                      className="btn btn-light"
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    >
                      &raquo;
                    </button>
                  </div>
=======
                    rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => ({
                      ...row,
                      '#': page * rowsPerPage + index + 1,
                      action: (
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
                      ),
                    }))}
                  />
                </VuiBox>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                  <button
                    onClick={(event) => handleChangePage(event, page - 1)}
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={(event) => handleChangePage(event, page + 1)}
                    disabled={(page + 1) * rowsPerPage >= rows.length}
                  >
                    Next
                  </button>
>>>>>>> Stashed changes
                </div>
              </>
            )}
            <ConfirmDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          </Card>
        </VuiBox>
      </VuiBox>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={500}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
<<<<<<< Updated upstream
        action={<button className='btn btn-outline-secondary' onClick={handleSnackbarClose}>Close</button>}
=======
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
>>>>>>> Stashed changes
        severity={snackbarSeverity}
      />
    </DashboardLayout>
  );
}

export default CommentDetail;
