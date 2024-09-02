import {
  IconHome, IconLogin, IconUserPlus, IconBook2, IconUser

} from '@tabler/icons';

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
    title: 'Article',
    icon: IconBook2,
    href: '/article',
  },

  // {
  //   navlabel: true,
  //   subheader: 'Code',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Tag',
  //   icon: IconTag,
  //   href: '/ui/typography',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Questions',
  //   icon: IconBrandHipchat,
  //   href: '/ui/shadow',
  // },
  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Profile',
    icon: IconUser,
    href: '/profileClient',
  },
  {
    id: uniqueId(),
    title: 'Login',
    icon: IconLogin,
    href: '/auth/login',
  },
  
  // {
  //   id: uniqueId(),
  //   title: 'Add User',
  //   icon: IconUserPlus,
  //   href: '/auth/register',
  // },

  
  // {
  //   navlabel: true,
  //   subheader: 'Extra',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Icons',
  //   icon: IconMoodHappy,
  //   href: '/icons',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Sample Page',
  //   icon: IconAperture,
  //   href: '/sample-page',
  // },
];

export default Menuitems;
