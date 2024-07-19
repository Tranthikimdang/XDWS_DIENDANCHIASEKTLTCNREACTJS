import React, { useEffect } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Administrator from "./pages/admin";
import MemberList from "./pages/admin/components/MemberList/MemberList";
import Dashboard from "./pages/admin/components/dashboard/Dashboard";
import Login from "./pages/admin/components/Login/Login";

const PrivateRoute = ({ element, requiredPermission = [] }) => {
  // const userType = useSelector((state) => state.auth?.user?.userType);
  // const loading = useSelector((state) => state.auth?.loading);
  // const hasPermission =
  //   requiredPermission.length === 0 || requiredPermission.includes(userType);

  // return hasPermission || loading ? (
  //   element
  // ) : (
  //   <Navigate
  //     to="/unauthorized"
  //     replace
  //     state={{ from: window.location.pathname }}
  //   />
  // );
  return element;
};

function LogoutPage() {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // dispatch(logoutAuth());
    navigate("/dang-nhap", { replace: true });
  }, [navigate]);

  //   return <Spin fullscreen />;
}

const App = () => {
  return (
    <Routes>
      {/* Redirect to the logout page on initial load */}
      {/* <Route path="/" element={<Navigate to="/dang-xuat" replace />} /> */}
      <Route path="/" element={<Administrator />}>
        <Route path="/" element={<Dashboard />} />
     
        
        <Route
          path="/quan-ly-thanh-vien"
          element={<PrivateRoute element={<MemberList />} />}
        />
      </Route>
      <Route path="/dang-nhap" element={<PrivateRoute element={<Login />} />} />
      <Route path="/dang-xuat" element={<LogoutPage />} />
      {/* <Route path="/admin" element={<Administrator />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/logout" element={<LogoutPage />} /> */}
    </Routes>
  );
};

export default App;
