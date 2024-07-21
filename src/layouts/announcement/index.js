import React from 'react';
import Card from "@mui/material/Card";
import Button from "@mui/material/Button"; // Thêm import Button
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import AuthorsTableData from "layouts/announcement/data/authorsTableData";

function Announcement() {
  const { columns, rows } = AuthorsTableData;

  const handleAddClick = () => {
    console.log('Add button clicked');
    // Xử lý sự kiện khi nhấn nút "Add" tại đây
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px" p="16px">
              <VuiTypography variant="lg" color="white">
                Announcement table
              </VuiTypography>
              <Button variant="contained" color="primary" onClick={handleAddClick}>
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
              <Table columns={columns} rows={rows} />
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Announcement;
