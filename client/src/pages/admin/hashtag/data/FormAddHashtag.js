/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import { useForm } from 'react-hook-form';
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import HashtagApi from "../../../../apis/HashtagApI"; // API mới của bạn

function FormAddHashtag() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [hashtags, setHashtags] = useState([]);

  // Fetch hashtags từ API
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const hashtagsList = await HashtagApi.getHashtagsList(); // Gọi API
        setHashtags(hashtagsList);
      } catch (error) {
        console.error("Error fetching hashtags:", error);
      }
    };

    fetchHashtags();
  }, []);

  const onSubmit = async (data) => {
    const isNameExists = hashtags.some(
      (hashtag) => hashtag.name.toLowerCase() === data.name.toLowerCase()
    );
    if (!data.name.startsWith("#")) {
      setError("name", { type: "manual", message: "Hashtag phải bắt đầu bằng dấu #" });
      setSnackbarMessage("Hashtag phải bắt đầu bằng dấu #");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    // Kiểm tra định dạng hashtag, cho phép bắt đầu bằng dấu #
    const hashtagPattern = /^#[a-zA-Z0-9_]+$/; // Cho phép # ở đầu và theo sau là chữ cái, số, hoặc dấu gạch dưới
    if (!hashtagPattern.test(data.name)) {
      setError("name", {
        type: "manual",
        message: "Tên hashtag không hợp lệ. Phải bắt đầu bằng #, chỉ chứa chữ cái, số và dấu gạch dưới.",
      });
      setSnackbarMessage("Tên hashtag không hợp lệ. Phải bắt đầu bằng #, chỉ chứa chữ cái, số và dấu gạch dưới.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  
    if (isNameExists) {
      setError("name", { type: "manual", message: "Tên đã tồn tại" });
      setSnackbarMessage("Tên đã tồn tại");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      await HashtagApi.addHashtag({ name: data.name });
      setSnackbarMessage("Đã thêm hashtag thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/hashtag'), 3000);
    } catch (error) {
      console.error("Error adding hashtag:", error);
      setSnackbarMessage("Không thêm được hashtag.");
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
            <label className='text-light form-label'>Hashtag name</label>
            <input 
              className={`form-control bg-dark text-light`} 
              style={smallFontStyle} 
              {...register('name', { required: true, minLength: 3 })}
            />
            {errors.name && errors.name.type === 'required' && (
              <span className='text-danger' style={smallFontStyle}>Tên hashtag là bắt buộc</span>
            )}
            {errors.name && errors.name.type === 'minLength' && (
              <span className='text-danger' style={smallFontStyle}>Tên phải có ít nhất 3 ký tự</span>
            )}
            {errors.name && errors.name.type === 'manual' && (
              <span className='text-danger' style={smallFontStyle}>{errors.name.message}</span>
            )}
          </div>
          
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
            <Link to="/admin/hashtag" className='btn btn-outline-light ms-3'>Back</Link>
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

export default FormAddHashtag;
