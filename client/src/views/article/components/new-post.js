import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../../apis/articleApi'; // Adjust the path as necessary
import categoriesApi from '../../../apis/categoriesApi'; // Adjust the path as necessary

const Newpost = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
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
    formData.append('image', data.image[0]);
    formData.append('categories_id', data.categories_id);
    formData.append('title', data.title);
    formData.append('content', data.content);

    try {
      const response = await api.addArticle(formData);
      setSnackbarMessage("Article added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/article'), 500);
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

  return (
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px', md: '20px' } }}>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Grid container spacing={3}>
            {/* Title Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="Tiêu đề"
                variant="standard"
                {...register('title', { required: 'Title is required', minLength: 3 })}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontSize: '2rem',
                    fontWeight: 'bold',
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    padding: 0,
                  },
                }}
                error={!!errors.title}
                helperText={errors.title && (errors.title.type === 'minLength' 
                  ? "Title must be at least 3 characters long" 
                  : errors.title.message)}
              />
            </Grid>

            {/* Content Editor */}
            <Grid item xs={12}>
              <Editor
                apiKey="w8d8xdljziohzromzltpcfb782uwno43s83axici5dyzam4y"
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                    "mediaembed casechange export formatpainter pageembed linkchecker",
                    "a11ychecker tinymcespellchecker permanentpen powerpaste advtable",
                    "advcode editimage advtemplate ai mentions tinycomments tableofcontents",
                    "footnotes mergetags autocorrect typography inlinecss markdown"
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | link image media table mergetags | removeformat | addcomment showcomments | spellcheckdialog a11ycheck typography",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  body_class: "my-editor",
                  ai_request: (request, respondWith) =>
                    respondWith.string(() =>
                      Promise.reject("See docs to implement AI Assistant")
                    ),
                }}
                onEditorChange={(content) => setValue("content", content)}
              />
              {errors.content && (
                <span className="text-danger">
                  {errors.content.message}
                </span>
              )}
            </Grid>

            {/* Image Upload and Category Selection */}
            <Grid item xs={12} md={6}>
              <TextField
                type="file"
                fullWidth
                {...register('image', { required: 'Image is required' })}
                error={!!errors.image}
                helperText={errors.image && errors.image.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                {...register('categories_id', { required: 'Category is required' })}
                SelectProps={{
                  native: true,
                }}
                error={!!errors.categories_id}
                helperText={errors.categories_id && errors.categories_id.message}
              >
                <option value="">
                  Select a category
                </option>
                {cates.map((cate) => (
                  <option key={cate?.key} value={cate?.key}>
                    {cate?.name}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Buttons for Publish and Back */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                >
                  Add Article
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => navigate('/article')}
                >
                  Back
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

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
    </PageContainer>
  );
};

export default Newpost;
