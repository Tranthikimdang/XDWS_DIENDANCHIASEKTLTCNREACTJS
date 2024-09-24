import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation, Link, useHistory } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import  { db, storage } from "../../../config/firebaseconfig";

function FormEditCate() {
  const location = useLocation();
  const { data } = location.state || {};
  const history = useHistory();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

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

  // Prepopulate form with category data if available
  useEffect(() => {
    if (data) {
      setValue("name", data.name);
    } else {
      history.push("/categorypro"); // Redirect if no data
    }
  }, [data, setValue, history]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      // Firebase Firestore update
      const categoryDocRef = doc(db, "categories_product", data.id);
      await updateDoc(categoryDocRef, { name: formData.name });

      setSnackbarMessage("Category updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Delay redirect to allow snackbar to display
      setTimeout(() => history.push("/categorypro"), 500);
    } catch (error) {
      console.error("Error updating category:", error);
      setSnackbarMessage("Failed to update category.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
            <label className="text-light form-label">Category name</label>
            <input
              className="form-control bg-dark text-light"
              type="text"
              id="name"
              {...register("name", { required: true, minLength: 3, maxLength: 20 })}
            />
            {errors.name && errors.name.type === "required" && (
              <span className="text-danger">Category is required</span>
            )}
            {errors.name && errors.name.type === "minLength" && (
              <span className="text-danger">Name must be at least 3 characters long</span>
            )}
            {errors.name && errors.name.type === "maxLength" && (
              <span className="text-danger">Name must be less than 20 characters long</span>
            )}
          </div>

          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Edit"}
            </button>
            <Link to="/categorypro" className="btn btn-outline-light ms-3">
              Back
            </Link>
          </div>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
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


