<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import mainLogo from '@/assets/images/main_logo.png';
    import apiService from '@/services/apiService'

    import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

    const route = useRoute()
    const isFooterHidden = computed(() => {
        const hiddenPages = ['branches']
        return hiddenPages.includes(route.name)
    })

    const { t, locale } = useI18n();

    // Function to change language
    const changeLanguage = (lang) => {
        locale.value = lang;
        localStorage.setItem("locale", lang);
    };


    const loans = ref([])
    const loadCredits = async () => {
        try {
            const res = await apiService.fetchCreditTypes()
            const list = res?.data || res
            const arr = Array.isArray(list) ? list : []
            loans.value = arr
        } catch (e) {
            loans.value = []
            loansBusiness.value = []
        }
    }

    watch(locale, () => { loadCredits() })

    const cards = ref([])
    const loadCards = async () => {
        try {
            const res = await apiService.fetchCardTypes()
            const list = res?.data || res
            const arr = Array.isArray(list) ? list : []
            cards.value = arr.filter((it) => String(it.category) === 'individual')
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


    const transfers = ref([])
    const transfersLoading = ref(false)
    const transfersError = ref(null)

    const fetchTransfers = async () => {
        transfersLoading.value = true
        transfersError.value = null
        try {
            const response = await apiService.fetchTransfers()
            if (response?.success && Array.isArray(response?.data)) {
                transfers.value = response.data
            } else if (Array.isArray(response)) {
                transfers.value = response
            } else if (Array.isArray(response?.data)) {
                transfers.value = response.data
            } else {
                transfers.value = []
            }
        } catch (e) {
            transfersError.value = e.message || 'Failed to load transfers'
            transfers.value = []
        } finally {
            transfersLoading.value = false
        }
    }

    onMounted(async () => {
        await loadCredits()
        await loadCards()
        await loadDeposits()
        await fetchTransfers()
    });
</script>

<template>
    <footer v-if="!isFooterHidden" class="bg-mainWhite mt-auto ">
        <div class="auto_container">
            <div class="wrap py-[60px]">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 sm:col-span-6 lg:col-span-3 mb-5 lg:mb-0">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.loans.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li v-for="item in loans" :key="item.id">
                                <RouterLink :to="`/loans-detail?id=${item.id}`"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ item.title || '' }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>

                    <div class="col-span-12 sm:col-span-6 lg:col-span-3 mb-5 lg:mb-0">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.cards.title') }}
                        </h4>

                        <ul class="space-y-4 mb-5 pb-5 border-solid border-0 border-b border-[#EEF2ED]">
                            <li v-for="item in cards" :key="item.id">
                                <RouterLink :to="`/cards-detail?id=${item.id}`"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ item.title || '' }}
                                </RouterLink>
                            </li>
                        </ul>


                        <h4 class=" mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.deposits.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li v-for="item in deposits" :key="item.id">
                                <RouterLink :to="`/deposits-detail?id=${item.id}`"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ item.title || '' }}
                                </RouterLink>
                            </li>
                        </ul>

                    </div>

                    <div class="col-span-12 sm:col-span-6 lg:col-span-3 mb-5 lg:mb-0">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.informations.title') }}
                        </h4>

                        <ul class="space-y-4 mb-5 pb-5 border-solid border-0 border-b border-[#EEF2ED]">
                            <li>
                                <RouterLink to="/cash"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.cashDesk') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/terminal"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.terminalDocs') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/documents"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.documentList') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/audit"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.auditReports') }}
                                </RouterLink>
                            </li>
                        </ul>

                        <h4 class=" mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.transfers.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li v-for="item in transfers" :key="item.id">
                                <RouterLink :to="{ name: 'transfer', params: { id: item.id } }"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ item.title || '' }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>

                    <div class="col-span-12 sm:col-span-6 lg:col-span-3 mb-5 lg:mb-0">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('header.aboutBank') }}
                        </h4>

                        <ul class="space-y-4  mb-5 pb-5  border-solid border-0 border-b border-[#EEF2ED]">
                            <li>
                                <RouterLink to="/about"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.contacts') }}
                                </RouterLink>
                            </li>
                            <!-- <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.requisites') }}
                                </RouterLink>
                            </li> -->
                            <li>
                                <RouterLink to="/news"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.news') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/branches"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.branches') }}
                                </RouterLink>
                            </li>
                        </ul>

                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('footer.languagesTitle') }}
                        </h4>

                        <ul class="space-y-4">
                            <li v-if="locale !== 'en'">
                                <button @click="changeLanguage('en')"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    English
                                </button>
                            </li>
                            <li v-if="locale !== 'ru'">
                                <button @click="changeLanguage('ru')"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    Русский
                                </button>
                            </li>
                            <li v-if="locale !== 'tk'">
                                <button @click="changeLanguage('tk')"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    Türkmençe
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-[#1D2417] py-[60px] text-mainWhite">
            <div class="auto_container">
                <div class="wrap">
                    <div class="grid items-center md:grid-cols-12 gap-8">
                        <div class="col-span-3">
                            <RouterLink to="/" class="block w-full max-w-[178px]">
                                <img :src="mainLogo" alt="logo" class="w-full h-full object-contain" />
                            </RouterLink>
                        </div>

                        <div class="col-span-4 contact flex flex-col">
                            <a href="tel:+993 12 34 11 28"
                                class="font-bold tracking-[0.2px] text-mainWhite text-[20px] md:text-[28px] leading-7">
                                +993 12 34 11 28
                            </a>
                            <p class="text-[17px] font-Gilroy text-mainWhite leading-5 mt-1">
                                {{ t('footer.office_text') }}
                            </p>
                        </div>

                        <div class="col-span-5">
                            <RouterLink to="/" class="flex gap-[10px] w-fit">
                                <div class="block w-full max-w-[80px]">
                                    <img src="../../assets/images/white_logo.png" alt="logo"
                                        class="w-full h-full object-contain" />
                                </div>
                                <div class="block">
                                    <h6 class="text-[#EEF2ED] font-bold text-[17px] leading-tight mb-[17px]">
                                        {{ t('footer.app.title') }}
                                    </h6>
                                    <p class="text-[#EEF2ED] font-Gilroy text-[17px] leading-tight"
                                        v-html="t('footer.app.text')"></p>
                                </div>
                            </RouterLink>
                        </div>
                    </div>

                    <div class="grid gap-6 mt-[60px] border-solid border-[#6F736D] border-0 border-t pt-8">
                        <h6 class="text-[#EEF2ED] text-sm leading-5">
                            {{ t('footer.text') }}
                        </h6>

                        <!-- <h6 class="text-[#EEF2ED] text-sm leading-5">
                            Сенагат-Банк является оператором по обработке персональных данных.
                        </h6> -->

                        <h6 class="text-[#EEF2ED] text-sm leading-5">
                            {{ t('footer.links.privacyPolicy') }}
                            <RouterLink to="/privacy?type=bank" class="text-[#2C702C] inline-block mx-2">
                                {{ t('footer.links.mobileBankingSystem') }}
                            </RouterLink>
                            <span class="text-[#2C702C]  mx-2 hidden sm:inline-block">|</span>
                            <RouterLink to="/privacy?type=payment" class="text-[#2C702C] inline-block mx-2">
                                {{ t('footer.links.paymentSystem') }}
                            </RouterLink>
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>
