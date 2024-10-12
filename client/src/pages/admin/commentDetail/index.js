import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import {  useLocation , useParams } from 'react-router-dom';
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import Table from "src/examples/Tables/Table";
import authorsTableData from "./data/authorsTableData";
import ConfirmDialog from './data/formDeleteComment';
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";
import './index.css';
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from 'src/config/firebaseconfig';

function CommentDetail() {
  const { id } = useParams();
  const { columns } = authorsTableData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const history = useHistory();
  // const location = useLocation();
  // const { id } = location.state || {};

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "commentDetails"), (snapshot) => {
      const commentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredComments = commentsList.filter(cmt => cmt.article_id == id);
      setRows(filteredComments);
      setLoading(false); // Dừng loading khi có dữ liệu
    });

    return () => unsubscribe();
  }, [id]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const approveComment = async (commentId) => {
    try {
      const commentRef = doc(db, 'commentDetails', commentId);
      await updateDoc(commentRef, { status: 'approved' });
      setSnackbarMessage("Bình luận đã được phê duyệt");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error approving comment:', error);
      setSnackbarMessage("Failed to approve comment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const rejectComment = async (commentId) => {
    try {
      const commentRef = doc(db, 'commentDetails', commentId);
      await updateDoc(commentRef, { status: 'rejected' });
      setSnackbarMessage("Bình luận không được phê duyệt.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error rejecting comment:', error);
      setSnackbarMessage("Lỗi Bình luận không được phê duyệt");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const confirmDelete = async (deleteId) => {
    try {
      const commentDocRef = doc(db, "commentDetails", deleteId);
      await deleteDoc(commentDocRef);
      setRows((prevRows) => prevRows.filter((comment) => comment.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("Xóa bình luận thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting comment:", error.message);
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
               Bảng Chi Tiết Bình Luận
              </VuiTypography>
              {/* <Link to={{ pathname: "/formAddCmt", state: { id: id } }}>
                <button className='text-light btn btn-outline-info' type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z" />
                  </svg>
                  Add
                </button>
              </Link> */}
            </VuiBox>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
              </div>
            ) : rows.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: 'white', fontSize: '18px' }}>
                Chưa có bình luận nào
              </div>
            ) : (
              <VuiBox>
                <Table
                  columns={columns}
                  rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => ({
                    ...row,
                    '#': page * rowsPerPage + index + 1,
                    action: (
                      <div>
                        {/* <button className="text-light btn btn-outline-success me-2" type="button" onClick={() => approveComment(row.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                          </svg>
                        </button>
                        <button className="text-light btn btn-outline-secondary me-2" type="button" onClick={() => rejectComment(row.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                          </svg>
                        </button> */}
                        <button className="text-light btn btn-outline-danger" onClick={() => handleDelete(row.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                          </svg>
                        </button>
                      </div>
                    ),
                  }))}
                  pagination
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </VuiBox>
            )}
          </Card>
        </VuiBox>
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
      </div>
      <ConfirmDialog
        open={openDialog}
        onConfirm={() => confirmDelete(deleteId)}
        onClose={cancelDelete}
      />
      <Snackbar
        open={snackbarOpen} autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default CommentDetail;
