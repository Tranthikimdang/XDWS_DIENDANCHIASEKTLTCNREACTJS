// Vision UI Dashboard React layouts
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

import FormAddUser from "layouts/user/data/formAddUser";
import FormEditUser from "layouts/user/data/FormEditUser";
import FormDeleteUser from "layouts/user/data/FormDeleteUser";

import FormAuthority from "layouts/authority/data/formAuthority";
import FormAunouncement from "layouts/announcement/data/formAunouncement";
import AuthorityDetail from "layouts/authorityDetail";

import FormAddCate from "layouts/category/data/FormAddCate";
import FormEditCate from "layouts/category/data/FormEditCate";
import FormDeleteCate from "layouts/category/data/FormDeleteCate";

import FormEditArticle from "layouts/tables/data/FormEditArticle";
import FormDeleteArticle from "layouts/tables/data/FormDeleteArticle";

import FormAddCmt from "layouts/comment/data/formComment";
import FormEditCmt from "layouts/comment/data/formEditComment";


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
    name: "Announcement",
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
    key: "formaddcmt",
    route: "/formaddcmt",
    component: FormAddCmt,
    noCollapse: true,
  },

  {
    type: "collapse",
    key: "formaddcate",
    route: "/formaddcate",
    component: FormAddCate,
  },
  {
    type: "collapse",
    key: "formeditcate",
    route: "/formeditcate",
    component: FormEditCate,
    noCollapse: true,
  },
  {
    key: "formdeletecate",
    route: "/formdeletecate",
    component: FormDeleteCate,
    noCollapse: true,
  },
// 

{
  type: "collapse",
  key: "formadduser",
  route: "/formadduser",
  component: FormAddUser,
},
{
  type: "collapse",
  key: "formedituser",
  route: "/formedituser",
  component: FormEditUser,
  noCollapse: true,
},
{
  key: "formdeleteUser",
  route: "/formdeleteUser",
  component: FormDeleteUser,
  noCollapse: true,
},
// 

  {
    type: "collapse",
    key: "formeditcmt",
    route: "/formeditcmt",
    component: FormEditCmt,
    noCollapse: true,
  },
  
  {
    type: "collapse",
    key: "formaddcmt",
    route: "/formaddcmt",
    component: FormAddCmt,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formeditcmt",
    route: "/formeditcmt",
    component: FormEditCmt,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formeditarticle",
    route: "/formeditArticle",
    component: FormEditArticle,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formdeletearticle",
    route: "/formdeleteArticle",
    component: FormDeleteArticle,
    noCollapse: true,

  },
  {
    type: "collapse",
    key: "formauthority",
    route: "/formauthority",
    component: FormAuthority,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formAunouncement",
    route: "/formAunouncement",
    component: FormAunouncement,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "authorityDetail",
    route: "/authorityDetail",
    component: AuthorityDetail,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formeditcmt",
    route: "/formeditcmt",
    component: FormEditCmt,
    noCollapse: true,
  },

];

export default routes;
