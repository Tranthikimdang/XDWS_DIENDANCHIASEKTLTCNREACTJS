/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Tooltip from "@mui/material/Tooltip";
import Footer from "src/examples/Footer";
import Table from 'src/examples/Tables/Table';
import authorsTableData from './data/authorsTableData';
import ConfirmDialog from './data/FormDeleteUser';
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import VuiInput from "src/components/admin/VuiInput";
import SearchIcon from '@mui/icons-material/Search';
// Images
import avatardefault from "src/assets/images/profile/user-1.jpg";
//sql
import UserApI from 'src/apis/UserApI';
import './index.css';

function User() {
  const { columns } = authorsTableData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  const userRole = user ? user.role : null; // Lấy role của user từ localStorage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await UserApI.getUsersList(); // Gọi API để lấy dữ liệu tài khoản từ MySQL
        console.log(users);

        // Lọc những tài khoản có role là admin và id trùng với userId trong localStorage
        const filteredUsers = users.data.users.filter(user => !(user.role === 'admin' && user.id === userId));

        setRows(filteredUsers); // Cập nhật danh sách tài khoản
        console.log('Filtered users:', filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userRole, userId]);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      await UserApI.deleteUser(deleteId); // Xóa tài khoản từ MySQL
      setRows(rows.filter((user) => user.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage('User deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbarMessage('Failed to delete user.');
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <VuiBox display="flex" flexDirection="column" minHeight="100vh">
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox py={3}>
          <VuiBox mb={3}>
            <Card>
              <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
                <VuiTypography variant="lg" color="white">
                  Danh sách tài khoản
                </VuiTypography>
                <VuiBox mb={1}>
                  <VuiInput
                    placeholder="Nhập vào đây..."
                    icon={{ component: <SearchIcon />, direction: "left" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={({ breakpoints }) => ({
                      [breakpoints.down("sm")]: {
                        maxWidth: "80px",
                      },
                      [breakpoints.only("sm")]: {
                        maxWidth: "80px",
                      },
                      backgroundColor: "info.main !important",
                    })}
                  />
                </VuiBox>
              </VuiBox>
              <VuiBox mb={2} display="flex" justifyContent="flex-end">
                {/* Trường tìm kiếm */}
                <Link to="/admin/addUser">
                  <Tooltip title="Thêm tài khoản" placement="top">
                    <button className="text-light btn btn-outline-info" type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                </Link>
              </VuiBox>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                  <ClipLoader size={50} color={'#123abc'} loading={loading} />
                </div>
              ) : (
                <>
                  <VuiBox>
                    <Table
                      columns={columns}
                      rows={filteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => ({
                          ...row,
                          no: page * rowsPerPage + index + 1,
                          author: (
                            <VuiBox style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={row?.imageUrl ? row.imageUrl : avatardefault}
                                alt="Hình ảnh tài khoản"
                                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                                onError={(e) => {
                                  e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                                }}
                              />

                              <VuiBox style={{ display: 'flex', flexDirection: 'column' }}>
                                <VuiTypography variant="button" color="white" fontWeight="medium">
                                  {row?.name || 'Unknown'}
                                </VuiTypography>
                                <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                  {row?.email || 'Unknown'}
                                </VuiTypography>
                              </VuiBox>
                            </VuiBox>
                          ),
                          action: (
                            <div>
                              <Link to={`/admin/editUser/${row.id}`}>
                                <Tooltip title="Sửa tài khoản" placement="top">
                                  <button
                                    className="text-light btn btn-outline-warning me-2"
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
                              <Tooltip title="Xóa tài khoản" placement="top">
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
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                  </svg>
                                </button>
                              </Tooltip>
                            </div>
                          ),
                        }))}
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
                        Page {page + 1} of {Math.ceil(filteredRows.length / rowsPerPage)}
                      </span>
                      <button
                        className="btn btn-light"
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={page >= Math.ceil(filteredRows.length / rowsPerPage) - 1}
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
          onConfirm={() => confirmDelete(deleteId)}
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
      <Footer />
    </VuiBox>
  );
}

export default User;
