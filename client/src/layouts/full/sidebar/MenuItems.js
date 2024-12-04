import {
  IconHome, IconUsers, IconBrandYoutube
} from '@tabler/icons';
import { IconUser } from '@tabler/icons-react';
import { IconInfoSquareRounded } from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Trang chủ',
    icon: IconHome,
    href: '/home',
  },
  {
    id: uniqueId(),
    title: 'Câu hỏi',
    icon: IconInfoSquareRounded,
    href: '/questions',
  },
  // {
  //   id: uniqueId(),
  //   title: 'Bài viết',
  //   icon: IconBook2,
  //   href: '/article',
  // },
  {
    id: uniqueId(),
    title: 'Khóa học',
    icon: IconBrandYoutube,
    href: '/products',
  },
  {
    id: uniqueId(),
    title: 'Người cố vấn',
    icon: IconUsers,
    href: '/mentor',
  },
  {
    id: uniqueId(),
    title: 'Người dùng',
    icon: IconUser,
    href: '/user',
  },
  {
  id: uniqueId(),
  title: 'Liên hệ',
  icon: IconUsers,
  href: '/contact', 
  },
];

export default Menuitems;
