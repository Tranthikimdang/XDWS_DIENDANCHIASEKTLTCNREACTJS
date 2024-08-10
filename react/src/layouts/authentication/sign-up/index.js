import { useState } from "react";
import { useHistory } from "react-router-dom"; // Import useNavigate from react-router-dom
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
import registerAPI from "../../../apis/loginApi"; // Đổi thành API cho đăng ký

// Import custom styles
import "./styles.css"; // Make sure to import your custom CSS file

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State mới cho Confirm Password
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useHistory();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const newUser = {
        name,
        email,
        password,
        location,
        phone,
      };
      
      

      await registerAPI.addUser(newUser); // Gọi API để đăng ký
      
      // Chuyển hướng đến dashboard
      navigate.push("/authentication/sign-in");
    } catch (error) {
      alert("An error occurred during registration. Please try again.");
      console.error("Registration error:", error);
    }
  };

  const responseGoogle = (response) => {
    console.log(response);
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
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Name
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
              type="text"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </GradientBorder>
        </VuiBox>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </GradientBorder>
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
            />
          </GradientBorder>
        </VuiBox>

        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Confirm Password
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
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </GradientBorder>
        </VuiBox>

        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Location
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
              type="text"
              placeholder="Your location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </GradientBorder>
        </VuiBox>

        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Phone
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
              type="text"
              placeholder="Your phone..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </GradientBorder>
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
