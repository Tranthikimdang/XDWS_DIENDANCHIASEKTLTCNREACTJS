import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Profile from 'src/views/profile/Profile';
import ForgotPassword from '../views/authentication/ForgotPassword';
import ResetPassword from '../views/authentication/ResetPassword';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const AdminLayout = Loadable(lazy(() => import('../layouts/admin')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const Article = Loadable(lazy(() => import('../views/article/Article')));
const ArticleDetail = Loadable(lazy(() => import('../views/article/components/ArticleDetail')));
const Newpost = Loadable(lazy(() => import('../views/article/components/new-post.js')));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Icons = Loadable(lazy(() => import('../views/icons/Icons')));
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')));
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const ProductClient = Loadable(lazy(() => import('../views/product/index')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const UserList = Loadable(lazy(() => import('../views/User/User')));

/* ****Admin Pages***** */
const DashboardAdmin = Loadable(lazy(() => import('../pages/admin/dashboard')));
const ArticleAdmin = Loadable(lazy(() => import('../pages/admin/article')));
const FormAddArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormAddArticle')));
const FormEditArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormEditArticle')));
const FormViewArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormViewArticle')));
const CommentDetailAdmin = Loadable(lazy(() => import('../pages/admin/commentDetail')));
const CategoryAdmin = Loadable(lazy(() => import('../pages/admin/category')));
const ProfileAdmin = Loadable(lazy(() => import('../pages/admin/profile')));
const CommentAdmin = Loadable(lazy(() => import('../pages/admin/comment')));
const QuestionAdmin = Loadable(lazy(() => import('../pages/admin/questions')));
const UserAdmin = Loadable(lazy(() => import('../pages/admin/user')));
const CategoryPro = Loadable(lazy(() => import('../pages/admin/category_pro')));
const AddCatePro = Loadable(lazy(() => import('../pages/admin/category_pro/data/FormAddCate')));
const EditCatePro = Loadable(lazy(() => import('../pages/admin/category_pro/data/FormEditCate')));
const Product = Loadable(lazy(() => import('../pages/admin/product')));
const AddProduct = Loadable(lazy(() => import('../pages/admin/product/data/FormAddProduct')));
const EditProduct = Loadable(lazy(() => import('../pages/admin/product/data/FormEditProduct')));
const Category = Loadable(lazy(() => import('../pages/admin/category')));
const AddCate = Loadable(lazy(() => import('../pages/admin/category/data/FormAddCate')));
const EditCate = Loadable(lazy(() => import('../pages/admin/category/data/FormEditCate')));

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
      ],
    },
    { path: '*', element: <>TRang không tồn tại</> },
  ];

  const userRoutes = [
    { path: '/', element: <Navigate to="/home" /> },
    { path: '/home', exact: true, element: <Dashboard /> },
    { path: '/article', exact: true, element: <Article /> },
    { path: '/article/:id', exact: true, element: <ArticleDetail /> },
    { path: '/new-post', exact: true, element: <Newpost /> },
    { path: '/sample-page', exact: true, element: <SamplePage /> },
    { path: '/icons', exact: true, element: <Icons /> },
    { path: '/ui/typography', exact: true, element: <TypographyPage /> },
    { path: '/ui/shadow', exact: true, element: <Shadow /> },
    { path: '/user', exact: true, element: <UserList /> },
    { path: '/profile', exact: true, element: <Profile /> },
    { path: '/products', exact: true, element: <ProductClient /> },
  ];

  const adminRoutes = [
    { path: 'dashboard', element: <DashboardAdmin /> },
    { path: 'article', exact: true, element: <ArticleAdmin /> },
    { path: 'formaddarticle', exact: true, element: <FormAddArticle /> },
    { path: 'formeditarticle', exact: true, element: <FormEditArticle /> },
    { path: 'formviewarticle/:id', exact: true, element: <FormViewArticle /> },
    { path: 'comment', exact: true, element: <CommentAdmin /> },
    { path: 'category', exact: true, element: <CategoryAdmin /> },
    { path: 'profile', exact: true, element: <ProfileAdmin /> },
    { path: 'questions', exact: true, element: <QuestionAdmin /> },
    { path: 'user', exact: true, element: <UserAdmin /> },
    { path: 'comment-detail', exact: true, element: <CommentDetailAdmin /> },
    { path: 'categoryPro', exact: true, element: <CategoryPro /> },
    { path: 'addCatePro', exact: true, element: <AddCatePro /> },
    { path: 'editCatePro/:id', exact: true, element: <EditCatePro /> },
    { path: 'products', exact: true, element: <Product /> },
    { path: 'editProduct/:id', exact: true, element: <EditProduct /> },
    { path: 'addProduct', exact: true, element: <AddProduct /> },
    { path: 'category', exact: true, element: <Category /> },
    { path: 'addCate', exact: true, element: <AddCate /> },
    { path: 'editCate/:id', exact: true, element: <EditCate /> },
  ];

  if (role === 'admin') {
    routes.push({
      path: '/',
      element: <FullLayout />,
      children: userRoutes,
    });
    routes.push({
      path: '/admin',
      element: <AdminLayout />,
      children: adminRoutes,
    });
  } else if (role === 'user') {
    routes.push({
      path: '/',
      element: <FullLayout />,
      children: userRoutes,
    });
  }

  return routes;
};

export default renderRoutes;
