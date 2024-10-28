import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card } from '@mui/material';
import { Link } from 'react-router-dom';
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import Table from "src/examples/Tables/Table";
import { articleColumns, questionColumns } from './data/authorsTableData';
import ConfirmDialog from './data/formDeleteComment';
// import apis from "src/apis/commentApi";
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";
import Skeleton from '@mui/material/Skeleton';
import 'src/pages/admin/comment/index.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from 'src/config/firebaseconfig';

function Comment() {
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const [articleRows, setArticleRows] = useState([]);
  const [questionRows, setQuestionRows] = useState([]);

  // Fetching data from Firestore
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const articleSnapshot = await getDocs(collection(db, "articles"));
        const questionSnapshot = await getDocs(collection(db, "questions"));
        const articleList = articleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const questionList = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticleRows(articleList);
        setQuestionRows(questionList);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const confirmDelete = async () => {
    try {
      // await apis.deleteComment(deleteId);
      setRows(rows.filter((comment) => comment.id !== deleteId));
      setOpenDialog(false);
      setSnackbarMessage("Comment deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting comment:", error);
      setSnackbarMessage("Failed to delete comment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const removeHtmlTags = (html) => html?.replace(/<[^>]+>/g, '');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const defaultImageUrl = "/path/to/default/image.png"; // Replace with your actual default image

  const formatUpdatedAt = (updatedAt) => {
    if (!updatedAt) return 'Unknown time';
    const date = new Date(updatedAt.seconds * 1000);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
  };

  // Rendering the table with data
  const renderTable = (rows, columns) => (
    <>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : rows && rows.length > 0 ? (
        <Table
          columns={columns}
          rows={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => ({
            ...row,
            '#': page * rowsPerPage + index + 1,
            image: (
              <ImageLoader
                src={row.image || defaultImageUrl}
                alt="Image"
                defaultImageUrl={defaultImageUrl}
              />
            ),
            function: (
              <div
                className="Questions-row"
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

                  <img
                    src={row.imageUrls}
                    alt="Không có hình ảnh"
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
              </div>
            ),
            content: (
              <VuiTypography variant="caption" color="text">
                {removeHtmlTags(row?.content || "").length > 10
                  ? `${removeHtmlTags(row.content).substring(0, 10)}...`
                  : removeHtmlTags(row.content || "")}
              </VuiTypography>
            ),
            date: (
              <VuiTypography variant="caption" color="text">
                {formatUpdatedAt(row.updated_at)}
              </VuiTypography>
            ),
            action: (
              <Link to={`/admin/commentDetail/${row.id}`}>
                <button className="text-light btn btn-outline-primary me-2" type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                    <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                  </svg>
                </button>
              </Link>
            ),
          }))}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No comments available.</p>
        </div>
      )}
    </>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3} className="tabs-container"  sx={{ padding: 0, margin: 0 }} >
        <Card>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="comment management tabs" >
            <Tab label="Bài viết " />
            <Tab label="Câu hỏi " />
          </Tabs>

          <VuiBox>
            {tabValue === 0 && renderTable(articleRows, articleColumns)}
            {tabValue === 1 && renderTable(questionRows, questionColumns)}
          </VuiBox>

        </Card>
      </VuiBox>
      <ConfirmDialog open={openDialog} onClose={() => setOpenDialog(false)} onConfirm={confirmDelete} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

// ImageLoader component for image handling
function ImageLoader({ src, alt, defaultImageUrl }) {
  const [imageSrc, setImageSrc] = useState(src.replace(/\\/g, "/"));
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    setImageSrc(defaultImageUrl);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div>
      {loading && <Skeleton variant="rectangular" width={40} height={40} />}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          display: loading ? 'none' : 'block',
          objectFit: 'cover',
          width: '100px',
          height: '100px',
        }}
      />
    </div>
  );
}

export default Comment;
