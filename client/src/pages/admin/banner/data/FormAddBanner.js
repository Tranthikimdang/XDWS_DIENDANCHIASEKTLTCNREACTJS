import React, { useEffect, useState } from 'react';
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from "@mui/material";
import { ClipLoader } from "react-spinners";
// import firebase
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../../config/firebaseconfig';

function FormAndBanner() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  // Xử lý logic khi submit form
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let downloadURL = '';
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const storageRef = ref(storage, `images/Banner/${file.name}`);
        await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Thêm bài viết mới vào Firestore
      await addDoc(collection(db, "Banners"), {
        image: downloadURL,
        title: data.title,
        content: data.content, // Nội dung text
        view: data.view || 0, // Mặc định view = 0 nếu không cung cấp
        isApproved: '0',
        created_at: new Date(), // Thời gian tạo
        is_deleted: data.is_deleted || false, // Mặc định là false nếu không cung cấp
        updated_at: new Date(), // Thời gian cập nhật
      });
      setSnackbarMessage("Đã thêm banner thành công.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/Banner'), 500);
    } catch (error) {
      console.error("Lỗi khi thêm Banner:", error.message);
      setSnackbarMessage("Không thêm được Banner. Vui lòng thử lại.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
                <div className='col-12 mb-3'>
                  <label className='text-light form-label' style={smallFontStyle}>Tiêu đề</label>
                  <input
                    className={`form-control bg-dark text-light ${errors.title ? 'is-invalid' : ''}`}
                    {...register('title', {
                      required: 'Title không được bỏ trống',
                      minLength: {
                        value: 5,
                        message: 'Tiêu đề phải có ít nhất 5 ký tự'
                      },
                      maxLength: {
                        value: 100,
                        message: 'Tiêu đề không được vượt quá 100 ký tự'
                      }
                    })}
                    style={smallFontStyle}
                  />
                  {errors.title && <span className="text-danger" style={smallFontStyle}>{errors.title.message}</span>}
                </div>
              </div>
              <div className="row">
                <div className='col-12 mb-3'>
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
              </div>
              <div className="mb-3">
                <label className="text-light form-label" style={smallFontStyle}>Nội dung</label>
                <textarea
                  className={`form-control bg-dark text-light ${errors.content ? 'is-invalid' : ''}`}
                  rows={10}
                  {...register('content', {
                    required: 'Nội dung không được bỏ trống',
                    minLength: {
                      value: 20,
                      message: 'Nội dung phải có ít nhất 20 ký tự'
                    }
                  })}
                  style={smallFontStyle}
                />
                {errors.content && <span className="text-danger" style={smallFontStyle}>{errors.content.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary">Lưu</button>
              <button className="btn btn-primary" type="button" onClick={() => navigate("/admin/banner")}>Trở lại</button>
            </form>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }} // Updated positioning
            >
              <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default FormAndBanner;
