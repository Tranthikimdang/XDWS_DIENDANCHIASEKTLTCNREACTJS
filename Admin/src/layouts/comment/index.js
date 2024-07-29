import React, { useState } from 'react';
import Card from "@mui/material/Card";
import { Link } from 'react-router-dom';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import authorsTableData from "layouts/comment/data/authorsTableData";
import ConfirmDialog from './data/formDeleteComment';
function Comment() {
  const { columns, rows } = authorsTableData;

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = (id) => {
    console.log("Delete button clicked", id);
    // Add your delete logic here
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Comment table
              </VuiTypography>
              <Link to="/formAddCmt">
              <button className='text-light btn btn-outline-info' type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z" />
                </svg>
                Add</button>
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
              <Table columns={columns}
                rows={rows.map(row => ({
                  ...row,
                  action: (
                    <div>                      
                      <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(row.id)}>Delete</button>
                    </div>
                  ),
                }))} />
            </VuiBox>
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
    </DashboardLayout>
  );
}

export default Comment;
