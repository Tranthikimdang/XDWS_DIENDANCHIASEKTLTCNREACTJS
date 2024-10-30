import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { useParams, useLocation } from 'react-router-dom';
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import Table from "src/examples/Tables/Table";
import ConfirmDialog from './data/formDeleteComment';
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";
import './index.css';
import { collection, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from 'src/config/firebaseconfig';
import { commentDetails } from './data/authorsTableData'; // Import columns data

function CommentDetail() {
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const location = useLocation()
  const [columns, setColumns] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const commentType = queryParams.get('type') || 'article';
  
  // Hook để hiển thị bình luận chi tiết
  useEffect(() => {
    // Xác định cột dựa trên commentType
    if (commentType === 'article') {
      setColumns(commentDetails.articleColumns);
    } else if (commentType === 'question') {
      setColumns(commentDetails.questionColumns);
    }
  
    const unsubscribeComments = onSnapshot(
      collection(db, commentType === 'article' ? 'commentDetails' : 'questions'),
      (snapshot) => {
        const commentsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        console.log('useParams ID:', id);
        if (commentType === 'article') {
          // Lọc bình luận cho bài viết
          const filteredComments = commentsList.filter(
            (comment) => comment.article_id === id // Kiểm tra với article_id
          );
          console.log('Filtered article comments:', filteredComments);
          setRows(filteredComments);
        } else if (commentType === 'question') {
          // Xử lý bình luận cho câu hỏi (lấy từ trường comments trong câu hỏi)
          const questionWithComments = commentsList.find(
            (question) => question.id === id // Kiểm tra với id câu hỏi
          );
          
          if (questionWithComments && questionWithComments.comments) {
            console.log('Firestore question comments:', questionWithComments.comments);
            setRows(questionWithComments.comments); // Lấy bình luận từ trường comments
          } else {
            console.log('No comments found for question');
            setRows([]);
          }
        }
  
        setLoading(false);
      }
    );
  
    return () => unsubscribeComments();
  }, [id, commentType]);
  
  

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
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
                    image: row.images && row.images.length > 0 ? (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {row.images.map((img, imgIndex) => (
                          <img key={imgIndex} src={img} alt={`comment-image-${imgIndex}`} style={{ width: '100px', height: '100px', margin: '0 5px', objectFit: 'cover', borderRadius: '5px' }} />
                        ))}
                      </div>
                    ) : (
                      'Bình luận không có ảnh'
                    ),
                    action: (
                      <div>
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
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default CommentDetail;
