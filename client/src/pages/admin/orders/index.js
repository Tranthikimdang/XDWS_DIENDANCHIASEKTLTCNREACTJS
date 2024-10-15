import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Tooltip from '@mui/material/Tooltip';
import Table from 'src/examples/Tables/Table';
import ConfirmDialog from './data/FormDeleteOrder';
import authorsOrdersData from './data/authorsOrdersData';
import { Snackbar, Alert, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import SearchIcon from '@mui/icons-material/Search';
import './index.css';

// Firebase
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebaseconfig';
import sendEmail from '../../../utils/email'; // Import email sending utility

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const formatOrderDay = (timestamp) => {
      let formattedString = '';

      if (timestamp) {
        const date = timestamp.toDate();
        const now = new Date();
        const diff = now - date;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
          formattedString = `${days} days ago`;
        } else if (hours > 0) {
          formattedString = `${hours} hours ago`;
        } else if (minutes > 0) {
          formattedString = `${minutes} minutes ago`;
        } else {
          formattedString = `${seconds} seconds ago`;
        }
      } else {
        formattedString = 'Unknown time';
      }

      return formattedString;
    };

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersData = ordersSnapshot.docs.map((orderDoc) => {
          const data = orderDoc.data();

          return {
            id: orderDoc.id,
            user_id: data.user_id,
            user_name: data.user_id, // Placeholder for user name
            paymentMethod: data.paymentMethod,
            totalAmount: data.totalAmount,
            items: data.items || [], // Ensure items is always an array
            order_day: formatOrderDay(data.createdAt),
            status: data.status || 'Pending', // Adding status to track payment
          };
        });
        console.log('Fetched Orders Data: ', ordersData); // Debug to check the structure
        setRows(ordersData); // Store data in state
      } catch (error) {
        console.error('Error fetching orders:', error);
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
      const orderRef = doc(db, 'orders', deleteId);
      await deleteDoc(orderRef); // Delete order from Firestore
      setRows(rows.filter((row) => row.id !== deleteId)); // Update the orders list
      setOpenDialog(false);
      setSnackbarMessage('Order deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbarMessage('Failed to delete order.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleConfirmPayment = async (row) => {
    try {
      // Update order status to Paid
      const orderRef = doc(db, 'orders', row.id);
      await updateDoc(orderRef, { status: 'Paid' });

      // Send email confirmation
      const emailContent = {
        to: row.user_email, // Assuming you have user's email in row data
        subject: 'Payment Confirmation',
        body: `Dear ${row.user_name},\n\nYour payment for order ${row.id} has been successfully confirmed.\n\nThank you for your business!\n\nBest regards,\nYour Company Name`,
      };
      await sendEmail(emailContent);

      setRows(rows.map((r) => (r.id === row.id ? { ...r, status: 'Paid' } : r))); // Update row status in state
      setSnackbarMessage('Payment confirmation email sent successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error confirming payment:', error);
      setSnackbarMessage('Failed to confirm payment and send email.');
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

  const filteredRows = rows.filter(
    (row) => row.user_id && row.user_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

            {/* Search Bar */}
            <VuiBox mb={2} display="flex" justifyContent="flex-end">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search orders..."
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
                sx={{ width: '250px' }}
              />
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
                  rows={
                    filteredRows.length > 0
                      ? filteredRows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => ({
                            ...row,
                            no: page * rowsPerPage + index + 1,
                            items: row.items && Array.isArray(row.items)
                              ? row.items
                                  .map((item) => `${item.product_id} (Qty: ${item.quantity})`)
                                  .join(', ')
                              : 'No items',
                            order_day: row.order_day,
                            paymentMethod: row.paymentMethod,
                            totalAmount: row.totalAmount,
                            status: row.status,
                            actions: (
                              <div className="action-buttons">
                                <Tooltip title="Delete Order" placement="top">
                                  {/* Delete button logic */}
                                </Tooltip>
                                {row.status === 'Pending' && (
                                  <Tooltip title="Confirm Payment" placement="top">
                                    <Button
                                      variant="outlined"
                                      color="success"
                                      size="small"
                                      onClick={() => handleConfirmPayment(row)}
                                    >
                                      Confirm Payment
                                    </Button>
                                  </Tooltip>
                                )}
                              </div>
                            ),
                          }))
                      : []
                  }
                />
              </VuiBox>
            )}
          </Card>
        </VuiBox>
      </VuiBox>
      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={`Delete order with user ID: ${deleteNote}`}
      />
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
