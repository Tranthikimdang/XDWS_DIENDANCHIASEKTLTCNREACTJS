/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import { useForm } from 'react-hook-form';
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import { collection, addDoc, getDocs } from "firebase/firestore";
import   { db, storage } from "../../../../config/firebaseconfig.js";


function FormAddCate() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [categories, setCategories] = useState([]);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    const isNameExists = categories.some(category => category.name.toLowerCase() === data.name.toLowerCase());
    
    if (isNameExists) {
      // Set error for duplicate category name with smaller font style
      setError("name", { type: "manual", message: "Tên đã ton tại" });
      setSnackbarMessage("Tên đã ton tại");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: data.name,  
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);

      setSnackbarMessage("Đã thêm danh mục thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/category'), 3000);
    } catch (error) {
      console.error('Error adding category:', error);
      setSnackbarMessage("Không thêm được danh mục.");
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
            <label className='text-light form-label'>Category name</label>
            <input 
              className={`form-control bg-dark text-light`} 
              style={smallFontStyle} 
              {...register('name', { required: true, minLength: 3 })}
            />
            {/* Error message for required and minLength validations */}
            {errors.name && errors.name.type === 'required' && (
              <span className='text-danger' style={smallFontStyle}>Tên danh mục là bắt buộc</span>
            )}
            {errors.name && errors.name.type === 'minLength' && (
              <span className='text-danger' style={smallFontStyle}>Tên phải có ít nhất 3 ký tự</span>
            )}
            {/* Error message for duplicate category name */}
            {errors.name && errors.name.type === 'manual' && (
              <span className='text-danger' style={smallFontStyle}>{errors.name.message}</span>
            )}
          </div>
          
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
            <Link to="/admin/category" className='btn btn-outline-light ms-3'>Back</Link>
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

export default FormAddCate;

