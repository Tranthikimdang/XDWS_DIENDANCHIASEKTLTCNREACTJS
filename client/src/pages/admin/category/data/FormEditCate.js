import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseconfig";

function FormEditCate() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // Dữ liệu danh mục
  const [categories, setCategories] = useState([]);
  const { setError } = useForm();

  console.log(categories);
  
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

  // Lấy dữ liệu danh mục dựa trên ID từ Firestore
  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        const categoryDocRef = doc(db, "categories", id);
        const categoryDoc = await getDoc(categoryDocRef);
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data();
          setData(categoryData); // Lưu dữ liệu vào state
          setValue("name", categoryData.name); // Gán dữ liệu vào form
        } else {
          console.log("Danh mục không tồn tại");
          navigate("/admin/category"); // Điều hướng nếu không tìm thấy danh mục
        }
      }
    };

    fetchCategory();
  }, [id, setValue, navigate]);

  const onSubmit = async (formData) => {
    setLoading(true);
    const isNameExists = categories.some(category => category.name.toLowerCase() === data.name.toLowerCase());
    
    if (isNameExists) {
      // Set error for duplicate category name with smaller font style
      setError("name", { type: "manual", message: "Category name already exists." });
      setSnackbarMessage("Category name already exists.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {
      const categoryDocRef = doc(db, "categories", id);
      await updateDoc(categoryDocRef, { name: formData.name });

      setSnackbarMessage("Cập nhật danh mục thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/admin/category"), 500);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      setSnackbarMessage("Cập nhật danh mục thất bại. Vui lòng thử lại.");
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
              Tên danh mục
            </label>
            <input
              className="form-control bg-dark text-light"
              type="text"
              id="name"
              {...register("name", { required: true, minLength: 3, maxLength: 20 })}
              disabled={loading} // Vô hiệu hóa input khi đang xử lý
            />
            {errors.name && errors.name.type === "required" && (
              <span className="text-danger">Tên danh mục là bắt buộc</span>
            )}
            {errors.name && errors.name.type === "minLength" && (
              <span className="text-danger">Tên phải có ít nhất 3 ký tự</span>
            )}
            {/* {errors.name && errors.name.type === "maxLength" && (
              <span className="text-danger">Tên phải có ít hơn 20 ký tự</span>
            )} */}
          </div>

          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Sửa"}
            </button>
            <Link to="/admin/category" className="btn btn-outline-light ms-3">
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

export default FormEditCate;
