import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation, Link } from "react-router-dom";
import api from "../../../apis/articleApi";
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name || "",
      image: data?.image || "",
      title: data?.title || "",
      category: data?.category || "",
      view: data?.view || "",
      created_date: data?.created_date || "",
      email: data?.email || "",
      content: data?.content || "",
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
                className={`form-control bg-dark text-light`}
                {...register("title", { required: "Title is required" })}
                style={smallFontStyle}
              />
              {errors.title && <span className="text-danger" style={smallFontStyle}>{errors.title.message}</span>}
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
                style={smallFontStyle}
                className="form-control bg-dark text-light"
                {...register("categories_id", { required: "Category is required" })}
              >
                <option value="" disabled>Select category</option>
                <option value="React" style={smallFontStyle}>React</option>
                <option value="AnotherCategory" style={smallFontStyle}>Another Category</option>
              </select>
              {errors.categories_id && <span className="text-danger" style={smallFontStyle}>{errors.category.message}</span>}
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
            {errors.content && <span className="text-danger" style={smallFontStyle}>{errors.content.message}</span>}
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
