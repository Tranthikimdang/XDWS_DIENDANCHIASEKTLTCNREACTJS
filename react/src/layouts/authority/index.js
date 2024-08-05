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
                  Id: index + 1,
                  action: (
                    <div>
                      <Link to={`/authorityDetail/${row.id}`}>
                        <button className="text-light btn btn-outline-primary me-2" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </button>
                      </Link>
                     
                      <button
                        className="text-light btn btn-outline-danger mr-1"
                        type="button"
                        onClick={() => handleOpenConfirmDialog(row.id)} // Mở dialog xác nhận khi nhấn Delete
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
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
