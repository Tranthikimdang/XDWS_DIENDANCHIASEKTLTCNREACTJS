import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import api from '../../../apis/commentDetailApi';
import { Snackbar, Alert } from "@mui/material";

function FormAddCmt() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const history = useHistory();
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const onSubmit = async (data) => {
    const currentDate = new Date().toISOString().split('T')[0]; 
    data.created_date = currentDate;
    data.updated_date = currentDate;
    
    try {
      const response = await api.addComment(data);
      console.log('Comment added successfully:', response);
      setSnackbarMessage("Comment added.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/commentDetail'), 1000); 
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
          <div>
            <label className='text-light form-label' style={smallFontStyle}>Article ID</label>
            <input className='form-control bg-dark text-light' {...register('article_id', { required: true })} />
            {errors.article_id && <span className='text-danger'>Article ID is required</span>}
          </div>
          <div>
            <label className='text-light form-label' style={smallFontStyle}>User ID</label>
            <input className='form-control bg-dark text-light' {...register('user_id', { required: true })} />
            {errors.user_id && <span className='text-danger'>User ID is required</span>}
          </div>         
          <div>
            <label className='text-light form-label' style={smallFontStyle}>Content</label>
            <textarea className='form-control bg-dark text-light' {...register('content', { required: true, minLength: 10, maxLength: 100 })} />
            {errors.content && <span className='text-danger'>{errors.content.type === 'required' ? 'Content is required' : errors.content.type === 'minLength' ? 'Content must be at least 10 characters long' : 'Content must be less than 100 characters long'}</span>}
          </div>            
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
            <button className='text-light btn btn-outline-secondary ms-2' type="button" onClick={() => history.push('/comment')}>Back</button>
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

export default FormAddCmt;
