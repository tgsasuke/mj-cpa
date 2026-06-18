import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/admin', 
      beforeEnter(to, from, next) {
        // 直接真跳轉到帶有 index.html 的路徑，繞過 Vue
        window.location.href = '/admin/index.html'
      }
    },
  ]
})

export default router