import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import api from "../../../apis/userApi"; // Update the API import to your users API

function FormEditUser() {
  const location = useLocation();
  const { data } = location.state || {};
  const history = useHistory();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      location: data?.location || "",
      phone: data?.phone || "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("location", data.location);
      setValue("phone", data.phone);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
      const response = await api.updateUser(data.id, formData);
      console.log("User updated successfully:", response);
      setSnackbarMessage("User updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/user'),1000); 
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage("Failed to update user.");
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
    fontSize: "0.9rem",
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
          <div>
            <label className="text-light form-label">Email</label>
            <input
              className="form-control bg-dark text-light"
              type="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && errors.email.type === "required" && (
              <span className="text-danger">Email is required</span>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <span className="text-danger">Invalid email format</span>
            )}
          </div>
          <div>
            <label className="text-light form-label">Location</label>
            <input
              className="form-control bg-dark text-light"
              {...register("location", { required: true, minLength: 2, maxLength: 50 })}
            />
            {errors.location && errors.location.type === "required" && (
              <span className="text-danger">Location is required</span>
            )}
            {errors.location && errors.location.type === "minLength" && (
              <span className="text-danger">Location must be at least 2 characters long</span>
            )}
            {errors.location && errors.location.type === "maxLength" && (
              <span className="text-danger">Location must be less than 50 characters long</span>
            )}
          </div>
          <div>
            <label className="text-light form-label">Phone</label>
            <input
              className="form-control bg-dark text-light"
              type="tel"
              {...register("phone", { required: true, pattern: /^[0-9]{10,15}$/ })}
            />
            {errors.phone && errors.phone.type === "required" && (
              <span className="text-danger">Phone is required</span>
            )}
            {errors.phone && errors.phone.type === "pattern" && (
              <span className="text-danger">Phone number must be 10 to 15 digits long</span>
            )}
          </div>
          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit">
              Edit
            </button>
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

export default FormEditUser;
