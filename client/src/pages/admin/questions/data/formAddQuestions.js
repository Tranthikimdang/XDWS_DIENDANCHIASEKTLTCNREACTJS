import React, { useEffect, useState } from 'react';
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { ClipLoader } from "react-spinners";
// import firebase
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../../config/firebaseconfig';

function FormAndQuestions() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
      setLoading(false);
    }
  }, []);
  
  // Tích hợp highlight.js để highlight code trong bài viết
  useEffect(() => {
    document.querySelectorAll("pre").forEach((block) => {
      // eslint-disable-next-line no-undef
      hljs.highlightElement(block);
    });
  });

  // Xử lý logic khi submit form
  const onSubmit = async (data) => {
    try {
      let downloadURL = '';
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const storageRef = ref(storage, `images/questions/${file.name}`);
        await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Thêm bài viết mới vào Firestore
      await addDoc(collection(db, "questions"), {
        user_id: user?.id || '',
        article_id: data.article_id || '',  // Giả sử article_id sẽ được cung cấp từ dữ liệu form
        questions: data.questions,
        up_code: data.content || '', // Nội dung bài viết từ Editor
        image: downloadURL,
        answers: [], // Mảng câu trả lời mặc định là rỗng
        view: data.view || 0, // Mặc định view = 0 nếu không cung cấp
        isApproved: '0', 
        likes: [], // Mảng lượt thích mặc định là rỗng
        created_at: new Date(), // Thời gian tạo
        is_deleted: data.is_deleted || false, // Mặc định là false nếu không cung cấp
        updated_at: new Date(), // Thời gian cập nhật
      });
      setSnackbarMessage("Questions added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/questions'), 500);
    } catch (error) {
      console.error("Error adding questions:", error.message);
      setSnackbarMessage("Failed to add questions. Please try again.");
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
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="row">
              <div className='col-6 mb-3'>
                <label className='text-light form-label' style={smallFontStyle}>Tên</label>
                <input className={`form-control bg-dark text-light`} style={smallFontStyle} value={user?.name || ''} readOnly />
              </div>
              <div className='col-6 mb-3'>
                <label className='text-light form-label' style={smallFontStyle}>Câu hỏi</label>
                <input
                  className={`form-control bg-dark text-light ${errors.questions ? 'is-invalid' : ''}`}
                  {...register('questions', {
                    required: 'questions is required',
                    minLength: {
                      value: 5,
                      message: 'questions must be at least 5 characters'
                    },
                    maxLength: {
                      value: 100,
                      message: 'questions cannot exceed 100 characters'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9 ]+$/,
                      message: 'questions can only contain letters and numbers'
                    }
                  })}
                  style={smallFontStyle}
                />
                {errors.questions && <span className="text-danger" style={smallFontStyle}>{errors.questions.message}</span>}
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
            </div>

            <div className="mb-3">
              <label className="text-light form-label" style={smallFontStyle}>
                Up code 
              </label>
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
                    editor.ui.registry.addButton('customInsertImage', {
                      text: 'Insert Image',
                      icon: 'image',
                      onAction: () => {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();

                        input.onchange = async function () {
                          const file = input.files[0];
                          const reader = new FileReader();
                          reader.onload = async function (e) {
                            const img = document.createElement('img');
                            img.src = e.target.result;

                            const formData = new FormData();
                            formData.append('file', file);

                            // Upload the image to Firestore storage
                            const storageRef = ref(storage, `images/questions/${file.name}`);
                            await uploadBytes(storageRef, file);
                            const downloadURL = await getDownloadURL(storageRef);

                            editor.insertContent(`<img src="${downloadURL}" alt="image" />`);
                          };
                          reader.readAsDataURL(file);
                        };
                      },
                    });
                  },
                }}
                onEditorChange={(content) => setValue("content", content)}
              />
            </div>

            <button className="btn btn-primary" type="submit">Add</button>
          </form>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default FormAndQuestions;
