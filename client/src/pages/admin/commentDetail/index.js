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
import { Box, Typography, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Chọn style mà bạn thích
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import axios from 'axios';
import { getQuestionComments, getCourseComments } from 'src/apis/CommentApi';

function CommentDetail() {
  const { id: question_id } = useParams();
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
  const commentType = queryParams.get('type') || 'question';

  // Hook để hiển thị bình luận chi tiết
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        let response;
        if (commentType === 'course') {
          response = await getCourseComments(question_id);
        } else if (commentType === 'question') {
          response = await getQuestionComments(question_id);
        }

        if (response && Array.isArray(response.data)) {
          console.log('Fetched comments:', response.data);
          const parsedComments = response.data.map(comment => ({
            ...comment,
            imageUrls: comment.imageUrls ? JSON.parse(comment.imageUrls || '[]') : [],
            fileUrls: comment.fileUrls ? JSON.parse(comment.fileUrls || '[]') : []
          }));
          setRows(parsedComments);
        } else {
          console.error('Invalid response data:', response.data);
          setRows([]);
        }

      } catch (error) {
        console.error('Error fetching comments:', error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    setColumns(commentDetails[`${commentType}Columns`]);
  }, [commentType, question_id]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      const collectionName = commentType === 'course' ? 'commentDetails' : 'questions';
      const commentDocRef = doc(db, collectionName, deleteId);

      await deleteDoc(commentDocRef);

      // Cập nhật lại danh sách bình luận mà không gọi lại fetchComments
      setRows((prevRows) => prevRows.filter((comment) => comment.id !== deleteId));

      setSnackbarMessage("Xóa bình luận thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
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

  const formatUpdatedAt = (updatedAt) => {
    if (!updatedAt) return 'Unknown time';
    const date = updatedAt.seconds ? new Date(updatedAt.seconds * 1000) : new Date(updatedAt);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
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
                  rows={rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      // Ensure imageUrls and fileUrls are parsed correctly if not already arrays
                      const imageUrls = Array.isArray(row.imageUrls)
                        ? row.imageUrls
                        : JSON.parse(row.imageUrls || '[]');
                      const fileUrls = Array.isArray(row.fileUrls)
                        ? row.fileUrls
                        : JSON.parse(row.fileUrls || '[]');

                      return {
                        ...row,
                        '#': page * rowsPerPage + index + 1,
                        date: (
                          <VuiTypography variant="caption" color="text">
                            {formatUpdatedAt(row.updated_at)}
                          </VuiTypography>
                        ),
                        code: row.up_code ? (
                          <Box sx={{ mt: 1, width: 'auto', height: 'auto' }}>
                            <SyntaxHighlighter language="javascript" style={dracula}>
                              {row.up_code}
                            </SyntaxHighlighter>
                          </Box>
                        ) : (
                          'Không có code'
                        ),
                        images: imageUrls.length > 0 ? (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {imageUrls.map((img, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`comment-image-${imgIndex}`}
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  margin: '0 5px',
                                  objectFit: 'cover',
                                  borderRadius: '5px',
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          'Không có hình ảnh'
                        ),
                        files: fileUrls.length > 0 ? (
                          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {fileUrls.map((fileUrl, fileIndex) => {
                              const fileName = decodeURIComponent(fileUrl)
                                .split('/')
                                .pop()
                                .split('?')[0];
                              return (
                                <Box key={fileIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                                  <DescriptionIcon />
                                  <Typography
                                    component="a"
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {fileName}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        ) : (
                          'Không có tập tin'
                        ),
                        action: (
                          <button
                            className="text-light btn btn-outline-danger"
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
                        ),
                      };
                    })}
                  pagination
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />

              </VuiBox>
            )
            }
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
