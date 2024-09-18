import React, { useState, useEffect } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from 'react-hook-form';
import { useHistory,useLocation } from 'react-router-dom';
import api from '../../../apis/commentDetailApi';
import { Snackbar, Alert } from "@mui/material";

function formAddQuestions() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const history = useHistory();
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [user, setUser] = useState(""); // User state

  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }   
  }, []);

  const onSubmit = async (data) => {
    const currentDate = new Date().toISOString().split('T')[0]; 
    const commentData = {
      ...data,
      article_id:id,
      user_name: user?.name,  
      created_date: currentDate,
      updated_date: currentDate
    };
    
    console.log('Comment data:', commentData);
    
    try {
      const response = await api.addComment(commentData);
      console.log('Comment added successfully:', response);
      setSnackbarMessage("Comment added.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/commentDetail',{ id:id }), 1000); 
    } catch (error) {
      console.error('Error adding comment:', error);
      setSnackbarMessage("Failed to add comment.");
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
    fontSize: '0.9rem'
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div>
            <label className='text-light form-label' style={smallFontStyle}>Article ID</label>
            <input className='form-control bg-dark text-light'  />
          </div> */}
          <div>
            <label className='text-light form-label' style={smallFontStyle}>User Name</label>
            <input className='form-control bg-dark text-light' value={user?.name || ''} readOnly />
          </div>         
          <div>
            <label className='text-light form-label' style={smallFontStyle}>Content</label>
            <textarea className='form-control bg-dark text-light' {...register('content', { required: true, minLength: 10, maxLength: 100 })} />
            {errors.content && <span className='text-danger'>{errors.content.type === 'required' ? 'Content is required' : errors.content.type === 'minLength' ? 'Content must be at least 10 characters long' : 'Content must be less than 100 characters long'}</span>}
          </div>            
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
            <button className='text-light btn btn-outline-secondary ms-2' type="button" onClick={() => history.push('/commentDetail',{ id: id })}>Back</button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
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

export default formAddQuestions;
