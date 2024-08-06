import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { Link, useParams } from 'react-router-dom';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import authorsTableData from "layouts//authorityDetail/data/authorsTableData";
import ConfirmDialog from './data/FormDeleteUser'; 
import FormAddUserAuthory from './data/FormAdd'; 
import apiauthorityDetail from "../../apis/authorityDetailApi";
import './MyPagination.css';

import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";

function User() {
  const { columns } = authorsTableData;
  const { id } = useParams();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiauthorityDetail.getList();
        if (response.status === 200) {
          const user = response.data || [];
          setRows(user);
          const filteredUsers = user.filter(user => user.IdAuthority === id);
          setFilteredRows(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      await apiauthorityDetail.deleteUser(deleteId);
      setFilteredRows(filteredRows.filter((user) => user.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("User deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbarMessage("Failed to delete user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddUserSuccess = (newUser) => {
    setFilteredRows([...filteredRows, newUser]);
    setSnackbarMessage("User added successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setOpenAddUserDialog(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const openAddUserDialogHandler = () => {
    setOpenAddUserDialog(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                AuthorityDetail table
              </VuiTypography>
              <button className='text-light btn btn-outline-info' type="button" onClick={openAddUserDialogHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z" />
                </svg>
                Add
              </button>
            </VuiBox>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
              </div>
            ) : (
              <>
                <VuiBox
                  sx={{
                    "& th": {
                      borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                        `${borderWidth[1]} solid ${grey[700]}`,
                    },
                    "& .MuiTableRow-root:not(:last-child)": {
                      "& td": {
                        borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                          `${borderWidth[1]} solid ${grey[700]}`,
                      },
                    },
                  }}
                >
                  <Table
                    columns={columns}
                    rows={currentRows.map((row, index) => ({
                      ...row,
                      Id:  index + 1,
                      action: (
                        <div>
                          <button
                            className="text-light btn btn-outline-danger"
                            type="button"
                            onClick={() => handleDelete(row.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                          </button>
                        </div>
                      ),
                    }))}
                  />
                </VuiBox>
                <VuiBox display="flex" justifyContent="end" my={3}>
                  <div className="d-flex justify-content-end p-2 custom-pagination">
                    <div className="btn-group btn-group-sm" role="group" aria-label="Pagination">
                      <button
                        className="btn btn-light"
                        onClick={() => handleChangePage(null, page - 1)}
                        disabled={page === 1}
                      >
                        &laquo; 
                      </button>
                      <span className="btn btn-light disabled">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        className="btn btn-light"
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={page >= totalPages}
                      >
                        &raquo;
                      </button>
                    </div>
                  </div>
                </VuiBox>
              </>
            )}
          </Card>
        </VuiBox>
      </VuiBox>
      <Footer />

      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemId={deleteId}
      />
      <FormAddUserAuthory
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
        onUserAdded={handleAddUserSuccess}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default User;
