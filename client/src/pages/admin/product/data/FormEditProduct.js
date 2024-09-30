import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseconfig";

function FormEditProduct() {
  const location = useLocation();
  const { data } = location.state || {};
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState("");
  const [imagePreview, setImagePreview] = useState(data?.image || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "categories_product"));
        const categoriesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(categoriesList); // Kiểm tra dữ liệu lấy về
        setCates(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error); // In ra lỗi nếu có
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: data?.user_id || "",
      image: data?.image || "",
      title: data?.title || "",
      categories_id: data?.categories_id || "",
      content: data?.content || "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("content", data.content || "");
      setValue("categories_id", data.categories_id || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
      const formDataWithImage = new FormData();

      for (const key in formData) {
        if (key === "image" && formData[key].length > 0) {
          formDataWithImage.append("image", formData[key][0]);
        } else {
          formDataWithImage.append(key, formData[key]);
        }
      }

      // Tạo reference đến document cần cập nhật
      const productRef = doc(db, "products", data.id); // Giả định bạn lưu sản phẩm trong collection "products"

      // Cập nhật dữ liệu vào Firestore
      await updateDoc(productRef, {
        title: formData.title,
        categories_id: formData.categories_id,
        content: formData.content,
        image: formDataWithImage.get("image") || data.image, // Nếu có hình ảnh mới, sử dụng hình ảnh mới, nếu không giữ lại hình ảnh cũ
      });

      setSnackbarMessage("Product updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/product"), 500);
    } catch (error) {
      console.error("Error updating Product:", error);
      setSnackbarMessage("Failed to update Product.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
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
        <form onSubmit={handleSubmit(onSubmit)} method="post" encType="multipart/form-data">
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Name
              </label>
              <input
                className="form-control bg-dark text-light"
                style={smallFontStyle}
                value={user?.name || ""}
                readOnly
              />
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Title
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.title ? "is-invalid" : ""}`}
                {...register("title", { required: "Title is required" })}
                style={smallFontStyle}
              />
              {errors.title && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.title.message}
                </span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Image
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? "is-invalid" : ""}`}
                type="file"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "160px", height: "auto" }}
                  />
                </div>
              )}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Category product
              </label>
              <select
                className={`form-control bg-dark text-light ${
                  errors.categories_id ? "is-invalid" : ""
                }`}
                style={smallFontStyle}
                {...register("categories_id", { required: "Category is required" })}
                value={data?.categories_id || ""} // Thiết lập giá trị hiện tại
                onChange={(e) => setValue("categories_id", e.target.value)} // Cập nhật giá trị khi có sự thay đổi
              >
                <option style={smallFontStyle} value="" disabled>
                  {cates.find((cate) => cate.id === data?.categories_id)?.name || "Select Category"}
                </option>
                {cates.map((cate) => (
                  <option style={smallFontStyle} key={cate.id} value={cate.id}>
                    {cate.name}
                  </option>
                ))}
              </select>
              {errors.categories_id && (
                <span className="text-danger" style={smallFontStyle}>
                  {errors.categories_id.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="text-light form-label" style={smallFontStyle}>
              Content
            </label>
            <ReactQuill
              theme="snow"
              value={data?.content || ""}
              onChange={(content) => setValue("content", content)}
              style={{ backgroundColor: "#fff", color: "#000" }}
            />
            {errors.content && (
              <span className="text-danger" style={smallFontStyle}>
                {errors.content.message}
              </span>
            )}
          </div>

          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">
              Edit Product
            </button>
            <button
              className="text-light btn btn-outline-secondary"
              type="button"
              onClick={() => navigate("/admin/product")}
            >
              Back
            </button>
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

export default FormEditProduct;
