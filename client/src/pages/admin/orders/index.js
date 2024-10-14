import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from '../../../components/admin/VuiBox';
import VuiTypography from '../../../components/admin/VuiTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import Tooltip from '@mui/material/Tooltip';
import Table from '../../../examples/Tables/Table';
import authorsOrderData from './data/authorsProduct'; // Data columns for orders
import ConfirmDialog from './data/FormDeleteProduct'; // Form for Delete Order
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import './index.css';
// Firebase imports
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebaseconfig';

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

  // Fetch Orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const ordersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Sanitize orders list
        const sanitizedOrdersList = ordersList.map((order) => ({
          id: order.id,
          note: order.note || '',
          order_day: order.order_day || '',
          product_id: order.product_id || '',
          user_id: order.user_id || '',
        }));

        // Fetch product and user names
        const productNames = await fetchProducts();
        const userNames = await fetchUsers();

        const enrichedOrders = sanitizedOrdersList.map((order) => ({
          ...order,
          ProductName: productNames[order.product_id] || 'Unknown Product',
          UserName: userNames[order.user_id] || 'Unknown User',
        }));

        setRows(enrichedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      const productSnapshot = await getDocs(collection(db, 'products'));
      const productData = {};
      productSnapshot.forEach((doc) => {
        productData[doc.id] = doc.data().name; // Assuming product has a 'name' field
      });
      setProducts(productData);
      return productData;
    };

    const fetchUsers = async () => {
      const userSnapshot = await getDocs(collection(db, 'users')); // Assuming 'users' collection
      const userData = {};
      userSnapshot.forEach((doc) => {
        userData[doc.id] = doc.data().name; // Assuming user has a 'name' field
      });
      setUsers(userData);
      return userData;
    };

    fetchOrders();
  }, []);

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
      const orderRef = doc(db, 'orders', deleteId);
      await deleteDoc(orderRef);
      setRows(rows.filter((row) => row.id !== deleteId));
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
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
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
              <Link to="/admin/addOrder">
                <button className="text-light btn btn-outline-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
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
                              onClick={() => handleDelete(row.id, row.ProductName)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5a.5.5 0 0 1 .5.5V12a.5.5 0 0 1-1 0V5.5a.5.5 0 0 1 .5-.5zM6 12h1v-7H6v7zm3.5-8a.5.5 0 0 1 .5.5V12a.5.5 0 0 1-1 0V4.5a.5.5 0 0 1 .5-.5zM9 12h1v-7H9v7zm3-9h-1V1.5A1.5 1.5 0 0 0 10.5 0h-5A1.5 1.5 0 0 0 4 1.5V3h1V1.5A.5.5 0 0 1 5.5 1h5a.5.5 0 0 1 .5.5V3z" />
                                <path d="M1 3h1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3h1v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3z" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      ),
                    }))}
                />
              </VuiBox>
            )}
          </Card>
        </VuiBox>
      </VuiBox>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={deleteTitle}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Order;
