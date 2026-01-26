<script setup>
    import { ref, computed, onMounted, nextTick, watch } from 'vue'
    import { RouterLink } from 'vue-router'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import { useI18n } from 'vue-i18n'
    import apiService from '@/services/apiService'

    import imgCash from '@/assets/images/services/cashService.svg'
    import imgTerminal from '@/assets/images/services/terminalInstallation.svg'
    import imgGuarantees from '@/assets/images/services/bankService.svg'
    import imgAudit from '@/assets/images/services/audit.svg'
    import imgGlass from '@/assets/images/services/tariffs.svg'

    const { t } = useI18n()

    const breadcrumbItems = computed(() => ([
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('breadcrumb.services') },
    ]))

    const activeTab = ref('all')
    const tabRefs = ref([])
    const sliderStyle = ref({})
    const isMobile = ref(false)

    const setActiveTab = (tab) => {
        activeTab.value = tab
        updateSlider()
    }

    const tabOrder = ['all', 'transfers', 'information']
    const activeIndex = computed(() => tabOrder.indexOf(activeTab.value))

    const updateSlider = () => {
        nextTick(() => {
            const index = activeIndex.value
            if (tabRefs.value[index]) {
                const button = tabRefs.value[index]
                const paddingPx = 4
                isMobile.value = window.innerWidth < 640
                if (isMobile.value) {
                    sliderStyle.value = {
                        height: `${button.offsetHeight}px`,
                        width: 'auto',
                        left: `${paddingPx}px`,
                        right: `${paddingPx}px`,
                        transform: `translateY(${button.offsetTop - paddingPx}px)`,
                    }
                } else {
                    sliderStyle.value = {
                        width: `${button.offsetWidth}px`,
                        height: '48px',
                        top: `${paddingPx}px`,
                        bottom: `${paddingPx}px`,
                        transform: `translateX(${button.offsetLeft - paddingPx}px)`,
                    }
                }
            }
        })
    }

    onMounted(() => {
        isMobile.value = window.innerWidth < 640
        updateSlider()
        window.addEventListener('resize', updateSlider)
    })

    watch(activeTab, () => {
        updateSlider()
    })

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

    onMounted(() => {
        fetchTransfers()
    })

    const informationItems = [
        { to: '/cash', title: t('nav.informations.cashDesk'), img: imgCash, subtitle: t('nav.informations.noReplenishment') },
        { to: '/terminal', title: t('nav.informations.terminalDocs'), img: imgTerminal, subtitle: t('nav.informations.noReplenishment') },
        { to: '/guarantees', title: t('nav.informations.bankGuarantees'), img: imgGuarantees, special: true, subtitle: t('nav.informations.noReplenishmentWithdrawal') },
        { to: '/audit', title: t('nav.informations.auditReports'), img: imgAudit, subtitle: t('nav.informations.noReplenishment') },
        { to: '/tariff', title: t('nav.informations.serviceTariffs'), img: imgGlass, subtitle: t('nav.informations.noReplenishment') },
    ]

    const allItems = computed(() => {
        const trans = Array.isArray(transfers.value) ? transfers.value : []
        const info = informationItems.slice()
        const sIdx = info.findIndex((x) => x.special)
        const special = sIdx >= 0 ? { type: 'info', data: info[sIdx] } : null
        if (sIdx >= 0) info.splice(sIdx, 1)
        const mixed = []
        if (info[0]) mixed.push({ type: 'info', data: info.shift() })
        if (trans[0]) mixed.push({ type: 'transfer', data: trans[0] })
        else if (info[0]) mixed.push({ type: 'info', data: info.shift() })
        if (special) mixed.push(special)
        let ti = 1
        while (ti < trans.length || info.length) {
            if (ti < trans.length) mixed.push({ type: 'transfer', data: trans[ti++] })
            if (info.length) mixed.push({ type: 'info', data: info.shift() })
        }
        return mixed
    })

    const isAllExpanded = ref(false)
    const toggleAllExpanded = () => { isAllExpanded.value = !isAllExpanded.value }
    const visibleAllItems = computed(() => isAllExpanded.value ? allItems.value : allItems.value.slice(0, 5))
</script>

<template>
    <!-- Breadcrumb ======================================================== -->
    <section class="crumb pt-[110px] md:pt-[145px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center flex-wrap text-center gap-2">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>
            </div>
        </div>
    </section>

    <!-- Services ========================================================== -->
    <section class="py-[60px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between flex-col sm:flex-row gap-4 mb-5 md:mb-10">
                    <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold leading-9">
                        {{ t('offer.title') }}
                    </h2>

                    <div
                        class="relative bg-mainWhite p-1 rounded-[20px] flex flex-col sm:flex-row items-center w-full sm:w-auto">
                        <span
                            :class="['absolute rounded-[16px] bg-[#2C702C] transition-all duration-300 ease-out will-change-transform', isMobile ? 'left-1 right-1' : 'top-1 bottom-1']"
                            :style="sliderStyle" aria-hidden="true"></span>

                        <button type="button" :ref="el => tabRefs[0] = el"
                            class="relative z-[1] cursor-pointer rounded-2xl text-center transition-colors py-3 px-[14px] w-full sm:w-auto"
                            :class="activeTab === 'all' ? 'text-mainWhite py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('all')">
                            {{ t('tabs.all') }}
                        </button>

                        <button type="button" :ref="el => tabRefs[1] = el"
                            class="relative z-[1] cursor-pointer rounded-2xl text-center transition-colors py-3 px-[14px] w-full sm:w-auto"
                            :class="activeTab === 'transfers' ? 'text-[#EEF2ED] py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('transfers')">
                            {{ t('tabs.moneyTransfers') }}
                        </button>

                        <button type="button" :ref="el => tabRefs[2] = el"
                            class="relative z-[1] cursor-pointer rounded-2xl text-center transition-colors py-3 px-[14px] w-full sm:w-auto"
                            :class="activeTab === 'information' ? 'text-[#EEF2ED] py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('information')">
                            {{ t('tabs.information') }}
                        </button>
                    </div>
                </div>

                <div v-show="activeTab === 'all'" class="flex flex-col gap-10">
                    <div class="grid gap-4 grid-cols-12">
                        <RouterLink v-for="(it, idx) in visibleAllItems" :key="idx"
                            :to="it.type === 'transfer' ? { name: 'transfer', params: { id: it.data.id } } : it.data.to"
                            :class="it.type === 'transfer'
                                ? (idx === 5
                                    ? 'col-span-12 sm:col-span-6 lg:lg:col-span-8 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition'
                                    : 'col-span-12 sm:col-span-6 lg:lg:col-span-4 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition')
                                : (it.data.special
                                    ? 'col-span-12 sm:col-span-6 lg:lg:col-span-4 !row-span-1 lg:!row-span-2 rounded-[20px] text-mainBlack relative overflow-hidden p-8 lg:p-10 lg:min-h-[520px] flex flex-col justify-start bg-[#F7F8F6]'
                                    : (idx === 5
                                        ? 'col-span-12 sm:col-span-6 lg:lg:col-span-8 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition'
                                        : 'col-span-12 sm:col-span-6 lg:lg:col-span-4 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition'))">
                            <template v-if="it.type === 'transfer'">
                                <h6 class="text-lg leading-tight lg:text-[24px] text-mainBlack font-bold mb-[10px]">
                                    {{ it.data.title || '' }}
                                </h6>
                                <!-- <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">
                                    {{ it.data.sub_title || '' }}
                                </p> -->
                                <span class="h-[120px] flex items-end justify-end z-[1]">
                                    <img :src="it.data?.image_url" class="block h-full object-contain"
                                        alt="transfer">
                                </span>
                            </template>
                            <template v-else>
                                <h6
                                    :class="['text-lg leading-tight lg:text-[24px] font-bold mb-[10px]', it.data.special ? 'text-mainBlack' : 'text-mainBlack']">
                                    {{ it.data.title }}</h6>
                                <!-- <p
                                    :class="['text-[17px] leading-5 mb-1 font-Gilroy', it.data.special ? 'text-mainWhite/80' : 'text-[#6F736D]']">
                                    {{ t('nav.informations.noReplenishment') }}
                                </p> -->
                                <span :class="it.data.special
                                    ? 'lg:absolute lg:right-1/2 lg:translate-x-1/2 lg:bottom-20 ml-auto lg:ml-0 lg:h-[200px] lg:w-[200px] z-[2]'
                                    : 'h-[95px] lg:h-[120px] flex items-end justify-end'
                                    ">
                                    <img :src="it.data.img" class="block h-full object-contain" alt="card">
                                </span>
                            </template>
                        </RouterLink>
                    </div>

                    <button type="button" @click="toggleAllExpanded"
                        class="flex items-center justify-center gap-[10px] cursor-pointer">
                        <p class="text-[#2C702C] text-[17px] font-Gilroy">
                            {{ isAllExpanded ? t('btn.hide') : t('btn.showAll') }}
                        </p>

                        <span>
                            <svg :class="isAllExpanded ? 'rotate-180' : ''" class="transition-transform" width="14"
                                height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.5675 1.06754L7.31754 7.31754C7.25949 7.37565 7.19056 7.42175 7.11469 7.4532C7.03881 7.48465 6.95748 7.50084 6.87535 7.50084C6.79321 7.50084 6.71188 7.48465 6.63601 7.4532C6.56014 7.42175 6.49121 7.37565 6.43316 7.31754L0.18316 1.06754C0.0658846 0.95026 0 0.7912 0 0.625347C0 0.459495 0.0658846 0.300435 0.18316 0.18316C0.300435 0.0658843 0.459495 0 0.625347 0C0.7912 0 0.95026 0.0658843 1.06753 0.18316L6.87535 5.99175L12.6832 0.18316C12.7412 0.125091 12.8102 0.0790281 12.886 0.0476015C12.9619 0.0161748 13.0432 0 13.1253 0C13.2075 0 13.2888 0.0161748 13.3647 0.0476015C13.4405 0.0790281 13.5095 0.125091 13.5675 0.18316C13.6256 0.241229 13.6717 0.310167 13.7031 0.386037C13.7345 0.461908 13.7507 0.543226 13.7507 0.625347C13.7507 0.707469 13.7345 0.788787 13.7031 0.864658C13.6717 0.940528 13.6256 1.00947 13.5675 1.06754Z"
                                    fill="#2C702C" />
                            </svg>
                        </span>
                    </button>
                </div>

                <div v-show="activeTab === 'transfers'" class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 grid grid-cols-12 gap-4">
                        <article v-if="transfersLoading" v-for="n in 2" :key="n"
                            class="rounded-[20px] bg-[#F7F8F6] p-8 animate-pulse">
                            <div class="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                            <div class="h-4 bg-gray-200 rounded w-28"></div>
                        </article>

                        <div v-else-if="transfersError && transfers.length === 0"
                            class="col-span-2 rounded-[20px] bg-[#F7F8F6] p-8">
                            <p class="text-[17px] text-[#6F736D] font-Gilroy">{{ transfersError }}</p>
                        </div>

                        <RouterLink v-else v-for="item in transfers" :key="item.id"
                            :to="{ name: 'transfer', params: { id: item.id } }"
                            class="col-span-12 sm:col-span-6 lg:col-span-4 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-lg leading-tight lg:text-[24px] text-mainBlack font-bold mb-[10px]">
                                {{ item?.title || '' }}
                            </h6>
                            <!-- <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">
                                {{ item?.sub_title || '' }}
                            </p> -->
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img :src="item?.image_url" class="block max-h-full object-contain" alt="transfer">
                            </span>
                        </RouterLink>
                    </div>
                </div>

                <div v-show="activeTab === 'information'" class="grid grid-cols-12 gap-4">
                    <RouterLink v-for="(item, idx) in informationItems" :key="idx" :to="item.to"
                        :class="item.special
                            ? 'col-span-12 sm:col-span-6 lg:col-span-4 !row-span-1 lg:!row-span-2 rounded-[20px] text-mainBlack relative overflow-hidden p-8 lg:p-10 lg:min-h-[520px] flex flex-col justify-start bg-[#F7F8F6] bg-deposit'
                            : 'col-span-12 sm:col-span-6 lg:col-span-4 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition'">
                        <h6
                            :class="['leading-7 font-bold mb-[10px]', item.special ? 'text-mainBlack text-lg leading-tight lg:text-[24px] ' : 'text-lg leading-tight lg:text-[24px] text-mainBlack']">
                            {{ item.title }}
                        </h6>
                        <!-- <p
                            :class="item.special ? 'text-mainBlack max-w-[420px] opacity-60' : 'text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy'">
                            {{ item.subtitle }}
                        </p> -->
                        <span :class="item.special
                            ? 'lg:absolute lg:right-1/2 lg:translate-x-1/2 lg:bottom-20 ml-auto lg:ml-0 lg:h-[200px] lg:w-[200px] z-[2]'
                            : 'h-[95px] lg:h-[120px] flex items-end justify-end'">
                            <img :src="item.img" :class="item.special
                                ? 'block w-full h-full object-contain select-none pointer-events-none'
                                : 'block h-full object-contain'" :alt="item.title">
                        </span>
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>

    <section class="md:pt-[60px] pb-[80px] md:pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div
                    class="flex flex-col md:flex-row items-center justify-between gap-4 relative bg-mainWhite rounded-[20px] p-6 md:p-8 overflow-hidden mb-10">
                    <div class="block w-full md:max-w-[460px]">
                        <h4 class="text-xl md:text-[28px] font-bold mb-[10px] text-mainBlack leading-tight">
                            {{ t('bankService.title') }}
                        </h4>
                        <p class="text-[#6F736D] text-[15px] md:text-[17px] mb-8 leading-tight">
                            {{ t('bankService.text') }}
                        </p>
                        <RouterLink to="/information"
                            class="w-fit block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                            {{ t('btn.learnMore') }}
                        </RouterLink>
                    </div>

                    <div class="hidden md:flex w-[150px] h-[220px] z-10 overflow-hidden items-end justify-end">
                        <!-- <img src="../../assets/images/services/services (6).png" class="w-full h-full object-contain"
                            alt="card"> -->

                        <!-- <svg class="block w-full h-full object-contain" width="160" height="172" viewBox="0 0 160 172" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M143.052 81.251H16.162C14.3319 81.251 13.5693 83.3862 14.7894 84.6063L20.2798 89.9442C20.5849 90.2492 21.1949 90.5542 21.6525 90.5542H137.714C138.172 90.5542 138.782 90.4017 139.087 89.9442L144.577 84.6063C145.645 83.3862 144.882 81.251 143.052 81.251Z"
                                fill="#4D4D4D" />
                            <path
                                d="M45.1394 73.3203H114.075C114.99 73.3203 115.6 72.5577 115.6 71.7952V65.6947C115.6 64.7796 114.838 64.1696 114.075 64.1696H45.1394C44.2243 64.1696 43.6143 64.9321 43.6143 65.6947V71.7952C43.4617 72.5577 44.2243 73.3203 45.1394 73.3203Z"
                                fill="#4D4D4D" />
                            <path d="M108.279 31.0743H99.1279V59.5942H108.279V31.0743Z" fill="#4D4D4D" />
                            <path d="M92.1136 31.0743H82.9629V59.5942H92.1136V31.0743Z" fill="#4D4D4D" />
                            <path d="M76.1 31.0743H66.9492V59.5942H76.1V31.0743Z" fill="#4D4D4D" />
                            <path d="M60.0853 31.0743H50.9346V59.5942H60.0853V31.0743Z" fill="#4D4D4D" />
                            <path
                                d="M45.1386 26.6515H114.074C114.989 26.6515 115.599 25.889 115.599 25.1264V18.5684C115.599 17.9583 115.294 17.5008 114.684 17.1958L80.2164 0.114384C79.7589 -0.0381281 79.3014 -0.0381281 78.8438 0.114384L44.376 17.0433C43.9185 17.3483 43.4609 17.8058 43.4609 18.4159V25.1264C43.4609 25.889 44.2235 26.6515 45.1386 26.6515ZM79.6064 9.11262C82.3516 9.11262 84.6393 11.4003 84.6393 14.1455C84.6393 16.8908 82.3516 19.0259 79.6064 19.0259C76.8612 19.0259 74.5735 16.7382 74.5735 13.993C74.5735 11.2478 76.8612 9.11262 79.6064 9.11262Z"
                                fill="#4D4D4D" />
                            <path
                                d="M7.38703 169.287C7.46071 169.892 7.75309 170.448 8.20898 170.852C8.66487 171.256 9.25275 171.478 9.86167 171.478H43.022C43.4117 171.479 43.796 171.387 44.1441 171.212C44.4922 171.037 44.7944 170.783 45.0264 170.47C45.2584 170.157 45.4138 169.793 45.4801 169.409C45.5463 169.025 45.5216 168.631 45.4079 168.258L41.1438 154.282L54.4194 145.889C56.1362 144.943 58.1482 144.685 60.0485 145.165C60.1001 145.178 60.1521 145.19 60.2045 145.201L87.8033 150.283C95.3952 151.641 103.223 150.536 110.142 147.129C110.247 147.077 110.349 147.018 110.447 146.951L158.18 114.177C158.703 113.817 159.07 113.271 159.205 112.651C159.339 112.03 159.232 111.381 158.904 110.837C157.11 107.848 154.232 105.667 150.87 104.747C147.508 103.828 143.92 104.241 140.855 105.9L140.352 106.172C136.907 102.238 131.146 100.761 126.732 102.999L126.676 103.027L125.014 103.923C122.656 102.006 119.773 100.848 116.744 100.603C113.715 100.358 110.683 101.038 108.048 102.552L97.8077 108.121H84.1532C81.2386 108.117 78.3622 107.458 75.7368 106.193L73.8437 105.277C68.3815 102.619 62.2903 101.525 56.2446 102.115C50.1988 102.706 44.4344 104.958 39.5897 108.622C39.5349 108.663 39.4821 108.707 39.4313 108.752L34.8602 112.821C33.2903 114.219 31.4515 115.281 29.4565 115.942L26.9851 107.836C26.8292 107.325 26.5132 106.877 26.0836 106.559C25.654 106.241 25.1336 106.069 24.5991 106.07H2.49295C2.14012 106.07 1.7913 106.145 1.46956 106.289C1.14782 106.434 0.860496 106.646 0.626577 106.91C0.392659 107.174 0.21748 107.485 0.112624 107.822C0.00776736 108.159 -0.0243767 108.514 0.0183161 108.864L7.38703 169.287ZM129.01 107.43C131.172 106.351 133.854 107.105 135.741 108.655L118.19 118.124L117.566 118.453C117.049 117.118 116.357 115.858 115.507 114.705L129.01 107.43ZM110.457 106.917C110.477 106.906 110.496 106.895 110.516 106.884C111.955 106.052 113.578 105.591 115.24 105.542C116.901 105.493 118.549 105.858 120.034 106.604L111.772 111.055C110.331 110.041 108.733 109.27 107.042 108.774L110.457 106.917ZM38.1735 116.545L42.6658 112.545C46.777 109.459 51.6599 107.566 56.7774 107.075C61.8948 106.584 67.0485 107.515 71.6714 109.764L73.5645 110.679C76.8671 112.271 80.4854 113.1 84.1517 113.105H102.511C105.013 113.108 107.442 113.951 109.408 115.499C111.375 117.046 112.765 119.209 113.356 121.64L100.613 121.064C95.7497 120.844 90.8759 121.069 86.053 121.736C85.3981 121.827 84.8061 122.174 84.4071 122.701C84.0081 123.228 83.8348 123.892 83.9254 124.547C84.0161 125.202 84.3631 125.794 84.8903 126.193C85.4175 126.592 86.0815 126.765 86.7364 126.675C91.2583 126.05 95.8278 125.839 100.388 126.044L116.048 126.753C116.086 126.753 116.123 126.755 116.16 126.755C116.822 126.755 117.456 126.492 117.923 126.025C118.391 125.557 118.653 124.923 118.653 124.262C118.653 124.015 118.646 123.77 118.634 123.525L120.538 122.521L143.223 110.284C144.804 109.427 146.615 109.091 148.399 109.322C150.182 109.554 151.848 110.341 153.158 111.573L107.774 142.733C101.854 145.607 95.1764 146.531 88.699 145.374L61.182 140.307C58.0506 139.537 54.7437 139.987 51.9316 141.565C51.8928 141.587 51.8543 141.61 51.8166 141.634L39.6375 149.334L30.9105 120.708C33.5932 119.837 36.0662 118.42 38.1735 116.545ZM22.7537 111.055L39.6545 166.493H12.0689L5.30946 111.055H22.7537Z"
                                fill="#4D4D4D" />
                            <path
                                d="M24.7044 165.328C26.0719 165.328 27.4087 164.922 28.5457 164.162C29.6828 163.403 30.569 162.323 31.0923 161.059C31.6157 159.796 31.7526 158.406 31.4858 157.064C31.219 155.723 30.5605 154.491 29.5935 153.524C28.6265 152.557 27.3945 151.899 26.0533 151.632C24.712 151.365 23.3218 151.502 22.0584 152.025C20.7949 152.549 19.7151 153.435 18.9553 154.572C18.1956 155.709 17.79 157.046 17.79 158.413C17.7921 160.246 18.5212 162.004 19.8175 163.3C21.1137 164.596 22.8712 165.325 24.7044 165.328ZM24.7044 156.485C25.0858 156.485 25.4587 156.598 25.7759 156.81C26.0931 157.022 26.3403 157.323 26.4863 157.676C26.6323 158.028 26.6704 158.416 26.596 158.79C26.5215 159.164 26.3378 159.508 26.068 159.778C25.7983 160.047 25.4546 160.231 25.0804 160.305C24.7063 160.38 24.3184 160.341 23.966 160.195C23.6136 160.049 23.3124 159.802 23.1005 159.485C22.8886 159.168 22.7756 158.795 22.7756 158.413C22.7766 157.902 22.9801 157.412 23.3417 157.051C23.7032 156.69 24.1932 156.486 24.7044 156.486V156.485Z"
                                fill="#4D4D4D" />
                        </svg> -->


                        <svg class="block w-full h-full object-contain" width="160" height="175" viewBox="0 0 160 175"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M127.13 28.7898H32.1309V21.2905L79.6401 0L103.751 10.8198L127.131 21.2999L127.13 28.7898ZM119.703 79.6711V36.6575H103.385V79.6711H119.703ZM87.7889 79.6711V36.6575H71.4709V79.6711H87.7889ZM55.8848 79.6711V36.6575H39.5668V79.6711H55.8848ZM127.131 87.5289H32.1313V93.9906L127.131 94V87.5289Z"
                                fill="#4D4D4D" />
                            <path
                                d="M7.38703 172.733C7.46071 173.337 7.75309 173.894 8.20898 174.298C8.66487 174.701 9.25275 174.924 9.86167 174.924H43.022C43.4117 174.924 43.796 174.833 44.1441 174.658C44.4922 174.483 44.7944 174.228 45.0264 173.915C45.2584 173.602 45.4138 173.239 45.4801 172.855C45.5463 172.471 45.5216 172.077 45.4079 171.704L41.1438 157.727L54.4194 149.335C56.1362 148.389 58.1482 148.13 60.0485 148.611C60.1001 148.624 60.1521 148.635 60.2045 148.647L87.8033 153.728C95.3952 155.087 103.223 153.982 110.142 150.575C110.247 150.523 110.349 150.463 110.447 150.397L158.18 117.623C158.703 117.263 159.07 116.717 159.205 116.096C159.339 115.476 159.232 114.827 158.904 114.282C157.11 111.294 154.232 109.113 150.87 108.193C147.508 107.273 143.92 107.686 140.855 109.346L140.352 109.618C136.907 105.684 131.146 104.207 126.732 106.444L126.676 106.473L125.014 107.369C122.656 105.451 119.773 104.294 116.744 104.049C113.715 103.804 110.683 104.484 108.048 105.998L97.8077 111.567H84.1532C81.2386 111.563 78.3622 110.904 75.7368 109.638L73.8437 108.723C68.3815 106.065 62.2903 104.971 56.2446 105.561C50.1988 106.151 44.4344 108.404 39.5897 112.068C39.5349 112.109 39.4821 112.152 39.4313 112.198L34.8602 116.267C33.2903 117.664 31.4515 118.726 29.4565 119.388L26.9851 111.281C26.8292 110.77 26.5132 110.323 26.0836 110.005C25.654 109.687 25.1336 109.515 24.5991 109.515H2.49295C2.14012 109.515 1.7913 109.59 1.46956 109.735C1.14782 109.88 0.860496 110.091 0.626577 110.356C0.392659 110.62 0.21748 110.931 0.112624 111.267C0.00776736 111.604 -0.0243767 111.96 0.0183161 112.31L7.38703 172.733ZM129.01 110.876C131.172 109.796 133.854 110.551 135.741 112.101L118.19 121.57L117.566 121.899C117.049 120.564 116.357 119.303 115.507 118.151L129.01 110.876ZM110.457 110.362C110.477 110.352 110.496 110.341 110.516 110.329C111.955 109.497 113.578 109.036 115.24 108.987C116.901 108.939 118.549 109.303 120.034 110.049L111.772 114.501C110.331 113.486 108.733 112.716 107.042 112.219L110.457 110.362ZM38.1735 119.991L42.6658 115.991C46.777 112.904 51.6599 111.011 56.7774 110.521C61.8948 110.03 67.0485 110.96 71.6714 113.209L73.5645 114.125C76.8671 115.717 80.4854 116.546 84.1517 116.551H102.511C105.013 116.554 107.442 117.397 109.408 118.944C111.375 120.492 112.765 122.654 113.356 125.086L100.613 124.509C95.7497 124.29 90.8759 124.515 86.053 125.182C85.3981 125.272 84.8061 125.619 84.4071 126.146C84.0081 126.674 83.8348 127.338 83.9254 127.993C84.0161 128.648 84.3631 129.24 84.8903 129.639C85.4175 130.038 86.0815 130.211 86.7364 130.12C91.2583 129.495 95.8278 129.284 100.388 129.49L116.048 130.198C116.086 130.198 116.123 130.201 116.16 130.201C116.822 130.201 117.456 129.938 117.923 129.471C118.391 129.003 118.653 128.369 118.653 127.708C118.653 127.461 118.646 127.215 118.634 126.971L120.538 125.967L143.223 113.729C144.804 112.873 146.615 112.537 148.399 112.768C150.182 113 151.848 113.787 153.158 115.019L107.774 146.179C101.854 149.053 95.1764 149.977 88.699 148.819L61.182 143.753C58.0506 142.983 54.7437 143.433 51.9316 145.011C51.8928 145.033 51.8543 145.056 51.8166 145.08L39.6375 152.779L30.9105 124.154C33.5932 123.283 36.0662 121.866 38.1735 119.991ZM22.7537 114.501L39.6545 169.938H12.0689L5.30946 114.501H22.7537Z"
                                fill="#4D4D4D" />
                            <path
                                d="M23.9143 168.829C25.2818 168.829 26.6186 168.423 27.7557 167.663C28.8928 166.904 29.779 165.824 30.3023 164.56C30.8256 163.297 30.9626 161.907 30.6958 160.565C30.429 159.224 29.7705 157.992 28.8035 157.025C27.8365 156.058 26.6045 155.4 25.2632 155.133C23.922 154.866 22.5317 155.003 21.2683 155.526C20.0049 156.05 18.925 156.936 18.1653 158.073C17.4055 159.21 17 160.547 17 161.914C17.0021 163.747 17.7312 165.505 19.0274 166.801C20.3237 168.097 22.0812 168.827 23.9143 168.829ZM23.9143 159.986C24.2958 159.986 24.6687 160.099 24.9859 160.311C25.3031 160.523 25.5503 160.824 25.6962 161.177C25.8422 161.529 25.8804 161.917 25.8059 162.291C25.7315 162.665 25.5478 163.009 25.278 163.279C25.0082 163.548 24.6645 163.732 24.2904 163.806C23.9162 163.881 23.5284 163.843 23.176 163.696C22.8236 163.55 22.5224 163.303 22.3105 162.986C22.0986 162.669 21.9855 162.296 21.9856 161.914C21.9865 161.403 22.1901 160.913 22.5516 160.552C22.9132 160.191 23.4032 159.988 23.9143 159.987V159.986Z"
                                fill="#4D4D4D" />
                        </svg>
                    </div>

                    <!-- <span class="bg-circle !hidden md:!block"></span> -->
                </div>

                <div
                    class="flex flex-col md:flex-row items-center justify-between gap-4 relative bg-mainWhite rounded-[20px] p-6 md:p-8 overflow-hidden">
                    <div class="block md:max-w-[500px]">
                        <h4 class="text-xl md:text-[28px] font-bold mb-[10px] text-mainBlack leading-tight">
                            {{ t('docs.title') }}
                        </h4>
                        <p class="text-[#6F736D] text-[15px] md:text-[17px] mb-8 leading-tight">
                            {{ t('docs.subTitle') }}
                        </p>
                        <RouterLink to="/documents"
                            class="w-fit block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                            {{ t('btn.learnMore') }}
                        </RouterLink>
                    </div>

                    <div class="hidden md:flex w-[150px] z-10 overflow-hidden items-end justify-end">
                        <!-- <img src="../../assets/images/services/services (2).png" class="w-full h-full object-contain"
                            alt="card"> -->

                        <svg class="block w-full h-full object-contain" viewBox="0 0 200 221" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.27661 218.169C9.36914 218.928 9.7363 219.627 10.3088 220.134C10.8813 220.641 11.6196 220.921 12.3843 220.92H54.0269C54.5162 220.921 54.9989 220.806 55.4361 220.586C55.8732 220.366 56.2527 220.047 56.5441 219.654C56.8354 219.261 57.0305 218.804 57.1137 218.322C57.1969 217.84 57.1659 217.345 57.0231 216.877L51.6683 199.325L68.3397 188.786C70.4957 187.598 73.0223 187.273 75.4087 187.877C75.4736 187.893 75.5389 187.907 75.6046 187.921L110.263 194.303C119.797 196.009 129.627 194.621 138.316 190.343C138.448 190.277 138.576 190.203 138.699 190.12L198.642 148.962C199.299 148.51 199.76 147.824 199.929 147.045C200.098 146.265 199.963 145.45 199.552 144.767C197.299 141.014 193.685 138.275 189.462 137.12C185.24 135.965 180.735 136.484 176.885 138.568L176.253 138.909C171.927 133.969 164.693 132.114 159.15 134.924L159.08 134.96L156.992 136.085C154.032 133.677 150.411 132.223 146.607 131.916C142.803 131.608 138.995 132.462 135.687 134.363L122.827 141.356H105.679C102.019 141.352 98.4071 140.524 95.11 138.935L92.7327 137.785C85.8733 134.447 78.224 133.073 70.6318 133.815C63.0395 134.556 55.8006 137.384 49.7167 141.986C49.6478 142.038 49.5815 142.092 49.5177 142.149L43.7773 147.259C41.8059 149.014 39.4967 150.348 36.9914 151.178L33.8878 140.998C33.6921 140.356 33.2952 139.794 32.7557 139.395C32.2162 138.995 31.5627 138.78 30.8915 138.781H3.13064C2.68756 138.781 2.24951 138.875 1.84547 139.056C1.44143 139.238 1.08061 139.504 0.786854 139.836C0.4931 140.167 0.273111 140.558 0.141433 140.981C0.00975423 141.404 -0.0306122 141.85 0.0230013 142.29L9.27661 218.169ZM162.011 140.489C164.725 139.133 168.093 140.081 170.463 142.027L148.423 153.918L147.639 154.332C146.99 152.655 146.12 151.072 145.054 149.625L162.011 140.489ZM138.711 139.844C138.736 139.831 138.761 139.817 138.786 139.802C140.593 138.758 142.631 138.179 144.718 138.117C146.804 138.056 148.873 138.514 150.739 139.451L140.363 145.041C138.554 143.767 136.547 142.799 134.424 142.176L138.711 139.844ZM47.9381 151.936L53.5797 146.913C58.7424 143.036 64.8744 140.659 71.3009 140.043C77.7274 139.427 84.1993 140.595 90.0047 143.419L92.3821 144.569C96.5295 146.568 101.073 147.61 105.678 147.616H128.733C131.875 147.62 134.925 148.678 137.395 150.621C139.864 152.565 141.61 155.28 142.353 158.334L126.35 157.61C120.242 157.334 114.122 157.617 108.065 158.454C107.243 158.568 106.499 159.004 105.998 159.666C105.497 160.328 105.28 161.162 105.393 161.984C105.507 162.807 105.943 163.55 106.605 164.051C107.267 164.552 108.101 164.77 108.923 164.656C114.602 163.871 120.34 163.606 126.067 163.864L145.733 164.754C145.78 164.754 145.827 164.757 145.874 164.757C146.704 164.757 147.5 164.427 148.087 163.84C148.674 163.253 149.004 162.457 149.004 161.627C149.004 161.316 148.995 161.008 148.981 160.701L151.371 159.44L179.858 144.072C181.845 142.997 184.119 142.575 186.359 142.865C188.599 143.156 190.69 144.145 192.336 145.692L135.342 184.822C127.908 188.431 119.522 189.592 111.388 188.138L76.8322 181.776C72.8998 180.809 68.747 181.374 65.2155 183.355C65.1668 183.383 65.1185 183.412 65.0711 183.442L49.7766 193.111L38.8173 157.163C42.1862 156.07 45.2918 154.29 47.9381 151.936ZM28.5741 145.041L49.7981 214.66H15.156L6.66761 145.041H28.5741Z"
                                fill="#4D4D4D" />
                            <path
                                d="M31.0228 213.196C32.7402 213.196 34.4189 212.687 35.8468 211.733C37.2747 210.779 38.3877 209.423 39.0448 207.836C39.702 206.25 39.874 204.504 39.539 202.819C39.2039 201.135 38.377 199.588 37.1626 198.374C35.9483 197.159 34.4011 196.332 32.7168 195.997C31.0325 195.662 29.2866 195.834 27.7 196.491C26.1134 197.148 24.7573 198.261 23.8032 199.689C22.8491 201.117 22.3398 202.796 22.3398 204.513C22.3424 206.815 23.2581 209.022 24.8859 210.65C26.5137 212.278 28.7208 213.194 31.0228 213.196ZM31.0228 202.092C31.5019 202.092 31.9702 202.234 32.3685 202.5C32.7668 202.766 33.0773 203.144 33.2606 203.587C33.4439 204.03 33.4918 204.517 33.3983 204.986C33.3048 205.456 33.0741 205.888 32.7353 206.227C32.3966 206.565 31.9649 206.796 31.4951 206.889C31.0252 206.983 30.5382 206.935 30.0956 206.751C29.6531 206.568 29.2748 206.257 29.0087 205.859C28.7426 205.461 28.6007 204.992 28.6007 204.513C28.6019 203.871 28.8575 203.256 29.3116 202.803C29.7656 202.349 30.381 202.094 31.0228 202.093V202.092Z"
                                fill="#4D4D4D" />
                            <path
                                d="M83.4371 129.259H139.625C143.382 129.256 146.985 127.761 149.643 125.104C152.3 122.447 153.795 118.845 153.799 115.087V109.691H171.772C175.53 109.687 179.132 108.193 181.789 105.536C184.446 102.879 185.94 99.2764 185.945 95.519V31.0263C185.945 30.6147 185.863 30.2071 185.706 29.8268C185.548 29.4466 185.317 29.1012 185.025 28.8104L157.129 0.972676C156.619 0.463173 155.948 0.145646 155.23 0.0737892L154.649 0.0156522C154.544 0.00521735 154.44 0 154.336 0H115.584C111.827 0.00426132 108.224 1.49881 105.568 4.15575C102.911 6.81269 101.416 10.415 101.412 14.1724V19.568H83.4371C79.6796 19.5721 76.0772 21.0666 73.4202 23.7236C70.7633 26.3805 69.2688 29.983 69.2646 33.7405V115.087C69.269 118.845 70.7636 122.447 73.4205 125.104C76.0774 127.761 79.6797 129.255 83.4371 129.259ZM125.843 30.2451L143.155 47.522H133.755C131.657 47.5197 129.646 46.6854 128.163 45.2022C126.68 43.719 125.845 41.708 125.843 39.6105V30.2451ZM157.99 10.6771L175.304 27.954H165.902C163.804 27.9517 161.793 27.1174 160.31 25.6342C158.827 24.151 157.993 22.14 157.99 20.0425V10.6771ZM107.673 14.1724C107.675 12.075 108.51 10.0641 109.993 8.58091C111.476 7.09774 113.487 6.26339 115.584 6.2609H151.729V20.0425C151.734 23.8 153.228 27.4023 155.885 30.0592C158.542 32.7161 162.144 34.2107 165.902 34.2149H179.684V95.519C179.681 97.6166 178.847 99.6275 177.364 101.111C175.881 102.594 173.87 103.428 171.772 103.431H153.799V50.5944C153.799 50.1827 153.718 49.7751 153.56 49.3949C153.402 49.0146 153.171 48.6692 152.88 48.3784L124.982 20.5407C124.472 20.0312 123.801 19.7137 123.083 19.6418L122.502 19.5837C122.398 19.5735 122.293 19.5683 122.189 19.568H107.673V14.1724ZM75.5256 33.7405C75.5279 31.6429 76.3622 29.6319 77.8454 28.1488C79.3286 26.6656 81.3396 25.8313 83.4371 25.8289H119.582V39.6105C119.586 43.368 121.081 46.9704 123.738 49.6274C126.395 52.2843 129.997 53.7788 133.755 53.7829H147.538V115.087C147.536 117.185 146.701 119.196 145.218 120.679C143.735 122.162 141.724 122.996 139.626 122.999H83.4371C81.3396 122.996 79.3286 122.162 77.8454 120.679C76.3622 119.196 75.5279 117.185 75.5256 115.087V33.7405Z"
                                fill="#4D4D4D" />
                            <path
                                d="M115.415 78.1843H109.895C109.065 78.1843 108.269 78.5141 107.682 79.1012C107.094 79.6883 106.765 80.4845 106.765 81.3148C106.765 82.145 107.094 82.9413 107.682 83.5283C108.269 84.1154 109.065 84.4452 109.895 84.4452H115.415C116.245 84.4452 117.041 84.1154 117.628 83.5283C118.215 82.9413 118.545 82.145 118.545 81.3148C118.545 80.4845 118.215 79.6883 117.628 79.1012C117.041 78.5141 116.245 78.1843 115.415 78.1843Z"
                                fill="#4D4D4D" />
                            <path
                                d="M88.6187 70.6427H134.443C135.273 70.6427 136.069 70.3129 136.656 69.7258C137.243 69.1388 137.573 68.3425 137.573 67.5123C137.573 66.682 137.243 65.8858 136.656 65.2987C136.069 64.7116 135.273 64.3818 134.443 64.3818H88.6187C87.7885 64.3818 86.9922 64.7116 86.4052 65.2987C85.8181 65.8858 85.4883 66.682 85.4883 67.5123C85.4883 68.3425 85.8181 69.1388 86.4052 69.7258C86.9922 70.3129 87.7885 70.6427 88.6187 70.6427Z"
                                fill="#4D4D4D" />
                            <path
                                d="M88.6187 84.4452H102.903C103.733 84.4452 104.529 84.1154 105.116 83.5283C105.703 82.9413 106.033 82.145 106.033 81.3148C106.033 80.4845 105.703 79.6883 105.116 79.1012C104.529 78.5141 103.733 78.1843 102.903 78.1843H88.6187C87.7885 78.1843 86.9922 78.5141 86.4052 79.1012C85.8181 79.6883 85.4883 80.4845 85.4883 81.3148C85.4883 82.145 85.8181 82.9413 86.4052 83.5283C86.9922 84.1154 87.7885 84.4452 88.6187 84.4452Z"
                                fill="#4D4D4D" />
                        </svg>

                    </div>

                    <!-- <span class="bg-circle !hidden md:!block"></span> -->
                </div>
            </div>
        </div>
    </section>


</template>



<style lang="scss" scoped>
    .bg-circle {
        position: absolute;
        display: block;
        width: 300px;
        height: 300px;
        background: #BB28ED;
        border-radius: 50%;
        filter: blur(137.15px);
        z-index: 1;
        right: -140px;
        bottom: -150px;
    }

    .hot-glow::after {
        content: "";
        position: absolute;
        width: 321px;
        height: 321px;
        right: -120px;
        bottom: -97px;
        background: #05746A;
        filter: blur(137.15px);
        border-radius: 9999px;
        /* makes it a circle */
        pointer-events: none;
    }
</style>
