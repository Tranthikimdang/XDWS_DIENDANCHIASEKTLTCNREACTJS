import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from 'src/components/admin/VuiBox';
import { Grid, Box, CardContent, CardMedia } from '@mui/material';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Tooltip from '@mui/material/Tooltip';
import Table from 'src/examples/Tables/Table';
import ConfirmDialog from './data/FormDeleteOrder';
import authorsOrdersData from './data/authorsOrdersData';
import {
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import { ClipLoader } from 'react-spinners';
import SearchIcon from '@mui/icons-material/Search';
import { IconArrowBadgeRight, IconArrowBadgeLeft } from '@tabler/icons-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
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
          formattedString = `${days} ngày trước`;
        } else if (hours > 0) {
          formattedString = `${hours} giờ trước`;
        } else if (minutes > 0) {
          formattedString = `${minutes} phút trước`;
        } else {
          formattedString = `${seconds} giây trước`;
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
            user_name: data.user_name || 'Unknown User',
            user_email: data.user_email || 'unknown@example.com',
            paymentMethod: data.paymentMethod,
            totalAmount: data.totalAmount,
            items: data.items || [],
            order_day: formatOrderDay(data.createdAt),
            status: data.status || 'Pending',
          };
        });
        console.log('Fetched Orders Data: ', ordersData);
        setRows(ordersData);
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
      await deleteDoc(orderRef);
      setRows(rows.filter((row) => row.id !== deleteId));
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
      const orderRef = doc(db, 'orders', row.id);
      await updateDoc(orderRef, { status: 'Paid' });

      const emailContent = {
        to: row.user_email,
        subject: 'Payment Confirmation',
        body: `Dear ${row.user_name},\n\nYour payment for order ${row.id} has been successfully confirmed.\n\nThank you for your business!\n\nBest regards,\nYour Company Name`,
      };
      await sendEmail(emailContent);

      setRows(rows.map((r) => (r.id === row.id ? { ...r, status: 'Paid' } : r)));
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

  const filteredRows = rows.filter(
    (row) => row.user_name && row.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredRows.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredRows.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
                    currentUsers.length > 0
                      ? currentUsers.map((row, index) => ({
                          ...row,
                          no: indexOfFirstUser + index + 1,
                          items:
                            row.items && Array.isArray(row.items)
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
                              {/* delete hoa don  */}
                              {/* <Tooltip title="Delete Order" placement="top">
                                <IconButton onClick={() => handleDelete(row.id, row.user_name)}>
                                  Delete
                                </IconButton>
                              </Tooltip> */}
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
          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1}>
              <IconArrowBadgeLeft />
            </Button>
            <Typography sx={{ margin: '0 10px', alignSelf: 'center' }}>
              Page {currentPage}
            </Typography>
            <Button
              variant="contained"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <IconArrowBadgeRight />
            </Button>
          </Box>
        </VuiBox>
      </VuiBox>

      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={`Delete order with user name: ${deleteNote}`}
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
