import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
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
import registerAPI from "../../../apis/loginApi"; // API cho đăng ký

// Import custom styles
import "./styles.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    phone: "",
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const validateForm = () => {
    let validationErrors = {};
    const { name, email, password, confirmPassword, location, phone } = formData;

    if (!name) validationErrors.name = "Name is required.";
    if (!email) validationErrors.email = "Email is required.";
    if (!password) validationErrors.password = "Password is required.";
    if (!confirmPassword) validationErrors.confirmPassword = "Please confirm your password.";
    if (!location) validationErrors.location = "Location is required.";
    if (!phone) validationErrors.phone = "Phone number is required.";

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match!";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (password && password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long.";
    }

    return validationErrors;
  };

  const handleRegister = async () => {
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Kiểm tra email đã tồn tại
      const emailExists = await registerAPI.checkEmailExists(formData.email);
      
      if (emailExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Tài khoản đã tồn tại với email này.", // Thông báo lỗi
        }));
        return;
      }else{
        // await registerAPI.addUser(formData);
        console.log("dsdsd");
        
      history.push("/authentication/sign-in");
      }

      
    } catch (error) {
      alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.");
      console.error("Registration error:", error);
    }
  };

  const responseGoogle = async (response) => {
    console.log(response);
    // Bạn có thể thêm logic xử lý đăng nhập Google ở đây
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <CoverLayout
      title="Welcome!"
      color="white"
      description="Enter your details to sign up"
      premotto="JOIN US NOW:"
      motto="THE SHARE CODE DASHBOARD"
      image={bgSignIn}
    >
      <VuiBox component="form" role="form">
        {["name", "email", "password", "confirmPassword", "location", "phone"].map((field) => (
          <VuiBox mb={2} key={field}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
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
        type={field === "confirmPassword" || field === "password" ? "password" : "text"}
        name={field}
        placeholder={`Your ${field}...`}
        value={formData[field]}
        onChange={handleChange}
      />
              
            </GradientBorder>
            {errors[field] && <VuiTypography variant="caption" color="red">{errors[field]}</VuiTypography>}
          </VuiBox>
        ))}

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

        <VuiBox display="flex" alignItems="center" justifyContent="center">
          <Link to="/authentication/sign-in" style={{ textDecoration: "none" }}>
            <VuiTypography
              variant="caption"
              color="blue"
              fontWeight="medium"
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              Already have an account? Sign in.
            </VuiTypography>
          </Link>
        </VuiBox>

        <VuiBox mt={4} mb={1}>
          <VuiButton color="info" fullWidth onClick={handleRegister}>
            SIGN UP
          </VuiButton>
        </VuiBox>

        <VuiBox mt={4} mb={1} textAlign="center">
          <div className="google-login-btn">
            <GoogleLogin
              clientId="YOUR_GOOGLE_CLIENT_ID"
              buttonText=""
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              render={renderProps => (
                <button
                  className="google-login-btn"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <img
                    className="google-icon"
                    src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0"
                    alt="Google"
                  />
                  Sign up with Google
                </button>
              )}
            />
          </div>
        </VuiBox>
      </VuiBox>
    </CoverLayout>
  );
}

export default Register;
