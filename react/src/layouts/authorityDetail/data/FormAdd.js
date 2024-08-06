import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import authorityDetailApi from "../../../apis/authorityDetailApi";
import VuiTypography from "components/VuiTypography";

function FormAddUserAuthory({ open, onClose, onUserAdded }) {
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
      // Lấy IdAuthority từ URL
      const pathArray = window.location.pathname.split('/');
      const idAuthority = pathArray[pathArray.length - 1];

      // Kiểm tra xem người dùng đã tồn tại trong authorityDetailApi chưa
      const existingUserResponse = await authorityDetailApi.getUserByEmail(formData.email);
      const existingUser = existingUserResponse.data;

      if (existingUser) {
        setSnackbarMessage("User with provided email already exists in authority details.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Dừng lại nếu người dùng đã tồn tại
      }

      // Kiểm tra nếu email tồn tại trong userApi
      const response = await authorityDetailApi.getUserByEmail(formData.email);
      const user = response;

      if (user) {
        // Nếu người dùng tồn tại, thêm IdAuthority vào dữ liệu người dùng
        const userData = {
          ...user,
          IdAuthority: idAuthority,
        };

        // Thêm vào authorityDetailApi
        const addResponse = await authorityDetailApi.addUser(userData);
        setSnackbarMessage("User added successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Notify parent component about the new user
        onUserAdded(addResponse.data); // Giả sử dữ liệu người dùng mới nằm trong addResponse.data

        // Đợi một chút trước khi đóng dialog
        setTimeout(() => {
          onClose();
        }, 500); // Thay đổi thời gian nếu cần

      } else {
        // Nếu người dùng không tồn tại, hiển thị thông báo lỗi
        setSnackbarMessage("User with provided email does not exist in user database.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setSnackbarMessage(error.response?.data?.message || "Failed to add user.");
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
    <Dialog open={open} onClose={onClose} sx={{ backgroundColor: "white", color: "black" }}>
      <DialogTitle sx={{ backgroundColor: "white", color: "black" }}>Add User</DialogTitle>
      <DialogContent sx={{ backgroundColor: "white", color: "black" }}>
        <VuiTypography variant="body2">
          <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="form-label" style={{ color: "black" }}>
                  Email
                </label>
                <input
                  className="form-control"
                  style={{ backgroundColor: "white", color: "black" }}
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
              <div className="mt-3">
                <button
                  className="btn btn-outline-info"
                  style={{ backgroundColor: "white", color: "black", margin: "10px" }}
                  type="submit"
                >
                  Add User
                </button>
                <button
                  onClick={onClose}
                  style={{ border: '1px solid red', backgroundColor: "white", color: "black" }}
                  variant="outlined"
                  className="btn btn-outline-info"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </VuiTypography>
      </DialogContent>

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
    </Dialog>
  );
}

export default FormAddUserAuthory;
