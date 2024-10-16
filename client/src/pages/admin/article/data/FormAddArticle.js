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

function FormAndArticle() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
  }, []);

  // Lấy danh sách categories từ Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
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
        const storageRef = ref(storage, `images/article/${file.name}`);
        await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Thêm bài viết mới vào Firestore
      await addDoc(collection(db, "articles"), {
        user_id: user.id,
        image: downloadURL,
        categories_id: data.categories_id,
        title: data.title,
        content: data.content, // Nội dung bao gồm mã code và hình ảnh
        view: data.view || 0, // Mặc định view = 0 nếu không cung cấp
        isApproved: '0',
        created_at: new Date(), // Thời gian tạo
        is_deleted: data.is_deleted || false, // Mặc định là false nếu không cung cấp
        updated_at: new Date(), // Thời gian cập nhật
      });
      setSnackbarMessage("Thêm bài viết thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/article'), 500);
    } catch (error) {
      console.error("Lỗi khi thêm bài viết:", error.message);
      setSnackbarMessage("Không thêm được bài viết. Vui lòng thử lại.");
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
          <>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <div className="row">
                <div className='col-6 mb-3'>
                  <label className='text-light form-label' style={smallFontStyle}>Tên</label>
                  <input className={`form-control bg-dark text-light`} style={smallFontStyle} value={user?.name || ''} readOnly />
                </div>
                <div className='col-6 mb-3'>
                  <label className='text-light form-label' style={smallFontStyle}>Tiêu đề</label>
                  <input
                    className={`form-control bg-dark text-light ${errors.title ? 'is-invalid' : ''}`}
                    {...register('title', {
                      required: 'Title không được bỏ trống', // Bắt lỗi tiêu đề bắt buộc
                      minLength: {
                        value: 5,
                        message: 'Tiêu đề phải có ít nhất 5 ký tự' // Độ dài tối thiểu
                      },
                      maxLength: {
                        value: 100,
                        message: 'Tiêu đề không được vượt quá 100 ký tự' // Độ dài tối đa
                      }
                    })}
                    style={smallFontStyle}
                  />
                  {/* Hiển thị lỗi nếu có */}
                  {errors.title && <span className="text-danger" style={smallFontStyle}>{errors.title.message}</span>}
                </div>

              </div>
              <div className="row">
                <div className='col-6 mb-3'>
                  <label className='text-light form-label' style={smallFontStyle}>Hình ảnh</label>
                  <input
                    className={`form-control bg-dark text-light ${errors.image ? 'is-invalid' : ''}`}
                    type='file'
                    {...register('image', { required: 'Image không được bỏ trống' })}
                  />
                  {errors.image && <div className='invalid-feedback' style={smallFontStyle}>
                    {errors.image.message}
                  </div>}
                </div>
                <div className="col-6 mb-3">
                  <label className="text-light form-label" style={smallFontStyle}>
                    Danh mục
                  </label>
                  <select
                    className={`form-control bg-dark text-light ${errors.categories_id ? 'is-invalid' : ''}`}
                    style={smallFontStyle}
                    {...register("categories_id", { required: "Category không được bỏ trống" })}
                  >
                    <option style={smallFontStyle} value="">
                      Mở menu chọn này
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
                  Nội dung
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
                  <span className="text-danger" style={smallFontStyle}>
                    {errors.content.message}
                  </span>
                )}
              </div>
              <div className="d-flex justify-content mt-3">
                <button className="btn btn-primary mx-2" type="submit">
                  Thêm bài viết
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/admin/article")}>Trở lại</button>
              </div>
            </form>
          </>
        )}
        {/* Make sure the div wrapping the form is properly closed */}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ transform: 'translateY(100px)' }}
        >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
export default FormAndArticle;