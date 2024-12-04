// Orders.js

import React, { useEffect, useState } from 'react';
import {
  Card,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import { IconArrowBadgeRight, IconArrowBadgeLeft } from '@tabler/icons-react';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import Table from 'src/examples/Tables/Table';
import ConfirmDialog from './data/FormDeleteOrder';
import authorsOrdersData from './data/authorsOrdersData';
import orderApi from '../../../apis/OrderApI'; // Corrected the casing
import courseApi from '../../../apis/CourseApI'; // Corrected the casing
import sendEmail from '../../../utils/email'; // Import email sending utility

import './index.css';

function Orders() {
  const { columns } = authorsOrdersData;

  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteNote, setDeleteNote] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [hiddenRows, setHiddenRows] = useState([]);

  useEffect(() => {
    const formatOrderDay = (timestamp) => {
      if (!timestamp) return 'Unknown time';
      const date = new Date(timestamp);
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

    const fetchTotalAmount = async (orderId) => {
      try {
        const response = await courseApi.getTotalAmount(orderId);
        return response.totalAmount || 'N/A';
      } catch (error) {
        console.error(`Error fetching total amount for order ${orderId}:`, error);
        return 'N/A';
      }
    };

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getOrdersList();
        if (data.orders) {
          const ordersData = await Promise.all(
            data.orders.map(async (order) => ({
              id: order.id,
              user_id: order.user_id,
              user_name: order.User?.name || 'Unknown User',
              user_email: order.User?.email || 'unknown@example.com',
              paymentMethod: order.payment_method,
              totalAmount: await fetchTotalAmount(order.id),
              items: order.items || 'No items',
              order_day: formatOrderDay(order.created_at),
              status: order.order_status || 'Pending',
            }))
          );
          setRows(ordersData);
        } else {
          throw new Error('No orders data found.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Display the actual error message from the API
        setSnackbarMessage(error.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = (id, note) => {
    setDeleteId(id);
    setDeleteNote(note);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await orderApi.deleteOrder(deleteId);
      setRows(rows.filter((row) => row.id !== deleteId));
      setSnackbarMessage('Order deleted successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error deleting order:', error);
      // Display the actual error message from the API
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
    } finally {
      setOpenDialog(false);
      setSnackbarOpen(true);
    }
  };

  const handleConfirmPayment = async (row) => {
    try {
      await orderApi.updateOrder(row.id, { order_status: 'Paid' });
      const emailContent = {
        to: row.user_email,
        subject: 'Payment Confirmation',
        body: `Dear ${row.user_name},\n\nYour payment for order ${row.id} has been successfully confirmed.\n\nThank you for your business!\n\nBest regards,\nYour Company Name`,
      };
      await sendEmail(emailContent);
      setRows(rows.map((r) => (r.id === row.id ? { ...r, status: 'Paid' } : r)));
      setSnackbarMessage('Payment confirmed and email sent successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error confirming payment:', error);
      // Display the actual error message from the API
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleHide = (id) => {
    setHiddenRows([...hiddenRows, id]);
    setSnackbarMessage('Order hidden successfully');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const filteredRows = rows.filter(
    (row) =>
      (row.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !hiddenRows.includes(row.id)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredRows.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredRows.length / usersPerPage) || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Order Management
              </VuiTypography>
            </VuiBox>

            {/* Search Field */}
            <VuiBox mb={3} px={3}>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Search by user name, email, or status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </VuiBox>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                <ClipLoader size={50} color={'#123abc'} loading={loading} />
              </Box>
            ) : (
              <VuiBox>
                <Table
                  columns={columns}
                  rows={
                    currentUsers.length > 0
                      ? currentUsers.map((row, index) => ({
                          ...row,
                          no: indexOfFirstUser + index + 1,
                          totalAmount: `$${row.totalAmount}`, // Display total amount with currency
                          status: row.status,
                          actions: (
                            <div className="action-buttons">
                              <Tooltip title="Hide Order" placement="top">
                                <IconButton onClick={() => handleHide(row.id)} color="warning">
                                  <VisibilityOffIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Details" placement="top">
                                <IconButton component={Link} to={`/orders/${row.id}`} color="primary">
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Confirm Payment" placement="top">
                                <IconButton onClick={() => handleConfirmPayment(row)} color="success">
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          ),
                        }))
                      : []
                  }
                />
              </VuiBox>
            )}
          </Card>
          {/* Pagination Controls */}
          <Box display="flex" justifyContent="center" marginTop="20px">
            <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1}>
              <IconArrowBadgeLeft />
            </Button>
            <Typography margin="0 10px" alignSelf="center">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <IconArrowBadgeRight />
            </Button>
          </Box>
        </VuiBox>
      </VuiBox>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={`Delete order for user: ${deleteNote}`}
      />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ transform: 'translateY(100px)' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Orders;