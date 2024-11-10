import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { Link } from 'react-router-dom';
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import Tooltip from "@mui/material/Tooltip";
import Table from "src/examples/Tables/Table";
import authorsMentorData from "./data/authorsMentorData";
import ConfirmDialog from './data/FormDeleteMentor';
import { Snackbar, Alert } from "@mui/material";
import { ClipLoader } from "react-spinners";
import './index.css';

// SQL
import api from "../../../apis/mentorApi";
import apiUser from '../../../apis/UserApI';

function Mentor() {
  const { columns } = authorsMentorData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const response = await api.getList();
        setRows(response);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  // Fetch users from the SQL API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiUser.getUsersList();
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleView = (id) => {
    console.log("View mentor with ID:", id);
  };

  // Delete mentor
  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteMentor(deleteId);
      setRows(rows.filter((row) => row.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("Deleted mentor successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting mentor:", error);
      setSnackbarMessage("Failed to delete mentor.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Approve mentor
  const handleApprove = async (id) => {
    try {
      await api.approveMentor(id);
      setRows(rows.map(row => (row.id === id ? { ...row, isApproved: 1 } : row)));
      setSnackbarMessage("Approved mentor successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error approving mentor:", error);
      setSnackbarMessage("Failed to approve mentor.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Format updated date
  const formatUpdatedAt = (updatedAt) => {
    let updatedAtString = '';
    if (updatedAt) {
      const date = new Date(updatedAt);
      const now = new Date();
      const diff = now - date;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        updatedAtString = `${days} days ago`;
      } else if (hours > 0) {
        updatedAtString = `${hours} hours ago`;
      } else if (minutes > 0) {
        updatedAtString = `${minutes} minutes ago`;
      } else {
        updatedAtString = `${seconds} seconds ago`;
      }
    } else {
      updatedAtString = 'Unknown time';
    }
    return updatedAtString;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Mentor List
              </VuiTypography>
            </VuiBox>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
              </div>
            ) : (
              <>
                <VuiBox sx={{
                  "& th": { borderBottom: ({ borders: { borderWidth }, palette: { grey } }) => `${borderWidth[1]} solid ${grey[700]}` },
                  "& .MuiTableRow-root:not(:last-child)": { "& td": { borderBottom: ({ borders: { borderWidth }, palette: { grey } }) => `${borderWidth[1]} solid ${grey[700]}` } },
                }}>
                  <Table
                    columns={columns}
                    rows={rows
                      .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const user = users.find(u => u.id === row.user_id);
                        return {
                          ...row,
                          no: page * rowsPerPage + index + 1,
                          author: (
                            <VuiBox style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={user?.imageUrl || 'default-image-url.jpg'}
                                alt="User Avatar"
                                style={{ width: 40, height: 40, borderRadius: '50%' }}
                              />
                              <VuiBox ml={2}>
                                <VuiTypography variant="button">{user?.name || 'Unknown'}</VuiTypography>
                                <VuiTypography variant="caption" color="text">{user?.email || 'Unknown'}</VuiTypography>
                              </VuiBox>
                            </VuiBox>
                          ),
                          updatedAt: formatUpdatedAt(row.updated_at),
                          upfile: row.upfile ? (row.upfile.length > 50 ? `${row.upfile.substring(0, 50)}...` : row.upfile) : 'No file',
                          actions: (
                            <VuiBox>
                              <Tooltip title="View Mentor">
                                <Link to={`/mentor/view/${row.id}`} style={{ textDecoration: 'none' }}>
                                  <VuiTypography variant="button" color="primary">
                                    View
                                  </VuiTypography>
                                </Link>
                              </Tooltip>
                              <Tooltip title="Approve Mentor">
                                <VuiTypography
                                  variant="button"
                                  color="success"
                                  onClick={() => handleApprove(row.id)}
                                >
                                  Approve
                                </VuiTypography>
                              </Tooltip>
                              <Tooltip title="Delete Mentor">
                                <VuiTypography
                                  variant="button"
                                  color="error"
                                  onClick={() => handleDelete(row.id, user?.name || 'Unknown')}
                                >
                                  Delete
                                </VuiTypography>
                              </Tooltip>
                            </VuiBox>
                          ),
                        };
                      })}
                  />
                </VuiBox>

                <ConfirmDialog
                  openDialog={openDialog}
                  onCancel={cancelDelete}
                  onConfirm={confirmDelete}
                  mentorName={deleteName}
                />
              </>
            )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Card>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Mentor;
