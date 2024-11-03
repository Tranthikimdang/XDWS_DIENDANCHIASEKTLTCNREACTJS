/* eslint-disable eqeqeq */
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


//firebase 
import { collection, getDocs, query, where,updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebaseconfig';
import { doc, deleteDoc } from "firebase/firestore";

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

  // Fetch mentor from Firestore
  useEffect(() => {
  const fetchMentorsAndUsers = async () => {
    setLoading(true);
    try {
      // Fetch mentors from mentors collection
      const mentorsQuery = query(collection(db, "mentors"));
      const mentorsSnapshot = await getDocs(mentorsQuery);
      const mentorsList = mentorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch users with role 'mentor' from users collection
      const usersQuery = query(collection(db, "users"), where("role", "==", "mentor"));
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combine mentors and users data
      const combinedList = mentorsList.map((mentor) => {
        const user = usersList.find((user) => user.id === mentor.user_id);
        return {
          ...mentor,
          user: user || {},
        };
      });

      setUsers(combinedList);
    } catch (error) {
      console.error("Error fetching mentors and users:", error);
      setSnackbarMessage("Failed to fetch mentors and users. Please try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  fetchMentorsAndUsers();
}, []);

  const handleView = async (id) => {
    try {
      console.log("Xem mentor với ID:", id);
    } catch (error) {
      console.error("Lỗi khi tải thông tin chi tiết mentor:", error);
    }
  };

  //xóa 
  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setOpenDialog(true);
  };
  // xóa
  const confirmDelete = async () => {
    try {
      // Tạo tham chiếu đến tài liệu cần xóa trong Firestore bằng ID của mentor
      const mentorRef = doc(db, "mentors", deleteId);
      await deleteDoc(mentorRef); // Thực hiện xóa mentor từ Firestore
      // Cập nhật lại danh sách mentor sau khi xóa
      setRows(rows.filter((row) => row.id !== deleteId));
      // Đóng hộp thoại xác nhận xóa và hiển thị thông báo thành công
      setOpenDialog(false);
      setSnackbarMessage("Xóa mentor thành công");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi xóa mentor:", error);
      setSnackbarMessage("Không xóa được mentor.");
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
  //duyệt
  const handleApprove = async (id) => {
    try {
      const mentorRef = doc(db, "mentors", id); // Tạo DocumentReference
      await updateDoc(mentorRef, { isApproved: 1 }); // Cập nhật trường isApproved thành 1
      // Cập nhật lại danh sách mentor
      setRows(rows.map(row => (row.id === id ? { ...row, isApproved: 1 } : row)));
      setSnackbarMessage("Duyệt mentor thành công");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi phê duyệt mentor:", error);
      setSnackbarMessage("Không thể duyệt mentor.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  //date
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Danh sách mentor
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
                    rows={rows
                      .sort((a, b) => (a.updated_at.seconds < b.updated_at.seconds ? 1 : -1))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return {
                          ...row,
                          no: page * rowsPerPage + index + 1,

                          author: (
                            <VuiBox style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={users?.find(u => row.user_id === u.id)?.imageUrl || 'default-image-url.jpg'}
                                alt="User Avatar"
                                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                              />

                              <VuiBox style={{ display: 'flex', flexDirection: 'column' }}>
                                <VuiTypography variant="button" color="white" fontWeight="medium">
                                  {users?.find(u => u.id === row.user_id)?.name || 'Unknown'}
                                </VuiTypography>
                                <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                  {users?.find(u => u.id === row.user_id)?.email || 'Unknown'}
                                </VuiTypography>
                              </VuiBox>
                            </VuiBox>

                          ),
                          expertise: (
                            <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                              {row.expertise}
                            </VuiTypography>
                          ),
                          location: (
                            <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                              {users?.find(u => u.id === row.user_id)?.location || 'Unknown'}
                            </VuiTypography>
                          ),
                          phone: (
                            <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                              {users?.find(u => u.id === row.user_id)?.phone || 'Unknown'}
                            </VuiTypography>
                          ),
                          information: (
                            <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                              {row.upfile.length > 50
                                ? `${row.upfile.substring(0, 50)}...`
                                : row.upfile}
                            </VuiTypography>
                          ),
                          date: (
                            <VuiBox>
                              <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                {formatUpdatedAt(row.updated_at)}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          action: (
                            <div className="action-buttons">
                              <Link to={`/admin/formviewmentor/${row.id}`}>
                                <Tooltip title="Xem mentor" placement="top">
                                  <button
                                    className="text-light btn btn-outline-info me-2"
                                    type="button"
                                    onClick={() => handleView(row.id)}
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
                              <Tooltip title="Xóa mentor" placement="top">
                                <button
                                  className="text-light btn btn-outline-danger me-2"
                                  type="button"
                                  onClick={() => handleDelete(row.id, users?.find(u => u.id === row.user_id)?.name || 'Unknown')}
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
                              {row.isApproved == 0 && (
                                <>
                                  <Tooltip title="Duyệt mentor" placement="top">
                                    <button className="text-light btn btn-outline-success me-2" onClick={() => handleApprove(row.id)} type="button">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                </>
                              )}

                            </div>
                          ),
                        };
                      })}
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
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        name={`${deleteName}`}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ transform: 'translateY(100px)' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Mentor;