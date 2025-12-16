<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import apiService from '@/services/apiService'
    const { t, locale } = useI18n();
    import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';



    import logo from "@/assets/images/logo.png";

    // Get current route
    const route = useRoute();

    // Check if current page is a detail page
    const isDetailPage = computed(() => {
        const detailPages = ['cards-detail', 'loans-detail', 'deposits-detail', 'about'];
        return detailPages.includes(route.name);
    });

    const activeTab = ref(null);
    const navRef = ref(null);
    const contentRef = ref(null);
    const headerRef = ref(null);
    const isSticky = ref(false);
    const spacerHeight = ref(0);
    const isMenuOpen = ref(false);
    const isLangOpen = ref(false);
    const langRef = ref(null);

    function setTab(tabKey) {
        activeTab.value = activeTab.value === tabKey ? null : tabKey;
    }

    function handleClickOutside(event) {
        const navEl = navRef.value;
        const contentEl = contentRef.value;
        const langEl = langRef.value;
        const headerEl = headerRef.value;
        const target = event.target;
        if (!navEl || !contentEl) return;
        const clickedInsideNav = navEl.contains(target);
        const clickedInsideContent = contentEl.contains(target);
        const clickedInsideLang = langEl ? langEl.contains(target) : false;
        const clickedInsideHeader = headerEl ? headerEl.contains(target) : false;
        if (!clickedInsideNav && !clickedInsideContent) {
            activeTab.value = null;
        }
        if (!clickedInsideLang) {
            isLangOpen.value = false;
        }
        if (!clickedInsideHeader) {
            isMenuOpen.value = false;
        }
    }

    function updateHeights() {
        const el = headerRef.value;
        spacerHeight.value = el ? el.offsetHeight : 0;
    }

    function handleScroll() {
        isSticky.value = window.scrollY > 800;
        if (activeTab.value) {
            activeTab.value = null;
        }
        if (isMenuOpen.value) {
            isMenuOpen.value = false;
        }
        if (isLangOpen.value) {
            isLangOpen.value = false;
        }
    }

    onMounted(async () => {
        window.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateHeights);
        await nextTick();
        updateHeights();
        await loadCredits()
        await loadCards()
        await loadDeposits()

    });

    onUnmounted(() => {
        window.removeEventListener('click', handleClickOutside);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateHeights);
    });

    // Close any open tab whenever the route changes
    watch(
        () => route.fullPath,
        () => {
            activeTab.value = null;
            isMenuOpen.value = false;
            isLangOpen.value = false;
        }
    );

    const loans = ref([])
    const loansBusiness = ref([])
    const loadCredits = async () => {
        try {
            const res = await apiService.fetchCreditTypes()
            const list = res?.data || res
            const arr = Array.isArray(list) ? list : []
            loans.value = arr.filter((it) => String(it.category) === 'individual')
            loansBusiness.value = arr.filter((it) => String(it.category) === 'legal_entity')
        } catch (e) {
            loans.value = []
            loansBusiness.value = []
        }
    }

    watch(locale, () => { loadCredits() })

    const cards = ref([])
    const cardsBusiness = ref([])
    const loadCards = async () => {
        try {
            const res = await apiService.fetchCardTypes()
            const list = res?.data || res
            const arr = Array.isArray(list) ? list : []
            cards.value = arr.filter((it) => String(it.category) === 'individual')
            cardsBusiness.value = arr.filter((it) => String(it.category) === 'entrepreneur')
        } catch (e) {
            cards.value = []
            cardsBusiness.value = []
        }
    }

    watch(locale, () => { loadCards() })

    const deposits = ref([])
    const loadDeposits = async () => {
        try {
            const res = await apiService.fetchDeposits()
            const list = res?.data || res
            const arr = Array.isArray(list) ? list : []
            deposits.value = arr
        } catch (e) {
            deposits.value = []
        }
    }

    watch(locale, () => { loadDeposits() })

    const currentLangLabel = computed(() => {
        const map = { ru: 'RU', en: 'EN', tk: 'TM' };
        return map[String(locale.value)] || 'RU';
    })

    function changeLanguage(lang) {
        const allowed = ['ru', 'en', 'tk'];
        const next = allowed.includes(lang) ? lang : 'ru';
        locale.value = next;
        try { localStorage.setItem('locale', next) } catch (e) { }
        isLangOpen.value = false;
    }
</script>

<template>
    <!-- <div :style="{ height: isSticky ? spacerHeight + 'px' : 'auto' }"></div> -->
    <header ref="headerRef" :class="[
        'top-0 left- w-full z-50 transition-all duration-700 ease-out',
        isSticky ? 'fixed -translate-y-3' : 'absolute translate-y-0'
    ]">
        <div class="auto_container">
            <div :class="[
                'header_inner flex items-center rounded-[20px] py-3 px-4 md:py-5 md:px-8 transition-all duration-500 ease-out relative',
                !isDetailPage ? 'bg-mainWhite' : '',
                isSticky ? 'mt-3 rounded-[14px] py-3 shadow-lg bg-mainWhite' : ''
            ]">
                <RouterLink to="/" class="block w-[46px] min-w-[46px] shrink-0 mr-8">
                    <img :src="logo" class="block w-full h-auto object-contain" alt="logo">
                </RouterLink>

                <nav ref="navRef" class="w-full">
                    <div class="flex items-center">
                        <div
                            :class="[isMenuOpen ? 'flex flex-col !items-start w-full rounded-[20px] p-8 absolute top-[100%] left-0 bg-mainWhite' : 'hidden', 'lg:flex items-center gap-[28px]']">
                            <h4 :class="[
                                'nav-tab cursor-pointer select-none relative font-Gilroy text-[17px] font-normal',
                                isMenuOpen ? 'text-mainBlack' : (isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack'),
                                activeTab === 'one' ? 'after:contents' : ' !after:hidden'
                            ]" @click="setTab('one')">
                                {{ t('header.privateClients') }}
                            </h4>

                            <h4 :class="[
                                'nav-tab cursor-pointer select-none relative font-Gilroy text-[17px] font-normal',
                                isMenuOpen ? 'text-mainBlack' : (isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack'),
                                activeTab === 'two' ? 'after:contents' : ' !after:hidden'
                            ]" @click="setTab('two')">
                                {{ t('header.businessAndIP') }}
                            </h4>

                            <RouterLink to="/services" :class="[
                                'font-Gilroy text-[17px] font-normal',
                                isMenuOpen ? 'text-mainBlack' : (isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack')
                            ]"> {{ t('nav.services.title') }}
                            </RouterLink>

                            <RouterLink to="/about" :class="[
                                'font-Gilroy text-[17px] font-normal',
                                isMenuOpen ? 'text-mainBlack' : (isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack')
                            ]">{{ t('header.aboutBank') }}
                            </RouterLink>

                            <div class="grid sm:grid-cols-2 lg:hidden w-full gap-3 sm:gap-6">
                                <RouterLink to="/dashboard" :class="[
                                    'text-sm font-bold border-solid border-[1px] rounded-[10px] px-5 py-[14px] text-center',
                                    isMenuOpen ? 'text-[#1D2417] border-[#1D2417]' : (isDetailPage && !isSticky ? 'text-mainWhite border-[#F7F8F6]' : 'text-[#1D2417] border-[#1D2417]')
                                ]">
                                    {{ t('header.onlineReception') }}
                                </RouterLink>

                                <a href="http://ibc.senagatbank.com.tm/login" target="_blank"
                                    class="text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] text-center">
                                    {{ t('header.internetBank') }}
                                </a>
                            </div>
                        </div>

                        <div class="flex items-center ml-auto gap-x-2">
                            <div ref="langRef" class="relative">
                                <button type="button" @click="isLangOpen = !isLangOpen" :class="[
                                    'flex items-center gap-2 border-solid border-[1px] border-[#EEF2ED] rounded-[10px] px-4 py-2',
                                    isDetailPage && !isSticky ? 'border-[#F7F8F6] text-mainWhite' : 'text-[#1D2417]'
                                ]">
                                    <span class="text-sm font-bold">{{ currentLangLabel }}</span>
                                    <svg :class="['transition-transform', isLangOpen ? 'rotate-180' : 'rotate-0']"
                                        width="11" height="6" viewBox="0 0 11 6" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10.1465 0.146527C10.193 0.100072 10.2481 0.0632224 10.3088 0.0380812C10.3695 0.01294 10.4346 -9.32947e-07 10.5003 -9.35819e-07C10.566 -9.38691e-07 10.631 0.0129399 10.6917 0.0380812C10.7524 0.0632224 10.8076 0.100072 10.854 0.146527C10.9005 0.192982 10.9373 0.248133 10.9625 0.308829C10.9876 0.369526 11.0006 0.43458 11.0006 0.500278C11.0006 0.565975 10.9876 0.631029 10.9625 0.691726C10.9373 0.752422 10.9005 0.807573 10.854 0.854028L5.85403 5.85403C5.80759 5.90052 5.75245 5.9374 5.69175 5.96256C5.63105 5.98772 5.56599 6.00067 5.50028 6.00067C5.43457 6.00067 5.36951 5.98772 5.30881 5.96256C5.24811 5.9374 5.19296 5.90052 5.14653 5.85403L0.146528 0.854028C0.0527075 0.760208 -2.37246e-07 0.63296 -2.4043e-07 0.500278C-2.43614e-07 0.367596 0.0527074 0.240348 0.146528 0.146528C0.240348 0.0527077 0.367596 -4.92905e-07 0.500278 -4.98705e-07C0.63296 -5.04505e-07 0.760207 0.0527076 0.854028 0.146528L5.50028 4.7934L10.1465 0.146527Z"
                                            :fill="isDetailPage && !isSticky ? '#F7F8F6' : '#191B19'" />
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
                            <RouterLink to="/dashboard" :class="[
                                'text-sm font-bold border-solid border-[1px] rounded-[10px] px-5 py-[14px] hidden lg:block',
                                isDetailPage && !isSticky ? 'text-mainWhite border-[#F7F8F6]' : 'text-[#1D2417] border-[#1D2417]'
                            ]">
                                {{ t('header.onlineReception') }}
                            </RouterLink>

                            <a href="http://ibc.senagatbank.com.tm/login" target="_blank"
                                class="text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] hidden lg:block">
                                {{ t('header.internetBank') }}
                            </a>

                            <button type="button" class="lg:hidden block cursor-pointer bg-none"
                                @click="isMenuOpen = !isMenuOpen; activeTab = null">
                                <svg width="17" height="13" viewBox="0 0 17 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M16.5 6.1875C16.5 6.36984 16.4276 6.54471 16.2986 6.67364C16.1697 6.80257 15.9948 6.875 15.8125 6.875H0.6875C0.505164 6.875 0.330295 6.80257 0.201364 6.67364C0.072433 6.54471 0 6.36984 0 6.1875C0 6.00516 0.072433 5.8303 0.201364 5.70136C0.330295 5.57243 0.505164 5.5 0.6875 5.5H15.8125C15.9948 5.5 16.1697 5.57243 16.2986 5.70136C16.4276 5.8303 16.5 6.00516 16.5 6.1875ZM0.6875 1.375H15.8125C15.9948 1.375 16.1697 1.30257 16.2986 1.17364C16.4276 1.0447 16.5 0.869836 16.5 0.6875C16.5 0.505164 16.4276 0.330295 16.2986 0.201364C16.1697 0.072433 15.9948 0 15.8125 0H0.6875C0.505164 0 0.330295 0.072433 0.201364 0.201364C0.072433 0.330295 0 0.505164 0 0.6875C0 0.869836 0.072433 1.0447 0.201364 1.17364C0.330295 1.30257 0.505164 1.375 0.6875 1.375ZM15.8125 11H0.6875C0.505164 11 0.330295 11.0724 0.201364 11.2014C0.072433 11.3303 0 11.5052 0 11.6875C0 11.8698 0.072433 12.0447 0.201364 12.1736C0.330295 12.3026 0.505164 12.375 0.6875 12.375H15.8125C15.9948 12.375 16.1697 12.3026 16.2986 12.1736C16.4276 12.0447 16.5 11.8698 16.5 11.6875C16.5 11.5052 16.4276 11.3303 16.2986 11.2014C16.1697 11.0724 15.9948 11 15.8125 11Z"
                                        :fill="isSticky ? '#191B19' : (isDetailPage ? '#F7F8F6' : '#191B19')" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            <div ref="contentRef">
                <Transition v-if="activeTab" name="fade-slide" mode="out-in"
                    class="tab-content relative bg-mainWhite py-8 !pt-10 lg:pt-0 px-10 lg:px-[118px] rounded-[20px] z-[50]">
                    <section v-if="activeTab === 'one'" key="one"
                        class="flex justify-between flex-wrap gap-8 relative max-h-[calc(100vh-100px)] overflow-auto no-scrollbar">
                        <button type="button" @click.stop="activeTab = null"
                            class="lg:hidden block cursor-pointer w-5 h-fit absolute top-8 left-8">
                            <svg class="w-full h-full object-contain" width="24" height="18" viewBox="0 0 24 18"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.290324 9.72492L1.52147 10.984L8.09283 17.6936L8.09184 17.6946C8.28239 17.8891 8.54006 18 8.80959 18C9.07912 18 9.33777 17.8891 9.52733 17.6946L10.0328 17.1784C10.2253 16.9839 10.3339 16.7198 10.3339 16.4436C10.3339 16.1684 10.2253 15.9032 10.0328 15.7097L4.83967 10.4042L22.989 10.4042C23.5468 10.4042 24 9.94151 24 9.37197L24 8.63913C24 8.36494 23.8934 8.10285 23.7038 7.90931C23.5142 7.71475 23.2566 7.60688 22.989 7.60688L4.83967 7.60688L10.0359 2.29032C10.2284 2.09677 10.336 1.83166 10.336 1.55644C10.336 1.28024 10.2284 1.01611 10.0359 0.821562L9.53036 0.305441C9.34081 0.110886 9.08215 -3.96909e-07 8.81262 -3.73347e-07C8.54309 -3.49784e-07 8.28443 0.110886 8.09488 0.305441L1.52351 7.01502L0.292368 8.27408L0.292368 8.27508C-0.0966317 8.67629 -0.0976172 9.32245 0.290393 9.72466L0.290324 9.72492Z"
                                    fill="black" />
                            </svg>
                        </button>
                        <div class="block w-full lg:w-[calc(33.33%-24px)]">
                            <RouterLink to="/loans" class="block text-[17px] font-bold mb-[22px]">{{
                                t('nav.loans.title') }}</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li v-for="item in loans" :key="item.id">
                                    <RouterLink :to="`/loans-detail?id=${item.id}`"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ item.title || '' }}</RouterLink>
                                </li>
                            </ul>
                        </div>

                        <div class="block w-full lg:w-[calc(33.33%-24px)]">
                            <RouterLink to="/cards" class="block text-[17px] font-bold mb-[22px]">{{
                                t('nav.cards.title') }}</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li v-for="item in cards" :key="item.id">
                                    <RouterLink :to="`/cards-detail?id=${item.id}`"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ item.title || '' }}</RouterLink>
                                </li>
                            </ul>
                        </div>

                        <div class="block w-full lg:w-[calc(33.33%-24px)]">
                            <RouterLink to="/deposits" class="block text-[17px] font-bold mb-[22px]">{{
                                t('nav.deposits.title') }}</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li v-for="item in deposits" :key="item.id">
                                    <RouterLink :to="`/deposits-detail?id=${item.id}`"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ item.title || '' }}</RouterLink>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section v-else-if="activeTab === 'two'" key="two"
                        class="flex gap-x-8 flex-wrap gap-8 relative max-h-[calc(100vh-100px)] overflow-auto no-scrollbar">
                        <button type="button" @click.stop="activeTab = null"
                            class="lg:hidden block cursor-pointer w-5 h-fit absolute top-8 left-8">
                            <svg class="w-full h-full object-contain" width="24" height="18" viewBox="0 0 24 18"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.290324 9.72492L1.52147 10.984L8.09283 17.6936L8.09184 17.6946C8.28239 17.8891 8.54006 18 8.80959 18C9.07912 18 9.33777 17.8891 9.52733 17.6946L10.0328 17.1784C10.2253 16.9839 10.3339 16.7198 10.3339 16.4436C10.3339 16.1684 10.2253 15.9032 10.0328 15.7097L4.83967 10.4042L22.989 10.4042C23.5468 10.4042 24 9.94151 24 9.37197L24 8.63913C24 8.36494 23.8934 8.10285 23.7038 7.90931C23.5142 7.71475 23.2566 7.60688 22.989 7.60688L4.83967 7.60688L10.0359 2.29032C10.2284 2.09677 10.336 1.83166 10.336 1.55644C10.336 1.28024 10.2284 1.01611 10.0359 0.821562L9.53036 0.305441C9.34081 0.110886 9.08215 -3.96909e-07 8.81262 -3.73347e-07C8.54309 -3.49784e-07 8.28443 0.110886 8.09488 0.305441L1.52351 7.01502L0.292368 8.27408L0.292368 8.27508C-0.0966317 8.67629 -0.0976172 9.32245 0.290393 9.72466L0.290324 9.72492Z"
                                    fill="black" />
                            </svg>
                        </button>
                        <div class="block w-full lg:w-[calc(33.33%-32px)]">
                            <h4 class="text-[17px] font-bold mb-[22px]">{{ t('nav.loans.title') }}</h4>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li v-for="item in loansBusiness" :key="item.id">
                                    <RouterLink :to="`/loans-detail?id=${item.id}`"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ item.title || '' }}</RouterLink>
                                </li>
                            </ul>
                        </div>

                        <div class="block w-full lg:w-[calc(33.33%-32px)]">
                            <h4 class="text-[17px] font-bold mb-[22px]">{{ t('nav.cards.title') }}</h4>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li v-for="item in cardsBusiness" :key="item.id">
                                    <RouterLink :to="`/cards-detail?id=${item.id}`"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ item.title || '' }}</RouterLink>
                                </li>
                            </ul>
                        </div>
                    </section>
                </Transition>
            </div>
        </div>
    </header>

    <div v-if="activeTab || isMenuOpen" class="fixed top-0 left-0 w-screen h-screen bg-[#000] opacity-50 z-[40]"></div>

</template>

<style lang="scss" scoped>
    .nav-tab {
        position: relative;

        &::after {
            position: absolute;
            display: block;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #6F736D;
        }
    }

    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>
