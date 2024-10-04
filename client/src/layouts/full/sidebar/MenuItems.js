import {
  IconHome, IconLogin, IconUserPlus, IconBook2, IconUsers, IconBrandYoutube
} from '@tabler/icons';
import { IconInfoSquareRounded } from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconHome,
    href: '/home',
  },
  {
    id: uniqueId(),
    title: 'Hỏi',
    icon: IconInfoSquareRounded,
    href: '/questions',
  },
  {
    id: uniqueId(),
    title: 'Bài viết',
    icon: IconBook2,
    href: '/article',
  },
  {
    id: uniqueId(),
    title: 'Khóa học',
    icon: IconBrandYoutube,
    href: '/products',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUsers,
    href: '/user', 
  },
  // {
  //   navlabel: true,
  //   subheader: 'Auth',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'LogOut',
  //   icon: IconLogin,
  //   href: '/auth/login',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Register',
  //   icon: IconUserPlus,
  //   href: '/auth/register',
  // },
];

export default Menuitems;
