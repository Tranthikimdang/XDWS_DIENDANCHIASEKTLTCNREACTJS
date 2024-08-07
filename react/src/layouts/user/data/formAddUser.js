import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import api from "../../../apis/userApi";
import "../index.css"; 

function FormAddUser() {
  const history = useHistory();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    console.log("Form Data:", formData);
    try {
      const response = await api.addUser(formData);
      console.log("User added successfully:", response);
      setSnackbarMessage("User added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push("/user"), 1000);
    } catch (error) {
      console.error("Error adding user:", error);
      setSnackbarMessage("Failed to add user.");
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container small-text">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields */}
          <div className="row">
            {/* Full Name */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Full Name</label>
              <input
                className="form-control bg-dark text-light"
                {...register("name", { required: true, minLength: 3, maxLength: 50 })}
              />
              {errors.name && <span className="text-danger">Name is required and must be between 3 and 50 characters long</span>}
            </div>
            {/* Email */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Email</label>
              <input
                className="form-control bg-dark text-light"
                {...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                })}
              />
              {errors.email && <span className="text-danger">Valid email is required</span>}
            </div>
          </div>
          <div className="row">
            {/* Location */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Location</label>
              <input
                className="form-control bg-dark text-light"
                {...register("location", { required: true })}
              />
              {errors.location && <span className="text-danger">Location is required</span>}
            </div>
            {/* Phone Number */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Phone Number</label>
              <input
                className="form-control bg-dark text-light"
                {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
              />
              {errors.phone && <span className="text-danger">Valid phone number is required</span>}
            </div>
          </div>
         
          <div className="row">
            {/* Password */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Password</label>
              <input
                type="password"
                className="form-control bg-dark text-light"
                {...register("password", { required: true, minLength: 6 })}
              />
              {errors.password && <span className="text-danger">Password must be at least 6 characters long</span>}
            </div>
            {/* Role */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Role</label>
              <select className="form-control bg-dark text-light" {...register("role", { required: true })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <span className="text-danger">Role is required</span>}
            </div>
          </div>
          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">
              Add User
            </button>
            <button className="text-light btn btn-outline-secondary" type="button" onClick={() => history.push("/user")}>
              Back
            </button>
          </div>
        </form>
      </div>

      {/* Snackbar for notifications */}
      <Footer />

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

export default FormAddUser;
