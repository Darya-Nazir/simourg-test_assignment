import { createRouter, createWebHistory } from 'vue-router'

import HealthCheckPage from '@/pages/HealthCheckPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'health-check',
      component: HealthCheckPage,
    },
  ],
})

export default router
