import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import VuiTypography from "components/VuiTypography";
import authorityApi from "../../../apis/authorityApi"; // Đường dẫn tới api.js
import Snackbar from "@mui/material/Snackbar"; // Nhập Snackbar
import Alert from "@mui/material/Alert"; // Nhập Alert

function FormAdd({ open, handleClose, onAdd }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State cho Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State cho thông điệp
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // State cho mức độ thông điệp

  const onSubmit = async (data) => {
    console.log(data); // Kiểm tra dữ liệu gửi đi
    try {
      // Gọi API để thêm authority mới
      const newAuthority = await authorityApi.add(data);
      console.log(newAuthority); // Kiểm tra phản hồi từ API
      onAdd(newAuthority); // Gọi hàm onAdd từ component cha để cập nhật danh sách

      // Thiết lập thông điệp và mở Snackbar
      setSnackbarMessage("Authority added successfully."); // Thông điệp thành công
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      handleClose(); // Đóng dialog
    } catch (error) {
      console.error("Không thể thêm authority:", error);
      setSnackbarMessage("Failed to add authority."); // Thông điệp thất bại
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Đóng Snackbar
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Authority</DialogTitle>
        <DialogContent sx={{ backgroundColor: "black", color: "white" }}>
          <VuiTypography variant="body2">
            <div className="container">
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ padding: "20px", borderRadius: "8px" }}
              >
                <div className="mb-3">
                  <label className="form-label">Project Name</label>
                  <input
                    className="form-control text-dark"
                    style={{ backgroundColor: "white" }}
                    {...register("name", { required: "Project Name is required" })}
                  />
                  {errors.name && <span className="text-danger">{errors.name.message}</span>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Assigned Role</label>
                  <input
                    className="form-control text-dark"
                    style={{ backgroundColor: "white" }}
                    {...register("assigned", { required: "Assigned Role is required" })}
                  />
                  {errors.assigned && <span className="text-danger">{errors.assigned.message}</span>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Created Date</label>
                  <input
                    className="form-control text-dark"
                    style={{ backgroundColor: "white" }}
                    type="date"
                    {...register("created_date", { required: "Created Date is required" })}
                  />

                  {errors.created_date && (
                    <span className="text-danger">{errors.created_date.message}</span>
                  )}
                </div>
                <div>
                  <input
                    className="form-control text-dark"
                    style={{ backgroundColor: "white" }}
                    type="hidden"
                    value=""
                    {...register("number_of_members")}
                  />
                </div>
                <DialogActions>
                  <Button
                    type="submit"
                    variant="outlined"
                    sx={{ borderColor: "info.main", color: "info.main" }}
                  >
                    Submit
                  </Button>
                  <Button onClick={handleClose} sx={{ color: "error.main" }} variant="outlined">
                    Cancel
                  </Button>
                </DialogActions>
              </form>
            </div>
          </VuiTypography>
        </DialogContent>
      </Dialog>

      {/* Snackbar để hiển thị thông điệp */}
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
    </>
  );
}

export default FormAdd;
