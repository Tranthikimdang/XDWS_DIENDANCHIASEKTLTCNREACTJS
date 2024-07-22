/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/** 
  All of the routes for the Vision UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

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
import UserForm from "layouts/comment/data/formComment";
import FormAuthority from "layouts/authority/data/formAuthority";
import FormAunouncement from "layouts/announcement/data/formAunouncement";
import AnnouncementDetail from "layouts/announcementDetail";
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
    key: "formaddcmt",
    route: "/formaddcmt",
    component: UserForm,
    noCollapse: true,
  },
  {
    type: "collapse",
    key: "formeditcmt",
    route: "/formeditcmt",
    component: UserForm,
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
    key: "announcementDetail",
    route: "/announcementDetail",
    component: AnnouncementDetail,
    noCollapse: true,
  }

]; 

export default routes;
