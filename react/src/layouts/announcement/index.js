import React, { useEffect, useState } from "react";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import ConfirmDialog from "./data/FormDelete";
import ConfirmDialogSend from "./data/FormSent";
import apis from "../../apis/announcementApi";
import { Link } from "react-router-dom";
import axios from "axios";
import VuiBadge from "components/VuiBadge";
import CircularProgress from "@mui/material/CircularProgress";
import "./MyPagination.css";
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";

const statusMap = {
  nháp: {
    badgeContent: "Nháp",
    sx: ({ palette: { white }, borders: { borderRadius, borderWidth } }) => ({
      background: "unset",
      border: `${borderWidth[1]} solid ${white.main}`,
      borderRadius: borderRadius.md,
      color: white.main,
    }),
  },
  "đã gửi": {
    badgeContent: "Đã gửi",
    sx: ({ palette: { white, success }, borders: { borderRadius, borderWidth } }) => ({
      background: success.main,
      border: `${borderWidth[1]} solid ${success.main}`,
      borderRadius: borderRadius.md,
      color: white.main,
    }),
  },
};

function Announcement() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; //
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/announcement");
        if (Array.isArray(response.data.data)) {
          setRows(response.data.data);
        } else {
          console.error("Dữ liệu không phải là mảng:", response.data.data);
          setRows([]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false); // Đặt loading thành false sau khi fetch xong
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async (deleteId) => {
    try {
      await apis.deleteAnnouncement(deleteId);
      setRows(rows.filter((announcement) => announcement.id !== deleteId));
      setOpenDeleteDialog(false);
      setSnackbarMessage("Announcement deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      setSnackbarMessage("Failed to delete announcement.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  
  const handleSend = (id) => {
    setSelectedId(id);
    setOpenSendDialog(true);
  };

  const confirmSend = async (sendId) => {
    try {
      const announcementToSend = rows.find((announcement) => announcement.id === sendId);
      const updateData = {
        ...announcementToSend,
        status: "đã gửi",
      };
      await apis.update(sendId, updateData);
      setRows(
        rows.map((announcement) =>
          announcement.id === sendId ? { ...announcement, status: "đã gửi" } : announcement
        )
      );
      setOpenSendDialog(false);
      setSnackbarMessage("Announcement sent successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error sending announcement:", error);
      setSnackbarMessage("Failed to send announcement.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const cancelAction = () => {
    setOpenDeleteDialog(false);
    setOpenSendDialog(false);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Lấy hàng cho trang hiện tại
  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          {loading ? ( // Hiển thị spinner khi đang tải dữ liệu
            <CircularProgress />
          ) : (
            <>
              <VuiBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb="22px"
                p="16px"
              >
                <VuiTypography variant="lg" color="white">
                  Announcement table
                </VuiTypography>
                <Link to="/formAunouncement">
                  <button className="text-light btn btn-outline-info" type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5-.5z"
                      />
                    </svg>
                    Add
                  </button>
                </Link>
              </VuiBox>
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
                  columns={[
                    { name: "Id", align: "left" },
                    { name: "sender", align: "left" },
                    { name: "receiver", align: "center" },
                    { name: "content", align: "center" },
                    { name: "status", align: "center" },
                    { name: "created_date", align: "center" },
                    { name: "action", align: "right" },
                    { name: "", align: "left" },
                  ]}
                  rows={paginatedRows.map((row, index) => ({
                    ...row,
                    Id: (page - 1) * rowsPerPage + index + 1, // Tính toán id dựa trên trang hiện tại
                    action: (
                      <div className="m-0 p-0">
                        {row.status === "nháp" && (
                          <button
                            className="text-light btn btn-outline-info me-2"
                            type="button"
                            onClick={() => handleSend(row.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-send"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ),
                    "": (
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
                    ),
                    status: (
                      <VuiBadge
                        variant="standard"
                        badgeContent={statusMap[row.status]?.badgeContent}
                        size="xs"
                        container
                        sx={statusMap[row.status]?.sx}
                      />
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
        </VuiBox>
      </VuiBox>
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={cancelAction}
        onConfirm={confirmDelete}
        itemId={selectedId}
      />
      <ConfirmDialogSend
        open={openSendDialog}
        onClose={cancelAction}
        onConfirm={confirmSend}
        itemId={selectedId}
      />
    </DashboardLayout>
  );
}

export default Announcement;
