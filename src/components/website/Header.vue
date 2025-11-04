<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';

    import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';

    const { t, locale } = useI18n();

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

    function setTab(tabKey) {
        activeTab.value = activeTab.value === tabKey ? null : tabKey;
    }

    function handleClickOutside(event) {
        const navEl = navRef.value;
        const contentEl = contentRef.value;
        const target = event.target;
        if (!navEl || !contentEl) return;
        const clickedInsideNav = navEl.contains(target);
        const clickedInsideContent = contentEl.contains(target);
        if (!clickedInsideNav && !clickedInsideContent) {
            activeTab.value = null;
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
    }

    onMounted(async () => {
        window.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateHeights);
        await nextTick();
        updateHeights();
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
        }
    );
</script>

<template>
    <!-- <div :style="{ height: isSticky ? spacerHeight + 'px' : 'auto' }"></div> -->
    <header ref="headerRef" :class="[
        'top-0 left- w-full z-50 transition-all duration-700 ease-out',
        isSticky ? 'fixed -translate-y-3' : 'absolute translate-y-0'
    ]">
        <div class="auto_container">
            <div :class="[
                'header_inner flex items-center rounded-[20px] py-5 px-8 transition-all duration-500 ease-out',
                !isDetailPage ? 'bg-mainWhite' : '',
                isSticky ? 'mt-3 rounded-[14px] py-3 shadow-lg bg-mainWhite' : ''
            ]">
                <RouterLink to="/" class="block w-[46px] min-w-[46px] shrink-0 mr-10">
                    <img :src="logo" class="block w-full h-auto object-contain" alt="logo">
                </RouterLink>

                <nav ref="navRef" class="w-full">
                    <div class="flex items-center gap-[34px]">
                        <h4 :class="[
                            'nav-tab cursor-pointer select-none font-Gilroy text-[17px] font-normal',
                            isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack',
                            activeTab === 'one' ? 'after:contents' : ' !after:hidden'
                        ]" @click="setTab('one')">
                            {{ t('header.privateClients') }}</h4>

                        <h4 :class="[
                            'nav-tab cursor-pointer select-none font-Gilroy text-[17px] font-normal',
                            isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack',
                            activeTab === 'two' ? 'after:contents' : ' !after:hidden'
                        ]" @click="setTab('two')">
                            {{ t('header.businessAndIP') }}</h4>

                        <RouterLink to="/services" :class="[
                            'font-Gilroy text-[17px] font-normal',
                            isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack'
                        ]"> {{ t('nav.services.title') }}
                        </RouterLink>

                        <RouterLink to="/about" :class="[
                            'font-Gilroy text-[17px] font-normal',
                            isDetailPage && !isSticky ? 'text-mainWhite' : 'text-mainBlack'
                        ]">{{ t('header.aboutBank') }}
                        </RouterLink>

                        <div class="flex items-center ml-auto gap-x-2">
                            <RouterLink to="/" :class="[
                                'block text-sm font-bold border-solid border-[1px] rounded-[10px] px-5 py-[14px]',
                                isDetailPage && !isSticky ? 'text-mainWhite border-[#F7F8F6]' : 'text-[#1D2417] border-[#1D2417]'
                            ]">
                                {{ t('header.onlineReception') }}
                            </RouterLink>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                                {{ t('header.internetBank') }}
                            </RouterLink>
                        </div>
                    </div>
                </nav>
            </div>
            <div ref="contentRef">
                <Transition v-if="activeTab" name="fade-slide" mode="out-in"
                    class="tab-content absolute w-[calc(100%-60px)] bg-mainWhite py-8 px-[118px] rounded-[20px]">
                    <section v-if="activeTab === 'one'" key="one" class="flex justify-between">
                        <div class="block w-[calc(33.33%-24px)]">
                            <RouterLink to="/loans" class="block text-[17px] font-bold mb-[22px]">{{
                                t('nav.loans.title') }}</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/loans-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.youngFamilies') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/loans-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.consumer') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.weddingsAndBirthdays') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.education') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.overdraft') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.agricultural') }}</RouterLink>
                                </li>

                            </ul>
                        </div>

                        <div class="block w-[calc(33.33%-24px)]">
                            <RouterLink to="/cards" class="block text-[17px] font-bold mb-[22px]">{{
                                t('nav.cards.title') }}</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/cards-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.cards.altynAsyrCard') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/cards-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.cards.goyumCard') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/cards-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.cards.mashgalaCard') }}</RouterLink>
                                </li>
                            </ul>
                        </div>

                        <div class="block w-[calc(33.33%-24px)]">
                            <RouterLink to="/deposits" class="block text-[17px] font-bold mb-[22px]">{{
                                t('nav.deposits.title') }}</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.childrenTargetDeposit') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.parentCare') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.healthOfNation') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.childrenOurFuture') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.profitable') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.demandDeposit') }}</RouterLink>
                                </li>

                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.altynAsyrCardDeposit') }}</RouterLink>
                                </li>

                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.goyumCardDeposit') }}</RouterLink>
                                </li>

                            </ul>
                        </div>

                        <!-- <div class="block w-[calc(25%-24px)]">
                            <RouterLink to="/services" class="block text-[17px] font-bold mb-[22px]">{{
                                t('nav.services.title') }}
                            </RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.services.moneyTransfers') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.services.safetyDepositBoxes') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.services.currencyExchange') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.services.utilityPayments') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.services.communicationPayments') }}</RouterLink>
                                </li>
                            </ul>
                        </div> -->
                    </section>
                    <section v-else-if="activeTab === 'two'" key="two" class="flex gap-x-8">
                        <div class="block w-[calc(33.33%-32px)]">
                            <h4 class="text-[17px] font-bold mb-[22px]">{{ t('nav.loans.title') }}</h4>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.stateEnterprises') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.publicFacilitiesFinancing') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.loans.forProductionPurposes') }}</RouterLink>
                                </li>
                            </ul>
                        </div>

                        <div class="block w-[calc(33.33%-32px)]">
                            <h4 class="text-[17px] font-bold mb-[22px]">{{ t('nav.deposits.title') }}</h4>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.childrenTargetDeposit') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.parentCare') }}</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        {{ t('nav.deposits.healthOfNation') }}</RouterLink>
                                </li>
                            </ul>
                        </div>
                    </section>
                </Transition>
            </div>
        </div>
    </header>
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
</style>
