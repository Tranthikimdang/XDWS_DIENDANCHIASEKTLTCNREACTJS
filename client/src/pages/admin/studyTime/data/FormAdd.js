/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import { useForm } from 'react-hook-form';
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import StudyTimeApi from 'src/apis/StudyTimeApI';
import UserApi from 'src/apis/UserApI';
import CoursesApi from 'src/apis/CourseApI';

function FormAddStudyTime() {
  const { register, handleSubmit, formState: { errors }, setError, getValues, setValue } = useForm({
    defaultValues: {
      startdate: new Date().toISOString().split("T")[0], // Set the default startdate to today's date
    },
  });
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch users and courses from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await UserApi.getUsersList();
        const coursesRes = await CoursesApi.getCoursesList();

        setUsers(usersRes.data.users || []);
        setCourses(coursesRes.data.courses || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Custom validation to check the date difference
  const validateDateDifference = (value) => {
    const startdate = getValues("startdate"); // Fetch the startdate from the form values
    const startDate = new Date(startdate);
    const endDate = new Date(value);
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30); // Convert difference to months

    if (diffMonths <= 3) {
      return "Ngày kết thúc phải cách ngày bắt đầu ít nhất 3 tháng.";
    }
    return true;
  };

  const onSubmit = async (data) => {
    if (!data.startdate || !data.enddate) {
      setError("startdate", { type: "manual", message: "Ngày bắt đầu và kết thúc là bắt buộc" });
      setSnackbarMessage("Ngày bắt đầu và kết thúc là bắt buộc");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await StudyTimeApi.addStudyTime({
        user_id: data.user_id,
        course_id: data.course_id,
        startdate: data.startdate,
        enddate: data.enddate,
      });
      setSnackbarMessage("Thêm thời gian học thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/studytime'), 3000); // Redirect after success
    } catch (error) {
      console.error("Error adding study time:", error);
      setSnackbarMessage("Không thêm được thời gian học.");
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

  const smallFontStyle = {
    fontSize: '0.9rem',
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className='text-light form-label'  style={smallFontStyle}>Chọn người dùng</label>
            <select
              className='form-control bg-dark text-light'
              {...register('user_id', { required: "Chọn người dùng là bắt buộc" })}
            >
              <option value="" >Chọn người dùng</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            {errors.user_id && (
              <span className='text-danger' style={smallFontStyle}>{errors.user_id.message}</span>
            )}
          </div>

          <div className='mt-3'>
            <label className='text-light form-label'  style={smallFontStyle}>Chọn khóa học</label>
            <select
              className='form-control bg-dark text-light'
              {...register('course_id', { required: "Chọn khóa học là bắt buộc" })}
            >
              <option value=""  style={smallFontStyle}>Chọn khóa học</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            {errors.course_id && (
              <span className='text-danger' style={smallFontStyle}>{errors.course_id.message}</span>
            )}
          </div>

          <div className='mt-3'>
            <label className='text-light form-label'  style={smallFontStyle}>Ngày bắt đầu</label>
            <input
              className={`form-control bg-dark text-light`}
              style={smallFontStyle}
              type="date"
              {...register('startdate', { required: "Ngày bắt đầu là bắt buộc" })}
            />
            {errors.startdate && (
              <span className='text-danger' style={smallFontStyle}>{errors.startdate.message}</span>
            )}
          </div>

          <div className='mt-3'>
            <label className='text-light form-label'  style={smallFontStyle}>Ngày kết thúc</label>
            <input
              className={`form-control bg-dark text-light`}
              style={smallFontStyle}
              type="date"
              {...register('enddate', { 
                required: "Ngày kết thúc là bắt buộc",
                validate: validateDateDifference,
              })}
            />
            {errors.enddate && (
              <span className='text-danger' style={smallFontStyle}>{errors.enddate.message}</span>
            )}
          </div>

          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Thêm</button>
            <Link to="/admin/studytime" className='btn btn-outline-light ms-3'>Quay lại</Link>
          </div>
        </form>
      </div>
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

export default FormAddStudyTime;
