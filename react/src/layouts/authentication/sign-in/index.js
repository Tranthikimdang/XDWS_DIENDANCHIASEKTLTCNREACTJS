import React, { useState, useRef, useEffect } from "react";
import { useHistory, Link } from "react-router-dom"; // Import useNavigate from react-router-dom
import { GoogleLogin } from "react-google-login"; // or import from "react-oauth/google"
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgSignIn from "assets/images/signInImage.png";
import loginAPI from "../../../apis/loginApi";
import emailjs from "emailjs-com";
import db from "../../../config/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

// Import custom styles
import "./styles.css"; // Make sure to import your custom CSS file

function Login() {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useHistory();
  const form = useRef();
  const history = useHistory();

  // localStorage.removeItem("user");
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  useEffect(() => {
    // Lấy dữ liệu người dùng từ local storage
    const userData = localStorage.getItem("user"); 
    if (!userData) {
      history.push("/authentication/sign-in"); // Nếu không có, điều hướng đến trang đăng nhập
      return;
    }

    const user = JSON.parse(userData); // Chuyển đổi chuỗi JSON thành đối tượng
    if (user.role == "admin") {
      history.push("/dashboard"); 
    }
  }, [history]);

  const validate = () => {
    let valid = true;
    let errors = {};

    if (!email) {
      errors.email = "Email is required.";
      valid = false;
    } else if (!validateEmailFormat(email)) {
      errors.email = "Invalid email format.";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
  
    try {
      // Lấy danh sách người dùng từ Firestore
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      console.log(users);
  
      // Tìm người dùng có email và password khớp
      const user = users.find((user) => user.email === email && user.password === password);
  
      if (user) {
        // Lưu thông tin người dùng vào localStorage
        if (user.role !== "admin") {
          alert("You do not have admin rights."); // Thông báo nếu không phải admin
          history.push("/authentication/sign-in"); // Điều hướng đến trang đăng nhập
        } else {
          localStorage.setItem("user", JSON.stringify(user));
          // Chuyển hướng đến dashboard
          navigate.push("/dashboard");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    }
  };
  
  const responseGoogle = async (response) => {
    const email = response.wt.cu;

    try {
      const emailExists = await loginAPI.checkEmailExists(email);
      const generateRandomPassword = () => {
        return Math.random().toString(36).slice(-8); // Tạo chuỗi ngẫu nhiên 8 ký tự
      };
      const generatedPassword = generateRandomPassword();

      if (emailExists) {
        alert("An account already exists with this email.");
        return;
      }

      // Tiếp tục nếu email không tồn tại

      const newUser = {
        name: response.wt.Ad,
        email: response.wt.cu,
        password: generatedPassword,
        location: "", // Cung cấp thông tin nếu cần
        phone: "", // Cung cấp thông tin nếu cần
        role: "user",
      };

      await loginAPI.addUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Gửi email sau khi thêm người dùng mới thành công

      sendEmail({
        name: newUser.name,
        email: newUser.email,
        message: `Mật khẩu của bạn là: ${generatedPassword}`,
      });

      // history.push("/");
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const sendEmail = (data) => {
    emailjs
      .send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        {
          to_name: data.name,
          to_email: data.email,
          message: data.message,
        },
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        (result) => {
          alert("Đăng ký thành công, kiểm tra email để nhận mật khẩu");
        },
        (error) => {
          alert("An error occurred, please try again.");
        }
      );
  };

  return (
    <CoverLayout
      title="Nice to see you!"
      color="white"
      description="Enter your email and password to log in"
      premotto="INSPIRED BY THE FUTURE:"
      motto="THE SHARE CODE DASHBOARD"
      image={bgSignIn}
    >
      <VuiBox component="form" role="form">
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Email
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput
              type="email"
              placeholder="Your email..."
              fontWeight="500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </GradientBorder>
          {errors.email && ( // ADD HERE: Hiển thị lỗi password nếu có
            <VuiTypography variant="caption" color="red">
              {errors.email}
            </VuiTypography>
          )}
        </VuiBox>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Password
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            borderRadius={borders.borderRadius.lg}
            padding="1px"
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput
              type="password"
              placeholder="Your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={({ typography: { size } }) => ({
                fontSize: size.sm,
              })}
            />
          </GradientBorder>
          {errors.password && ( // ADD HERE: Hiển thị lỗi password nếu có
            <VuiTypography variant="caption" color="red">
              {errors.password}
            </VuiTypography>
          )}
        </VuiBox>
        <VuiBox display="flex" alignItems="center">
          <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} />
          <VuiTypography
            variant="caption"
            color="white"
            fontWeight="medium"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Remember me
          </VuiTypography>
        </VuiBox>
        {/* <VuiBox display="flex" alignItems="center" justifyContent="center">
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <VuiTypography
              variant="caption"
              color="blud"
              fontWeight="medium"
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              Don't have an account? Sign up.
            </VuiTypography>
          </Link>
        </VuiBox> */}
        <VuiBox mt={4} mb={1}>
          <VuiButton color="info" fullWidth onClick={handleLogin}>
            LOGIN
          </VuiButton>
        </VuiBox>
        {/* <VuiBox mt={4} mb={1} textAlign="center">
          <div className="google-login-btn">
            <GoogleLogin
              clientId="YOUR_GOOGLE_CLIENT_ID"
              buttonText=""
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <button
                className="btn btn-light"
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  backgroundColor: '#f8f9fa',
                  border: '0px solid #ced4da'
                }}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <img
                    className="google-icon"
                    src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0"
                    alt="Google"
                  />
                  Login with Google
                </button>
              )}
            />
          </div>
        </VuiBox> */}
      </VuiBox>
    </CoverLayout>
  );
}

export default Login;
