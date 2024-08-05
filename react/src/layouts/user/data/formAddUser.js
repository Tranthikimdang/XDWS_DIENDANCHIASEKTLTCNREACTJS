import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import api from "../../../apis/userApi"; 

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
    try {
      const response = await api.addUser(formData);
      console.log("User added successfully:", response);
      setSnackbarMessage("User added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/user'),1000); 

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
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-light form-label">Name</label>
            <input
              className="form-control bg-dark text-light"
              {...register("name", { required: true, minLength: 3, maxLength: 50 })}
            />
            {errors.name && errors.name.type === "required" && (
              <span className="text-danger">Name is required</span>
            )}
            {errors.name && errors.name.type === "minLength" && (
              <span className="text-danger">Name must be at least 3 characters long</span>
            )}
            {errors.name && errors.name.type === "maxLength" && (
              <span className="text-danger">Name must be less than 50 characters long</span>
            )}
          </div>
          <div>
            <label className="text-light form-label">Email</label>
            <input
              className="form-control bg-dark text-light"
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              })}
            />
            {errors.email && errors.email.type === "required" && (
              <span className="text-danger">Email is required</span>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <span className="text-danger">Invalid email address</span>
            )}
          </div>
          <div>
            <label className="text-light form-label">Location</label>
            <input
              className="form-control bg-dark text-light"
              {...register("location", { required: true })}
            />
            {errors.location && <span className="text-danger">Location is required</span>}
          </div>
          <div>
            <label className="text-light form-label">Phone Number</label>
            <input
              className="form-control bg-dark text-light"
              {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
            />
            {errors.phone && errors.phone.type === "required" && (
              <span className="text-danger">Phone number is required</span>
            )}
            {errors.phone && errors.phone.type === "pattern" && (
              <span className="text-danger">Invalid phone number</span>
            )}
          </div>
          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit">
              Add User
            </button>
          </div>
        </form>
      </div>
      {/* Snackbar for notifications */}
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
