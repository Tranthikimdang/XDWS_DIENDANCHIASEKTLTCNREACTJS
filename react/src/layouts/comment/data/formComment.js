import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import api from '../../../apis/commentApi';
import { Snackbar, Alert } from "@mui/material";

function FormAddCmt() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const history = useHistory();
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const onSubmit = async (data) => {
    try {
      const response = await api.addComment(data);
      console.log('Comment added successfully:', response);
      setSnackbarMessage("Comment added.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/comment'),500); 
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
            <label className='text-light form-label' style={smallFontStyle}>Name</label>
            <input className='form-control bg-dark text-light' {...register('name', { required: true, minLength: 3, maxLength: 20 })} />
            {errors.name && <span className='text-danger'>{errors.name.type === 'required' ? 'Name is required' : errors.name.type === 'minLength' ? 'Name must be at least 3 characters long' : 'Name must be less than 20 characters long'}</span>}
          </div>
          <div>
            <label className='text-light form-label' style={smallFontStyle}>Email</label>
            <input className='form-control bg-dark text-light' {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.email && <span className='text-danger'>{errors.email.type === 'required' ? 'Email is required' : 'Invalid email address'}</span>}
          </div>         
          <div>
            <label className='text-light form-label' style={smallFontStyle}>Description</label>
            <textarea className='form-control bg-dark text-light' {...register('description', { required: true, minLength: 10, maxLength: 100 })} />
            {errors.description && <span className='text-danger'>{errors.description.type === 'required' ? 'Description is required' : errors.description.type === 'minLength' ? 'Description must be at least 10 characters long' : 'Description must be less than 100 characters long'}</span>}
          </div>                  
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
            <button className='text-light btn btn-outline-secondary ms-2' type="button" onClick={() => history.push('/comment')}>Back</button>
          </div>
        </form>
      </div>
      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={500}
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