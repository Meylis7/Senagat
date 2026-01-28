import axios from 'axios'

// Use /api proxy in development (configured in vite.config.js)
// In production, this should be set via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add request interceptor to set locale header
apiClient.interceptors.request.use(
  (config) => {
    const locale = localStorage.getItem('locale') || 'tk'
    config.headers['Accept-Language'] = locale
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response.data
  },
  (error) => {
    // Handle axios errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || error.response.statusText
      console.error(
        `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        errorMessage,
      )
      throw new Error(errorMessage)
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error: No response from server', error.message)
      throw new Error('Network error. Please check your connection.')
    } else {
      // Something else happened
      console.error('Request Error:', error.message)
      throw new Error(error.message || 'An error occurred. Please try again.')
    }
  },
)

const apiService = {
  // General HTTP methods for flexible API usage
  get(endpoint, config = {}) {
    return apiClient.get(endpoint, {
      params: config.params,
      headers: config.headers,
    })
  },

  post(endpoint, data, config = {}) {
    return apiClient.post(endpoint, data, {
      headers: config.headers,
    })
  },

  fetchNews(params = {}) {
    return apiClient.get('/v1/news', { params })
  },

  fetchNewsDetail(newsId) {
    return apiClient.get(`/v1/news/${newsId}`)
  },

  fetchExchangeRates(params = {}) {
    return apiClient.get('/v1/exchange-rate', { params })
  },

  fetchFacts(params = {}) {
    return apiClient.get('/v1/facts', { params })
  },

  fetchAwards(params = {}) {
    return apiClient.get('/v1/awards', { params })
  },

  fetchAwardDetail(id) {
    return apiClient.get(`/v1/awards/${id}`)
  },

  submitContactMessage(data) {
    return apiClient.post('/v1/contact-message', data)
  },

  fetchClients(params = {}) {
    return apiClient.get('/v1/clients', { params })
  },

  fetchCreditTypes(params = {}) {
    return apiClient.get('/v1/credit/types', { params })
  },

  fetchDeposits(params = {}) {
    return apiClient.get('/v1/deposits', { params })
  },
  fetchDepositDetail(id) {
    return apiClient.get(`/v1/deposits/${id}`)
  },

  fetchCardTypes(params = {}) {
    return apiClient.get('/v1/card/types', { params })
  },

  fetchCertificateTypes(params = {}) {
    return apiClient.get('/v1/certificate-types', { params })
  },

  fetchTransfers(params = {}) {
    return apiClient.get('/v1/money-transfers', { params })
  },
  fetchTransferDetail(id) {
    return apiClient.get(`/v1/money-transfers/${id}`)
  },

  fetchTariffs(params = {}) {
    return apiClient.get('/v1/tariff', { params })
  },

  fetchLocations(params = {}) {
    return apiClient.get('/v1/location', { params })
  },
  fetchBranches(params = {}) {
    return apiClient.get('/v1/location/branches', { params })
  },
  fetchBanks(params = {}) {
    return apiClient.get('/v1/belet/banks', { params })
  },
  fetchBanksAuth(token, params = {}) {
    return apiClient.get('/v1/belet/banks', {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  fetchBeletBalancesAuth(token, params = {}) {
    return apiClient.get('/v1/belet/balances', {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  checkBeletPhone(token, phone) {
    return apiClient.post(
      '/v1/belet/belet/check-phone',
      { phone },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      },
    )
  },
  fetchInternationalPaymentTypes(params = {}) {
    return apiClient.get('/v1/international-payment-types', { params })
  },
  submitInternationalPaymentOrder(data, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data'
    }
    return apiClient.post('/v1/international-payment-order', data, {
      headers,
    })
  },
  submitCertificateOrder(data, token) {
    return apiClient.post('/v1/certificate-order', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  submitBeletTopUp(data, token) {
    return apiClient.post('/v1/belet/top-up', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  submitCreditOrder(data, token) {
    return apiClient.post('/v1/application/credit/order', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  submitCardOrder(data, token) {
    return apiClient.post('/v1/card/order', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },

  // Dashboard pages ========================================
  requestOtp(data) {
    return apiClient.post('/v1/users/auth/request-otp', data)
  },

  fetchUserInfo(token) {
    return apiClient.get('/v1/users/auth/user-information', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { _t: Date.now() },
    })
  },

  submitProfile(formData, token) {
    return apiClient.post('/v1/profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  verifyOtp(data) {
    return apiClient.post('/v1/users/auth/verify-otp', data)
  },

  register(data) {
    return apiClient.post('/v1/users/auth/register', data)
  },

  preLogin(data) {
    return apiClient.post('/v1/users/auth/pre-login', data)
  },

  login(data) {
    return apiClient.post('/v1/users/auth/login', data)
  },

  fetchPaymentHistoryAuth(token, params = {}) {
    return apiClient.get('/v1/payment-history', {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
}

export default apiService
