import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation, useHistory } from "react-router-dom";
import api from "../../../apis/commentDetailApi";
import { Snackbar, Alert } from "@mui/material";

function FormEditCmt() {
  const location = useLocation();
  const { data } = location.state || {};
  const history = useHistory();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [user, setUser] = useState(""); 

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: data?.content || "",
    },
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }   
  }, []);

  useEffect(() => {
    if (data) {
      setValue("content", data.content);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
    const currentDate = new Date().toISOString().split('T')[0]; 
      const requestData = {
        user_name: user.name, 
        content: formData.content,
        created_date: data.created_date,         
        updated_date: currentDate  
      };
  
      const response = await api.updateComment(data.id, requestData);
      console.log("Comment updated successfully:", response);
      setSnackbarMessage("Comment updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/commentDetail'), 500);
    } catch (error) {
      console.error("Error updating comment:", error.response ? error.response.data : error.message);
      setSnackbarMessage("Failed to update comment.");
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
            <label className='text-light form-label' style={smallFontStyle}>User Name</label>
            <input className='form-control bg-dark text-light' value={user?.name || ''} readOnly />
          </div>         
          <div>
            <label className='text-light form-label' style={smallFontStyle}>Content</label>
            <textarea className='form-control bg-dark text-light' {...register('content', { required: true, minLength: 10, maxLength: 100 })} />
            {errors.content && <span className='text-danger'>{errors.content.type === 'required' ? 'Content is required' : errors.content.type === 'minLength' ? 'Content must be at least 10 characters long' : 'Content must be less than 100 characters long'}</span>}
          </div>            
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Update</button>
            <button className='text-light btn btn-outline-secondary ms-2' type="button" onClick={() => history.push('/commentDetail')}>Back</button>
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

export default FormEditCmt;
