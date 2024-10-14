import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Table from 'src/examples/Tables/Table';
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import Tooltip from '@mui/material/Tooltip';

import ConfirmDialog from './data/FormDeleteProduct'; // Form for Delete Order
import './index.css';
import authorsOrderData from './data/authorsProduct';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../../config/firebaseconfig'; // Verify this path
import { doc, deleteDoc } from 'firebase/firestore'; // Import deleteDoc từ Firebase Firestore

function Order() {
  const { columns } = authorsOrderData; // Data columns for orders
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  // tim kiem
  const [searchTerm, setSearchTerm] = useState(''); // New state for search input

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersData = ordersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // Map dữ liệu thành cấu trúc phù hợp với bảng
        const mappedRows = ordersData.map((order) => {
          const product = productsData.find((product) => product.id === order.product_id) || {};
          const user = usersData.find((user) => user.id === order.user_id) || {};
          return {
            no: order.id, // Bạn có thể thay đổi nếu cần
            Note: order.note,
            ProductName: product.name || 'Unknown', // Kiểm tra nếu sản phẩm không tồn tại
            OrderDay: formatUpdatedAt(order.order_day),
            UserName: user.name || 'Unknown', // Kiểm tra nếu user không tồn tại
            actions: null, // Bạn có thể cập nhật hành động nếu cần
            id: order.id,
          };
        });

        setRows(mappedRows);
        setProducts(productsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setSnackbarMessage('Lỗi khi lấy dữ liệu');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';

    if (updatedAt) {
      const date = new Date(updatedAt.seconds * 1000); // Chuyển đổi giây thành milliseconds
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

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };
  // Define cancelDelete function to close the dialog
  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const confirmDelete = async () => {
    console.log("Confirm delete called with ID:", deleteId); // Log ID
    if (!deleteId) return;
    try {
      const orderRef = doc(db, 'orders', deleteId);
      await deleteDoc(orderRef);
      setRows(rows.filter((row) => row.id !== deleteId)); // Sử dụng đúng trường ID
      setOpenDialog(false);
      setSnackbarMessage('Order deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbarMessage('Failed to delete the order.');
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Lọc các hàng dựa trên thuật ngữ tìm kiếm
  const filteredRows = rows.filter((row) => {
    const product = products.find((product) => product.id === row.product_id);

    // Kiểm tra nếu `product` không tồn tại hoặc `product.name` không tồn tại, trả về false
    if (!product || !product.name) return false;

    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  // update
  const handleEdit = (id) => {
    console.log('Edit button clicked', id);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Order Table
              </VuiTypography>
              <Link to="/admin/addCate">
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
                  Add
                </button>
              </Link>
            </VuiBox>

            {/* Search Bar with Material-UI */}
            {/* <VuiBox mb={2} display="flex" justifyContent="flex-end">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { backgroundColor: 'white', borderRadius: '4px' },
                }}
                sx={{ width: "250px" }}
              />
            </VuiBox> */}

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
              <VuiBox>
                <Table
                  columns={columns}
                  rows={rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => ({
                      ...row,
                      no: page * rowsPerPage + index + 1,
                      actions: (
                        <div className="action-buttons">
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
                          <Link
                            to={{
                              pathname: `/admin/addProduct`,
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
                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5v-.5H4v-.293a.5.5 0 0 1 .175-.106z" />
                                </svg>
                              </button>
                            </Tooltip>
                          </Link>
                          <Tooltip title="Xóa" placement="top">
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
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      ),
                    }))}
                />
              </VuiBox>
            )}
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
          </Card>
        </VuiBox>
      </VuiBox>

      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete} // Kiểm tra hàm này có được định nghĩa
        onConfirm={confirmDelete} // Kiểm tra hàm này có được định nghĩa
        title={deleteTitle} // Nếu bạn cần truyền tiêu đề xóa
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose} // Kiểm tra hàm này có được định nghĩa
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Order;
