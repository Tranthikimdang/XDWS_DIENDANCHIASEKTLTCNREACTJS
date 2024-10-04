import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { Link, useLocation, useHistory } from 'react-router-dom';
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
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    if (id) {
      const unsubscribe = onSnapshot(collection(db, "commentDetails"), (snapshot) => {
        const commentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredComments = commentsList.filter(cmt => cmt.article_id === id);
        setRows(filteredComments);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [id]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const approveComment = async (commentId) => {
    try {
      const commentRef = doc(db, 'commentDetails', commentId);
      await updateDoc(commentRef, { status: 'approved' });
      setSnackbarMessage("Comment approved successfully.");
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
      setSnackbarMessage("Comment rejected successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error rejecting comment:', error);
      setSnackbarMessage("Failed to reject comment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      const commentDocRef = doc(db, "commentDetails", deleteId);
      await deleteDoc(commentDocRef);
      setRows((prevRows) => prevRows.filter((comment) => comment.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("Comment deleted successfully.");
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
                Comment Detail Table
              </VuiTypography>
            </VuiBox>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
              </div>
            ) : rows.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: 'white', fontSize: '18px' }}>
                No comments available.
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
                        <button className="text-light btn btn-outline-success me-2" onClick={() => approveComment(row.id)}>
                          Approve
                        </button>
                        <button className="text-light btn btn-outline-secondary me-2" onClick={() => rejectComment(row.id)}>
                          Reject
                        </button>
                        <button className="text-light btn btn-outline-danger" onClick={() => handleDelete(row.id)}>
                          Delete
                        </button>
                      </div>
                    ),
                  }))}
                  pagination={{
                    count: rows.length,
                    page,
                    rowsPerPage,
                    onPageChange: handleChangePage,
                    onRowsPerPageChange: handleChangeRowsPerPage,
                  }}
                />
              </VuiBox>
            )}
          </Card>
        </VuiBox>
      </VuiBox>

      <ConfirmDialog
        open={openDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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
