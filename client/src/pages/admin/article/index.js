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
import authorsArticleData from "./data/authorsArticleData";
import ConfirmDialog from './data/FormDeleteArticle';
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";
import './index.css';

//firebase 
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebaseconfig';
import { doc, deleteDoc } from "firebase/firestore";

function Questions() {
  const { columns } = authorsArticleData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [cates,setCates] = useState([]);

  // Fetch articles from Firestore
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesSnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = articlesSnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }; // Trả về đối tượng bài viết
        });
        setRows(articlesData); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);
  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCates(categoriesData);

        // Create a mapping of category ID to name
        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCates(categoriesMap);

        console.log("Fetched categories:", categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //sửa 
  const handleEdit = (id) => {
    console.log("Edit button clicked", id);
  };

  const handleView = async (id) => {
    try {
      console.log("View Article with ID:", id);
    } catch (error) {
      console.error("Error fetching article details:", error);
    }
  };

  //xóa 
  const handleDelete = (id, title) => {
    setDeleteId(id);
    setDeleteTitle(title);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      // Tạo tham chiếu đến tài liệu cần xóa trong Firestore bằng ID của bài viết
      const articleRef = doc(db, "articles", deleteId);
      await deleteDoc(articleRef); // Thực hiện xóa bài viết từ Firestore
      // Cập nhật lại danh sách bài viết sau khi xóa
      setRows(rows.filter((row) => row.id !== deleteId));
      // Đóng hộp thoại xác nhận xóa và hiển thị thông báo thành công
      setOpenDialog(false);
      setSnackbarMessage("Article deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting article:", error);
      setSnackbarMessage("Failed to delete the article.");
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

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const handleAddArticleSuccess = () => {
    setSnackbarMessage("Article added successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleApprove = async (id) => {
    try {
      const articleRef = doc(db, "articles", id); // Tạo DocumentReference
      await updateDoc(articleRef, { isApproved: 1 }); // Cập nhật trường isApproved thành 1
      // Cập nhật lại danh sách bài viết
      setRows(rows.map(row => (row.id === id ? { ...row, isApproved: 1 } : row)));
      setSnackbarMessage("Article approved successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error approving article:", error);
      setSnackbarMessage("Failed to approve the article.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Bảng Bài Viết
              </VuiTypography>
              <Link to="/admin/formaddarticle">
                <button className='text-light btn btn-outline-info' onClick={handleAddArticleSuccess}>
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
                  Thêm
                </button>
              </Link>
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
                    rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      const authorName = users.find(u => u.id === row.user_id)?.name || 'Unknown';
                      return {
                        ...row,
                        no: page * rowsPerPage + index + 1,
                        fuction: (
                          <div
                            className="article-row"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                              height: '70px', // Fixed height to avoid expanding/collapsing
                            }}
                          >
                            <div className="image-column" style={{ flex: '0 0 100px' }}>
                              <img
                                src={row.image}
                                alt={
                                  row.title
                                    ? row.title.length > 10
                                      ? `${row.title.substring(0, 10).toUpperCase()}...`
                                      : row.title.toUpperCase()
                                    : "Image of the article"
                                }
                                style={{
                                  width: '100px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                              />
                            </div>
                            <div className="content-column" style={{ flex: 1, marginLeft: '10px' }}>
                              <VuiBox display="flex" flexDirection="column">
                                <VuiTypography variant="caption" fontWeight="medium" color="white" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  <strong>
                                    {row.title?.length > 10
                                      ? `${row.title.toUpperCase()?.substring(0, 10)}...`
                                      : row.title.toUpperCase()}
                                  </strong>
                                </VuiTypography>
                                <VuiTypography variant="caption" color="text" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                  {cates[row.categories_id]}
                                </VuiTypography>
                              </VuiBox>
                            </div>
                          </div>
                        ),
                        author: (
                          <VuiBox>
                            <VuiTypography variant="button" color="white" fontWeight="medium">
                              {authorName}
                            </VuiTypography>
                          </VuiBox>
                        ),
                        content: (
                          <VuiBox>
                            <VuiTypography variant="button" color="white" fontWeight="medium">
                              {row.content}
                            </VuiTypography>
                          </VuiBox>
                        ),
                        action: (
                          <div className="action-buttons">
                            <Link to={`/admin/formviewarticle/${row.id}`}>
                              <Tooltip title="Xem bài viết" placement="top">
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
                            <Link  to={`/admin/formeditarticle/${row.id}`}>
                              <Tooltip title="Sửa bài viết" placement="top">
                                <button
                                  className="text-light btn btn-outline-warning me-2"
                                  type="button"
                                  onClick={() => handleEdit(row.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                  </svg>
                                </button>
                              </Tooltip>
                            </Link>
                            <Tooltip title="Xóa bài viết" placement="top">
                              <button
                                className="text-light btn btn-outline-danger me-2"
                                type="button"
                                onClick={() => handleDelete(row.id, row.title)}
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
                                <Tooltip title="Duyệt bài viết" placement="top">
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
        title={`Xóa tiêu đề có tên là: ${deleteTitle}`}
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

export default Questions;