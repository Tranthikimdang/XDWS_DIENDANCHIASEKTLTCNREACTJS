import React, { useEffect, useState } from "react";
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Snackbar, Alert } from "@mui/material";

// Firebase
import { db, storage } from '../../../../config/firebaseconfig';
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";  // Add serverTimestamp
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function FormEditBanner() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [data, setData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch Banner data based on ID
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const BannerDocRef = doc(db, "Banners", id);
        const BannerDoc = await getDoc(BannerDocRef);
        if (BannerDoc.exists()) {
          setData(BannerDoc.data());
          setImagePreview(BannerDoc.data().image || "");
        } else {
          console.log("Banner không tồn tại.");
          navigate("/admin/Banner");
        }
      } catch (error) {
        console.error("Lỗi khi lấy Banner:", error);
      }
    };
    if (id) fetchBanner();
  }, [id, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: "",
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("content", data.content || "");
    }
  }, [data, setValue]);

  const handleImageUpload = async (file) => {
    if (!file) return null;
    try {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      console.log("Hình ảnh đã được tải lên thành công, URL:", imageUrl);
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

      const BannerRef = doc(db, "Banners", id);
      await updateDoc(BannerRef, {
        title: formData.title,
        content: formData.content,
        image: imageUrl,
        lastUpdated: serverTimestamp()  // Update the lastUpdated field with current timestamp
      });

      setSnackbarMessage("Cập nhật Banner thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/Banner'), 500);
    } catch (error) {
      console.error("Lỗi khi cập nhật Banner:", error);
      setSnackbarMessage("Cập nhật Banner thất bại.");
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
              <label className="text-light form-label">Tiêu đề</label>
              <input className="form-control bg-dark text-light"
                {...register("title", { required: "Tiêu đề là bắt buộc" })}
              />
              {errors.title && <span className="text-danger">{errors.title.message}</span>}
            </div>
            <div className="col-6 mb-3">
              <label className="text-light form-label">Hình ảnh</label>
              <input
                className={`form-control bg-dark text-light ${errors.image ? "is-invalid" : ""}`}
                type="file"
                {...register("image")}
                onChange={handleImageChange}
              />
              {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
            </div>
          </div>
          {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mt-2" style={{ maxWidth: "160px" }} />}
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
            <button className="btn btn-primary mx-2" type="submit">Cập nhật Banner</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/admin/Banner")}>Trở lại</button>
          </div>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default FormEditBanner;
