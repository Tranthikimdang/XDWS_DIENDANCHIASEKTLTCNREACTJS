import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card } from '@mui/material';
import { Link } from 'react-router-dom';
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import Footer from "src/examples/Footer";
import Table from "src/examples/Tables/Table";
import { courseColumns, questionColumns } from './data/authorsTableData';
import { Alert, Snackbar } from "@mui/material";
import { ClipLoader } from "react-spinners";
import Skeleton from '@mui/material/Skeleton';
import 'src/pages/admin/comment/index.css';
import CourseApi from 'src/apis/CourseApI';
import QuestionApi from 'src/apis/QuestionsApis';
const { getCoursesList } = CourseApi;
const { getQuestionsList } = QuestionApi;

function Comment() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(4);
  const [tabValue, setTabValue] = useState(0);
  const [courseRows, setCourseRows] = useState([]);
  const [questionRows, setQuestionRows] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Fetch API
        const courseResponse = await getCoursesList();
        const questionResponse = await getQuestionsList();

        // Log full response to debug
        console.log("Courses response:", courseResponse);
        console.log("Questions response:", questionResponse);

        // Extract data safely
        const courseList = Array.isArray(courseResponse.data)
          ? courseResponse.data.map(item => ({
            id: item.id,
            ...item,
            updated_at: item.updated_at || null,
          }))
          : courseResponse.data.courses.map(item => ({
            id: item.id,
            ...item,
            updated_at: item.updated_at || null,
          })); // Adjust based on actual structure

        const questionList = Array.isArray(questionResponse.data)
          ? questionResponse.data.map(item => ({
            id: item.id,
            ...item,
            updated_at: item.updated_at || null,
          }))
          : questionResponse.data.questions.map(item => ({
            id: item.id,
            ...item,
            updated_at: item.updated_at || null,
          })); // Adjust based on actual structure
        console.log("Questions updated_at:", questionResponse.data);

        setCourseRows(courseList);
        setQuestionRows(questionList);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const removeHtmlTags = (html) => html?.replace(/<[^>]+>/g, '');

  const defaultImageUrl = "/path/to/default/image.png"; // Replace with your actual default image

  const formatUpdatedAt = (row) => {
    const updatedAt = row.updated_at || row.updatedAt;
  
    if (!updatedAt) return 'Unknown time';
  
    // Check if it's a string or timestamp
    let date;
    if (updatedAt.seconds) {
      // Firebase timestamp
      date = new Date(updatedAt.seconds * 1000);
    } else if (typeof updatedAt === 'string') {
      // Date string
      date = new Date(updatedAt);
    } else if (updatedAt instanceof Date) {
      // Date object
      date = updatedAt;
    } else {
      // Invalid date format
      return 'Invalid date';
    }
  
    if (isNaN(date.getTime())) return 'Invalid date'; // Handle invalid date
  
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
  const renderTable = (rows, columns, tabValue) => (
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
                  <img
                    src={`${row.image}`}
                    alt={
                      row.name && row.name.length > 10
                        ? `${row.name.substring(0, 10).toUpperCase()}...`
                        : row.name
                          ? row.name.toUpperCase()
                          : 'Image of the Product'
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
              </div>
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
            questions: (
              <VuiTypography variant="caption" color="text">
                {removeHtmlTags(row?.questions || "").length > 50
                  ? `${removeHtmlTags(row.questions).substring(0, 50)}...`
                  : removeHtmlTags(row.questions || "")}
              </VuiTypography>
            ),
            date: (
              <VuiTypography variant="caption" color="text">
                {console.log(row)}  {/* Debugging log */}
                {formatUpdatedAt(row)}
              </VuiTypography>
            ),            
            action: (
              <>
                {tabValue === 0 ? ( // Kiểm tra nếu tab là "Khóa học"
                  <Link to={`/admin/commentDetail/${row.id}?type=course`}>
                    <button className="text-light btn btn-outline-primary me-2" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                      </svg>
                    </button>
                  </Link>
                ) : ( // Nếu tab là "Câu hỏi"
                  <Link to={`/admin/commentDetail/${row.id}?type=question`}>
                    <button className="text-light btn btn-outline-primary me-2" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                      </svg>
                    </button>
                  </Link>
                )}
              </>
            )


          }))}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No comments available.</p>
        </div>
      )}
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
  );

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
  return (
    <VuiBox
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Chiều cao tối thiểu toàn bộ màn hình
    >
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox py={3} className="tabs-container" sx={{ padding: 0, margin: 0 }} >
          <Card>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="comment management tabs" >
              <Tab label=" Bảng bình luận khóa học " />
              <Tab label="Bảng bình luận câu hỏi " />
            </Tabs>

            <VuiBox>
              {tabValue === 0 && renderTable(courseRows, courseColumns, tabValue)}
              {tabValue === 1 && renderTable(questionRows, questionColumns, tabValue)}
            </VuiBox>

          </Card>
        </VuiBox>
        {/* <ConfirmDialog open={openDialog} onClose={() => setOpenDialog(false)} onConfirm={confirmDelete} /> */}
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
      {/* Footer cố định */}
      <Footer />
    </VuiBox>
  );
}



export default Comment;
