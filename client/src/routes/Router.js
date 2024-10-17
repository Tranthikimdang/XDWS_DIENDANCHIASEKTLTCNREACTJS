import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Profile from 'src/views/profile/Profile';
import ForgotPassword from '../views/authentication/ForgotPassword';
import ResetPassword from '../views/authentication/ResetPassword';
import CommentDetail from '../pages/admin/commentDetail';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const AdminLayout = Loadable(lazy(() => import('../layouts/admin'))); // Ensure the correct file is imported

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const Article = Loadable(lazy(() => import('../views/article/Article')));
const CateArticleDetail = Loadable(lazy(() => import('../views/article/components/CateArticleDetail')));
const ArticleDetail = Loadable(lazy(() => import('../views/article/components/ArticleDetail')));
const Newpost = Loadable(lazy(() => import('../views/article/components/new-post')));
const Questions = Loadable(lazy(() => import('../views/questions/Questions')));
const EditQuestions = Loadable(lazy(() => import('../views/questions/EditQuestions')));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Icons = Loadable(lazy(() => import('../views/icons/Icons')));
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')));
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const ProductClient = Loadable(lazy(() => import('../views/product/index')));
const ProductDetail = Loadable(lazy(() => import('../views/product/components/detail')));
const CateDetail = Loadable(lazy(() => import('../views/product/components/cateDetail')));
const ProductDetailUser = Loadable(lazy(() => import('../views/productDetail/index')));
const Cart = Loadable(lazy(() => import('../views/cart/index')));
const Payment = Loadable(lazy(() => import('../views/cart/data/payment')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const UserList = Loadable(lazy(() => import('../views/User/User')));

const DashboardAdmin = Loadable(lazy(() => import('../pages/admin/dashboard')));
const ArticleAdmin = Loadable(lazy(() => import('../pages/admin/article')));
const FormAddArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormAddArticle')));
const FormEditArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormEditArticle')));
const FormViewArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormViewArticle')));

const CommentDetailAdmin = Loadable(lazy(() => import('../pages/admin/commentDetail')));
const CategoryAdmin = Loadable(lazy(() => import('../pages/admin/category')));
const ProfileAdmin = Loadable(lazy(() => import('../pages/admin/profile')));
const CommentAdmin = Loadable(lazy(() => import('../pages/admin/comment')));


const BannerAdmin = Loadable(lazy(() => import('../pages/admin/banner')))
const FormAddBanner = Loadable(lazy(() => import('../pages/admin/banner/data/FormAddBanner')))
const FormEditBanner = Loadable(lazy(() => import('../pages/admin/banner/data/FormEditBanner')))
const FormViewBanner = Loadable(lazy(() => import('../pages/admin/banner/data/FormViewBanner')))



const QuestionAdmin = Loadable(lazy(() => import('../pages/admin/questions')))
const FormAddQuestions = Loadable(lazy(() => import('../pages/admin/questions/data/formAddQuestions')))
const FormEditQuestions = Loadable(lazy(() => import('../pages/admin/questions/data/formEditQuestions')))
const FormViewQuestions = Loadable(lazy(() => import('../pages/admin/questions/data/FormViewQuestions')))

const UserAdmin = Loadable(lazy(() => import('../pages/admin/user')));
const CategoryPro = Loadable(lazy(() => import('../pages/admin/category_pro')));
const AddCatePro = Loadable(lazy(() => import('../pages/admin/category_pro/data/FormAddCate')));
const EditCatePro = Loadable(lazy(() => import('../pages/admin/category_pro/data/FormEditCate')));

const Product = Loadable(lazy(() => import('../pages/admin/product')));
const AddProduct = Loadable(lazy(() => import('../pages/admin/product/data/FormAddProduct')));
const EditProduct = Loadable(lazy(() => import('../pages/admin/product/data/FormEditProduct')));
const AddProDetaill = Loadable(lazy(() => import('../pages/admin/productDetail/data/FormAddProduct')));
const ProDetaill = Loadable(lazy(() => import('../pages/admin/productDetail')));
const EditProDetaill = Loadable(lazy(() => import('../pages/admin/productDetail/data/FormEditProduct')));



const AddCate = Loadable(lazy(() => import('../pages/admin/category/data/FormAddCate')));
const EditCate = Loadable(lazy(() => import('../pages/admin/category/data/FormEditCate')));

const AddUser = Loadable(lazy(() => import('../pages/admin/user/data/formAddUser')));
const EditUser = Loadable(lazy(() => import('../pages/admin/user/data/FormEditUser')));

const Orders = Loadable(lazy(() => import('../pages/admin/orders')));

// Ensure all lazy imports point to default exported components
// And avoid importing the same component multiple times with different casing



const renderRoutes = (role) => {
  const routes = [
    {
      path: '/auth',
      element: <BlankLayout />,
      children: [
        { path: '404', element: <Error /> },
        { path: '/auth/register', element: <Register /> },
        { path: 'login', element: <Login /> },
        { path: '/auth/forgot-password', element: <ForgotPassword /> },
        { path: '/auth/reset-password/:userId', element: <ResetPassword /> },
        // { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    },
    { path: '*', element: <>TRang không tồn tại</> },
  ];
  if (!role) return routes;
  if (role === 'admin') {
    routes.push({
      path: '/',
      element: <FullLayout />,
      children: [
        { path: '/', element: <Navigate to="/home" /> },
        { path: '/home', exact: true, element: <Dashboard /> },
        { path: '/article', exact: true, element: <Article /> },
        { path: '/CateArticleDetail/:id', exact: true, element: <CateArticleDetail /> },
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, // Add this route
        { path: '/new-post', exact: true, element: <Newpost /> }, // Add this route
        { path: '/questions', exact: true, element: <Questions /> },
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, // Add this route for UserList
        { path: '/profile', exact: true, element: <Profile /> },
        { path: '/commentDetail/:id', exact: true, element: <CommentDetail /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },
        { path: '/productDetailUser/:id', exact: true, element: <ProductDetailUser /> },
        { path: '/cart', exact: true, element: <Cart /> },
        { path: '/orders', exact: true, element: <Orders /> },
        { path: '/payment', exact: true, element: <Payment /> },

        // { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    });
    routes.push({
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: 'dashboard', element: <DashboardAdmin /> },
        { path: 'article', exact: true, element: <ArticleAdmin /> },
        { path: 'formaddarticle', exact: true, element: <FormAddArticle/> },
        { path: 'formeditarticle/:id', exact: true, element: <FormEditArticle/> },
        { path: 'formviewarticle/:id', exact: true, element: <FormViewArticle/> },

        { path: 'banner', exact: true, element: <BannerAdmin /> },
        { path: 'formaddbanner', exact: true, element: <FormAddBanner/> },
        { path: 'formeditbanner/:id', exact: true, element: <FormEditBanner/> },
        { path: 'formviewbanner/:id', exact: true, element: <FormViewBanner/> },

        { path: 'comment', exact: true, element: <CommentAdmin /> }, // Add this route
        { path: 'category', exact: true, element: <CategoryAdmin /> },
        { path: 'profile', exact: true, element: <ProfileAdmin /> },
        { path: 'questions', exact: true, element: <QuestionAdmin /> },
        // { path: 'formaddquestions', exact: true, element: <FormAddQuestions/> },
        // { path: 'formeditquestions/:id', exact: true, element: <FormEditQuestions/> },
        // { path: 'formviewquestions/:id', exact: true, element: <FormViewQuestions/> },

        { path: 'questions/:id', exact: true, element: <EditQuestions /> },

        // { path: 'formaddquestions', exact: true, element: <FormAddQuestions/> },
        // { path: 'formeditquestions/:id', exact: true, element: <FormEditQuestions/> },
        // { path: 'formviewquestions/:id', exact: true, element: <FormViewQuestions/> },

        { path: 'user', exact: true, element: <UserAdmin /> },
        { path: 'commentDetail/:id', exact: true, element: <CommentDetailAdmin /> }, // Add this route for UserList
        { path: 'categoryPro', exact: true, element: <CategoryPro /> },
        { path: 'addCatePro', exact: true, element: <AddCatePro /> },
        { path: 'editCatePro/:id', exact: true, element: <EditCatePro /> },
        { path: 'products', exact: true, element: <Product /> },
        { path: 'editProduct/:id', exact: true, element: <EditProduct /> },
        { path: 'addProduct', exact: true, element: <AddProduct /> },
        { path: 'addCate', exact: true, element: <AddCate /> },
        { path: 'editCate/:id', exact: true, element: <EditCate/> },
        { path: 'addCate', exact: true, element: <AddCate/> },
        { path: 'editCate/:id', exact: true, element: <EditCate /> },
        { path: 'addUser', exact: true, element: <AddUser /> }, // Add User route
        { path: 'editUser/:id', exact: true, element: <EditUser /> }, // Edit User route
        { path: 'orders', exact: true, element: <Orders /> }, 
        { path: 'addProDetaill/:product_id', exact: true, element: <AddProDetaill /> }, 
        { path: 'productDetail/:id', exact: true, element: <ProDetaill /> }, 
        { path: 'editProDetaill/:detailId', exact: true, element: <EditProDetaill /> }, 
        // { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    });
  } else if (role === 'user') {
    routes.push({
      path: '/',
      element: <FullLayout />,
      children: [
        { path: '/', element: <Navigate to="/home" /> },
        { path: '/home', exact: true, element: <Dashboard /> },
        { path: '/article', exact: true, element: <Article /> },
        { path: '/CateArticleDetail/:id', exact: true, element: <CateArticleDetail /> },
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, // Add this route
        { path: '/new-post', exact: true, element: <Newpost /> }, // Add this route
        { path: '/questions', exact: true, element: <Questions /> },
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, // Add this route for UserList
        { path: '/profile', exact: true, element: <Profile /> },
        { path: '/commentDetail/:id', exact: true, element: <CommentDetail /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },
        { path: '/productDetailUser/:id', exact: true, element: <ProductDetailUser /> },
        { path: '/cart', exact: true, element: <Cart /> },

        // { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    });
  } else {
    routes.push({
      path: '/',
      element: <FullLayout />,
      children: [
        { path: '/', element: <Navigate to="/home" /> },
        { path: '/home', exact: true, element: <Dashboard /> },
        { path: '/article', exact: true, element: <Article /> },
        { path: '/CateArticleDetail/:id', exact: true, element: <CateArticleDetail /> },
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, // Add this route
        { path: '/new-post', exact: true, element: <Newpost /> }, // Add this route
        { path: '/questions', exact: true, element: <Questions /> },
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, // Add this route for UserList
        { path: '/profile', exact: true, element: <Profile /> },
        { path: '/commentDetail', exact: true, element: <CommentDetail /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },
        { path: '/productDetailUser/:id', exact: true, element: <ProductDetailUser /> },
        { path: '/cart', exact: true, element: <Cart /> },
        // { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    });
  }
  return routes;
};

export default renderRoutes;
