import React, { useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import { Snackbar, Alert } from "@mui/material";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../config/firebaseconfig.js'; // Nhập đúng

function FormAndArticle() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const history = useHistory();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
    console.log(user);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCates(categoriesList); // Set the fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (data.image && data.image.length > 0) {
        // Upload image to Firebase Storage
        const file = data.image[0];
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Add article to Firestore with image URL
        await addDoc(collection(db, "articles"), {
          user_id: user.id,
          image_url: downloadURL,
          categories_id: data.categories_id,
          title: data.title,
          content: data.content,
        });

        setSnackbarMessage("Article added successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => history.push('/article'), 500);
      } else {
        setSnackbarMessage("Image is required.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
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
      <DashboardNavbar />
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* Form fields */}
          <div className="row">
            <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Name</label>
              <input className={`form-control bg-dark text-light`} style={smallFontStyle} value={user?.name} readOnly />
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
                <option style={smallFontStyle} value="">
                  Open this select menu
                </option>
                {cates.map((cate) => (
                  <option style={smallFontStyle} key={cate.id} value={cate.id}>
                    {cate.name}
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
              apiKey="qgviuf41lglq9gqkkx6nmyv7gc5z4a1vgfuvfxf2t38dmbss"
              init={{
                plugins: "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                toolbar: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
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

export default FormAndArticle;
