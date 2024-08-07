import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import api from '../../../apis/articleApi';
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

function FormAndArticle() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const history = useHistory();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('image', data.image[0]); // File input is an array
    formData.append('email', data.email);
    formData.append('category', data.category);
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('view', data.view);
    formData.append('created_date', data.created_date);

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
          <div className='col-6 mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Username</label>
            <input
              className={`form-control bg-dark text-light ${errors.user_id ? 'is-invalid' : ''}`}
              {...register('user_id', { required: 'Name is required', minLength: 3, maxLength: 20 })}
              style={smallFontStyle}
            />
            {errors.user_id && errors.user_id.type === 'required' && <span className='text-warning'>Name is required</span>}
            {errors.user_id && errors.user_id.type === 'minLength' && <span className='text-warning'>Name must be at least 3 characters long</span>}
            {errors.user_id && errors.user_id.type === 'maxLength' && <span className='text-warning'>Name must be less than 20 characters long</span>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Image</label>
            <input
              className={`form-control bg-dark text-light ${errors.image ? 'is-invalid' : ''}`}
              type='file'
              {...register('image', { required: 'Image is required' })}
            />
            {errors.image && <div className='invalid-feedback'>
              {errors.image.message}
            </div>}
          </div><div className='mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Title</label>
            <input
              className={`form-control bg-dark text-light`}
              {...register("title", { required: "Title is required" })}
              style={smallFontStyle}
            />
            {errors.title && <span className="text-danger">{errors.title.message}</span>}
          </div>
          <div className="mb-3">
            <label className="text-light form-label" style={smallFontStyle}>
              Category
            </label>
            <select
              style={smallFontStyle}
              className="form-control bg-dark text-light"
              {...register("category", { required: "Category is required" })}
            >
              <option value="" disabled>Select category</option>
              <option value="React" style={smallFontStyle}>React</option>
              <option value="AnotherCategory" style={smallFontStyle}>Another Category</option>
            </select>
            {errors.category && <span className="text-danger">{errors.category.message}</span>}
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
                content_css: "/article.css",
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

            {errors.content && <span className="text-danger">{errors.content.message}</span>}
          </div>
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
            <Link to="/article" className='btn btn-outline-light ms-3'>Back</Link>
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
