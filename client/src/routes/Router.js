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
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const Article = Loadable(lazy(() => import('../views/article/Article')));
const ArticleDetail = Loadable(lazy(() => import('../views/article/components/ArticleDetail'))); // Import the ArticleDetail component
const Newpost = Loadable(lazy(() => import('../views/article/components/new-post.js'))); // Import the ArticleDetail component
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Icons = Loadable(lazy(() => import('../views/icons/Icons')));
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')));
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const ProductClient = Loadable(lazy(() => import('../views/product/index')));
const ProductDetail = Loadable(lazy(() => import('../views/product/components/detail')));
const CateDetail = Loadable(lazy(() => import('../views/product/components/cateDetail')));


const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const UserList = Loadable(lazy(() => import('../views/User/User'))); // Import the UserList component


const DashboardAdmin = Loadable(lazy(() => import('../pages/admin/dashboard')))

const ArticleAdmin = Loadable(lazy(() => import('../pages/admin/article')))
const FormAddArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormAddArticle')))
const FormEditArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormEditArticle')))
const FormViewArticle = Loadable(lazy(() => import('../pages/admin/article/data/FormViewArticle')))

const CommentDetailAdmin = Loadable(lazy(() => import('../pages/admin/commentDetail')))
const CategoryAdmin = Loadable(lazy(() => import('../pages/admin/category')))
const ProfileAdmin = Loadable(lazy(() => import('../pages/admin/profile')))
const CommentAdmin = Loadable(lazy(() => import('../pages/admin/comment')))

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
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, // Add this route
        { path: '/new-post', exact: true, element: <Newpost /> }, // Add this route
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, // Add this route for UserList
        { path: '/profile', exact: true, element: <Profile /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },
        // { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    });
    routes.push({
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: 'dashboard', element: <DashboardAdmin/> },
        { path: 'article', exact: true, element: <ArticleAdmin/> },
        { path: 'formaddarticle', exact: true, element: <FormAddArticle/> },
        { path: 'formeditarticle/:id', exact: true, element: <FormEditArticle/> },
        { path: 'formviewarticle/:id', exact: true, element: <FormViewArticle/> },
        { path: 'comment', exact: true, element: <CommentAdmin /> }, // Add this route
        { path: 'category', exact: true, element: <CategoryAdmin /> },
        { path: 'profile', exact: true, element: <ProfileAdmin /> },
        { path: 'questions', exact: true, element: <QuestionAdmin /> },
        { path: 'formaddquestions', exact: true, element: <FormAddQuestions/> },
        { path: 'formeditquestions/:id', exact: true, element: <FormEditQuestions/> },
        { path: 'formviewquestions/:id', exact: true, element: <FormViewQuestions/> },
        { path: 'user', exact: true, element: <UserAdmin /> },
        { path: 'comment-detail', exact: true, element: <CommentDetailAdmin /> }, // Add this route for UserList
        { path: 'categoryPro', exact: true, element: <CategoryPro /> },
        { path: 'addCatePro', exact: true, element: <AddCatePro /> },
        { path: 'editCatePro/:id', exact: true, element: <EditCatePro /> },
        { path: 'products', exact: true, element: <Product /> },
        { path: 'editProduct/:id', exact: true, element: <EditProduct /> },
        { path: 'addProduct', exact: true, element: <AddProduct /> },
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
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, // Add this route
        { path: '/new-post', exact: true, element: <Newpost /> }, // Add this route
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, // Add this route for UserList
        { path: '/profile', exact: true, element: <Profile /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },

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
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, // Add this route
        { path: '/new-post', exact: true, element: <Newpost /> }, // Add this route
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, // Add this route for UserList
        { path: '/profile', exact: true, element: <Profile /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },

        // { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    });
  }
  return routes;
};

export default renderRoutes;
