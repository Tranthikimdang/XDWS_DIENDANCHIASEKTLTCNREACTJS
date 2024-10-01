// import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import Card from "@mui/material/Card";
// import VuiBox from "src/components/admin/VuiBox";
// import VuiTypography from "src/components/admin/VuiTypography";
// import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
// import Table from "src/examples/Tables/Table";
// import authorsTableData from "./data/authorsTableData";
// import ConfirmDialog from "./data/FormDeleteCate";
// import apis from "src/apis/categoriesApi";
// import { Alert, Snackbar } from "@mui/material";
// import { ClipLoader } from "react-spinners";

// import { collection, addDoc, getDocs } from "firebase/firestore";
// import   { db, storage }  from 'src/config/firebaseconfig';
// import { doc, deleteDoc } from "firebase/firestore"; // Import deleteDoc từ Firebase Firestore


// function Category() {
//   const { columns } = authorsTableData;
//   const [openDialog, setOpenDialog] = useState(false);
//   const [rows, setRows] = useState([]);
//   const [deleteId, setDeleteId] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const handleEdit = (id) => {
//     console.log("Edit button clicked", id);
//   };
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true);
//       try {
//         const querySnapshot = await getDocs(collection(db, "categories"));
//         const categoriesList = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setRows(categoriesList);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchCategories();
//   }, []);
  

//   const handleDelete = (id) => {
//     setDeleteId(id);
//     setOpenDialog(true);
//   };

//   const confirmDelete = async (deleteId) => {
//     try {
//       // Tạo tham chiếu đến tài liệu cần xóa trong Firestore bằng ID của cate
//       const articleRef = doc(db, "categories", deleteId);
//       await deleteDoc(articleRef); // Thực hiện xóa cate từ Firestore

//       // Cập nhật lại danh sách cate sau khi xóa
//       setRows(rows.filter((row) => row.id !== deleteId));

//       // Đóng hộp thoại xác nhận xóa và hiển thị thông báo thành công
//       setOpenDialog(false);
//       setSnackbarMessage("Article deleted successfully.");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error("Error deleting article:", error);
//       setSnackbarMessage("Failed to delete the article.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   const cancelDelete = () => {
//     setOpenDialog(false);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };


//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <VuiBox py={3}>
//         <VuiBox mb={3}>
//           <Card>
//             <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
//               <VuiTypography variant="lg" color="white">
//                 Category table
//               </VuiTypography>
//               <Link to="/admin/addCate">
//                 <button className="text-light btn btn-outline-info" type="button">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="16"
//                     height="16"
//                     fill="currentColor"
//                     class="bi bi-plus"
//                     viewBox="0 0 16 16"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"
//                     />
//                   </svg>
//                   Add
//                 </button>
//               </Link>
//             </VuiBox>
//             {loading ? (
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   height: '100px',
//                 }}
//               >
//                 <ClipLoader size={50} color={"#123abc"} loading={loading} />
//               </div>
//             ) : (
//             <>
//             <VuiBox
//               sx={{
//                 "& th": {
//                   borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
//                     `${borderWidth[1]} solid ${grey[700]}`,
//                 },
//                 "& .MuiTableRow-root:not(:last-child)": {
//                   "& td": {
//                     borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
//                       `${borderWidth[1]} solid ${grey[700]}`,
//                   },
//                 },
//               }}
//             >
//               <Table
//                 columns={columns}
//                 rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
//                   console.log(row);
//                   return {
//                     no: page * rowsPerPage + index + 1,
//                     name: row.name,
//                     action: (
//                       <div>
//                         <Link to={`/admin/editCate/${row.id}`}>
//                           <button className="text-light btn btn-outline-warning me-2" 
//                           type="button">
                      

//                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
//                             <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
//                           </svg>
//                           </button>
//                         </Link>
//                         <button
//                           className="text-light btn btn-outline-danger"
//                           type="button"
//                           onClick={() => handleDelete(row.id)}
//                         >
//                          <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="16"
//                           height="16"
//                           fill="currentColor"
//                           className="bi bi-trash"
//                           viewBox="0 0 16 16"
//                         >
//                           <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
//                           <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
//                         </svg>
//                         </button>
//                       </div>
//                     ),
//                   };
//                 })}
//                 />
//                 </VuiBox>
                
//                 <div className="d-flex justify-content-center p-2 custom-pagination">
//                   <div className="btn-group btn-group-sm" role="group" aria-label="Pagination">
//                     <button
//                       className="btn btn-light"
//                       onClick={() => handleChangePage(null, page - 1)}
//                       disabled={page === 0}
//                     >
//                       &laquo;
//                     </button>
//                     <span className="btn btn-light disabled">
//                       Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
//                     </span>
//                     <button
//                       className="btn btn-light"
//                       onClick={() => handleChangePage(null, page + 1)}
//                       disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
//                     >
//                       &raquo;
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </Card>
//         </VuiBox>
//       </VuiBox>
//       {/* Dialog for delete confirmation */}
//       <ConfirmDialog
//         open={openDialog}
//         onClose={cancelDelete}
//         onConfirm={confirmDelete}
//         itemId={deleteId}
//       />

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </DashboardLayout>
//   );
// }

// export default Category;


import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Card from "@mui/material/Card";
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import Table from "src/examples/Tables/Table";
import authorsTableData from "./data/authorsTableData";
import ConfirmDialog from "./data/FormDeleteCate";
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from 'src/config/firebaseconfig';

function Category() {
  const { columns } = authorsTableData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // tim kiem
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRows(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };
  // Define cancelDelete function to close the dialog
    const cancelDelete = () => {
      setOpenDialog(false);
    };

  const confirmDelete = async (deleteId) => {
    try {
      const articleRef = doc(db, "categories", deleteId);
      await deleteDoc(articleRef);
      setRows(rows.filter((row) => row.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("Category deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting category:", error);
      setSnackbarMessage("Failed to delete the category.");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Lọc các hàng dựa trên thuật ngữ tìm kiếm
  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Link to="/admin/addCate">
                <button className="text-light btn btn-outline-info" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"
                    />
                  </svg>
                  Add
                </button>
              </Link>
            </VuiBox>
           {/* tìm kiếm  */}
            <VuiBox mb={2}>
              <input
                type="text"
                placeholder="Search category..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                    rows={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => ({
                      no: page * rowsPerPage + index + 1,
                      name: row.name,
                      action: (
                        <div>
                          <Link to={`/admin/editCate/${row.id}`}>
                            <button className="text-light btn btn-outline-warning me-2" type="button">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                              </svg>
                            </button>
                          </Link>
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
                        </div>
                      ),
                    }))}
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
                      Page {page + 1} of {Math.ceil(filteredRows.length / rowsPerPage)}
                    </span>
                    <button
                      className="btn btn-light"
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={page >= Math.ceil(filteredRows.length / rowsPerPage) - 1}
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

export default Category;

