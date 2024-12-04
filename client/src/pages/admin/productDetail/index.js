/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link, useParams } from 'react-router-dom';
import VuiBox from '../../../components/admin/VuiBox';
import VuiTypography from '../../../components/admin/VuiTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import Tooltip from '@mui/material/Tooltip';
import Table from '../../../examples/Tables/Table';
import authorsProductData from './data/authors';
import ConfirmDialog from './data/FormDelete';
import ConfirmDialogEx from './data/FormDelete';
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import './index.css';
//firebase
import api from '../../../apis/CourseDetailApI';
import { getExerciseByIdCourse, deleteExercise } from '../../../apis/ExerciseApi';

function ProductDetail() {
  const { columns } = authorsProductData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const { course_id } = useParams();
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  // Fetch Products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.getCourseDetailsList(); // Lấy toàn bộ sản phẩm

        const filteredProducts = response.data.courseDetails.filter(
          (product) => product.course_id === Number(course_id),
        ); // Lọc sản phẩm theo course_id
        setRows(filteredProducts); // Cập nhật danh sách sản phẩm
      } catch (error) {
        console.error('Error fetching products:', error);
        setSnackbarMessage('Failed to fetch products.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [course_id]);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const data = await getExerciseByIdCourse(course_id);
        setExercises(data.data.courseDetails);
        console.log(data);

        // const filteredProducts = response.data.courseDetails.filter(product => product.course_id === Number(course_id)); // Lọc sản phẩm theo course_id
        setRow(data.data.courseDetails); // Cập nhật danh sách sản phẩm
      } catch (error) {
        console.error('Lỗi lấy câu hỏi:', error);
        setSnackbarMessage('Failed to fetch');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [course_id]);

  const handleEdit = (id) => {
    console.log('Edit button clicked', id);
  };

  const handleDelete = (id, title) => {
    setDeleteId(id);
    setDeleteTitle(title);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteCourseDetail(deleteId); // Gọi API để xóa sản phẩm

      // Cập nhật lại danh sách sản phẩm sau khi xóa
      setRows(rows.filter((row) => row.id !== deleteId));

      // Đóng hộp thoại xác nhận xóa và hiển thị thông báo thành công
      setOpenDialog(false);
      setSnackbarMessage('Xóa bài học thành công');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting Product:', error);
      setSnackbarMessage('Lỗi khi xóa khóa học');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const confirmDeleteEx = async () => {
    try {
      await deleteExercise(deleteId); // Gọi API để xóa sản phẩm

      // Cập nhật lại danh sách câu hỏi sau khi xóa
      setRow(row.filter((row) => row.id !== deleteId));

      // Đóng hộp thoại xác nhận xóa và hiển thị thông báo thành công
      setOpenDialog(false);
      setSnackbarMessage('Xóa câu hỏi thành công');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting Product:', error);
      setSnackbarMessage('Lỗi khi xóa câu hỏi.');
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

  const handleAddProductSuccess = () => {
    setSnackbarMessage('Product added successfully.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt); // Chuyển đổi chuỗi thành đối tượng Date
      const now = new Date();
      const diff = now - date; // Tính toán khoảng cách thời gian

      const seconds = Math.floor(diff / 1000); // chuyển đổi ms thành giây
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
                Các bài học
              </VuiTypography>
              <Link to={`/admin/addProDetaill/${course_id}`}>
                <button
                  className="text-light btn btn-outline-info"
                  onClick={handleAddProductSuccess}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"
                    />
                  </svg>
                  Thêm bài học
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
                      .sort((a, b) => (a.no > b.no ? 1 : -1))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const authorName =
                          users.find((u) => u.id === row.user_id)?.name || 'Unknown';

                        return {
                          ...row,
                          updated_at: formatUpdatedAt(row.updated_at),
                          no: row.no,

                          video: (
                            <div
                              className="Product-row"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                height: '100px',
                              }}
                            >
                              <div className="image-column" style={{ flex: '0 0 100px' }}>
                                <iframe
                                  src={row.video}
                                  width="150px"
                                  height="100px"
                                  allow="autoplay"
                                  title={`Video Lesson ${index + 1}`}
                                  frameBorder="0"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          ),

                          Author: (
                            <VuiBox>
                              <VuiTypography variant="button" color="white" fontWeight="medium">
                                {authorName}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          action: (
                            <div className="action-buttons">
                              <Link
                                to={{
                                  pathname: `/admin/editProDetaill/${row.id}`,
                                  state: { data: row },
                                }}
                              >
                                <Tooltip title="Sửa" placement="top">
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
                                  onClick={() => handleDelete(row.id, row.name)}
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
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                  </svg>
                                </button>
                              </Tooltip>
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

      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Bài kiểm tra
              </VuiTypography>
              <Link to={`/admin/addExercise/${course_id}`}>
                <button
                  className="text-light btn btn-outline-info"
                  onClick={handleAddProductSuccess}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"
                    />
                  </svg>
                  Thêm câu hỏi
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
                    columns={[
                      { name: 'no', align: 'left', label: 'Số thứ tự' },
                      { name: 'question_text', align: 'left', label: 'Tên sản phẩm' },
                      { name: 'option_a', align: 'left', label: '' },
                      { name: 'option_b', align: 'left', label: '' },
                      { name: 'option_c', align: 'left', label: '' },
                      { name: 'option_d', align: 'left', label: '' },
                      { name: 'correct_answer', align: 'left', label: '' },
                      { name: 'action', align: 'left', label: 'Thao tác' },
                    ]}
                    rows={row
                      .sort((a, b) => (a.no > b.no ? 1 : -1))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const authorName =
                          users.find((u) => u.id === row.user_id)?.name || 'Unknown';

                        return {
                          ...row,
                          no: index + 1,
                          Author: (
                            <VuiBox>
                              <VuiTypography variant="button" color="white" fontWeight="medium">
                                {authorName}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          action: (
                            <div className="action-buttons">
                              <Link
                                to={{
                                  pathname: `/admin/editExercise/${course_id}/${row.id}`,
                                  state: { data: row },
                                }}
                              >
                                <Tooltip title="Sửa" placement="top">
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
                              <Tooltip title="Xóa" placement="top">
                                <button
                                  className="text-light btn btn-outline-danger me-2"
                                  type="button"
                                  onClick={() => handleDelete(row.id, row.name)}
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
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                  </svg>
                                </button>
                              </Tooltip>
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
        title={`Delete ${deleteTitle}`}
        content="Bạn có muốn xóa bài học này"
      />
      <ConfirmDialogEx
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDeleteEx}
        title={`Delete ${deleteTitle}`}
        content="Bạn có muốn xóa câu hỏi này"
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default ProductDetail;
