/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from '../../../components/admin/VuiBox';
import VuiTypography from '../../../components/admin/VuiTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import Tooltip from '@mui/material/Tooltip';
import Table from '../../../examples/Tables/Table';
import authorsProductData from './data/authors';
import ConfirmDialog from './data/FormDelete';
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import './index.css';
//sql
import api from '../../../apis/CourseApi';
import apiUser from '../../../apis/UserApi';



function Course() {
  const { columns } = authorsProductData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getCoursesList();
        console.log('Dữ liệu trả về:', response.data); // Kiểm tra dữ liệu trả về

        // Đảm bảo courses lấy đúng mảng từ response.data.courses
        const courses = Array.isArray(response.data.courses) ? response.data.courses : [];
        setRows(courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setRows([]); // Thiết lập rows là mảng rỗng trong trường hợp có lỗi
      }
    };

    fetchCourses();
  }, []);

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiUser.getUsersList();
        console.log('Users data:', response.data); // Kiểm tra dữ liệu
        // Gán mảng users từ response.data.users
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);


  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      // Gọi API để xóa khóa học
      await api.deleteCourse(deleteId); // Gọi delete từ CourseAPI

      // Cập nhật lại danh sách khóa học sau khi xóa
      setRows(rows.filter((row) => row.id !== deleteId));

      // Đóng hộp thoại xác nhận xóa và hiển thị thông báo thành công
      setOpenDialog(false);
      setSnackbarMessage('Course deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting course:', error);
      setSnackbarMessage(
        'Failed to delete the course: ' + (error.response?.data?.message || 'Unknown error.'),
      );
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

  const removeSpecificHtmlTags = (htmlString, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, 'gi');
    return htmlString?.replace(regex, '');
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code', // Hiển thị 'VND' thay vì '₫'
    }).format(value);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Product Table
              </VuiTypography>
              <Link to="/admin/addProduct">
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
                      .sort((a, b) => (a.updated_at.seconds < b.updated_at.seconds ? 1 : -1))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const authorName = Array.isArray(users)
                          ? users.find((u) => u.id === row.user_id)?.name
                          : 'Unknown';

                        return {
                          ...row,
                          updated_at: formatUpdatedAt(row.updated_at),
                          no: page * rowsPerPage + index + 1,
                          price: formatCurrency(row.price),
                          discount: formatCurrency(row.discount),
                          image: (
                            <div
                              className="Product-row"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                height: '70px',
                              }}
                            >
                              <div className="image-column" style={{ flex: '0 0 100px' }}>
                                <img
                                  src={`${row.image}`}
                                  alt={
                                    row.name && row.name.length > 10
                                      ? `${row.name.substring(0, 10).toUpperCase()}...`
                                      : row.name
                                      ? row.name.toUpperCase()
                                      : 'Image of the Product'
                                  }
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

                          Author: (
                            <VuiBox>
                              <VuiTypography variant="button" color="white" fontWeight="medium">
                                {authorName}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          content:
                            removeSpecificHtmlTags(row.content, 'p')?.length > 10
                              ? `${removeSpecificHtmlTags(row.content, 'p')?.substring(0, 10)}...`
                              : removeSpecificHtmlTags(row.content, 'p'),
                          action: (
                            <div className="action-buttons">
                              <Link
                                to={{
                                  pathname: `/admin/addProDetaill/${row.id}`,
                                  state: { data: row },
                                }}
                              >
                                <Tooltip title="Thêm" placement="top">
                                  <button
                                    className="text-light btn btn-outline-info me-2"
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
                                  </button>
                                  <Link to={`/admin/productDetail/${row.id}`}>
                                    <Tooltip title="Xem" placement="top">
                                      <button
                                        className="text-light btn btn-outline-info me-2"
                                        type="button"
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
                                  <Link to={`/admin/editProduct/${row.id}`}>
                                    <Tooltip title="Sửa" placement="top">
                                      <button
                                        className="text-light btn  btn-outline-warning me-2"
                                        type="button"
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
        itemName={`${deleteName}`}
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

export default Course;
