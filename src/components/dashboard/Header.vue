<script setup>
    import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
    import { RouterLink, useRoute, useRouter } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();

    import logo from "@/assets/images/logo.png";
    import { useUserStore } from '@/stores/userStore'
    import apiService from '@/services/apiService'

    // Active link check
    const isActiveLink = (routePath) => {
        const route = useRoute();
        return route.path === routePath;
    }

    const route = useRoute()
    const router = useRouter()
    const isSignPage = computed(() => {
        const name = String(route.name || '').toLowerCase()
        const path = String(route.path || '').toLowerCase()
        return name.includes('sign') || path.includes('/sign')
    })

    const isIdentifyPage = computed(() => {
        const name = String(route.name || '').toLowerCase()
        const path = String(route.path || '').toLowerCase()
        return name.includes('identify') || path.includes('/identify')
    })

    const isLangOpen = ref(false)
    const isMenuOpen = ref(false)
    const langRef = ref(null)
    const menuRef = ref(null)
    const menuBtnRef = ref(null)
    const profileRef = ref(null)
    const profileBtnRef = ref(null)
    const userStore = useUserStore()
    const needsVerification = ref(false)
    const profileChecked = ref(false)
    const displayName = ref('')
    const profileStatus = ref('not-confirmed')
    const isProfileOpen = ref(false)

    async function checkProfileStatus() {
        profileChecked.value = false
        try {
            const token =
                userStore.authToken ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('access_token') ||
                localStorage.getItem('token') ||
                ''
            if (!token) {
                needsVerification.value = true
                profileStatus.value = 'not-confirmed'
                displayName.value = ''
                profileChecked.value = true
                return
            }
            const res = await apiService.fetchUserInfo(token)
            const profile = res?.data?.profile ?? res?.profile ?? null
            if (!profile) {
                needsVerification.value = true
                profileStatus.value = 'not-confirmed'
                displayName.value = ''
            } else {
                const status = String(profile.status || '').toLowerCase()
                if (status === 'pending' || status === 'approved' || status === 'rejected') {
                    profileStatus.value = status
                } else {
                    profileStatus.value = 'not-confirmed'
                }
                needsVerification.value = profileStatus.value !== 'approved'
                const first = String(profile.first_name || '').trim()
                const last = String(profile.last_name || '').trim()
                const initial = first ? (first[0].toUpperCase() + '.') : ''
                const formatted = [initial, last].filter(Boolean).join('').trim()
                const full = [first, last].filter(Boolean).join(' ').trim()
                displayName.value = formatted || full || ''
            }
            profileChecked.value = true
        } catch (e) {
            needsVerification.value = true
            profileStatus.value = 'not-confirmed'
            if (!displayName.value) displayName.value = ''
            profileChecked.value = true
        }
    }

    const statusTooltip = computed(() => {
        switch (profileStatus.value) {
            case 'pending':
                return t('dashboard.toast.verificationPending')
            case 'approved':
                return t('dashboard.toast.profileConfirmed')
            case 'rejected':
                return t('dashboard.toast.verificationRejected')
            default:
                return t('dashboard.toast.profileNotConfirmed')
        }
    })

    const currentLangLabel = computed(() => {
        const map = { ru: 'RU', en: 'EN', tk: 'TM' }
        return map[String(locale.value)] || 'RU'
    })

    function changeLanguage(lang) {
        const allowed = ['ru', 'en', 'tk']
        const next = allowed.includes(lang) ? lang : 'ru'
        locale.value = next
        try { localStorage.setItem('locale', next) } catch (e) { }
        isLangOpen.value = false
    }

    function handleClickOutside(event) {
        const target = event.target
        const langEl = langRef.value
        if (langEl && !langEl.contains(target)) {
            isLangOpen.value = false
        }
        const menuEl = menuRef.value
        const btnEl = menuBtnRef.value
        const insideMenu = menuEl ? menuEl.contains(target) : false
        const insideBtn = btnEl ? btnEl.contains(target) : false
        if (isMenuOpen.value && !insideMenu && !insideBtn) {
            isMenuOpen.value = false
        }
        const profEl = profileRef.value
        const profBtn = profileBtnRef.value
        const insideProf = profEl ? profEl.contains(target) : false
        const insideProfBtn = profBtn ? profBtn.contains(target) : false
        if (isProfileOpen.value && !insideProf && !insideProfBtn) {
            isProfileOpen.value = false
        }
    }

    onMounted(() => {
        window.addEventListener('click', handleClickOutside)
        checkProfileStatus()
    })

    onUnmounted(() => {
        window.removeEventListener('click', handleClickOutside)
    })

    watch(
        () => route.fullPath,
        () => {
            isMenuOpen.value = false
            isLangOpen.value = false
            isProfileOpen.value = false
            checkProfileStatus()
        }
    )
    watch(() => userStore.authToken, () => { checkProfileStatus() })

    const logout = () => {
        userStore.logout()
        router.push('/sign')
    }

    const isVerifyModalOpen = ref(false)
    const selectedServiceTitle = ref('')
    const pendingRouteName = ref('')

    async function onServiceClick(routeName, title) {
        selectedServiceTitle.value = title
        pendingRouteName.value = routeName
        if (!profileChecked.value) {
            await checkProfileStatus()
        }
        if (needsVerification.value) {
            isVerifyModalOpen.value = true
            return
        }
        router.push({ name: routeName })
    }

    function proceedToVerify() {
        isVerifyModalOpen.value = false
        router.push({ name: 'dashboard.identify' })
    }

    function closeVerifyModal() {
        isVerifyModalOpen.value = false
    }
    // Check profile status =================


</script>

<template>
    <header v-if="!isSignPage" class="mb-10">
        <div class="auto_container">
            <div class="wrap bg-mainWhite rounded-[20px] py-3 sm:py-5 px-5 sm:px-8 relative">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-10">
                        <RouterLink to="/" class=" w-[46px] block">
                            <img :src="logo" class="w-full h-full object-contain" alt="logo">
                        </RouterLink>

                        <nav ref="menuRef" :class="[
                            'absolute top-full left-0 bg-[#F7F8F6] w-full z-20 p-8 ll:p-0 rounded-[20px] ll:rounded-none ll:relative ll:top-0',
                            'transition-all duration-300 ease-out overflow-hidden',
                            isMenuOpen ? 'opacity-100 translate-y-0 max-h-[600px] pointer-events-auto shadow-md' : 'opacity-0 -translate-y-2 max-h-0 pointer-events-none',
                            'll:opacity-100 ll:translate-y-0 ll:max-h-none ll:pointer-events-auto'
                        ]">
                            <ul class="flex flex-col ll:flex-row ll:items-center gap-8 whitespace-nowrap text-center">
                                <li class="w-full">
                                    <RouterLink :to="{ name: 'dashboard.home' }"
                                        class="text-[#1D2417] text-[17px] block w-full pb-1 ll:pb-0 font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED] relative"
                                        :class="[isActiveLink('/dashboard') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.dashboard') }}
                                    </RouterLink>
                                </li>
                                <!-- <li class="w-full">
                                    <RouterLink :to="{ name: 'dashboard.services' }"
                                        class="text-[#1D2417] text-[17px] block w-full pb-1 ll:pb-0 font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED] relative"
                                        :class="[isActiveLink('/dashboard/services') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.services') }}
                                    </RouterLink>
                                </li> -->

                                <li class="w-full">
                                    <button type="button"
                                        @click="onServiceClick('dashboard.cards', t('dashboard.services.cardIssuance'))"
                                        class="text-[#1D2417] text-[17px] block w-full pb-1 ll:pb-0 font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED] relative"
                                        :class="[isActiveLink('/dashboard/cards') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.orderCard') }}
                                    </button>
                                </li>

                                <li class="w-full">
                                    <button type="button"
                                        @click="onServiceClick('dashboard.loan-application', t('dashboard.services.loanApplication'))"
                                        class="text-[#1D2417] text-[17px] block w-full pb-1 ll:pb-0 font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED] relative"
                                        :class="[isActiveLink('/dashboard/loan-application') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.creditApplication') }}
                                    </button>
                                </li>

                                <li class="w-full">
                                    <button type="button"
                                        @click="onServiceClick('dashboard.certificate-application', t('dashboard.services.getCertificate'))"
                                        class="text-[#1D2417] text-[17px] block w-full pb-1 ll:pb-0 font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED] relative"
                                        :class="[isActiveLink('/dashboard/certificate-application') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.getCertificate') }}
                                    </button>
                                </li>



                                <li class="w-full">
                                    <RouterLink :to="{ name: 'dashboard.payments' }"
                                        class="text-[#1D2417] text-[17px] block w-full font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED] relative"
                                        :class="[isActiveLink('/dashboard/payments') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.internationalPayments') }}
                                    </RouterLink>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div class="flex items-center gap-x-[10px]">
                        <div ref="langRef" class="relative">
                            <button type="button" @click="isLangOpen = !isLangOpen" :class="[
                                'flex items-center gap-2 border-solid border-[1px] border-[#EEF2ED] rounded-[10px] px-4 py-2',
                                'text-[#1D2417]'
                            ]">
                                <span class="text-sm font-bold">{{ currentLangLabel }}</span>
                                <svg :class="['transition-transform', isLangOpen ? 'rotate-180' : 'rotate-0']"
                                    width="11" height="6" viewBox="0 0 11 6" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.1465 0.146527C10.193 0.100072 10.2481 0.0632224 10.3088 0.0380812C10.3695 0.01294 10.4346 -9.32947e-07 10.5003 -9.35819e-07C10.566 -9.38691e-07 10.631 0.0129399 10.6917 0.0380812C10.7524 0.0632224 10.8076 0.100072 10.854 0.146527C10.9005 0.192982 10.9373 0.248133 10.9625 0.308829C10.9876 0.369526 11.0006 0.43458 11.0006 0.500278C11.0006 0.565975 10.9876 0.631029 10.9625 0.691726C10.9373 0.752422 10.9005 0.807573 10.854 0.854028L5.85403 5.85403C5.80759 5.90052 5.75245 5.9374 5.69175 5.96256C5.63105 5.98772 5.56599 6.00067 5.50028 6.00067C5.43457 6.00067 5.36951 5.98772 5.30881 5.96256C5.24811 5.9374 5.19296 5.90052 5.14653 5.85403L0.146528 0.854028C0.0527075 0.760208 -2.37246e-07 0.63296 -2.4043e-07 0.500278C-2.43614e-07 0.367596 0.0527074 0.240348 0.146528 0.146528C0.240348 0.0527077 0.367596 -4.92905e-07 0.500278 -4.98705e-07C0.63296 -5.04505e-07 0.760207 0.0527076 0.854028 0.146528L5.50028 4.7934L10.1465 0.146527Z"
                                        fill="#191B19" />
                                </svg>
                            </button>
                            <div v-show="isLangOpen"
                                class="absolute right-0 mt-2 bg-mainWhite rounded-[10px] shadow-lg py-2 px-4 z-[51]">
                                <button type="button"
                                    class="block w-full text-left px-3 py-2 rounded hover:text-mainWhite transition-all duration-300 text-sm hover:bg-[#2C702C] "
                                    @click="changeLanguage('ru')">RU</button>
                                <button type="button"
                                    class="block w-full text-left px-3 py-2 rounded hover:text-mainWhite transition-all duration-300 text-sm hover:bg-[#2C702C] "
                                    @click="changeLanguage('en')">EN</button>
                                <button type="button"
                                    class="block w-full text-left px-3 py-2 rounded hover:text-mainWhite transition-all duration-300 text-sm hover:bg-[#2C702C] "
                                    @click="changeLanguage('tk')">TM</button>
                            </div>
                        </div>

                        <!-- <RouterLink :to="{ name: 'dashboard.profile' }"
                            class="group w-10 h-10 flex items-center justify-center border-solid border-[#EEF2ED] rounded-[10px] p-[10px] transition-all hover:bg-[#2C702C] duration-300">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    class="fill-[#6F736D] w-5 h-5 object-contain transition-all duration-300 group-hover:fill-mainWhite"
                                    d="M16.1735 14.6896C14.9836 12.6326 13.15 11.1576 11.0102 10.4584C12.0686 9.82826 12.891 8.86812 13.351 7.7254C13.8109 6.58268 13.8831 5.32056 13.5563 4.13287C13.2296 2.94518 12.522 1.89759 11.5422 1.15097C10.5624 0.404356 9.36466 0 8.13284 0C6.90102 0 5.70325 0.404356 4.72349 1.15097C3.74372 1.89759 3.03612 2.94518 2.70936 4.13287C2.3826 5.32056 2.45474 6.58268 2.91471 7.7254C3.37467 8.86812 4.19703 9.82826 5.2555 10.4584C3.11565 11.1568 1.28206 12.6318 0.0922159 14.6896C0.0485822 14.7608 0.0196403 14.8399 0.0070978 14.9225C-0.00544473 15.005 -0.00133381 15.0892 0.019188 15.1701C0.0397098 15.251 0.0762269 15.3269 0.126585 15.3935C0.176942 15.46 0.24012 15.5158 0.312392 15.5576C0.384663 15.5993 0.464563 15.6262 0.547378 15.6365C0.630193 15.6469 0.714246 15.6406 0.794576 15.6179C0.874907 15.5953 0.949888 15.5568 1.0151 15.5047C1.08031 15.4526 1.13442 15.388 1.17425 15.3146C2.64612 12.7709 5.24768 11.2521 8.13284 11.2521C11.018 11.2521 13.6196 12.7709 15.0914 15.3146C15.1313 15.388 15.1854 15.4526 15.2506 15.5047C15.3158 15.5568 15.3908 15.5953 15.4711 15.6179C15.5514 15.6406 15.6355 15.6469 15.7183 15.6365C15.8011 15.6262 15.881 15.5993 15.9533 15.5576C16.0256 15.5158 16.0887 15.46 16.1391 15.3935C16.1895 15.3269 16.226 15.251 16.2465 15.1701C16.267 15.0892 16.2711 15.005 16.2586 14.9225C16.246 14.8399 16.2171 14.7608 16.1735 14.6896ZM3.75784 5.62713C3.75784 4.76183 4.01443 3.91597 4.49516 3.19651C4.97589 2.47704 5.65917 1.91629 6.4586 1.58515C7.25803 1.25402 8.13769 1.16738 8.98636 1.33619C9.83503 1.505 10.6146 1.92168 11.2264 2.53353C11.8383 3.14539 12.255 3.92494 12.4238 4.77361C12.5926 5.62227 12.5059 6.50194 12.1748 7.30137C11.8437 8.10079 11.2829 8.78407 10.5635 9.26481C9.844 9.74554 8.99813 10.0021 8.13284 10.0021C6.9729 10.0009 5.86082 9.53955 5.04062 8.71935C4.22042 7.89914 3.75908 6.78707 3.75784 5.62713Z"
                                    fill="#6F736D" />
                            </svg>
                        </RouterLink> -->

                        <button ref="profileBtnRef" @click="isProfileOpen = !isProfileOpen"
                            class="group w-10 h-10 flex items-center justify-center border-solid border-[#EEF2ED] rounded-[10px] p-[10px] transition-all hover:bg-[#2C702C] duration-300">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    class="fill-[#6F736D] w-5 h-5 object-contain transition-all duration-300 group-hover:fill-mainWhite"
                                    d="M16.1735 14.6896C14.9836 12.6326 13.15 11.1576 11.0102 10.4584C12.0686 9.82826 12.891 8.86812 13.351 7.7254C13.8109 6.58268 13.8831 5.32056 13.5563 4.13287C13.2296 2.94518 12.522 1.89759 11.5422 1.15097C10.5624 0.404356 9.36466 0 8.13284 0C6.90102 0 5.70325 0.404356 4.72349 1.15097C3.74372 1.89759 3.03612 2.94518 2.70936 4.13287C2.3826 5.32056 2.45474 6.58268 2.91471 7.7254C3.37467 8.86812 4.19703 9.82826 5.2555 10.4584C3.11565 11.1568 1.28206 12.6318 0.0922159 14.6896C0.0485822 14.7608 0.0196403 14.8399 0.0070978 14.9225C-0.00544473 15.005 -0.00133381 15.0892 0.019188 15.1701C0.0397098 15.251 0.0762269 15.3269 0.126585 15.3935C0.176942 15.46 0.24012 15.5158 0.312392 15.5576C0.384663 15.5993 0.464563 15.6262 0.547378 15.6365C0.630193 15.6469 0.714246 15.6406 0.794576 15.6179C0.874907 15.5953 0.949888 15.5568 1.0151 15.5047C1.08031 15.4526 1.13442 15.388 1.17425 15.3146C2.64612 12.7709 5.24768 11.2521 8.13284 11.2521C11.018 11.2521 13.6196 12.7709 15.0914 15.3146C15.1313 15.388 15.1854 15.4526 15.2506 15.5047C15.3158 15.5568 15.3908 15.5953 15.4711 15.6179C15.5514 15.6406 15.6355 15.6469 15.7183 15.6365C15.8011 15.6262 15.881 15.5993 15.9533 15.5576C16.0256 15.5158 16.0887 15.46 16.1391 15.3935C16.1895 15.3269 16.226 15.251 16.2465 15.1701C16.267 15.0892 16.2711 15.005 16.2586 14.9225C16.246 14.8399 16.2171 14.7608 16.1735 14.6896ZM3.75784 5.62713C3.75784 4.76183 4.01443 3.91597 4.49516 3.19651C4.97589 2.47704 5.65917 1.91629 6.4586 1.58515C7.25803 1.25402 8.13769 1.16738 8.98636 1.33619C9.83503 1.505 10.6146 1.92168 11.2264 2.53353C11.8383 3.14539 12.255 3.92494 12.4238 4.77361C12.5926 5.62227 12.5059 6.50194 12.1748 7.30137C11.8437 8.10079 11.2829 8.78407 10.5635 9.26481C9.844 9.74554 8.99813 10.0021 8.13284 10.0021C6.9729 10.0009 5.86082 9.53955 5.04062 8.71935C4.22042 7.89914 3.75908 6.78707 3.75784 5.62713Z"
                                    fill="#6F736D" />
                            </svg>
                        </button>

                        <div ref="profileRef" v-show="isProfileOpen"
                            class="absolute top-[calc(100%+1px)] right-0 bg-mainWhite flex flex-col gap-2 rounded-[10px] p-[10px] min-w-[200px] z-10  shadow-lg">
                            <RouterLink :to="{ name: 'dashboard.identify' }"
                                class="flex items-center justify-between py-3 px-2 border-solid border-0 border-b-[1px] border-b-[#e6e7e6] relative transition-all duration-300 ">
                                <div class="flex items-center gap-2">
                                    <span class="w-4 h-4 block">
                                        <svg class="w-full h-full object-contain" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M11.9999 0C5.38283 0 0 5.38286 0 12C0 15.2722 1.31999 18.24 3.45104 20.4074C3.46604 20.4235 3.47783 20.4396 3.4939 20.4546C5.66889 22.6424 8.67842 24 12 24C15.3216 24 18.331 22.6425 20.5061 20.4535C20.5222 20.4385 20.534 20.4224 20.549 20.4063C22.68 18.2399 24 15.272 24 12C24 5.38287 18.617 0 11.9999 0ZM11.9999 22.2857C9.27423 22.2857 6.79923 21.2122 4.95631 19.4754C5.05917 17.8522 6.39524 16.56 8.03982 16.56H15.9598C17.6033 16.56 18.9393 17.8522 19.0433 19.4754C17.2004 21.2122 14.7258 22.2857 11.9999 22.2857ZM20.4287 17.878C19.7162 16.1037 17.9837 14.8457 15.9598 14.8457H8.03982C6.01697 14.8457 4.28349 16.1036 3.5709 17.878C2.40413 16.2098 1.71414 14.1858 1.71414 12C1.71414 6.32888 6.32869 1.71429 11.9998 1.71429C17.6709 1.71429 22.2854 6.32888 22.2854 12C22.2854 14.1857 21.5955 16.2098 20.4287 17.878Z"
                                                fill="#191B19" />
                                            <path
                                                d="M12 4.28516C9.34283 4.28516 7.18188 6.4473 7.18188 9.10327C7.18188 11.7604 9.34294 13.9225 12 13.9225C14.657 13.9225 16.818 11.7603 16.818 9.10436C16.818 6.44722 14.657 4.28516 12 4.28516ZM12 12.2085C10.2878 12.2085 8.89616 10.8156 8.89616 9.10464C8.89616 7.39249 10.2879 5.99972 12 5.99972C13.712 5.99972 15.1038 7.39257 15.1038 9.10354C15.1038 10.8157 13.712 12.2085 12 12.2085Z"
                                                fill="#191B19" />
                                        </svg>
                                    </span>
                                    <h6 class="text-sm font-medium text-[#191B19]">
                                        {{ displayName || t('dashboard.header.fullName') }}
                                    </h6>
                                </div>

                                <span class="w-[18px] h-[18px] block relative group">
                                    <svg v-if="profileStatus === 'approved'" class="w-full h-full object-contain"
                                        width="60" height="60" viewBox="0 0 60 60" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M45.9373 3.5117C43.6678 1.2422 40.6561 0 37.449 0H22.539C19.3281 0 16.3202 1.25 14.0507 3.5117L3.5117 14.0507C1.2422 16.3202 0 19.3319 0 22.539V37.449C0 40.6599 1.25 43.6678 3.5117 45.9373L14.0507 56.4763C16.3202 58.7458 19.3319 59.988 22.539 59.988H37.449C40.6599 59.988 43.6678 58.738 45.9373 56.4763L56.4763 45.9373C58.7458 43.6678 59.988 40.6561 59.988 37.449V22.539C59.988 19.3281 58.738 16.3202 56.4763 14.0507L45.9373 3.5117ZM55.9963 37.4607C55.9963 39.6013 55.1682 41.6091 53.6565 43.1209L43.1175 53.6599C41.6058 55.1716 39.598 55.9997 37.4573 55.9997H22.5473C20.4067 55.9997 18.3989 55.1716 16.8871 53.6599L6.3481 43.1209C4.8364 41.6092 4.0083 39.6014 4.0083 37.4607V22.5507C4.0083 20.4101 4.83642 18.4023 6.3481 16.8905L16.8871 6.3515C18.3988 4.8398 20.4066 4.0117 22.5473 4.0117H37.4573C39.5979 4.0117 41.6057 4.83982 43.1175 6.3515L53.6565 16.8905C55.1682 18.4022 55.9963 20.41 55.9963 22.5507V37.4607Z"
                                            fill="#2C702C" />
                                        <path
                                            d="M38.4764 23.6781L27.2264 34.9281C27.0975 35.057 26.8866 35.057 26.7577 34.9281L21.4061 29.5765C21.0272 29.1976 20.5272 28.9984 19.9959 28.9984C19.4646 28.9984 18.9568 29.2093 18.5857 29.5765C18.2068 29.9554 17.9958 30.4554 17.9958 30.9984C17.9958 31.5374 18.2068 32.0375 18.574 32.4086L23.7849 37.6195C24.5036 38.3382 25.4255 38.8578 26.4255 38.9789C27.7966 39.1508 29.1247 38.6898 30.0739 37.7406L41.4019 26.4126C41.7808 26.0337 41.98 25.5337 41.98 24.9907C41.98 24.4907 41.8003 24.0102 41.4605 23.6509C40.6792 22.7993 39.2808 22.8618 38.4605 23.6821L38.4764 23.6781Z"
                                            fill="#2C702C" />
                                    </svg>

                                    <svg v-else-if="profileStatus === 'rejected'" class="w-full h-full object-contain"
                                        width="60" height="60" viewBox="0 0 60 60" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M45.9373 3.5117C43.6678 1.2422 40.6561 0 37.449 0H22.539C19.3281 0 16.3202 1.25 14.0507 3.5117L3.5117 14.0507C1.2422 16.3202 0 19.3319 0 22.539V37.449C0 40.6599 1.25 43.6678 3.5117 45.9373L14.0507 56.4763C16.3202 58.7458 19.3319 59.988 22.539 59.988H37.449C40.6599 59.988 43.6678 58.738 45.9373 56.4763L56.4763 45.9373C58.7458 43.6678 59.988 40.6561 59.988 37.449V22.539C59.988 19.3281 58.738 16.3202 56.4763 14.0507L45.9373 3.5117ZM55.9963 37.4607C55.9963 39.6013 55.1682 41.6091 53.6565 43.1209L43.1175 53.6599C41.6058 55.1716 39.598 55.9997 37.4573 55.9997H22.5473C20.4067 55.9997 18.3989 55.1716 16.8871 53.6599L6.3481 43.1209C4.8364 41.6092 4.0083 39.6014 4.0083 37.4607V22.5507C4.0083 20.4101 4.83642 18.4023 6.3481 16.8905L16.8871 6.3515C18.3988 4.8398 20.4066 4.0117 22.5473 4.0117H37.4573C39.5979 4.0117 41.6057 4.83982 43.1175 6.3515L53.6565 16.8905C55.1682 18.4022 55.9963 20.41 55.9963 22.5507V37.4607Z"
                                            fill="#F44336" />
                                        <path
                                            d="M39.0489 21.8262C37.9473 20.7246 36.17 20.7246 35.0723 21.8262L30.4356 26.4629L25.8028 21.8301C24.7012 20.7285 22.9239 20.7285 21.8262 21.8301C20.7246 22.9278 20.7246 24.709 21.8262 25.8067L26.459 30.4395L21.8262 35.0723C20.7246 36.17 20.7246 37.9512 21.8262 39.0489C22.377 39.5997 23.0957 39.8731 23.8145 39.8731C24.5333 39.8731 25.252 39.5997 25.8028 39.0489L30.4356 34.4161L35.0684 39.0489C35.6192 39.5997 36.3379 39.8731 37.0567 39.8731C37.7755 39.8731 38.4942 39.5997 39.045 39.0489C40.1466 37.9512 40.1466 36.17 39.045 35.0723L34.4122 30.4395L39.045 25.8067C40.1466 24.709 40.1466 22.9239 39.0489 21.8262Z"
                                            fill="#F44336" />
                                    </svg>

                                    <svg v-else-if="profileStatus === 'pending'" class="w-full h-full object-contain"
                                        width="60" height="60" viewBox="0 0 60 60" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M45.9373 3.5117C43.6678 1.2422 40.6561 0 37.449 0H22.539C19.3281 0 16.3202 1.25 14.0507 3.5117L3.5117 14.0507C1.2422 16.3202 0 19.3319 0 22.539V37.449C0 40.6599 1.25 43.6678 3.5117 45.9373L14.0507 56.4763C16.3202 58.7458 19.3319 59.988 22.539 59.988H37.449C40.6599 59.988 43.6678 58.738 45.9373 56.4763L56.4763 45.9373C58.7458 43.6678 59.988 40.6561 59.988 37.449V22.539C59.988 19.3281 58.738 16.3202 56.4763 14.0507L45.9373 3.5117ZM55.9963 37.4607C55.9963 39.6013 55.1682 41.6091 53.6565 43.1209L43.1175 53.6599C41.6058 55.1716 39.598 55.9997 37.4573 55.9997H22.5473C20.4067 55.9997 18.3989 55.1716 16.8871 53.6599L6.3481 43.1209C4.8364 41.6092 4.0083 39.6014 4.0083 37.4607V22.5507C4.0083 20.4101 4.83642 18.4023 6.3481 16.8905L16.8871 6.3515C18.3988 4.8398 20.4066 4.0117 22.5473 4.0117H37.4573C39.5979 4.0117 41.6057 4.83982 43.1175 6.3515L53.6565 16.8905C55.1682 18.4022 55.9963 20.41 55.9963 22.5507V37.4607Z"
                                            fill="#EBB618" />
                                        <path
                                            d="M30 34.741C30.7032 34.741 31.6878 34.2426 31.7472 32.9312L32.3472 18.4313C32.3472 17.0882 31.296 16 30 16C28.704 16 27.6528 17.0882 27.6528 18.4313L28.2528 32.9312C28.3218 34.311 29.2128 34.741 30 34.741ZM30 36.7851C29.208 36.7851 28.434 37.1207 27.876 37.6987C27.318 38.2767 27 39.0722 27 39.8926C27 40.7129 27.318 41.5146 27.876 42.0926C28.434 42.6706 29.208 43 30 43C30.7914 43 31.5654 42.6706 32.118 42.0926C32.682 41.5146 33 40.7129 33 39.8926C33 39.0784 32.682 38.2767 32.118 37.6987C31.5654 37.1207 30.7914 36.7851 30 36.7851Z"
                                            fill="#EBB618" />
                                    </svg>

                                    <svg v-else class="w-full h-full object-contain" width="60" height="60"
                                        viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M45.9373 3.5117C43.6678 1.2422 40.6561 0 37.449 0H22.539C19.3281 0 16.3202 1.25 14.0507 3.5117L3.5117 14.0507C1.2422 16.3202 0 19.3319 0 22.539V37.449C0 40.6599 1.25 43.6678 3.5117 45.9373L14.0507 56.4763C16.3202 58.7458 19.3319 59.988 22.539 59.988H37.449C40.6599 59.988 43.6678 58.738 45.9373 56.4763L56.4763 45.9373C58.7458 43.6678 59.988 40.6561 59.988 37.449V22.539C59.988 19.3281 58.738 16.3202 56.4763 14.0507L45.9373 3.5117ZM55.9963 37.4607C55.9963 39.6013 55.1682 41.6091 53.6565 43.1209L43.1175 53.6599C41.6058 55.1716 39.598 55.9997 37.4573 55.9997H22.5473C20.4067 55.9997 18.3989 55.1716 16.8871 53.6599L6.3481 43.1209C4.8364 41.6092 4.0083 39.6014 4.0083 37.4607V22.5507C4.0083 20.4101 4.83642 18.4023 6.3481 16.8905L16.8871 6.3515C18.3988 4.8398 20.4066 4.0117 22.5473 4.0117H37.4573C39.5979 4.0117 41.6057 4.83982 43.1175 6.3515L53.6565 16.8905C55.1682 18.4022 55.9963 20.41 55.9963 22.5507V37.4607Z"
                                            fill="#6F736D" />
                                        <path
                                            d="M37.77 27.27H32.7301V22.23C32.7301 21.0035 31.7265 20 30.5 20C29.2735 20 28.27 21.0035 28.27 22.23V27.27H23.23C22.0035 27.27 21 28.2735 21 29.5C21 30.7265 22.0035 31.73 23.23 31.73H28.27V36.77C28.27 37.9965 29.2735 39 30.5 39C31.7265 39 32.7301 37.9965 32.7301 36.77V31.73H37.77C38.9965 31.73 40 30.7265 40 29.5C40 28.2735 38.9965 27.27 37.77 27.27Z"
                                            fill="#6F736D" />
                                    </svg>

                                    <p
                                        class="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-2 py-1 text-xs rounded bg-[#1D2417] text-white opacity-0 pointer-events-none transition-all duration-200 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 z-50">
                                        {{ statusTooltip }}
                                    </p>
                                </span>
                            </RouterLink>

                            <button @click="logout"
                                class="flex items-center justify-between p-2 relative transition-all duration-300 ">
                                <div class="flex items-center gap-2">
                                    <span class="w-4 h-4 block">
                                        <svg class="w-full h-full object-contain" width="24" height="23"
                                            viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M23.9265 11.8765C23.8803 11.9861 23.8134 12.0842 23.7292 12.1686L21.268 14.6018V14.6029C20.908 14.9589 20.3241 14.9589 19.963 14.6029C19.6029 14.2459 19.6029 13.6687 19.963 13.3127L20.8491 12.4366H14.4613C13.9525 12.4366 13.5383 12.0283 13.5383 11.524C13.5383 11.0198 13.9525 10.6114 14.4613 10.6114H20.8491L19.963 9.73534C19.6249 9.376 19.6341 8.81591 19.986 8.46798C20.338 8.12005 20.9045 8.11091 21.268 8.44517L23.7291 10.8784V10.8795C23.8134 10.9639 23.8803 11.062 23.9264 11.1715C24.0245 11.3963 24.0245 11.6518 23.9265 11.8765ZM19.3849 16.7441C18.8783 16.751 18.4687 17.1559 18.4618 17.6567V20.0899C18.4618 20.1709 18.4295 20.2485 18.3718 20.3055C18.3141 20.3626 18.2356 20.3945 18.1537 20.3945H11.6921V2.70265H18.1537C18.2356 2.70265 18.3141 2.7346 18.3718 2.79163C18.4295 2.84867 18.4618 2.92624 18.4618 3.00609V5.44044C18.4618 5.94352 18.8748 6.35304 19.3849 6.35304C19.8949 6.35304 20.308 5.94352 20.308 5.44044V3.00609C20.301 1.83341 19.341 0.88317 18.1537 0.877446H11.2744C11.1578 0.71774 11.0217 0.575135 10.8682 0.450817C10.3455 0.0492738 9.66476 -0.094464 9.02205 0.0618313L1.63734 1.88703C0.675023 2.12202 -0.00115054 2.97645 1.47429e-06 3.9552V19.0929C-0.00115231 20.0717 0.675023 20.9261 1.63734 21.1611L9.02205 22.9863C9.19397 23.0046 9.36706 23.0046 9.53898 22.9863C10.019 22.984 10.4863 22.8255 10.8682 22.5357C11.0217 22.4125 11.1578 22.2688 11.2744 22.1102H18.1537C19.3179 22.1045 20.2687 21.1908 20.308 20.042V17.6077C20.301 17.1069 19.8914 16.7019 19.3849 16.6951V16.7441Z"
                                                fill="#C60000" />
                                        </svg>
                                    </span>
                                    <h6 class="text-sm font-medium text-[#191B19]">
                                        {{ t('dashboard.btn.logout') }}
                                    </h6>
                                </div>
                            </button>
                        </div>

                        <button ref="menuBtnRef" class="block ll:hidden cursor-pointer w-[22px] h-[22px]"
                            @click="isMenuOpen = !isMenuOpen">
                            <svg class="w-full h-full object-contain pointer-events-none" width="17" height="13"
                                viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.5 6.1875C16.5 6.36984 16.4276 6.54471 16.2986 6.67364C16.1697 6.80257 15.9948 6.875 15.8125 6.875H0.6875C0.505164 6.875 0.330295 6.80257 0.201364 6.67364C0.072433 6.54471 0 6.36984 0 6.1875C0 6.00516 0.072433 5.8303 0.201364 5.70136C0.330295 5.57243 0.505164 5.5 0.6875 5.5H15.8125C15.9948 5.5 16.1697 5.57243 16.2986 5.70136C16.4276 5.8303 16.5 6.00516 16.5 6.1875ZM0.6875 1.375H15.8125C15.9948 1.375 16.1697 1.30257 16.2986 1.17364C16.4276 1.0447 16.5 0.869836 16.5 0.6875C16.5 0.505164 16.4276 0.330295 16.2986 0.201364C16.1697 0.072433 15.9948 0 15.8125 0H0.6875C0.505164 0 0.330295 0.072433 0.201364 0.201364C0.072433 0.330295 0 0.505164 0 0.6875C0 0.869836 0.072433 1.0447 0.201364 1.17364C0.330295 1.30257 0.505164 1.375 0.6875 1.375ZM15.8125 11H0.6875C0.505164 11 0.330295 11.0724 0.201364 11.2014C0.072433 11.3303 0 11.5052 0 11.6875C0 11.8698 0.072433 12.0447 0.201364 12.1736C0.330295 12.3026 0.505164 12.375 0.6875 12.375H15.8125C15.9948 12.375 16.1697 12.3026 16.2986 12.1736C16.4276 12.0447 16.5 11.8698 16.5 11.6875C16.5 11.5052 16.4276 11.3303 16.2986 11.2014C16.1697 11.0724 15.9948 11 15.8125 11Z"
                                    fill="#191B19" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <section v-if="profileChecked && needsVerification && !isSignPage && !isIdentifyPage" class="verify mb-10">
        <div class="auto_container">
            <div class="wrap bg-[hsl(60,94%,57%)]/40 rounded-[10px] p-[14px]">
                <div class="flex items-center justify-between gap-4">
                    <h1 class="text-[18px] font-[500] text-[#191B19]">
                        {{ t('dashboard.header.verifyAccount') }}
                    </h1>
                    <RouterLink :to="{ name: 'dashboard.identify' }"
                        class="text-[16px] font-bold transition-all duration-300 active">
                        {{ t('dashboard.btn.verify') }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>

    <div v-if="isVerifyModalOpen" class="fixed inset-0 z-[60]">
        <div class="absolute inset-0 bg-[#000]/50" @click="closeVerifyModal"></div>
        <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-mainWhite rounded-[20px] p-6 w-[90%] max-w-[420px] shadow-lg">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-[20px] font-bold text-[#1D2417]">
                    {{ t('dashboard.header.verifyAccount') }}
                </h3>
                <button type="button" class="w-6 h-6" @click="closeVerifyModal">
                    <svg class="w-full h-full object-contain" width="20" height="20" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.4141 10.0001L16.7071 15.2931C16.8947 15.4806 17.0001 15.735 17.0001 16.0001C17.0001 16.2652 16.8947 16.5196 16.7071 16.7071C16.5196 16.8947 16.2652 17.0001 16.0001 17.0001C15.735 17.0001 15.4806 16.8947 15.2931 16.7071L10.0001 11.4141L4.70711 16.7071C4.51956 16.8947 4.26522 17.0001 4.00011 17.0001C3.735 17.0001 3.48066 16.8947 3.29311 16.7071C3.10556 16.5196 3.00012 16.2652 3.00012 16.0001C3.00012 15.735 3.10556 15.4806 3.29311 15.2931L8.58611 10.0001L3.29311 4.7071C3.10556 4.51955 3.00012 4.26521 3.00012 4.0001C3.00012 3.73499 3.10556 3.48065 3.29311 3.2931C3.48066 3.10555 3.735 3.00011 4.00011 3.00011C4.26522 3.00011 4.51956 3.10555 4.70711 3.2931L10.0001 8.58611L15.2931 3.2931C15.4806 3.10555 15.735 3.00011 16.0001 3.00011C16.2652 3.00011 16.5196 3.10555 16.7071 3.2931C16.8947 3.48065 17.0001 3.73499 17.0001 4.0001C17.0001 4.26521 16.8947 4.51955 16.7071 4.7071L11.4141 10.0001Z"
                            fill="#191B19" />
                    </svg>
                </button>
            </div>

            <p class="text-[15px] text-[#6F736D] mb-5 text-center">
                {{ t('dashboard.modal.requiredVerification', { service: selectedServiceTitle }) }}
            </p>

            <div class="flex items-center justify-center">
                <button type="button"
                    class="text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[10px] text-center"
                    @click="proceedToVerify">
                    {{ t('dashboard.btn.verify') }}
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped>
    .active {
        position: relative;

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: #6F736D;
        }
    }
</style>
