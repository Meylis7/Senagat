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
        {
          path: 'awards-detail',
          name: 'awards-detail',
          component: () => import('@/views/website/AwardsDetailView.vue'),
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
        {
          path: 'transfer/:id',
          name: 'transfer',
          component: () => import('@/views/website/TransferView.vue'),
          props: true,
        },
        {
          // Расчетно-кассовые обслуживание
          path: 'cash',
          name: 'cash',
          component: () => import('@/views/website/CashView.vue'),
        },
        {
          // Банковские гарантии
          path: 'guarantees',
          name: 'guarantees',
          component: () => import('@/views/website/BankGarantiesView.vue'),
        },
        {
          // Перечень документов для открытия счета
          path: 'documents',
          name: 'documents',
          component: () => import('@/views/website/DocumentsView.vue'),
        },
        {
          // Аудиторские отчеты
          path: 'audit',
          name: 'audit',
          component: () => import('@/views/website/AuditView.vue'),
        },
        {
          // Услуги банка
          path: 'information',
          name: 'information',
          component: () => import('@/views/website/InformationView.vue'),
        },
        {
          // Документы по установке терминала
          path: 'terminal',
          name: 'terminal',
          component: () => import('@/views/website/TerminalView.vue'),
        },
        {
          // Tariff
          path: 'tariff',
          name: 'tariff',
          component: () => import('@/views/website/TariffView.vue'),
        },
        {
          // Map
          path: 'branches',
          name: 'branches',
          component: () => import('@/views/website/MapView.vue'),
        },
        {
          // Политика конфиденциальности
          path: 'privacy',
          name: 'privacy',
          component: () => import('@/views/website/PrivacyView.vue'),
        },
      ],
    },

    // Dashboard area grouped under DashboardLayout
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = localStorage.getItem('authToken')
        if (to.name !== 'dashboard.sign' && !isAuthenticated) {
          next({ name: 'dashboard.sign' })
        } else {
          next()
        }
      },
      children: [
        {
          path: '',
          name: 'dashboard.home',
          component: () => import('@/views/dashboard/HomeView.vue'),
        },
        {
          path: '/sign',
          name: 'dashboard.sign',
          component: () => import('@/views/dashboard/SignView.vue'),
        },
        {
          path: 'identify',
          name: 'dashboard.identify',
          component: () => import('@/views/dashboard/IdentifyView.vue'),
        },
        {
          path: 'payments',
          name: 'dashboard.payments',
          component: () => import('@/views/dashboard/InternationalPaymentsView.vue'),
        },
        {
          path: 'payment',
          name: 'dashboard.payment',
          component: () => import('@/views/dashboard/PaymentView.vue'),
        },
        {
          path: 'services',
          name: 'dashboard.services',
          component: () => import('@/views/dashboard/ServicesView.vue'),
        },
        {
          path: 'cards',
          name: 'dashboard.cards',
          component: () => import('@/views/dashboard/CardsView.vue'),
        },
        {
          path: 'profile',
          name: 'dashboard.profile',
          component: () => import('@/views/dashboard/ProfileView.vue'),
        },
        {
          path: 'history',
          name: 'dashboard.history',
          component: () => import('@/views/dashboard/HistoryView.vue'),
        },
        {
          path: 'loan-application',
          name: 'dashboard.loan-application',
          component: () => import('@/views/dashboard/LoanApplicationView.vue'),
        },
        {
          path: 'certificate-application',
          name: 'dashboard.certificate-application',
          component: () => import('@/views/dashboard/CertificateApplicationView.vue'),
        },
        {
          path: 'card-application',
          name: 'dashboard.card-application',
          component: () => import('@/views/dashboard/CardApplicationView.vue'),
        },

        {
          path: 'belet',
          name: 'dashboard.belet',
          component: () => import('@/views/dashboard/BeletView.vue'),
        },
      ],
    },

    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('@/views/404.vue'),
    },
  ],
})

export default router
