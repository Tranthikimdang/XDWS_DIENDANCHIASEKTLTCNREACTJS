import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import HashtagApi from "../../../../apis/HashtagApI";

function FormEditHashtag() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const { setError } = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "", // Giá trị mặc định
    },
  });

  // Lấy toàn bộ dữ liệu hashtag và tìm hashtag theo id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allHashtags = await HashtagApi.getHashtags();
        setHashtags(allHashtags);

        const currentHashtag = allHashtags.data.hashtags.find((hashtag) => hashtag.id == id);
        if (currentHashtag) {
          setValue("name", currentHashtag.name); // Gán dữ liệu vào form
        } else {
          console.log("Hashtag không tồn tại");
          // navigate("/admin/hashtag"); // Điều hướng nếu không tìm thấy hashtag
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu hashtag:", error);
      }
    };

    fetchData();
  }, [id, setValue, navigate]);

  const onSubmit = async (formData) => {
    setLoading(true);

    // Kiểm tra trùng tên hashtag, loại trừ hashtag đang chỉnh sửa
    const isNameExists = hashtags.data.hashtags.some(
      (hashtag) => hashtag.id !== id && hashtag.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (!formData.name.startsWith("#")) {
      setError("name", { type: "manual", message: "Hashtag phải bắt đầu bằng dấu #" });
      setSnackbarMessage("Hashtag phải bắt đầu bằng dấu #");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    // if (isNameExists) {
    //   setError("name", { type: "manual", message: "Hashtag đã tồn tại" });
    //   setSnackbarMessage("Hashtag đã tồn tại.");
    //   setSnackbarSeverity("error");
    //   setSnackbarOpen(true);
    //   setLoading(false);
    //   return;
    // }

    try {
      await HashtagApi.updateHashtag(id, { name: formData.name });

      setSnackbarMessage("Cập nhật hashtag thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/admin/hashtag"), 500);
    } catch (error) {
      console.error("Lỗi khi cập nhật hashtag:", error);
      setSnackbarMessage("Cập nhật hashtag thất bại. Vui lòng thử lại.");
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
            <label htmlFor="name" className="text-light form-label">
              Tên hashtag
            </label>
            <input
              className="form-control bg-dark text-light"
              type="text"
              id="name"
              {...register("name", { required: true, minLength: 3, maxLength: 20 })}
              disabled={loading} // Vô hiệu hóa input khi đang xử lý
            />
            {errors.name && errors.name.type === "required" && (
              <span className="text-danger">Tên hashtag là bắt buộc</span>
            )}
            {errors.name && errors.name.type === "minLength" && (
              <span className="text-danger">Tên phải có ít nhất 3 ký tự</span>
            )}
          </div>

          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Sửa"}
            </button>
            <Link to="/admin/hashtag" className="btn btn-outline-light ms-3">
              Quay lại
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

export default FormEditHashtag;
