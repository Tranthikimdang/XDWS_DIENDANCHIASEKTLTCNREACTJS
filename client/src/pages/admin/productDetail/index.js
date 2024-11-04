/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Link, useParams } from 'react-router-dom';
import VuiBox from '../../../components/admin/VuiBox';
import VuiTypography from '../../../components/admin/VuiTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import Tooltip from '@mui/material/Tooltip';
import Table from '../../../examples/Tables/Table';
import authorsProductData from './data/authorsProduct';
import ConfirmDialog from './data/FormDeleteProduct';
import { Alert, Snackbar } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import './index.css';
//firebase
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, getDoc } from 'firebase/firestore';
import { db, storage } from '../../../config/firebaseconfig'; // Verify this path
import { doc, deleteDoc } from 'firebase/firestore'; // Import deleteDoc từ Firebase Firestore
import { Update } from '@mui/icons-material';


function ProductDetail() {
  const { columns } = authorsProductData;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const { id } = useParams();
  // Fetch Products from Firebas

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Truy vấn tất cả sản phẩm
        const querySnapshot = await getDocs(collection(db, 'product_detail'));
        const ProductsList = querySnapshot.docs
          .map((doc) => {
            const ProductData = { id: doc.id, ...doc.data() };
            return ProductData; // Trả về dữ liệu sản phẩm
          })
          // Lọc sản phẩm dựa vào product_id
          .filter((product) => product.product_id === id);

        console.log(ProductsList);
        setRows(ProductsList); // Lưu sản phẩm vào state
      } catch (error) {
        console.error('Error fetching Products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    console.log('Edit button clicked', id);
  };

  const handleDelete = (id, title) => {
    setDeleteId(id);
    setDeleteTitle(title);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      // Tạo tham chiếu đến tài liệu cần xóa trong Firestore bằng ID của bài viết
      const productRef = doc(db, 'product_detail', deleteId);
      await deleteDoc(productRef); // Thực hiện xóa bài viết từ Firestore

      // Cập nhật lại danh sách bài viết sau khi xóa
      setRows(rows.filter((row) => row.id !== deleteId));

      // Đóng hộp thoại xác nhận xóa và hiển thị thông báo thành công
      setOpenDialog(false);
      setSnackbarMessage('Product deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting Product:', error);
      setSnackbarMessage('Failed to delete the Product.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const removeSpecificHtmlTags = (htmlString, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, 'gi');
    return htmlString?.replace(regex, '');
  };

  const handleAddProductSuccess = () => {
    setSnackbarMessage('Product added successfully.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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

  const getDriveEmbedUrl = (driveLink) => {
    // Chuyển link Google Drive thành dạng có thể nhúng được (embed link)
    const fileId = driveLink.match(/[-\w]{25,}/);
    return fileId ? `https://drive.google.com/file/d/${fileId[0]}/preview` : null;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Các khóa học
              </VuiTypography>
              <Link to={`/admin/addProDetaill/${id}`}>
                <button
                  className="text-light btn btn-outline-info"
                  onClick={handleAddProductSuccess}
                >
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
                  Thêm bài học
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
                <ClipLoader size={50} color={'#123abc'} loading={loading} />
              </div>
            ) : (
              <>
                <VuiBox
                  sx={{
                    '& th': {
                      borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                        `${borderWidth[1]} solid ${grey[700]}`,
                    },
                    '& .MuiTableRow-root:not(:last-child)': {
                      '& td': {
                        borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                          `${borderWidth[1]} solid ${grey[700]}`,
                      },
                    },
                  }}
                >
                  <Table
                    columns={columns}
                    rows={rows
                      .sort((a, b) => (a.no > b.no ? 1 : -1))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const authorName =
                          users.find((u) => u.id === row.user_id)?.name || 'Unknown';

                        return {
                          ...row,
                          updated_at: formatUpdatedAt(row.updated_at),
                          no: row.no,

                          video: (
                            <div
                              className="Product-row"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                height: '70px',
                              }}
                            >
                              <div className="image-column" style={{ flex: '0 0 100px' }}>
                                <iframe
                                  src={getDriveEmbedUrl(row.video)}
                                  width="100px"
                                  height="70px"
                                  allow="autoplay"
                                  title={`Video Lesson ${index + 1}`}
                                  frameBorder="0"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          ),

                          Author: (
                            <VuiBox>
                              <VuiTypography variant="button" color="white" fontWeight="medium">
                                {authorName}
                              </VuiTypography>
                            </VuiBox>
                          ),
                          action: (
                            <div className="action-buttons">
                              <Link
                                to={{
                                  pathname: `/admin/editProDetaill/${row.id}`,
                                  state: { data: row },
                                }}
                              >
                                <Tooltip title="Sửa" placement="top">
                                  <button
                                    className="text-light btn btn-outline-warning me-2"
                                    type="button"
                                    onClick={() => handleEdit(row.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-pencil"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                    </svg>
                                  </button>
                                </Tooltip>
                              </Link>
                              <Tooltip title="Xóa bài viết" placement="top">
                                <button
                                  className="text-light btn btn-outline-danger me-2"
                                  type="button"
                                  onClick={() => handleDelete(row.id, row.name)}
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
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                  </svg>
                                </button>
                              </Tooltip>
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
        title={`Delete ${deleteTitle}`}
        content="Are you sure you want to delete this Product?"
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default ProductDetail;
