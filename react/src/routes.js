// Vision UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Comment from "layouts/comment";
import CommentDetail from "layouts/commentDetail";
import Category from "layouts/category";
import Profile from "layouts/profile";
import Article from "layouts/article";
import User from "layouts/user";
import SignIn from "layouts/authentication/sign-in";

import FormAddUser from "layouts/user/data/formAddUser";
import FormEditUser from "layouts/user/data/FormEditUser";
import FormDeleteUser from "layouts/user/data/FormDeleteUser";


import FormAddCate from "layouts/category/data/FormAddCate";
import FormEditCate from "layouts/category/data/FormEditCate";
import FormDeleteCate from "layouts/category/data/FormDeleteCate";

import FormAddArticle from "layouts/article/data/FormAndArticle";
import FormViewArticle from "layouts/article/data/FormViewArticle";
import FormEditArticle from "layouts/article/data/FormEditArticle";
import FormDeleteArticle from "layouts/article/data/FormDeleteArticle";

import FormAddCmt from "layouts/commentDetail/data/formComment";
import FormDeleteCmt from "layouts/commentDetail/data/formDeleteComment";

// Vision UI Dashboard React icons
import { IoIosDocument } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { BsJournals } from "react-icons/bs";
import { BsBellFill } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa";
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
    key: "article",
    route: "/article",
    icon: <BsJournals size="15px" color="inherit" />,
    component: Article,
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
 
  // router form thêm sửa xóa
  {
    key: "commentDetail",
    route: "/commentDetail",
    component: CommentDetail,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formaddcmt",
    route: "/formaddcmt",
    component: FormAddCmt,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formdeletecmt",
    route: "/formdeletecmt",
    component: FormDeleteCmt,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formaddcate",
    route: "/formaddcate",
    component: FormAddCate,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formeditcate",
    route: "/formeditcate",
    component: FormEditCate,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formdeletecate",
    route: "/formdeletecate",
    component: FormDeleteCate,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formadduser",
    route: "/formadduser",
    component: FormAddUser,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formedituser",
    route: "/formedituser",
    component: FormEditUser,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formdeleteUser",
    route: "/formdeleteUser",
    component: FormDeleteUser,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formeandarticle",
    route: "/formandarticle",
    component: FormAddArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formviewarticle",
    route: "/formviewarticle/:id", // Thêm :id để định tuyến theo params
    component: FormViewArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formeditarticle",
    route: "/formeditArticle",
    component: FormEditArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formdeletearticle",
    route: "/formdeleteArticle",
    component: FormDeleteArticle,
    hidden: true, // Ẩn mục này
  }

];


export default routes;