import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
    },
    {
      path: '/news-detail',
      name: 'news-detail',
      component: () => import('../views/NewsDetailView.vue'),
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('../views/CardsView.vue'),
    },
    {
      // path: '/cards-detail/:id',
      path: '/cards-detail/',
      name: 'cards-detail',
      component: () => import('../views/CardDetailView.vue'),
    },
    {
      path: '/loans',
      name: 'loans',
      component: () => import('../views/LoansView.vue'),
    },
    {
      // path: '/card-detail/:id',
      path: '/loans-detail/',
      name: 'loans-detail',
      component: () => import('../views/LoansDetailView.vue'),
    },
    {
      path: '/deposits',
      name: 'deposits',
      component: () => import('../views/DepositsView.vue'),
    },
    {
      // path: '/deposit-detail/:id',
      path: '/deposits-detail/',
      name: 'deposits-detail',
      component: () => import('../views/DepositDetailView.vue'),
    },
  ],
})

export default router
