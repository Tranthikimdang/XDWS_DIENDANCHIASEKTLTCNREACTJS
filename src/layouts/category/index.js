import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import Table from 'examples/Tables/Table';
import authorsTableData from 'layouts/category/data/authorsTableData';
import ConfirmDialog from './data/FormDeleteCate'; // Import the ConfirmDialog component

function Category() {
  const { columns, rows } = authorsTableData;
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleEdit = (id) => {
    console.log("Edit button clicked", id);
    // Add your edit logic here
  };

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
                Category table
              </VuiTypography>
              <Link to="/formaddcate">
                <button className="text-light btn btn-outline-info" type="button">Add</button>
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
                columns={columns}
                rows={rows.map(row => ({
                  ...row,
                  action: (
                    <div>
                      <Link to={`/formeditcate/${row.id}`}>
                        <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(row.id)}>Edit</button>
                      </Link>
                      <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(row.id)}>Delete</button>
                    </div>
                  ),
                }))}
              />
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>
      <Footer />

      {/* Dialog for delete confirmation */}
      <ConfirmDialog
        open={openDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemId={deleteId}
      />
    </DashboardLayout>
  );
}

export default Category;
