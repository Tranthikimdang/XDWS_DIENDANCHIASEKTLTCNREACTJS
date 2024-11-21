/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Tooltip from '@mui/material/Tooltip';
import Table from 'src/examples/Tables/Table';
import authorsQuestionsData from './data/authorsTableData';
import ConfirmDialog from './data/formDeleteQuestions';
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import './index.css';

//kết nối sql
import userApis from 'src/apis/UserApI';
import { deleteQuestion, getQuestionsList, updateQuestion } from 'src/apis/QuestionsApis';

function Questions() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { columns } = authorsQuestionsData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteQuestions, setDeleteQuestions] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [reload, setReload] = useState(false);
  // Fetch Questionss from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await getQuestionsList();
        if (res.status == 'success') {
          setRows(res?.data?.questions);
        }
      } catch (error) {
        console.error('Lỗi khi tải câu hỏi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [reload]);
  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await userApis.getUsersList();
        if (res.status == 'success') {
          setUsers(res?.data.users);
        }
      } catch (error) {
        console.error('Lỗi khi tải user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //sửa
  const handleEdit = (id) => {
    console.log('Đã nhấp vào nút chỉnh sửa', id);
  };

  const handleView = async (id) => {
    try {
      console.log('Xem câu hỏi với ID:', id);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết câu hỏi:', error);
    }
  };

  //xóa
  const handleDelete = (id, questions) => {
    setDeleteId(id);
    setDeleteQuestions(questions);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteQuestion(deleteId);
      console.log(res);
      setReload((reload) => !reload);
      setOpenDialog(false);
      setSnackbarMessage('Xóa câu hỏi thành công.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      setSnackbarMessage('Không xóa được câu hỏi.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //duyệt
  const handleApprove = async (row) => {
    try {
      const res = await updateQuestion(row.id, { ...row, isApproved: true });
      console.log(res);
      if (res.status == 'success') {
        setReload((reload) => !reload);
        // Cập nhật lại danh sách bài viết
        setSnackbarMessage('Câu hỏi đã được duyệt thành công.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Lỗi khi duyệt Câu hỏi:', error);
      setSnackbarMessage('Không thể duyệt các câu hỏi.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };


  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt);
      const now = new Date();
      const diff = now - date;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        updatedAtString = `${days} ngày trước`;
      } else if (hours > 0) {
        updatedAtString = `${hours} giờ trước`;
      } else if (minutes > 0) {
        updatedAtString = `${minutes} phút trước`;
      } else {
        updatedAtString = `${seconds} giây trước`;
      }
    } else {
      updatedAtString = 'Không rõ thời gian';
    }

    return updatedAtString;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Bảng câu hỏi
              </VuiTypography>
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
                <ClipLoader size={50} color={'#123abc'} loading={loading} />
              </div>
            ) : (
              <>
                <VuiBox
                  sx={{
                    '& th': {
                      borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                        `${borderWidth[1]} solid ${grey[700]}`,
                    },
                    '& .MuiTableRow-root:not(:last-child)': {
                      '& td': {
                        borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                          `${borderWidth[1]} solid ${grey[700]}`,
                      },
                    },
                  }}
                >
                  <Table
                    columns={columns}
                    rows={rows
                      .sort((a, b) => (a.updatedAt.seconds < b.updatedAt.seconds ? 1 : -1))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        console.log(row);
                        const authorName =
                          users.find((u) => u.id === row.user_id)?.name || 'không có';
                        return {
                          ...row,
                          no: page * rowsPerPage + index + 1,
                          fuction: (
                            <div
                              className="Questions-row"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                height: '70px', // Fixed height to avoid expanding/collapsing
                              }}
                            >
                              <div className="image-column" style={{ flex: '0 0 100px' }}>
                                <img
                                  src={row.imageUrls}
                                  alt="Không có hình ảnh"
                                  style={{
                                    width: '100px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  }}
                                />
                              </div>
                            </div>
                          ),
                          author: (
                            <VuiBox>
                              <img
                                src={
                                  users?.find((u) => row?.user_id === u.id)?.imageUrl ||
                                  'default-image-url.jpg'
                                }
                                alt="User Avatar"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  marginRight: 8,
                                }}
                              />
                              <VuiTypography variant="button" color="white" fontWeight="medium">
                                {authorName}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          questions: (
                            <VuiBox>
                              <VuiTypography
                                variant="caption"
                                color="text"
                                style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
                              >
                                {row.questions?.length > 10
                                  ? `${row.questions?.substring(0, 10)}...`
                                  : row.questions}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          date: (
                            <VuiBox>
                              <VuiTypography
                                variant="caption"
                                color="text"
                                style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
                              >
                                {formatUpdatedAt(row.updatedAt)}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          action: (
                            <div className="action-buttons">
                              <Link to={`/admin/questions/${row.id}`} state={{ type: '0' }}>
                                <Tooltip title="Xem bài viết" placement="top">
                                  <button
                                    className="text-light btn btn-outline-info me-2"
                                    type="button"
                                    onClick={() => handleView(row.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-eye"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                  </button>
                                </Tooltip>
                              </Link>
                              <Link to={`/admin/questions/${row.id}`} state={{ type: '1' }}>
                                <Tooltip title="Sửa bài viết" placement="top">
                                  <button
                                    className="text-light btn btn-outline-warning me-2"
                                    type="button"
                                    onClick={() => handleEdit(row.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-pencil"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                    </svg>
                                  </button>
                                </Tooltip>
                              </Link>
                              <Tooltip title="Xóa bài viết" placement="top">
                                <button
                                  className="text-light btn btn-outline-danger me-2"
                                  type="button"
                                  onClick={() => handleDelete(row.id, row.questions)}
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
                              </Tooltip>
                              {row.isApproved == 0 && (
                                <>
                                  <Tooltip title="Duyệt bài viết" placement="top">
                                    <button
                                      className="text-light btn btn-outline-success me-2"
                                      onClick={() => handleApprove(row)}
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-check-square"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                </>
                              )}
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
                </div>
              </>
            )}
          </Card>
        </VuiBox>
      </VuiBox>
      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        questions={`${deleteQuestions}`}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ transform: 'translateY(100px)' }} // Điều chỉnh khoảng cách từ phía trên bằng cách di chuyển theo trục Y
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            border: '1px solid #ccc', // Thêm đường viền 1px với màu #ccc (màu xám nhạt)
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Questions;
