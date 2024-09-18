import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation, Link, useHistory } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

// Import Firebase Firestore functions
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseconfig.js";

function FormEditCate() {
  const location = useLocation();
  const history = useHistory();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [category, setCategory] = useState(location.state?.data || {});
  const [loading, setLoading] = useState(false);
import { useLocation, Link } from "react-router-dom";
import api from "../../../apis/categoriesApi";
import { Snackbar, Alert } from "@mui/material";

function FormEditCate() {
  const location = useLocation();
  const { data } = location.state || {};
  const history = useHistory();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (!category) {
      history.push("/category"); // Redirect if no category is passed
    } else {
      setValue("name", category.name); // Prepopulate the form with the existing category name
    }
  }, [category, history, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const categoryDocRef = doc(db, "categories", category.id);
      await updateDoc(categoryDocRef, { name: data.name });
      setSnackbarMessage("Category updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      history.push("/category");
    } catch (error) {
      console.error("Error updating category:", error);
      setSnackbarMessage("Failed to update category.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name || "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
      const response = await api.updateCategory(data.id, formData);
      console.log("Category updated successfully:", response);
      setSnackbarMessage("Article added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/category'), 500);
    } catch (error) {
      console.error("Error updating category:", error);
      setSnackbarMessage("Failed to add category.");
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
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-light form-label">Category name</label>
            <input
              className="form-control bg-dark text-light"
              type="text"
              id="name"
              {...register("name", { required: true, minLength: 3, maxLength: 20 })}
            />
            {errors.name && errors.name.type === "required" && (
              <span className="text-danger"style={smallFontStyle}>Category is required</span>
            )}
           
          </div>
          <div className='mt-3'>
          <button className='text-light btn btn-outline-info' type="submit" disabled={loading}>
              {loading ? "Updating..." : "Edit"}
            </button>
            <Link to="/category" className='btn btn-outline-light ms-3'>Back</Link>
              {...register("name", { required: true, minLength: 3, maxLength: 20 })}
            />
            {errors.name && errors.name.type === "required" && (
              <span className="text-danger">Name is required</span>
            )}
            {errors.name && errors.name.type === "minLength" && (
              <span className="text-danger">Name must be at least 3 characters long</span>
            )}
            {errors.name && errors.name.type === "maxLength" && (
              <span className="text-danger">Name must be less than 20 characters long</span>
            )}
          </div>
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Edit</button>
            <Link to="/article" className='btn btn-outline-light ms-3'>Back</Link>
          </div>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
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

export default FormEditCate;

