import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation, Link } from "react-router-dom";
import api from "../../../apis/articleApi";
import categoriesApi from '../../../apis/categoriesApi';
import { Editor } from "@tinymce/tinymce-react"; // Thay thế bằng đường dẫn thực tế tới Editor
import { Snackbar, Alert } from "@mui/material";
import { useHistory } from 'react-router-dom';

function FormEditArticle() {
  const location = useLocation();
  const { data } = location.state || {};
  const history = useHistory();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState(""); // Khai báo state name

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user)
      // setName(user.name);
    }
    console.log(user);

  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getList();
        if (response.status === 200) {
          const categories = response.data || [];
          setCates(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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
      

     
    },
  });

  const [imagePreview, setImagePreview] = useState(data?.image || "");

  useEffect(() => {
    if (data) {
      setValue("content", data.content || "");
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

      const response = await api.updateArticle(data.id, formDataWithImage);
      console.log('Article added successfully:', response);
      setSnackbarMessage("Article added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/article'), 500);
    } catch (error) {
      console.error("Error updating article:", error);
      setSnackbarMessage("Failed to add Article.");
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          method="post"
          encType="multipart/form-data"
        >
          <div className="row">
          <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Username</label>
              <input className={`form-control bg-dark text-light`} style={smallFontStyle} value={user?.name} />
            </div>
            <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Title</label>
              <input
                className={`form-control bg-dark text-light`}
                {...register("title", { required: "Title is required" })}
                style={smallFontStyle}
              />
              {errors.title && <span className="text-danger" style={smallFontStyle}>{errors.title.message}</span>}
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Image
              </label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? "is-invalid" : ""
                  }`}
                type="file"
                {...register("image", { required: "Image is required" })}
                onChange={handleImageChange} // Add onChange handler
              />
              {errors.image && (
                <div className="invalid-feedback">{errors.image.message}</div>
              )}
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
                Category
              </label>
              <select
                className={`form-control bg-dark text-light ${errors.categories_id ? 'is-invalid' : ''}`} style={smallFontStyle}
                {...register("categories_id", { required: "Category is required" })}>
                <option style={smallFontStyle}>Open this select menu</option>
                {cates.length && cates.map((cate) => (
                  <option style={smallFontStyle} key={cate?.key} value={cate?.key}>{cate?.name}</option>
                ))}
              </select>
              {errors.categories_id && <span className="text-danger" style={smallFontStyle}>{errors.categories_id.message}</span>}
            </div>
          </div>
          <div className="mb-3">
            <label className="text-light form-label" style={smallFontStyle}>
              Content
            </label>
            <Editor
              apiKey="w8d8xdljziohzromzltpcfb782uwno43s83axici5dyzam4y"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                content_css: "/path/to/dark-theme-tinymce.css", // Use the downloaded CSS file path
                body_class: "my-editor",
                tinycomments_author: "Author name",
                mergetags_list: [
                  { value: "First.Name", title: "First Name" },
                  { value: "Email", title: "Email" },
                ],
                ai_request: (request, respondWith) =>
                  respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
              }}
              initialValue=""
              onEditorChange={(content) => setValue("content", content)}
            />
            {errors.content && (
              <span className="text-danger" style={smallFontStyle}>
                {errors.content.message}
              </span>
            )}

          </div>
          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">Edit Article</button>
            <button
              className="text-light btn btn-outline-secondary"
              type="button"
              onClick={() => history.push("/article")}
            >
              Back
            </button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={500}
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

export default FormEditArticle;
