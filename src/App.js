import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Administrator from "./pages/admin";
import MemberList from "./pages/admin/components/MemberList/MemberList";
import Dashboard from "./pages/admin/components/dashboard/Dashboard";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // dispatch(logoutAuth());
    navigate("/login", { replace: true });
  }, []);

//   return <Spin fullscreen />;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Administrator />}>
        <Route path="/" element={<Dashboard/>} />
        <Route
          path="/quan-ly-bai-viet"
          element={<PrivateRoute element={<MemberList />} />}
        />
        <Route
          path="/quan-ly-thanh-vien"
          element={<PrivateRoute element={<MemberList />} />}
        />
      </Route>
      {/* <Route path="/admin" element={<Administrator />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/logout" element={<LogoutPage />} /> */}
    </Routes>
  );
};

export default App;
