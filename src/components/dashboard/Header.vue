<script setup>
    import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();

    import logo from "@/assets/images/logo.png";

    // Active link check
    const isActiveLink = (routePath) => {
        const route = useRoute();
        return route.path === routePath;
    }

    const route = useRoute()
    const isSignPage = computed(() => {
        const name = String(route.name || '')
        const path = String(route.path || '')
        return name.includes('sign') || path.includes('/sign')
    })

    const isLangOpen = ref(false)
    const isMenuOpen = ref(false)
    const langRef = ref(null)
    const menuRef = ref(null)
    const menuBtnRef = ref(null)

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
    }

    onMounted(() => {
        window.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
        window.removeEventListener('click', handleClickOutside)
    })

    watch(
        () => route.fullPath,
        () => {
            isMenuOpen.value = false
            isLangOpen.value = false
        }
    )

</script>

<template>
    <header v-if="!isSignPage" class="mb-10">
        <div class="auto_container">
            <div class="wrap bg-mainWhite rounded-[20px] py-5 px-8 relative">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-10">
                        <RouterLink to="/dashboard" class=" w-[46px] block">
                            <img :src="logo" class="w-full h-full object-contain" alt="logo">
                        </RouterLink>

                        <nav ref="menuRef" :class="[
                            'absolute top-full left-0 bg-[#F7F8F6] w-full z-20 p-8 mm:p-0 rounded-[20px] mm:rounded-none mm:relative mm:top-0',
                            'transition-all duration-300 ease-out overflow-hidden',
                            isMenuOpen ? 'opacity-100 translate-y-0 max-h-[600px] pointer-events-auto' : 'opacity-0 -translate-y-2 max-h-0 pointer-events-none',
                            'mm:opacity-100 mm:translate-y-0 mm:max-h-none mm:pointer-events-auto'
                        ]">
                            <ul class="flex flex-col mm:flex-row items-center gap-8">
                                <li class="w-full">
                                    <RouterLink :to="{ name: 'dashboard.home' }"
                                        class="text-[#1D2417] text-[17px] font-Gilroy block w-full font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED]"
                                        :class="[isActiveLink('/dashboard') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.dashboard') }}
                                    </RouterLink>
                                </li>
                                <li class="w-full">
                                    <RouterLink :to="{ name: 'dashboard.payments' }"
                                        class="text-[#1D2417] text-[17px] font-Gilroy block w-full font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED]"
                                        :class="[isActiveLink('/dashboard/payments') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.payments') }}
                                    </RouterLink>
                                </li>
                                <li class="w-full">
                                    <RouterLink :to="{ name: 'dashboard.services' }"
                                        class="text-[#1D2417] text-[17px] font-Gilroy block w-full font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED]"
                                        :class="[isActiveLink('/dashboard/services') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.services') }}
                                    </RouterLink>
                                </li>
                                <li class="w-full">
                                    <RouterLink :to="{ name: 'dashboard.cards' }"
                                        class="text-[#1D2417] text-[17px] font-Gilroy block w-full font-bold mm:font-normal border-solid border-0 border-b-[1px] mm:border-b-0 border-[#EEF2ED]"
                                        :class="[isActiveLink('/dashboard/cards') ? 'active border-b-0' : '']">
                                        {{ t('dashboard.header.cards') }}
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

                        <!-- <RouterLink :to="{ name: 'dashboard.notifications' }"
                            class="group w-10 h-10 flex items-center justify-center border-solid border-[#EEF2ED] rounded-[10px] p-[10px] transition-all hover:bg-[#2C702C] duration-300">
                            <svg width="15" height="17" viewBox="0 0 15 17" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    class="fill-[#6F736D] w-5 h-5 object-contain transition-all duration-300 group-hover:fill-mainWhite"
                                    d="M14.8272 11.8703C14.3936 11.1234 13.7491 9.01016 13.7491 6.25C13.7491 4.5924 13.0906 3.00269 11.9185 1.83058C10.7464 0.65848 9.1567 0 7.49909 0C5.84149 0 4.25178 0.65848 3.07968 1.83058C1.90757 3.00269 1.24909 4.5924 1.24909 6.25C1.24909 9.01094 0.603782 11.1234 0.170188 11.8703C0.0594621 12.0602 0.000761949 12.2759 7.36794e-06 12.4957C-0.000747213 12.7155 0.0564706 12.9316 0.16589 13.1223C0.27531 13.3129 0.433063 13.4713 0.623239 13.5815C0.813416 13.6917 1.02929 13.7498 1.24909 13.75H4.43738C4.58157 14.4556 4.96505 15.0897 5.52295 15.5451C6.08085 16.0006 6.77892 16.2493 7.49909 16.2493C8.21927 16.2493 8.91734 16.0006 9.47524 15.5451C10.0331 15.0897 10.4166 14.4556 10.5608 13.75H13.7491C13.9688 13.7497 14.1846 13.6915 14.3747 13.5812C14.5647 13.471 14.7224 13.3125 14.8317 13.1219C14.941 12.9313 14.9982 12.7153 14.9974 12.4955C14.9966 12.2758 14.9379 12.0601 14.8272 11.8703ZM7.49909 15C7.11145 14.9999 6.73338 14.8796 6.41691 14.6558C6.10043 14.4319 5.86112 14.1155 5.73191 13.75H9.26628C9.13707 14.1155 8.89776 14.4319 8.58128 14.6558C8.26481 14.8796 7.88674 14.9999 7.49909 15ZM1.24909 12.5C1.85066 11.4656 2.49909 9.06875 2.49909 6.25C2.49909 4.92392 3.02588 3.65215 3.96356 2.71447C4.90124 1.77678 6.17301 1.25 7.49909 1.25C8.82518 1.25 10.0969 1.77678 11.0346 2.71447C11.9723 3.65215 12.4991 4.92392 12.4991 6.25C12.4991 9.06641 13.146 11.4633 13.7491 12.5H1.24909Z"
                                    fill="#6F736D" />
                            </svg>
                        </RouterLink>

                        <RouterLink :to="{ name: 'dashboard.settings' }"
                            class="group w-10 h-10 flex items-center justify-center border-solid border-[#EEF2ED] rounded-[10px] p-[10px] transition-all hover:bg-[#2C702C] duration-300">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    class="fill-[#6F736D] w-5 h-5 object-contain transition-all duration-300 group-hover:fill-mainWhite"
                                    d="M8.17508 4.42508C7.4334 4.42508 6.70838 4.64502 6.0917 5.05707C5.47501 5.46913 4.99437 6.0548 4.71054 6.74002C4.42671 7.42524 4.35245 8.17924 4.49714 8.90667C4.64183 9.6341 4.99899 10.3023 5.52343 10.8267C6.04788 11.3512 6.71607 11.7083 7.4435 11.853C8.17092 11.9977 8.92492 11.9235 9.61015 11.6396C10.2954 11.3558 10.881 10.8752 11.2931 10.2585C11.7052 9.64179 11.9251 8.91676 11.9251 8.17508C11.9241 7.18084 11.5286 6.22761 10.8256 5.52458C10.1226 4.82154 9.16933 4.42612 8.17508 4.42508ZM8.17508 10.6751C7.68063 10.6751 7.19728 10.5285 6.78616 10.2538C6.37504 9.97905 6.0546 9.58861 5.86539 9.13179C5.67617 8.67498 5.62666 8.17231 5.72312 7.68736C5.81958 7.20241 6.05769 6.75695 6.40732 6.40732C6.75695 6.05769 7.20241 5.81958 7.68736 5.72312C8.17231 5.62666 8.67498 5.67617 9.13179 5.86539C9.58861 6.0546 9.97905 6.37504 10.2538 6.78616C10.5285 7.19728 10.6751 7.68063 10.6751 8.17508C10.6751 8.83813 10.4117 9.47401 9.94285 9.94285C9.47401 10.4117 8.83813 10.6751 8.17508 10.6751ZM15.0501 8.34383C15.0532 8.23133 15.0532 8.11883 15.0501 8.00633L16.2157 6.55008C16.2768 6.47362 16.3191 6.38388 16.3392 6.28807C16.3593 6.19227 16.3566 6.09309 16.3313 5.99852C16.1402 5.28024 15.8544 4.59059 15.4813 3.94774C15.4325 3.86361 15.3647 3.79205 15.2833 3.73875C15.2019 3.68545 15.1092 3.65188 15.0126 3.64071L13.1595 3.43446C13.0824 3.35321 13.0043 3.27508 12.9251 3.20008L12.7063 1.34227C12.6951 1.24556 12.6614 1.15282 12.608 1.07144C12.5545 0.990053 12.4828 0.922281 12.3985 0.873522C11.7554 0.501137 11.0658 0.21558 10.3477 0.0243032C10.2531 -0.000855417 10.1539 -0.00342863 10.0581 0.016791C9.96229 0.0370106 9.87257 0.0794573 9.79618 0.140709L8.34383 1.30008C8.23133 1.30008 8.11883 1.30008 8.00633 1.30008L6.55008 0.136803C6.47362 0.0756848 6.38388 0.0333797 6.28807 0.0132964C6.19227 -0.00678703 6.09309 -0.00408733 5.99852 0.0211782C5.28036 0.212606 4.59075 0.498431 3.94774 0.871178C3.86361 0.920027 3.79205 0.987839 3.73875 1.06922C3.68545 1.15059 3.65188 1.24329 3.64071 1.33993L3.43446 3.19618C3.35321 3.27378 3.27508 3.35191 3.20008 3.43055L1.34227 3.64383C1.24556 3.65509 1.15282 3.68878 1.07144 3.74222C0.990053 3.79566 0.922281 3.86737 0.873522 3.95165C0.501137 4.59474 0.21558 5.28434 0.0243032 6.00243C-0.000855417 6.09706 -0.00342863 6.19627 0.016791 6.29208C0.0370106 6.38788 0.0794573 6.4776 0.140709 6.55399L1.30008 8.00633C1.30008 8.11883 1.30008 8.23133 1.30008 8.34383L0.136803 9.80008C0.0756848 9.87654 0.0333797 9.96629 0.0132964 10.0621C-0.00678703 10.1579 -0.00408733 10.2571 0.0211782 10.3516C0.212264 11.0699 0.498107 11.7596 0.871178 12.4024C0.920027 12.4866 0.987839 12.5581 1.06922 12.6114C1.15059 12.6647 1.24329 12.6983 1.33993 12.7095L3.19305 12.9157C3.27066 12.997 3.34878 13.0751 3.42743 13.1501L3.64383 15.0079C3.65509 15.1046 3.68878 15.1973 3.74222 15.2787C3.79566 15.3601 3.86737 15.4279 3.95165 15.4766C4.59474 15.849 5.28434 16.1346 6.00243 16.3259C6.09706 16.351 6.19627 16.3536 6.29208 16.3334C6.38788 16.3132 6.4776 16.2707 6.55399 16.2095L8.00633 15.0501C8.11883 15.0532 8.23133 15.0532 8.34383 15.0501L9.80008 16.2157C9.87654 16.2768 9.96629 16.3191 10.0621 16.3392C10.1579 16.3593 10.2571 16.3566 10.3516 16.3313C11.0699 16.1402 11.7596 15.8544 12.4024 15.4813C12.4866 15.4325 12.5581 15.3647 12.6114 15.2833C12.6647 15.2019 12.6983 15.1092 12.7095 15.0126L12.9157 13.1595C12.997 13.0824 13.0751 13.0043 13.1501 12.9251L15.0079 12.7063C15.1046 12.6951 15.1973 12.6614 15.2787 12.608C15.3601 12.5545 15.4279 12.4828 15.4766 12.3985C15.849 11.7554 16.1346 11.0658 16.3259 10.3477C16.351 10.2531 16.3536 10.1539 16.3334 10.0581C16.3132 9.96229 16.2707 9.87257 16.2095 9.79618L15.0501 8.34383ZM13.7923 7.83602C13.8056 8.06187 13.8056 8.2883 13.7923 8.51415C13.783 8.66877 13.8314 8.82134 13.9282 8.94227L15.0368 10.3274C14.9096 10.7317 14.7467 11.1239 14.5501 11.4993L12.7845 11.6993C12.6307 11.7164 12.4887 11.7899 12.386 11.9056C12.2356 12.0747 12.0755 12.2349 11.9063 12.3852C11.7906 12.4879 11.7172 12.6299 11.7001 12.7837L11.504 14.5477C11.1286 14.7445 10.7364 14.9073 10.3321 15.0345L8.94618 13.9259C8.83527 13.8373 8.69751 13.789 8.55555 13.7891H8.51805C8.29221 13.8024 8.06577 13.8024 7.83993 13.7891C7.68531 13.7798 7.53274 13.8283 7.4118 13.9251L6.02274 15.0345C5.61847 14.9073 5.2263 14.7444 4.85087 14.5477L4.65087 12.7845C4.6338 12.6307 4.56031 12.4887 4.44462 12.386C4.27548 12.2356 4.11531 12.0755 3.96493 11.9063C3.86222 11.7906 3.72025 11.7172 3.56649 11.7001L1.80243 11.5032C1.6057 11.1278 1.44282 10.7356 1.31571 10.3313L2.4243 8.9454C2.5211 8.82447 2.56955 8.6719 2.56024 8.51727C2.54696 8.29143 2.54696 8.06499 2.56024 7.83915C2.56955 7.68452 2.5211 7.53195 2.4243 7.41102L1.31571 6.02274C1.44292 5.61847 1.6058 5.2263 1.80243 4.85087L3.56571 4.65087C3.71947 4.6338 3.86144 4.56031 3.96415 4.44462C4.11453 4.27548 4.2747 4.11531 4.44383 3.96493C4.55999 3.86215 4.63378 3.71986 4.65087 3.56571L4.84696 1.80243C5.22235 1.6057 5.61453 1.44282 6.01883 1.31571L7.40477 2.4243C7.5257 2.5211 7.67827 2.56955 7.8329 2.56024C8.05874 2.54696 8.28518 2.54696 8.51102 2.56024C8.66565 2.56955 8.81822 2.5211 8.93915 2.4243L10.3274 1.31571C10.7317 1.44292 11.1239 1.6058 11.4993 1.80243L11.6993 3.56571C11.7164 3.71947 11.7899 3.86144 11.9056 3.96415C12.0747 4.11453 12.2349 4.2747 12.3852 4.44383C12.4879 4.55953 12.6299 4.63302 12.7837 4.65008L14.5477 4.84618C14.7445 5.22157 14.9073 5.61375 15.0345 6.01805L13.9259 7.40399C13.8281 7.52594 13.7796 7.68008 13.7899 7.83602H13.7923Z"
                                    fill="#6F736D" />
                            </svg>
                        </RouterLink> -->

                        <RouterLink :to="{ name: 'dashboard.profile' }"
                            class="group w-10 h-10 flex items-center justify-center border-solid border-[#EEF2ED] rounded-[10px] p-[10px] transition-all hover:bg-[#2C702C] duration-300">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    class="fill-[#6F736D] w-5 h-5 object-contain transition-all duration-300 group-hover:fill-mainWhite"
                                    d="M16.1735 14.6896C14.9836 12.6326 13.15 11.1576 11.0102 10.4584C12.0686 9.82826 12.891 8.86812 13.351 7.7254C13.8109 6.58268 13.8831 5.32056 13.5563 4.13287C13.2296 2.94518 12.522 1.89759 11.5422 1.15097C10.5624 0.404356 9.36466 0 8.13284 0C6.90102 0 5.70325 0.404356 4.72349 1.15097C3.74372 1.89759 3.03612 2.94518 2.70936 4.13287C2.3826 5.32056 2.45474 6.58268 2.91471 7.7254C3.37467 8.86812 4.19703 9.82826 5.2555 10.4584C3.11565 11.1568 1.28206 12.6318 0.0922159 14.6896C0.0485822 14.7608 0.0196403 14.8399 0.0070978 14.9225C-0.00544473 15.005 -0.00133381 15.0892 0.019188 15.1701C0.0397098 15.251 0.0762269 15.3269 0.126585 15.3935C0.176942 15.46 0.24012 15.5158 0.312392 15.5576C0.384663 15.5993 0.464563 15.6262 0.547378 15.6365C0.630193 15.6469 0.714246 15.6406 0.794576 15.6179C0.874907 15.5953 0.949888 15.5568 1.0151 15.5047C1.08031 15.4526 1.13442 15.388 1.17425 15.3146C2.64612 12.7709 5.24768 11.2521 8.13284 11.2521C11.018 11.2521 13.6196 12.7709 15.0914 15.3146C15.1313 15.388 15.1854 15.4526 15.2506 15.5047C15.3158 15.5568 15.3908 15.5953 15.4711 15.6179C15.5514 15.6406 15.6355 15.6469 15.7183 15.6365C15.8011 15.6262 15.881 15.5993 15.9533 15.5576C16.0256 15.5158 16.0887 15.46 16.1391 15.3935C16.1895 15.3269 16.226 15.251 16.2465 15.1701C16.267 15.0892 16.2711 15.005 16.2586 14.9225C16.246 14.8399 16.2171 14.7608 16.1735 14.6896ZM3.75784 5.62713C3.75784 4.76183 4.01443 3.91597 4.49516 3.19651C4.97589 2.47704 5.65917 1.91629 6.4586 1.58515C7.25803 1.25402 8.13769 1.16738 8.98636 1.33619C9.83503 1.505 10.6146 1.92168 11.2264 2.53353C11.8383 3.14539 12.255 3.92494 12.4238 4.77361C12.5926 5.62227 12.5059 6.50194 12.1748 7.30137C11.8437 8.10079 11.2829 8.78407 10.5635 9.26481C9.844 9.74554 8.99813 10.0021 8.13284 10.0021C6.9729 10.0009 5.86082 9.53955 5.04062 8.71935C4.22042 7.89914 3.75908 6.78707 3.75784 5.62713Z"
                                    fill="#6F736D" />
                            </svg>
                        </RouterLink>

                        <button ref="menuBtnRef" class="block mm:hidden cursor-pointer w-[22px] h-[22px]"
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
</template>

<style scoped>
    .active {
        position: relative;

        &:after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 1px;
            background: #6F736D;
        }
    }
</style>
