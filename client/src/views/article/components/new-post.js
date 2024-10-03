import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ClipLoader } from "react-spinners";
// firebase
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../config/firebaseconfig.js';

function Newpost() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
    console.log(user);
  }, []);

  // Lấy danh sách categories từ Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try{
        const querySnapshot = await getDocs(collection(db, "categories"));
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

  // Xử lý logic khi submit form
  const onSubmit = async (data) => {
    try {
      let downloadURL = '';
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Thêm bài viết mới vào Firestore
      await addDoc(collection(db, "articles"), {
        user_id: user.id,
        image: downloadURL,
        categories_id: data.categories_id,
        title: data.title,
        content: data.content,
        view: data.view || 0,
        isApproved: '0', 
        created_at: new Date(),
        is_deleted: data.is_deleted || false,
        updated_at: new Date(),
      });

      setSnackbarMessage("Bài viết của bạn đã được gửi, đang chờ quản trị viên phê duyệt.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/article'), 500);
    } catch (error) {
      console.error("Error adding article:", error.message);
      setSnackbarMessage("Failed to add article. Please try again.");
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
      {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
            }}
          >
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        ) : (
          <>
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
                  apiKey="qgviuf41lglq9gqkkx6nmyv7gc5z4a1vgfuvfxf2t38dmbss"
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                      "mediaembed casechange export formatpainter pageembed linkchecker",
                      "a11ychecker tinymcespellchecker permanentpen powerpaste advtable",
                      "advcode editimage advtemplate ai mentions tinycomments tableofcontents",
                      "footnotes mergetags autocorrect typography inlinecss markdown",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | link image media table codesample | customInsertImage | removeformat | addcomment showcomments | spellcheckdialog a11ycheck typography",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    body_class: "my-editor",
                    codesample_languages: [
                      { text: 'HTML/XML', value: 'markup' },
                      { text: 'JavaScript', value: 'javascript' },
                      { text: 'CSS', value: 'css' },
                      { text: 'Python', value: 'python' },
                      { text: 'PHP', value: 'php' },
                      { text: 'C++', value: 'cpp' },
                    ],
                    setup: (editor) => {
                      // Thêm nút tùy chỉnh cho upload ảnh
                      editor.ui.registry.addButton('customInsertImage', {
                        text: 'Insert Image',
                        icon: 'image',
                        onAction: () => {
                          // Tạo một input cho phép upload file
                          const input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          input.click();

                          input.onchange = async () => {
                            const file = input.files[0];
                            if (file) {
                              const storageRef = ref(storage, `images/${file.name}`);
                              try {
                                await uploadBytes(storageRef, file);
                                const downloadURL = await getDownloadURL(storageRef);
                                // Chèn ảnh với kích thước nhỏ hơn
                                editor.insertContent(`<img src="${downloadURL}" alt="${file.name}" style="width: 200px; height: auto;" />`);
                              } catch (error) {
                                console.error('Image upload failed:', error);
                              }
                            }
                          };
                        }
                      });
                    },
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
                  <option key={cate.id} value={cate.id}>
                    {cate.name}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Buttons for Publish and Back */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" mt={3}>
               
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => navigate('/article')}
                >
                  Back
                </Button>
                 <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                >
                  Add Article
                </Button>
              </Box>
            </Grid>
          </Grid>
          
        </form>
        </>
    )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={8000}
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