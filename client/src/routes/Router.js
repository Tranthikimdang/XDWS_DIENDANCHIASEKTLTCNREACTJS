import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Profile from 'src/views/profile/Profile';
import ForgotPassword from '../views/authentication/ForgotPassword';
import ResetPassword from '../views/authentication/ResetPassword';
import CommentDetail from '../pages/admin/commentDetail';
import ChatDetails from '../views/chat/ChatDetails'; // Import the ChatDetails component

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const AdminLayout = Loadable(lazy(() => import('../layouts/admin'))); // Ensure the correct file is imported

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const Article = Loadable(lazy(() => import('../views/article/Article')));
const Contact = Loadable(lazy(() => import('../views/contact/Contact')));
const CateArticleDetail = Loadable(
  lazy(() => import('../views/article/components/CateArticleDetail')),
);
const Chatbox = Loadable(lazy(() => import('../views/Chatbox/chatbox')));
const ArticleDetail = Loadable(lazy(() => import('../views/article/components/ArticleDetail')));
const Newpost = Loadable(lazy(() => import('../views/article/components/new-post')));
const Questions = Loadable(lazy(() => import('../views/questions/Questions')));
const QuestionDetail = Loadable(lazy(() => import('../views/questions/components/QuestionDetail')));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Icons = Loadable(lazy(() => import('../views/icons/Icons')));
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')));
const Shadow = Loadable(lazy(() => import('../')));
const ProductClient = Loadable(lazy(() => import('../views/course/index')));
const ProductDetail = Loadable(lazy(() => import('../views/course/components/detail')));
const CateDetail = Loadable(lazy(() => import('../views/course/components/cateDetail')));
const ProductDetailUser = Loadable(lazy(() => import('../views/courseDetail/index')));
const Cart = Loadable(lazy(() => import('../views/cart/index')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const UserList = Loadable(lazy(() => import('../views/User/User')));
const Inter = Loadable(lazy(() => import('../views/inter')));
const Mentor = Loadable(lazy(() => import('../views/mentor/mentor')));
const RegisterMentor = Loadable(lazy(() => import('../views/mentor/registerMentor')));
const EditProfile = Loadable(lazy(() => import('../views/profile/editProfile')));
const Notification = Loadable(lazy(() => import('../views/notification')));
const Friend = Loadable(lazy(() => import('../views/Friend/Friend')));
const Certificate = Loadable(lazy(() => import('../views/certificate')));
const QH = Loadable(lazy(() => import('../views/questions/components/Questions_hashtag')));


//admin
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
const FormViewQuestion = Loadable(lazy(() => import('../pages/admin/questions/data/formViewQuestion')));
const FormEditQuestion = Loadable(lazy(() => import('../pages/admin/questions/data/formEditQuestion.js')));

const UserAdmin = Loadable(lazy(() => import('../pages/admin/user')));
const CategoryPro = Loadable(lazy(() => import('../pages/admin/category_pro')));
const AddCatePro = Loadable(lazy(() => import('../pages/admin/category_pro/data/FormAddCate')));
const EditCatePro = Loadable(lazy(() => import('../pages/admin/category_pro/data/FormEditCate')));

const Product = Loadable(lazy(() => import('../pages/admin/course')));
const AddProduct = Loadable(lazy(() => import('../pages/admin/course/data/FormAdd')));
const EditProduct = Loadable(lazy(() => import('../pages/admin/course/data/FormEdit')));
const AddProDetaill = Loadable(
  lazy(() => import('../pages/admin/courseDetail/data/FormAdd')),
);
const ProDetaill = Loadable(lazy(() => import('../pages/admin/courseDetail')));
const EditProDetaill = Loadable(lazy(() => import('../pages/admin/courseDetail/data/FormEdit')));


const AddCate = Loadable(lazy(() => import('../pages/admin/category/data/FormAddCate')));
const EditCate = Loadable(lazy(() => import('../pages/admin/category/data/FormEditCate')));

const AddUser = Loadable(lazy(() => import('../pages/admin/user/data/formAddUser')));
const EditUser = Loadable(lazy(() => import('../pages/admin/user/data/FormEditUser')));

const MentorAdmin = Loadable(lazy(() => import('../pages/admin/mentor')));
const FormViewMentor = Loadable(lazy(() => import('../pages/admin/mentor/data/FormViewMentor')));

const HasgtagAdmin = Loadable(lazy(() => import('../pages/admin/hashtag/')));
const AddHasgtag = Loadable(lazy(() => import('../pages/admin/hashtag/data/FormAddHashtag')));
const EditHasgtag = Loadable(lazy(() => import('../pages/admin/hashtag/data/FormEditHashtag')));
 
const AddExercise = Loadable(lazy(() => import('../pages/admin/exercise/data/FormAdd')));
const EditExercise = Loadable(lazy(() => import('../pages/admin/exercise/data/FormEdit')));

const Orders = Loadable(lazy(() => import('../pages/admin/orders')));

const StudyTime = Loadable(lazy(() => import('../pages/admin/studyTime')));
const AddStudyTime = Loadable(lazy(() => import('../pages/admin/studyTime/data/FormAdd')));




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
        { path: '/auth/inter', exact: true, element: <Inter /> },
        { path: '/auth/registerMentor', exact: true, element: <RegisterMentor /> },
        { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    },
    { path: '*', element: <>Trang không tồn tại</> },
  ];
  if (!role) return routes;
  if (role === 'admin') {
    routes.push({
      path: '/',
      element: <FullLayout />,
      children: [
        { path: '/', element: <Navigate to="/home" /> },
        { path: '/chat', exact: true, element: <Chatbox /> },
        { path: '/chat/:userId', exact: true, element: <ChatDetails /> },
        { path: '/home', exact: true, element: <Dashboard /> },
        { path: '/article', exact: true, element: <Article /> },
        { path: '/contact', exact: true, element: <Contact /> },
        { path: '/CateArticleDetail/:id', exact: true, element: <CateArticleDetail /> },
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, 
        { path: '/new-post', exact: true, element: <Newpost /> }, 
        { path: '/questions', exact: true, element: <Questions /> },
        { path: '/questions/:questionId', exact: true, element: <QuestionDetail /> }, 
        { path: '/mentor', exact: true, element: <Mentor /> },
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> },
        { path: '/mentor', exact: true, element: <Mentor /> },
        { path: '/registerMentor', exact: true, element: <RegisterMentor /> },
        { path: '/profile/:userId', exact: true, element: <Profile /> },
        { path: '/commentDetail/:type/:id', exact: true, element: <CommentDetail /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },
        { path: '/productDetailUser/:id', exact: true, element: <ProductDetailUser /> },
        { path: '/cart', exact: true, element: <Cart /> },
        { path: '/orders', exact: true, element: <Orders /> },
        { path: '/editProfile/:userId', exact: true, element: <EditProfile /> },
        { path: '/notification/:userId', exact: true, element: <Notification /> },
        { path: '/friend', exact: true, element: <Friend /> },
        { path: '/certificate/:userId', exact: true, element: <Certificate /> },
        { path: '/question_Hashtag/:hashtagId', exact: true, element: <QH /> },
      ],
    });
    routes.push({
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: 'dashboard', element: <DashboardAdmin /> },
        { path: 'article', exact: true, element: <ArticleAdmin /> },
        { path: 'formaddarticle', exact: true, element: <FormAddArticle /> },
        { path: 'formeditarticle/:id', exact: true, element: <FormEditArticle /> },
        { path: 'formviewarticle/:id', exact: true, element: <FormViewArticle /> },
        { path: 'comment', exact: true, element: <CommentAdmin /> }, // Add this route
        { path: 'category', exact: true, element: <CategoryAdmin /> },
        { path: 'questions', exact: true, element: <QuestionAdmin /> },
        { path: 'questions/view/:id', exact: true, element: <FormViewQuestion /> },
        { path: 'questions/edit/:id', exact: true, element: <FormEditQuestion /> },
        { path: 'user', exact: true, element: <UserAdmin /> },
        { path: 'commentDetail/:id', exact: true, element: <CommentDetailAdmin /> }, // Add this route for UserList
        { path: 'categoryPro', exact: true, element: <CategoryPro /> },
        { path: 'addCatePro', exact: true, element: <AddCatePro /> },
        { path: 'editCatePro/:id', exact: true, element: <EditCatePro /> },
        { path: 'products', exact: true, element: <Product /> },
        { path: 'editProduct/:id', exact: true, element: <EditProduct /> },
        { path: 'addProduct', exact: true, element: <AddProduct /> },
        { path: 'addCate', exact: true, element: <AddCate /> },
        { path: 'editCate/:id', exact: true, element: <EditCate /> },
        { path: 'addCate', exact: true, element: <AddCate /> },
        { path: 'editCate/:id', exact: true, element: <EditCate /> },
        { path: 'addUser', exact: true, element: <AddUser /> }, // Add User route
        { path: 'editUser/:id', exact: true, element: <EditUser /> }, // Edit User route
        { path: 'orders', exact: true, element: <Orders /> }, 
        { path: 'addProDetaill/:course_id', exact: true, element: <AddProDetaill /> }, 
        { path: 'productDetail/:course_id', exact: true, element: <ProDetaill /> }, 
        { path: 'editProDetaill/:course_id/:detailId', exact: true, element: <EditProDetaill /> }, 
        { path: 'mentor', exact: true, element: <MentorAdmin /> },
        { path: 'formviewmentor/:id', exact: true, element: <FormViewMentor/> },
        { path: 'profile', exact: true, element: <ProfileAdmin/> },
        { path: 'hashtag', exact: true, element: <HasgtagAdmin/> },
        { path: 'addhashtag', exact: true, element: <AddHasgtag /> },
        { path: 'edithashtag/:id', exact: true, element: <EditHasgtag /> },
        { path: 'studyTime', exact: true, element: <StudyTime /> },
        { path: 'addStudyTime', exact: true, element: <AddStudyTime /> },
        { path: 'addExercise/:course_id', exact: true, element: <AddExercise /> },
        { path: 'editExercise/:course_id/:exercise_id', exact: true, element: <EditExercise /> }, 
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
        { path: '/chat', exact: true, element: <Chatbox /> },
        { path: '/article', exact: true, element: <Article /> },
        { path: '/CateArticleDetail/:id', exact: true, element: <CateArticleDetail /> },
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, 
        { path: '/new-post', exact: true, element: <Newpost /> }, 
        { path: '/questions', exact: true, element: <Questions /> },
        { path: '/questions/:questionId', exact: true, element: <QuestionDetail /> }, 
        { path: '/mentor', exact: true, element: <Mentor /> },
        { path: '/registerMentor', exact: true, element: <RegisterMentor /> },
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, 
        { path: '/profile/:userId', exact: true, element: <Profile /> },
        { path: '/commentDetail/:type/:id', exact: true, element: <CommentDetail /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },
        { path: '/productDetailUser/:id', exact: true, element: <ProductDetailUser /> },
        { path: '/cart', exact: true, element: <Cart /> },  
        { path: '/editProfile/:userId', exact: true, element: <EditProfile /> },      
        { path: '*', element: <Navigate to="/auth/404" /> },
        { path: '/notification/:userId', exact: true, element: <Notification /> },
        { path: '/friend', exact: true, element: <Friend /> },
        { path: '/certificate/:userId', exact: true, element: <Certificate /> },
        { path: '/question_Hashtag/:hashtagId', exact: true, element: <QH /> },
      ],
    });
  } else {
    routes.push({
      path: '/',
      element: <FullLayout />,
      children: [
        { path: '/', element: <Navigate to="/home" /> },
        { path: '/home', exact: true, element: <Dashboard /> },
        { path: '/chat', exact: true, element: <Chatbox /> },
        { path: '/article', exact: true, element: <Article /> },
        { path: '/contact', exact: true, element: <Contact /> },
        { path: '/CateArticleDetail/:id', exact: true, element: <CateArticleDetail /> },
        { path: '/article/:id', exact: true, element: <ArticleDetail /> }, 
        { path: '/new-post', exact: true, element: <Newpost /> }, 
        { path: '/questions', exact: true, element: <Questions /> },
        { path: '/questions/:questionId', exact: true, element: <QuestionDetail /> }, 
        { path: '/sample-page', exact: true, element: <SamplePage /> },
        { path: '/icons', exact: true, element: <Icons /> },
        { path: '/ui/typography', exact: true, element: <TypographyPage /> },
        { path: '/ui/shadow', exact: true, element: <Shadow /> },
        { path: '/user', exact: true, element: <UserList /> }, 
        { path: '/mentor', exact: true, element: <Mentor /> }, 
        { path: '/RegisterMentor', exact: true, element: <RegisterMentor /> },
        { path: '/profile/:userId', exact: true, element: <Profile /> },
        { path: '/commentDetail', exact: true, element: <CommentDetail /> },
        { path: '/products', exact: true, element: <ProductClient /> },
        { path: '/productDetail/:id', exact: true, element: <ProductDetail /> },
        { path: '/cateDetail/:id', exact: true, element: <CateDetail /> },
        { path: '/productDetailUser/:id', exact: true, element: <ProductDetailUser /> },
        { path: '/cart', exact: true, element: <Cart /> },
        { path: '/editProfile/:userId', exact: true, element: <EditProfile /> },
        { path: '/notification/:userId', exact: true, element: <Notification /> },
        { path: '/friend', exact: true, element: <Friend /> },
        { path: '/certificate/:userId', exact: true, element: <Certificate /> },
        { path: '/question_Hashtag/:hashtagId', exact: true, element: <QH /> },
        { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    });
  }
  return routes;
};

export default renderRoutes;
