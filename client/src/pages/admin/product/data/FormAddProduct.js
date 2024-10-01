import React, { useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Snackbar, Alert } from "@mui/material";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../config/firebaseconfig.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

function FormAddProduct() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedCategoryId = watch("categories_id");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "categories_product"));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCates(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    document.querySelectorAll("pre").forEach((block) => {
      hljs.highlightElement(block);
    });
  });

  const onSubmit = async (data) => {
    try {
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const storageRef = ref(storage, `images/${file.name}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "products"), {
          user_id: user.id,
          image_url: downloadURL,
          categories_id: data.categories_id,
          title: data.title,
          content: data.content,
          view: data.view || 0, // Ensure view is provided, default to 0 if not
          created_at: new Date(), // Set the current date/time
          is_deleted: data.is_deleted || false, // Default to false if not provided
          updated_at: new Date(), // Set the current date/time
        });

        setSnackbarMessage("product added successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => navigate('/product'), 500);
      } else {
        setSnackbarMessage("Image is required.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
      setSnackbarMessage("Failed to add product. Please try again.");
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

  const selectedCategory = cates.find(cate => cate.id === selectedCategoryId);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="row">
            <div className='col-6 mb-3'>
              <label className='text-light form-label' style={smallFontStyle}>Name</label>
              <input className={`form-control bg-dark text-light`} style={smallFontStyle} value={user?.name || ''} readOnly />
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
                Category product
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
            <ReactQuill
              theme="snow"
              onChange={(content) => setValue("content", content)}
              style={{ backgroundColor: '#fff', color: '#000' }}
            />
            {errors.content && (
              <span className="text-danger" style={smallFontStyle}>
                {errors.content.message}
              </span>
            )}
          </div>
          <div className="d-flex justify-content mt-3">
            <button className="text-light btn btn-outline-info me-2" type="submit">Add product</button>
            <button
              className="text-light btn btn-outline-secondary"
              type="button"
              onClick={() => navigate("/product")}
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

export default FormAddProduct;
