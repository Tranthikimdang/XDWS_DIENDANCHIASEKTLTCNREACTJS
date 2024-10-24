// Vision UI Dashboard React layouts
import Dashboard from "src/pages/admin/dashboard";
import Questions from "src/pages/admin/questions";

import AddCate from "../pages/admin/category/data/FormAddCate";
import EditCate from "../pages/admin/category/data/FormEditCate";

import CategoryPro from "../pages/admin/category_pro";
import AddCatePro from "../pages/admin/category_pro/data/FormAddCate";
import EditCatePro from "../pages/admin/category_pro/data/FormEditCate";

import Products from "src/pages/admin/product";
import AddProduct from "../pages/admin/product/data/FormAddProduct";
import EditProduct from "../pages/admin/product/data/FormEditProduct";
import productDetail from "../views/product/components/detail"


import productDetailAdmin from "../pages/admin/productDetail"
import AddProDetaill from "../pages/admin/productDetail/data/FormAddProduct"
import EditProDetaill from "../pages/admin/productDetail/data/FormAddProduct"

import Article from "src/pages/admin/article";
import FormAddArticle from "src/pages/admin/article/data/FormAddArticle";
import FormViewArticle from "src/pages/admin/article/data/FormViewArticle";
import FormEditArticle from "src/pages/admin/article/data/FormEditArticle";

import Mentor from "src/pages/admin/mentor";
import FormViewMentor from "src/pages/admin/mentor/data/FormViewMentor";


import Orders from 'src/pages/admin/orders';

// Vision UI Dashboard React icons
// import { IoIosDocument } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { BsFillPersonPlusFill, BsList } from "react-icons/bs";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { BsJournals } from "react-icons/bs";
import { FaQuestionCircle, FaYoutube } from "react-icons/fa";
const routes = [

  {
    type: "collapse",
    name: "Bảng điều khiển",
    key: "dashboard",
    route: "/admin/dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý bài viết",
    key: "article",
    route: "/admin/article",
    icon: <BsJournals size="15px" color="inherit" />,
    component: Article,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý danh mục bài viết",
    key: "category",
    route: "/admin/category",
    icon: <BsFillFileEarmarkTextFill size="15px" color="inherit" />,
    // component: Category,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Bình Luận",
    key: "comment",
    route: "/admin/comment",
    icon: <BsFillPencilFill size="15px" color="inherit" />,
    // component: Comment,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý câu hỏi",
    key: "questions",
    route: "/admin/questions",
    icon: <FaQuestionCircle size="15px" color="inherit" />,
    component: Questions,
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
    name: "Quản lý tài khoản",
    key: "user",
    route: "/admin/user",
    icon: <BsFillPersonPlusFill size="15px" color="inherit" />,
    // component: User,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý mentor",
    key: "mentor",
    route: "/admin/mentor",
    icon: <BsJournals size="15px" color="inherit" />,
    component: Mentor,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý đơn hàng",
    key: "orders",
    route: "/admin/orders",
    icon: <BsList size="15px" color="inherit" />,
    component: Orders,
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
    route: "/admin/commentDetail/:id",
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
  //article
  {
    key: "formeandarticle",
    route: "/admin/formaddarticle",
    component: FormAddArticle,
    hidden: true, // Ẩn mục này            
  },
  {
    key: "formviewarticle",
    route: "/admin/formviewarticle/:id", // Thêm :id để định tuyến theo params
    component: FormViewArticle,
    hidden: true, // Ẩn mục này
  },
  {
    key: "formeditarticle",
    route: "/admin/formeditarticle",
    component: FormEditArticle,
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
  },
  {
    key: "addCate",
    route: "/admin/addCate",
    component: AddCate,
    hidden: true, // Ẩn mục này
  },
  {
    key: "editCate",
    route: "/admin/editCate/:id",
    component: EditCate,
    hidden: true, // Ẩn mục này
  },
  {
    key: "addCate",
    route: "/admin/addCate",
    component: AddCate,
    hidden: true, // Ẩn mục này
  },
  {
    key: "editCate",
    route: "/admin/editCate/:id",
    component: EditCate,
    hidden: true, // Ẩn mục này
  },

  {
    key: 'ProductDetail',
    route: '/admin/productDetail/:id',
    component: productDetailAdmin,
    hidden: true, // Ẩn mục này
  },
  {
    key: 'AddProDetaill',
    route: '/admin/addProDetaill/:product_id',
    component: AddProDetaill,
    hidden: true, // Ẩn mục này
  },
  {
    key: 'EditProDetaill',
    route: '/admin/editProDetaill/:detailId',
    component: EditProDetaill,
    hidden: true, // Ẩn mục này
  },
  {
    key: 'Orders',
    route: '/admin/orders',
    component: Orders,
    hidden: true, // Ẩn mục này
  },
  //mentor
  {
    key: "formviewmentor",
    route: "/admin/formviewmentor/:id", // Thêm :id để định tuyến theo params
    component: FormViewMentor,
    hidden: true, // Ẩn mục này
  },
];

export default routes;
