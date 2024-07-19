import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import bgImg from "../../../../assets/dn.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "123") {
      // On successful login
      navigate("/", { replace: true });
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="bg-login">
      <div className="left-panel">
        <div className="bg-img">
          <img src={bgImg} alt="bg" />
        </div>
        <h1>INSPIRED BY THE FUTURE:</h1>
        <h2>THE VISION UI DASHBOARD</h2>
      </div>
      <div className="right-panel">
        <div className="login-form">
          <h2>Đăng nhập</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit">SIGN IN</button>
          </form>
          <p>
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
