import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import WebsiteLayout from '@/layouts/WebsiteLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Website pages
import HomeView from '@/views/website/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
  routes: [
    // Public website grouped under WebsiteLayout
    {
      path: '/',
      component: WebsiteLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/website/ServicesView.vue'),
        },
        { path: 'about', name: 'about', component: () => import('@/views/website/AboutView.vue') },
        { path: 'news', name: 'news', component: () => import('@/views/website/NewsView.vue') },
        {
          path: 'news-detail',
          name: 'news-detail',
          component: () => import('@/views/website/NewsDetailView.vue'),
        },
        { path: 'cards', name: 'cards', component: () => import('@/views/website/CardsView.vue') },
        {
          path: 'cards-detail',
          name: 'cards-detail',
          component: () => import('@/views/website/CardDetailView.vue'),
        },
        { path: 'loans', name: 'loans', component: () => import('@/views/website/LoansView.vue') },
        {
          path: 'loans-detail',
          name: 'loans-detail',
          component: () => import('@/views/website/LoansDetailView.vue'),
        },
        {
          path: 'deposits',
          name: 'deposits',
          component: () => import('@/views/website/DepositsView.vue'),
        },
        {
          path: 'deposits-detail',
          name: 'deposits-detail',
          component: () => import('@/views/website/DepositDetailView.vue'),
        },
      ],
    },

    // Dashboard area grouped under DashboardLayout
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        // Keep empty for now or point to a simple placeholder
        { path: '', name: 'dashboard-home', component: () => import('@/components/draft.vue') },
      ],
    },
  ],
})

export default router
