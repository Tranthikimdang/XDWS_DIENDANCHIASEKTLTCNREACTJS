// Vision UI Dashboard React layouts
import Dashboard from "src/pages/admin/dashboard";
// import Comment from "layouts/comment";
// import questions from "layouts/questions";
// import CommentDetail from "layouts/commentDetail";
// import Category from "layouts/category";
// import Profile from "layouts/profile";
// import Article from "layouts/article";
// import User from "layouts/user";
// import SignIn from "layouts/authentication/sign-in";
// import SignUp from "layouts/authentication/sign-up";

// import FormAddUser from "layouts/user/data/formAddUser";
// import FormEditUser from "layouts/user/data/FormEditUser";
// import FormDeleteUser from "layouts/user/data/FormDeleteUser";

// import FormAddCate from "layouts/category/data/FormAddCate";
// import FormEditCate from "layouts/category/data/FormEditCate";
// import FormDeleteCate from "layouts/category/data/FormDeleteCate";

// import FormAddArticle from "layouts/article/data/FormAndArticle";
// import FormViewArticle from "layouts/article/data/FormViewArticle";
// import FormEditArticle from "layouts/article/data/FormEditArticle";
// import FormDeleteArticle from "layouts/article/data/FormDeleteArticle";

// import FormAddQuestions from "layouts/questions/data/formAddQuestions";
// import FormEditQuestions from "layouts/questions/data/formEditQuestions";
// import FormDeleteQuestions from "layouts/questions/data/formDeleteQuestions";

// import FormAddCmt from "layouts/commentDetail/data/formComment";
// import FormEditCmt from "layouts/commentDetail/data/formEditComment";
// import FormDeleteCmt from "layouts/commentDetail/data/formDeleteComment";

import CategoryPro from "../pages/admin/category_pro";
import AddCatePro from "../pages/admin/category_pro/data/FormAddCate";
import EditCatePro from "../pages/admin/category_pro/data/FormEditCate";

import Products from "src/pages/admin/product";
import AddProduct from "../pages/admin/product/data/FormAddProduct";
import EditProduct from "../pages/admin/product/data/FormEditProduct";
import productDetail from "../views/product/components/detail"

// Vision UI Dashboard React icons
// import { IoIosDocument } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { BsJournals } from "react-icons/bs";
import { FaQuestionCircle, FaYoutube } from "react-icons/fa";
const routes = [
 
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/admin/dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Article Management",
    key: "article",
    route: "/admin/article",
    icon: <BsJournals size="15px" color="inherit" />,
    // component: Article,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Category Management",
    key: "category",
    route: "/admin/category",
    icon: <BsFillFileEarmarkTextFill size="15px" color="inherit" />,
    // component: Category,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Comment Management",
    key: "comment",
    route: "/admin/comment",
    icon: <BsFillPencilFill size="15px" color="inherit" />,
    // component: Comment,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Questions Management",
    key: "questions",
    route: "/admin/questions",
    icon: <FaQuestionCircle size="15px" color="inherit" />,
    // component: questions,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Danh mục sản phẩm",
    key: "categoryPro",
    route: "/admin/categoryPro",
    icon: <BsFillFileEarmarkTextFill size="15px" color="inherit" />,
    component: Products,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý sản phẩm",
    key: "products",
    route: "/admin/products",
    icon: <FaYoutube size="15px" color="inherit" />,
    component: CategoryPro,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "User Management",
    key: "user",
    route: "/admin/user",
    icon: <BsFillPersonPlusFill size="15px" color="inherit" />,
    // component: User,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/admin/profile",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    // component: Profile,
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Logout",
  //   key: "sign-in",
  //   route: "/admin/authentication/sign-in",
  //   icon: <IoIosDocument size="15px" color="inherit" />,
  //   // component: SignIn,
  //   noCollapse: true,
  // },

  {
    key: "commentDetail",
    route: "/admin/commentDetail",
    // component: CommentDetail,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formaddcmt",
    route: "/admin/formaddcmt",
    // component: FormAddCmt,
    hidden: true,
  },
  {
    key: "formeditcmt",
    route: "/admin/formeditcmt",
    // component: FormEditCmt,
    hidden: true, 
  },
  {
    key: "formdeletecmt",
    route: "/admin/formdeletecmt",
    // component: FormDeleteCmt,
    hidden: true, // Ẩn mục này
  },
   // questions
   {
    key: "formaddquestions",
    route: "/admin/formAddQuestions",
    // component: FormAddQuestions,
    hidden: true,
  },
  {
    key: "formeditquestions",
    route: "/admin/formEditQuestions",
    // component: FormEditQuestions,
    hidden: true, 
  },
  {
    key: "formdeletequestions",
    route: "/admin/formDeleteQuestions",
    // component: FormDeleteQuestions,
    hidden: true, // Ẩn mục này
  },
  //cate
  {
    key: "formaddcate",
    route: "/admin/formaddcate",
    // component: FormAddCate,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formeditcate",
    route: "/admin/formeditcate",
    // component: FormEditCate,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formdeletecate",
    route: "/admin/formdeletecate",
    // component: FormDeleteCate,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formadduser",
    route: "/admin/formadduser",
    // component: FormAddUser,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formedituser",
    route: "/admin/formedituser",
    // component: FormEditUser,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formdeleteUser",
    route: "/admin/formdeleteUser",
    // component: FormDeleteUser,
    noCollapse: true,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formeandarticle",
    route: "/admin/formandarticle",
    // component: FormAddArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formviewarticle",
    route: "/admin/formviewarticle/:id", // Thêm :id để định tuyến theo params
    // component: FormViewArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formeditarticle",
    route: "/admin/formeditArticle",
    // component: FormEditArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formdeletearticle",
    route: "/admin/formdeleteArticle",
    // component: FormDeleteArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "addCatePro",
    route: "/admin/addCatePro",
    component: AddCatePro,
    hidden: true, // Ẩn mục này
  },
  {
    key: "editCatePro",
    route: "/admin/editCatePro/:id",
    component: EditCatePro,
    hidden: true, // Ẩn mục này
  },
  {
    key: "addProduct",
    route: "/admin/addProduct",
    component: AddProduct,
    hidden: true, // Ẩn mục này
  },
  {
    key: "editProduct",
    route: "/admin/editProduct/:id",
    component: EditProduct,
    hidden: true, // Ẩn mục này
  },
  {
    key: "editProduct",
    route: '/productDetail/:id',
    component: productDetail,
    hidden: true, // Ẩn mục này
  }

  // '/productDetail/:id'
];

export default routes;
