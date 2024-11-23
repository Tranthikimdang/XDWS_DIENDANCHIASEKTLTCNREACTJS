import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, Snackbar, Alert, FormHelperText } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import UserAPI from '../../apis/UserApI'; // API để lấy và cập nhật người dùng
import axios from 'axios';

const EditUser = () => {
    const { userId } = useParams(); // Lấy userId từ URL
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthday: "",
        cardId: "",
        imageUrl: "",
        location: "",
        phone: "",
    });

    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Lấy thông tin người dùng để chỉnh sửa
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserAPI.getUsersList();  // Giả sử API này lấy toàn bộ người dùng
                const foundUser = response.data.users.find(user => user.id == parseInt(userId));

                console.log(response.data.users);
                
                if (foundUser) {
                    setUser(foundUser);
                    setImagePreview(foundUser.imageUrl || "");
                } else {
                    setSnackbarMessage("Không tìm thấy người dùng");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                    // navigate("/users");  // Chuyển hướng đến danh sách người dùng nếu không tìm thấy
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
                setSnackbarMessage("Lỗi khi lấy dữ liệu");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        };
        fetchUsers();
    }, [userId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra tên
        if (!user.name) {
            newErrors.name = "Tên không được để trống";
        }

        // Kiểm tra email
        if (!user.email) {
            newErrors.email = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        // Kiểm tra mật khẩu
        if (!user.password) {
            newErrors.password = "Mật khẩu không được để trống";
        } else if (user.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        // Kiểm tra số điện thoại
        if (user.phone && !/^\d{10}$/.test(user.phone)) {
            newErrors.phone = "Số điện thoại phải có 10 chữ số";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra lỗi trước khi gửi
        if (!validateForm()) {
            return;
        }

        try {
            let imageUrl = user.imageUrl;
            if (imageFile) {
                // Upload hình ảnh
                const formData = new FormData();
                formData.append("image", imageFile);
                const uploadResponse = await axios.post("http://localhost:3000/api/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                imageUrl = uploadResponse.data.imagePath;
            }

            const updatedUser = { ...user, imageUrl };

            // Gửi yêu cầu cập nhật người dùng
            await UserAPI.updateUser(userId, updatedUser);

            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            setSnackbarMessage("Thông tin đã được cập nhật thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            navigate(`/profile/${userId}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            setSnackbarMessage("Cập nhật thất bại!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Chỉnh sửa thông tin người dùng
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Tên"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        name="birthday"
                        value={user.birthday}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Số CMND"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="cardId"
                        value={user.cardId}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Địa chỉ"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="location"
                        value={user.location}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Số điện thoại"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        error={Boolean(errors.phone)}
                        helperText={errors.phone}
                    />
                    <TextField
                        label="Mật khẩu"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Xác nhận mật khẩu"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                    />
                    <Box sx={{ mt: 2 }}>
                        <label className="text-light">Hình ảnh</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="form-control"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ maxWidth: "150px", marginTop: "10px" }}
                            />
                        )}
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Cập nhật
                    </Button>
                </form>
            </Box>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EditUser;
