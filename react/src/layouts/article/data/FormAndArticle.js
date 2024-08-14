import React, { useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import api from '../../../apis/articleApi';
import categoriesApi from '../../../apis/categoriesApi';
import { Editor } from "@tinymce/tinymce-react";
import { Snackbar, Alert } from "@mui/material";
function FormAndArticle() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
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


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('image', data.image[0]); // File input is an array
    formData.append('categories_id', data.categories_id);
    formData.append('title', data.title);
    formData.append('content', data.content);

    try {
      const response = await api.addArticle(formData);
      setSnackbarMessage("Article added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/article'), 500);
    } catch (error) {
      setSnackbarMessage("Failed to add article.");
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
    fontSize: '0.9rem'
  };

  return (
    <DashboardLayout>
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="row">
            <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Username</label>
              <input className={`form-control bg-dark text-light`} style={smallFontStyle} value={user?.name} />
            </div>
            <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Title</label>
              <input
                className={`form-control bg-dark text-light ${errors.title ? 'is-invalid' : ''}`}
                {...register('title', { required: 'Title is required', minLength: 3 })}
                style={smallFontStyle}
              />
              {errors.title && <span className="text-danger" style={smallFontStyle}>{errors.title.message}</span>}
              {errors.title && errors.title.type === 'minLength' && <span className="text-danger" style={smallFontStyle}>Title must be at least 3 characters long</span>}

            </div>
          </div>
          <div className="row">
            <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Image</label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? 'is-invalid' : ''}`}
                type='file'
                {...register('image', { required: 'Image is required' })}
              />
              {errors.image && <div className='invalid-feedback' style={smallFontStyle}>
                {errors.image.message}
              </div>}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Category
              </label>
              <select
                className={`form-control bg-dark text-light ${errors.categories_id ? 'is-invalid' : ''}`}
                style={smallFontStyle}
                {...register("categories_id", { required: "Category is required" })}
              >
                <option style={smallFontStyle}>
                  Open this select menu
                </option>
                {cates.map((cate) => (
                  
                  <option style={smallFontStyle} key={cate?.key} value={cate?.key}>
                    {cate?.name}
                  </option>
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
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                content_css: "/path/to/dark-theme-tinymce.css",
                body_class: "my-editor",
                tinycomments_author: "Author name",
                mergetags_list: [
                  { value: "First.Name", title: "First Name" },
                  { value: "Email", title: "Email" },
                ],
                ai_request: (request, respondWith) =>
                  respondWith.string(() =>
                    Promise.reject("See docs to implement AI Assistant")
                  ),
              }}
              initialValue=""
              onEditorChange={(content) => setValue("content", content)}
            />
            {errors.content && (
              <span className="text-danger" style={smallFontStyle}>
                {errors.content.message}
              </span>
            )}

            {errors.content && (
              <span className="text-danger" style={smallFontStyle}>
                {errors.content.message}
              </span>
            )}
          </div>
          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">Add Article</button>
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

export default FormAndArticle;
