import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    authToken: null,
    phoneNumber: null,
    otpSessionToken: null,
  }),
  actions: {
    loadUser() {
      // Load user from localStorage when app starts
      this.user = JSON.parse(localStorage.getItem('user')) || null
      this.authToken = localStorage.getItem('authToken') || null
      this.phoneNumber = localStorage.getItem('phoneNumber') || null
      this.otpSessionToken = sessionStorage.getItem('otpSessionToken') || null
    },
    setUser(userData, token) {
      this.user = userData
      this.authToken = token
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('authToken', token)
    },
    updateUser(userData) {
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
    },
    logout() {
      this.user = null
      this.authToken = null
      this.otpSessionToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
      localStorage.removeItem('phoneNumber')
      sessionStorage.removeItem('otpSessionToken')
    },
    setPhone(phone) {
      this.phoneNumber = phone
      localStorage.setItem('phoneNumber', phone)
    },
    setOtpSessionToken(token) {
      this.otpSessionToken = token
      sessionStorage.setItem('otpSessionToken', token)
    },
  },
})
