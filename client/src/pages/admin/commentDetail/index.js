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
import { getQuestionComments } from 'src/apis/CommentApi';
import { getCourseComments } from 'src/apis/CommentCourseApi';
import { deleteComment as deleteCourseComment } from 'src/apis/CommentCourseApi';
import { deleteComment as deleteQuestionComment } from 'src/apis/CommentApi';
function CommentDetail() {
  const { id, type } = useParams();
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
  const commentType = queryParams.get('type');

  // Hook để hiển thị bình luận chi tiết
  const fetchQuestionComments = async (question_id) => {
    setLoading(true);
    try {
      const response = await getQuestionComments(question_id);
      if (response && Array.isArray(response.data)) {
        const parsedComments = response.data.map(comment => ({
          ...comment,
          imageUrls: Array.isArray(comment.imageUrls)
            ? comment.imageUrls
            : comment.imageUrls?.startsWith('[')
              ? JSON.parse(comment.imageUrls)
              : [comment.imageUrls], // Wrap single URL in an array
          fileUrls: Array.isArray(comment.fileUrls)
            ? comment.fileUrls
            : comment.fileUrls?.startsWith('[')
              ? JSON.parse(comment.fileUrls)
              : [comment.fileUrls], // Wrap single URL in an array
        }));
        setRows(parsedComments);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching question comments:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };


  // Fetch course comments
  const fetchCourseComments = async (course_id) => {
    console.log('fetchCourseComments called with course_id:', course_id);
    setLoading(true);
    try {
      const response = await getCourseComments(course_id);
      console.log('Response from API:', response);

      // Kiểm tra xem response có hợp lệ không
      if (response && response.data && Array.isArray(response.data)) {
        const parsedComments = response.data.map(comment => ({
          ...comment,
          imageUrls: Array.isArray(comment.imageUrls)
            ? comment.imageUrls
            : comment.imageUrls?.startsWith('[')
              ? JSON.parse(comment.imageUrls)
              : [comment.imageUrls] // Đảm bảo rằng imageUrls luôn là một mảng
        }));
        setRows(parsedComments);
      } else {
        console.warn('No comments found or response data is not an array.');
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching course comments:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data based on comment type
  useEffect(() => {
    console.log('useEffect triggered with commentType:', commentType);
    setColumns(commentDetails[`${commentType}Columns`]);

    // Thay đổi điều kiện để gọi đúng hàm
    if (id && commentType === 'course') {
      console.log('Calling fetchCourseComments with id:', id);
      fetchCourseComments(id);
    } else if (id) {
      console.log('Calling fetchQuestionComments with id:', id);
      fetchQuestionComments(id);
    }
  }, [type, id]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      const deleteApi = commentType === 'course' ? deleteCourseComment : deleteQuestionComment;

      // Gọi API xóa bình luận từ backend
      const response = await deleteApi(deleteId);

      if (response.status === 204) {
        // Xóa bình luận khỏi state
        setRows((prevRows) => {
          const updatedRows = prevRows.filter((comment) => comment.id !== deleteId);

          // Cập nhật lại localStorage cho từng loại bình luận
          if (commentType === 'course') {
            const storedCourses = JSON.parse(localStorage.getItem('comment_course')) || [];
            const updatedCourses = storedCourses.filter((comment) => comment.id !== deleteId);
            localStorage.setItem('comment_course', JSON.stringify(updatedCourses));
          } else if (commentType === 'question') {
            const storedQuestions = JSON.parse(localStorage.getItem('comment_question')) || [];
            const updatedQuestions = storedQuestions.map((question) => ({
              ...question,
              comments: question.comments.filter((comment) => comment.id !== deleteId),
            }));
            localStorage.setItem('comment_question', JSON.stringify(updatedQuestions));
          }

        // Cập nhật lại giao diện nếu xóa thành công
        setRows(prevRows => {
          const updatedRows = prevRows.filter(comment => comment.id !== deleteId);
  
          // Cập nhật local storage mà không xóa toàn bộ danh sách câu hỏi
          const storedQuestions = JSON.parse(localStorage.getItem('comment_question')) || [];
          const updatedQuestions = storedQuestions.map(question => {
            return {
              ...question,
              comments: question.comments.filter(comment => comment.id !== deleteId)
            };
          });
  
          // Lưu danh sách cập nhật vào local storage
          localStorage.setItem('comment_question', JSON.stringify(updatedQuestions));
  
          return updatedRows;
        });

        setSnackbarMessage("Comment deleted successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to delete comment.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Failed to delete comment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting comment:", error);
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
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            {fileUrls.map((fileUrl, fileIndex) => {
                              const fileName = decodeURIComponent(fileUrl)
                                .split('/')
                                .pop()
                                .split('?')[0];

                              return (
                                <Box
                                  key={fileIndex}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 16px',
                                    border: '1px solid rgb(61, 54, 54)',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgb(40, 42, 54)',
                                    width: 'fit-content',
                                  }}
                                >
                                  <IconButton sx={{ color: '#ffffff', padding: '0' }}>
                                    <DescriptionIcon />
                                  </IconButton>
                                  <Typography
                                    component="a"
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      marginLeft: '8px',
                                      color: '#ffffff',
                                      textDecoration: 'none',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      wordBreak: 'break-all',
                                    }}
                                  >
                                    {fileName}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        ) : (
                          <Typography
                            sx={{
                              mt: 1,
                              fontSize: '14px',
                              color: '#888',
                              textAlign: 'left',
                            }}
                          >
                            Không có tập tin
                          </Typography>
                        ),

                        content: row.content || 'Không có nội dung',
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
