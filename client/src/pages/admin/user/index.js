/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Table from 'src/examples/Tables/Table';
import authorsTableData from './data/authorsTableData';
import ConfirmDialog from './data/FormDeleteUser';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import từ Firebase
import { db } from '../../../config/firebaseconfig'; // Đảm bảo bạn đã cấu hình Firebase
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import UserApI from 'src/apis/UserApi';
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
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  const userRole = user ? user.role : null;  // Lấy role của user từ localStorage

  // Fetch dữ liệu từ UserAPI chỉ khi user không phải là admin hoặc userId không trùng với id
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserApI.getUsers();
        const users = response.data;

        // Lọc những tài khoản có role là admin và id trùng với userId trong localStorage
        const filteredUsers = users.filter(user => !(user.role === 'admin' && user.id === userId));

        setRows(filteredUsers);  // Cập nhật danh sách người dùng đã lọc
        console.log('Filtered users:', filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userRole, userId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Card>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <VuiTypography variant="h6">User Management</VuiTypography>
            <Link to="/add-user">
              <button>Add User</button>
            </Link>
          </VuiBox>
          {loading ? (
            <ClipLoader size={50} />
          ) : (
            <Table columns={columns} rows={rows} page={page} rowsPerPage={rowsPerPage} />
          )}
        </Card>
      </VuiBox>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={async () => {
          try {
            await deleteDoc(doc(db, 'users', deleteId));
            setRows(rows.filter(row => row.id !== deleteId));
            setSnackbarMessage('User deleted successfully');
            setSnackbarSeverity('success');
          } catch (error) {
            setSnackbarMessage('Error deleting user');
            setSnackbarSeverity('error');
          } finally {
            setSnackbarOpen(true);
            setOpenDialog(false);
          }
        }}
      />
    </DashboardLayout>
  );
}

export default User;