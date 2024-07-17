import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import MemberList from "./components/MemberList/MemberList";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./admin.css";

function Administrator() {
  return (
    <div className="background">
      <div className="wrapper">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Administrator;
