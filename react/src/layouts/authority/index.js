import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import authorsTableData from "layouts/authority/data/authorsTableData";
import FormAdd from "./data/FormAdd"; // Đảm bảo đường dẫn đúng
import authorityApi from "../../apis/authorityApi"; // Đường dẫn tới api.js
import { Link } from "react-router-dom";
import ConfirmDialog from "./data/FormDelete"; // Đảm bảo đường dẫn đúng

function Authority() {
  const { columns } = authorsTableData;
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddAuthority = (newAuthority) => {
    setRows((prevRows) => [...prevRows, newAuthority]);
  };

  const handleOpenConfirmDialog = (id) => {
    setSelectedAuthorityId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedAuthorityId(null);
  };

  const handleConfirmDelete = (id) => {
    authorityApi
      .dele(id)
      .then(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete authority:", error);
      });
  };

  const handleViewAuthority = (id) => {
    const authority = rows.find((row) => row.id === id);
    if (authority) {
      console.log("Viewing authority:", authority);
    }
  };

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const data = await authorityApi.getList();
        if (Array.isArray(data.data)) {
          setRows(data.data);
        } else {
          console.error("Dữ liệu không phải là một mảng:", data);
        }
      } catch (error) {
        console.error("Failed to fetch authorities:", error);
      }
    };

    fetchAuthorities();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Authority Management Table
              </VuiTypography>
              <Button
                onClick={handleOpenDialog}
                variant="outlined"
                className="btn btn-outline-info"
                sx={{
                  color: "info.main",
                  borderColor: "info.main",
                  "&:hover": { borderColor: "info.dark" },
                }}
              >
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
              </Button>
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
                columns={columns}
                rows={rows.map((row, index) => ({
                  ...row,
                  ordinal: index + 1,
                  action: (
                    <div>
                      <Link to={`/authorityDetail/${row.id}`}>
                        <button className="text-light btn btn-outline-primary me-2" type="submit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 3.5a4.5 4.5 0 0 0-4.5 4.5A4.5 4.5 0 0 0 8 12.5a4.5 4.5 0 0 0 4.5-4.5A4.5 4.5 0 0 0 8 3.5zm0 8a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
                            <path d="M8 1C4.4 1 1.3 4 0 8c1.3 4 4.4 7 8 7s6.7-3 8-7c-1.3-4-4.4-7-8-7zm0 13.5C5.2 14.5 2.8 12.1 2 8c.8-4.1 3.2-6.5 6-6.5s5.2 2.4 6 6.5c-.8 4.1-3.2 6.5-6 6.5z" />
                          </svg>
                        </button>
                      </Link>
                      <button
                        className="text-light btn btn-outline-info me-2"
                        type="button" // Đổi từ 'submit' sang 'button'
                        onClick={() => {
                          // Gửi yêu cầu với ID người dùng từ row
                          const userId = row.id; // Lấy ID từ dòng tương ứng
                          fetchUserData(userId); // Gọi hàm để lấy dữ liệu người dùng
                        }}
                      >
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
                      </button>
                      <button
                        className="text-light btn btn-outline-danger mr-1"
                        type="button"
                        onClick={() => handleOpenConfirmDialog(row.id)} // Mở dialog xác nhận khi nhấn Delete
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
                    </div>
                  ),
                }))}
              />
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>

      {/* Dialog để thêm authority */}
      <FormAdd open={openDialog} handleClose={handleCloseDialog} onAdd={handleAddAuthority} />

      {/* Dialog xác nhận xóa authority */}
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        itemId={selectedAuthorityId}
      />
    </DashboardLayout>
  );
}

export default Authority;
