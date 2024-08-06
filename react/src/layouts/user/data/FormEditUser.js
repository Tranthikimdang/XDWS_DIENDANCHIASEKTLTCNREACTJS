import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation, useHistory } from 'react-router-dom';
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
      birthday: data?.birthday || "",
      cardId: data?.cardId || "",
      password: data?.password || "",
      role: data?.role || "user",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("location", data.location);
      setValue("phone", data.phone);
      setValue("birthday", data.birthday);
      setValue("cardId", data.cardId);
      setValue("password", data.password);
      setValue("role", data.role);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
      const response = await api.updateUser(data.id, formData);
      console.log("User updated successfully:", response);
      setSnackbarMessage("User updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/user'), 1000); 
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                type="email"
                {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
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
                {...register("location", { required: true, minLength: 2, maxLength: 50 })}
              />
              {errors.location && <span className="text-danger">Location is required and must be between 2 and 50 characters long</span>}
            </div>
            {/* Phone Number */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Phone Number</label>
              <input
                className="form-control bg-dark text-light"
                type="tel"
                {...register("phone", { required: true, pattern: /^[0-9]{10,15}$/ })}
              />
              {errors.phone && <span className="text-danger">Phone number must be between 10 and 15 digits long</span>}
            </div>
          </div>
          <div className="row">
            {/* Birthday */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Birthday</label>
              <input
                type="date"
                className="form-control bg-dark text-light"
                {...register("birthday", { required: true })}
              />
              {errors.birthday && <span className="text-danger">Birthday is required</span>}
            </div>
            {/* Card ID */}
            <div className="col-md-6 mb-3">
              <label className="text-light form-label">Card ID</label>
              <input
                type="number"
                className="form-control bg-dark text-light"
                {...register("cardId", { required: true, minLength: 10, maxLength: 12 })}
              />
              {errors.cardId && <span className="text-danger">Card ID must be between 10 and 12 digits long</span>}
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
              Edit User
            </button>
            <button className="text-light btn btn-outline-secondary" type="button" onClick={() => history.push('/user')}>
              Back
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
