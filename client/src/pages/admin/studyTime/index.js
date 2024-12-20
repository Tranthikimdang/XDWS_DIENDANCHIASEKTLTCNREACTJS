import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import DashboardLayout from 'src/examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'src/examples/Navbars/DashboardNavbar';
import Footer from 'src/examples/Footer';
import Table from 'src/examples/Tables/Table';
import { Alert, IconButton, Snackbar, Tooltip } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import SearchIcon from '@mui/icons-material/Search';
import VuiInput from 'src/components/admin/VuiInput';
import StudyTimeApi from 'src/apis/StudyTimeApI';
import UserApi from 'src/apis/UserApI';
import CoursesApi from 'src/apis/CourseApI';
import { format } from 'date-fns';

function StudyTime() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studyTimesRes = await StudyTimeApi.getStudyTimesList();
        const usersRes = await UserApi.getUsersList();
        const coursesRes = await CoursesApi.getCoursesList();

        const studyTimes = studyTimesRes.data.studyTimes || [];
        const users = usersRes.data.users || [];
        const courses = coursesRes.data.courses || [];

        // Ánh xạ thêm user_name và course_name
        const mappedStudyTimes = studyTimes.map((studyTime) => {
          const user = users.find((u) => u.id == studyTime.user_id);
          const course = courses.find((c) => c.id == studyTime.course_id); // In ra khóa học được tìm thấy

          return {
            ...studyTime,
            user_name: user ? user.name : 'Unknown User',
            course_name: course ? course.name : 'Unknown Course',
          };
        });

        setRows(mappedStudyTimes);
        setUsers(users);
        setCourses(courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      try {
        await StudyTimeApi.deleteStudyTime(id); // API gọi xóa dữ liệu
        setRows(rows.filter((row) => row.id !== id)); // Cập nhật lại danh sách dữ liệu
        setSnackbarSeverity('success');
        setSnackbarMessage('Xóa thành công!');
      } catch (error) {
        console.error('Error deleting record:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Có lỗi xảy ra khi xóa!');
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const filteredRows = rows.filter((row) =>
    (row.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()),
  );

  return (
    <VuiBox display="flex" flexDirection="column" minHeight="100vh">
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox py={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Bảng thời gian học
              </VuiTypography>
              <VuiBox mb={1}>
                <VuiInput
                  placeholder="Tìm kiếm..."
                  icon={{ component: <SearchIcon />, direction: 'left' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </VuiBox>
            </VuiBox>
            <VuiBox mb={2} display="flex" justifyContent="flex-end">
              <Link to="/admin/addStudyTime">
                <Tooltip title="Thêm hashtag" placement="top">
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
                        fillRule="evenodd"
                        d="M8 1.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM8 14.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-.5.5zM14.5 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"
                      />
                    </svg>
                  </button>
                </Tooltip>
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
              <Table
                columns={[
                  { name: 'user_name', align: 'left' },
                  { name: 'course_name', align: 'left' },
                  { name: 'startdate', align: 'left' },
                  { name: 'enddate', align: 'left' },
                  { name: 'actions', align: 'center' },
                ]}
                rows={filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => ({
                    no: page * rowsPerPage + index + 1, // Display the row number
                    user_name: row.user_name, // Display the user's name
                    course_name: row.course_name, // Display the course name
                    startdate: format(new Date(row.startdate), 'dd/MM/yyyy'), // Format startdate
                    enddate: format(new Date(row.enddate), 'dd/MM/yyyy'), // Format enddate
                    actions: (
                      <div>
                        <Tooltip title="Xóa hashtag" placement="top">
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
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                            </svg>
                          </button>
                        </Tooltip>
                      </div>
                    ),
                  }))}
                pagination={{
                  count: filteredRows.length,
                  page: page,
                  rowsPerPage: rowsPerPage,
                  onPageChange: (event, newPage) => setPage(newPage),
                  onRowsPerPageChange: (event) => setRowsPerPage(parseInt(event.target.value, 10)),
                }}
              />
            )}
          </Card>
        </VuiBox>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Footer />
      </DashboardLayout>
    </VuiBox>
  );
}

export default StudyTime;
