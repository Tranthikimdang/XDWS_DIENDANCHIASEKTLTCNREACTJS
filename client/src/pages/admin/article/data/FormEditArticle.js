import React, { useEffect, useState } from "react";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Snackbar, Alert } from "@mui/material";

// Firebase
import { db, storage } from '../../../../config/firebaseconfig';
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function FormEditArticle() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cates, setCates] = useState([]);
  const [user, setUser] = useState("");
  const [data, setData] = useState(null); // Dữ liệu bài viết
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchUser = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      try {
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCates(categoriesList);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy dữ liệu bài viết dựa trên ID
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleDocRef = doc(db, "articles", id);
        const articleDoc = await getDoc(articleDocRef);
        if (articleDoc.exists()) {
          setData(articleDoc.data());
          setImagePreview(articleDoc.data().image || "");
        } else {
          console.log("Bài viết không tồn tại.");
          navigate("/admin/article");
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };
    if (id) fetchArticle();
  }, [id, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: user?.id || "",
      image: "",
      title: "",
      categories_id: "",
      content: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("content", data.content || "");
      setValue("categories_id", data.categories_id || "");
    }
  }, [data, setValue]);

  const handleImageUpload = async (file) => {
    if (!file) return null;
    try {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      let imageUrl = data?.image || "";
      if (formData.image && formData.image[0]) {
        imageUrl = await handleImageUpload(formData.image[0]);
      }
      const articleRef = doc(db, "articles", id);
      await updateDoc(articleRef, {
        title: formData.title,
        content: formData.content,
        categories_id: formData.categories_id,
        image: imageUrl,
      });
      setSnackbarMessage("Cập nhật bài viết thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/article'), 500);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      setSnackbarMessage("Cập nhật bài viết thất bại.");
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} method="post" encType="multipart/form-data">
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label">Tên</label>
              <input className="form-control bg-dark text-light" value={user?.name} readOnly />
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label">Tiêu đề</label>
              <input className="form-control bg-dark text-light"
                {...register("title", { required: "Tiêu đề là bắt buộc" })}
              />
              {errors.title && <span className="text-danger">{errors.title.message}</span>}
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="text-light form-label">Hình ảnh</label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? "is-invalid" : ""}`}
                type="file"
                onChange={handleImageChange}
              />
              {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
              {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mt-2" style={{ maxWidth: "160px" }} />}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label">Danh mục</label>
              <select
                className={`form-control bg-dark text-light ${errors.categories_id ? 'is-invalid' : ''}`}
                {...register("categories_id", { required: "Danh mục là bắt buộc" })}
              >
                <option value="" disabled>Mở chọn danh mục</option>
                {cates.map((cate) => (
                  <option key={cate.id} value={cate.id}>{cate.name}</option>
                ))}
              </select>
              {errors.categories_id && <span className="text-danger">{errors.categories_id.message}</span>}
            </div>
          </div>
          <div className="mb-3">
            <label className="text-light form-label">Nội dung</label>
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
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={(content) => setValue("content", content)}
              initialValue={data?.content || ""}
            />
            {errors.content && <span className="text-danger">{errors.content.message}</span>}
          </div>
          <div className="d-flex justify-content mt-3">
            <button className="btn btn-primary mx-2" type="submit">Cập nhật bài viết</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/admin/article")}>Trở lại</button>
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
