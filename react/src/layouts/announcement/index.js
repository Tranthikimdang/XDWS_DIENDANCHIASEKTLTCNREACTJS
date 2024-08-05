import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
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
        ...announcementToSend, // Copy all fields from the announcement
        status: "đã gửi",
      };
      const response = await apis.update(sendId, updateData);
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
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
                      d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"
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
                  { name: "Send", align: "center" },
                  { name: "action", align: "center" },
                ]}
                rows={rows.map((row, index) => ({
                  ...row,
                  ordinal: index + 1,
                  Send: (
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
                            className="bi bi-send"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.964.39a.5.5 0 0 1 .036.518l-2 12a.5.5 0 0 1-.622.38l-9-3a.5.5 0 0 1-.166-.895L11.95 8 3.178 4.632a.5.5 0 0 1 .166-.895l9-3a.5.5 0 0 1 .62.383z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ),
                  action: (
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
                        <path d="M2.5 5.5V14a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V5.5h-1V14H3V5.5h-1zM3.5 1a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5V2h-9V1zM6.5 2h3v1h-3V2z" />
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
          </Card>
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
