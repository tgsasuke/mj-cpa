import { createRouter, createWebHistory } from 'vue-router'
import PostDetail from '@/components/PostDetail.vue'
import HomeView from '@/views/HomeView.vue'
import { usePostsStore } from '@/stores/postsStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      component: HomeView,
      beforeEnter(to, from, next) {
        window.location.href = '/admin/index.html'
      }
    },
    {
      // 路由 A：純分類文章列表
      path: '/:category',
      name: 'post-key-list',
      component: HomeView
    },
    {
      // 路由 B：看特定文章全文
      path: '/:category/:slug',
      name: 'post-detail',
      component: HomeView,
      // 將匹配到的文章當作 prop 傳入 HomeView
      props: (route) => {
        const postsStore = usePostsStore()
        if (!postsStore?.posts || postsStore.posts.length === 0) {
          postsStore.getAllPosts()
        }
        const targetSlug = decodeURIComponent(route.params.slug)
        const safePosts = postsStore?.posts || []
        const matchedPost = safePosts.find(p => decodeURIComponent(p.slug) === targetSlug)
        
        return { post: matchedPost || null }
      }
    },
    {
      // 預設首頁：自動導向第一個分類
      path: '/',
      redirect: '/reading'
    }
  ]
})

export default router