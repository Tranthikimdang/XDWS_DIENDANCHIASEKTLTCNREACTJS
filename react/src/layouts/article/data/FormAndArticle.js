import React, { useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import api from '../../../apis/articleApi';
import categoriesApi from '../../../apis/categoriesApi';
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

function FormAndArticle() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const history = useHistory();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getList();
        console.log(response.data);

        if (response.status == 200) {
          const categories = response.data || [];
          setCates(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('user_id', data.user_id);
    formData.append('image', data.image[0]); // File input is an array
    formData.append('categories_id', data.categories_id);
    formData.append('title', data.title);
    formData.append('content', data.content);


    // Debug: Log FormData entries
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await api.addArticle(formData);
      // thông báo 
      console.log('Article added successfully:', response);
      setSnackbarMessage("Article added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => history.push('/article'), 500);
    } catch (error) {
      console.error('Error adding article:', error);
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
              <input
                className={`form-control bg-dark text-light ${errors.user_id ? 'is-invalid' : ''}`}
                {...register('user_id', { required: 'Name is required', minLength: 3, maxLength: 20 })}
                style={smallFontStyle}
              />
              {errors.user_id && <span className="text-danger" style={smallFontStyle}>{errors.user_id.message}</span>}

              {errors.user_id && errors.user_id.type === 'minLength' && <span className="text-danger" style={smallFontStyle}>Name must be at least 3 characters long</span>}
              {errors.user_id && errors.user_id.type === 'maxLength' && <span className="text-danger" style={smallFontStyle}>Name must be less than 20 characters long</span>}
            </div>
            <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Title</label>
              <input
                className={`form-control bg-dark text-light ${errors.title ? 'is-invalid' : ''}`}
                {...register('title', { required: 'Title is required', minLength: 3, maxLength: 20 })}
                style={smallFontStyle}
              />
              {errors.title && <span className="text-danger" style={smallFontStyle}>{errors.title.message}</span>}

              {errors.title && errors.title.type === 'minLength' && <span className="text-danger" style={smallFontStyle}>Title must be at least 3 characters long</span>}
              {errors.title && errors.title.type === 'maxLength' && <span className="text-danger" style={smallFontStyle}>Title must be less than 20 characters long</span>}
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
               className="form-control bg-dark text-light" style={smallFontStyle}
               {...register("categories_id", { required: "Category is required" })}>
                <option style={smallFontStyle}>Open this select menu</option>
                {
                  cates.length && cates.map((cate) => (
                    <option style={smallFontStyle} key={cate?.key} value={cate?.key}>{cate?.name}</option>
                  ))
                }
              </select>
              {errors.categories_id && <span className="text-danger" style={smallFontStyle}>{errors.categories_id.message}</span>}
            </div>
          </div>
          <div className="mb-3">
            <label className="text-light form-label" style={smallFontStyle}>
              Content
            </label>
            <Editor
              apiKey="owarvk3rl1z5v44dvx9b06crntnsgrgjcja6mayprjqj5qaa"
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
