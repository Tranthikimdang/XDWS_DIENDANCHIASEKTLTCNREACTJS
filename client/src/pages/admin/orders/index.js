/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Table from 'src/examples/Tables/Table';
import ConfirmDialog from './data/FormDeleteOrder';
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import OrderAPI from 'src/apis/OrderApI';
import './index.css';
import authorsTableData from './data/authorsOrdersData';


function Order() {
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await OrderAPI.getOrdersList();
        // Sanitize the data before setting state
        const sanitizedOrders = orders.data.orders.map(order => ({
          ...order,
          total: order.total || 0,  // Provide default value
          status: order.status || 'Unknown'
        }));
        setRows(sanitizedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setSnackbarMessage('Failed to fetch orders');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      await OrderAPI.deleteOrder(deleteId);
      setRows(rows.filter((order) => order.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage('Order deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbarMessage('Failed to delete order.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Orders Management
              </VuiTypography>
              <Link to="/admin/addOrder">
                <button className="text-light btn btn-outline-info" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"/>
                  </svg>
                  New Order
                </button>
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
                    rows={rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => ({
                        ...row,
                        no: page * rowsPerPage + index + 1,
                        avatar: (
                          <div style={{ textAlign: 'center' }}>
                            <img
                              src={row.imageUrl || '/default-avatar.png'}
                              alt={row.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                        ), // Hiển thị hình ảnh hoặc hình ảnh mặc định nếu không có
                        action: (
                          <div>
                            <Link to={`/admin/viewOrder/${row.id}`}>
                              <button className="text-light btn btn-outline-primary me-2" type="button">
                                <i className="bi bi-eye"></i>
                              </button>
                            </Link>
                            <Link to={`/admin/editOrder/${row.id}`}>
                              <button className="text-light btn btn-outline-warning me-2" type="button">
                                <i className="bi bi-pencil"></i>
                              </button>
                            </Link>
                            <button 
                              className="text-light btn btn-outline-danger"
                              type="button"
                              onClick={() => handleDelete(row.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
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
        onClose={() => setOpenDialog(false)}
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
  );
}

export default Order;