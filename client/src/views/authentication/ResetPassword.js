import React from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { doc, updateDoc } from "firebase/firestore"; 
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, CardContent } from "@mui/material";
import db from '../../config/firebaseconfig'; 

const ResetPassword = () => {
    const { userId } = useParams(); // Lấy userId từ URL
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const newPassword = data.get("newpassword");
        const confirmPassword = data.get("confirmpassword");

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!"); 
            return;
        }

        try {
            // Cập nhật mật khẩu trong Firestore
            const userRef = doc(db, "users", userId); // Sử dụng userId từ URL
            await updateDoc(userRef, {
                password: newPassword, // Cập nhật mật khẩu
            });
            alert("Đặt lại mật khẩu thành công!"); 
            setTimeout(() => {
                navigate("/auth/login");
            }, 2000);
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            alert("Đặt lại mật khẩu thất bại, vui lòng thử lại!"); 
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card sx={{ boxShadow: "4" }}>
                    <CardContent sx={{ m: 3 }}>
                        <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
                            <LockResetIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
                            Đặt Lại Mật Khẩu
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                name="newpassword"
                                id="newpassword"
                                label="Mật khẩu mới"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                name="confirmpassword"
                                id="confirmpassword"
                                label="Xác nhận mật khẩu"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Xác nhận
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default ResetPassword;
