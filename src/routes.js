import React from "react";
import Dashboard from "layouts/dashboard";
import Comment from "layouts/comment";
import Category from "layouts/category";
import Profile from "layouts/profile";
import Tables from "layouts/tables";
import User from "layouts/user";
import Announcement from "layouts/announcement";
import Authority from "layouts/authority";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import FormAddCate from "layouts/category/data/FormAddCate.js";
import FormEditCate from "layouts/category/data/FormEditCate";
import FormDeleteCate from "layouts/category/data/FormDeleteCate";
// Vision UI Dashboard React icons
import { IoRocketSharp } from "react-icons/io5";
import { IoIosDocument } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { BsJournals } from "react-icons/bs";
import { BsBellFill } from "react-icons/bs";
import { BsGearFill } from "react-icons/bs";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Article Management",
    key: "tables",
    route: "/tables",
    icon: <BsJournals size="15px" color="inherit" />,
    component: Tables,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Category Management",
    key: "category",
    route: "/category",
    icon: <BsFillFileEarmarkTextFill size="15px" color="inherit" />,
    component: Category,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Comment Management",
    key: "comment",
    route: "/comment",
    icon: <BsFillPencilFill size="15px" color="inherit" />,
    component: Comment,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "User Management",
    key: "user",
    route: "/user",
    icon: <BsFillPersonPlusFill size="15px" color="inherit" />,
    component: User,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Announcement Management",
    key: "announcement",
    route: "/announcement",
    icon: <BsBellFill size="15px" color="inherit" />,
    component: Announcement,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Authority Management",
    key: "authority",
    route: "/authority",
    icon: <BsGearFill size="15px" color="inherit" />,
    component: Authority,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: Profile,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <IoIosDocument size="15px" color="inherit" />,
    component: SignIn,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: SignUp,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formaddcate",
    route: "/formaddcate",
    component: FormAddCate,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formeditcate",
    route: "/formeditcate",
    component: FormEditCate,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formdeletecate",
    route: "/formdeletecate",
    component: FormDeleteCate,
    noCollapse: true,
  }
];

export default routes;
