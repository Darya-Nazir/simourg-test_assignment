import type { RouteRecordRaw } from 'vue-router'

import UserCreatePage from '@/pages/Users/UserCreatePage.vue'
import UserEditPage from '@/pages/Users/UserEditPage.vue'
import UsersListPage from '@/pages/Users/UsersListPage.vue'

export const ROUTE_NAMES = {
  USERS_LIST: 'users-list',
  USERS_NEW: 'users-new',
  USERS_EDIT: 'users-edit',
} as const

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/users',
  },
  {
    path: '/users',
    name: ROUTE_NAMES.USERS_LIST,
    component: UsersListPage,
  },
  {
    path: '/users/new',
    name: ROUTE_NAMES.USERS_NEW,
    component: UserCreatePage,
  },
  {
    path: '/users/:id/edit',
    name: ROUTE_NAMES.USERS_EDIT,
    component: UserEditPage,
  },
]
