import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { Link } from 'react-router-dom';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import authorsTableData from "layouts/user/data/authorsTableData";
import ConfirmDialog from './data/FormDeleteUser';
import apis from "../../apis/userApi";
import { Alert, Snackbar, TablePagination } from "@mui/material";
import { ClipLoader } from "react-spinners";
import './index.css';

function User() {
  const { columns } = authorsTableData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apis.getList();
        if (response.status === 200) {
          const user = response.data || [];
          setRows(user);
          console.log("Fetched users:", user);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      await apis.deleteUser(deleteId);
      setRows(rows.filter((user) => user.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("User deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      console.log("Error response:", error.response);
      setSnackbarMessage("Failed to delete user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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

  const handleAddUserSuccess = () => {
    setSnackbarMessage("User added successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
                User table
              </VuiTypography>
              <Link to="/formAddUser">
                <button className='text-light btn btn-outline-info' type="button" onClick={handleAddUserSuccess}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z" />
                  </svg>
                  Add
                </button>
              </Link>
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
                    rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      console.log(row);
                      return {
                        ...row,
                        action: (
                          <div>
                            <Link to={{ pathname: "/formEditUser", state: { data: row } }}>
                              <button className="text-light btn btn-outline-warning me-2" type="button">
                                Edit
                              </button>
                            </Link>
                            <button
                              className="text-light btn btn-outline-danger"
                              type="button"
                              onClick={() => handleDelete(row.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ),
                      };
                    })}
                  />
                </VuiBox>
                <div className="d-flex justify-content-end p-2 custom-pagination">
                  <div className="btn-group btn-group-sm" role="group" aria-label="Pagination">
                    <button
                      className="btn btn-light"
                      onClick={() => handleChangePage(null, page - 1)}
                      disabled={page === 0}
                    >
                      &laquo; Prev
                    </button>
                    <span className="btn btn-light disabled">
                      Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
                    </span>
                    <button
                      className="btn btn-light"
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                    >
                      Next &raquo;
                    </button>
                  </div>
                </div>
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
