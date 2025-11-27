<script setup>
    import { ref, computed, onMounted, nextTick, watch } from 'vue'
    import { RouterLink } from 'vue-router'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import { useI18n } from 'vue-i18n'
    import apiService from '@/services/apiService'
    import imgCash from '@/assets/images/cash.png'
    import imgTerminal from '@/assets/images/terminal.png'
    import imgGuarantees from '@/assets/images/Guarantees.png'
    import imgAudit from '@/assets/images/Audit.png'
    import imgGlass from '@/assets/images/GradientGlass.png'
    const { t } = useI18n()

    const breadcrumbItems = computed(() => ([
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('breadcrumb.services') },
    ]))

    const activeTab = ref('all')
    const tabRefs = ref([])
    const sliderStyle = ref({})

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
                sliderStyle.value = {
                    width: `${button.offsetWidth}px`,
                    transform: `translateX(${button.offsetLeft - 4}px)`,
                }
            }
        })
    }

    onMounted(() => {
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
    <section class="crumb pt-[145px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center gap-x-2">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>
            </div>
        </div>
    </section>

    <!-- Services ========================================================== -->
    <section class="py-[60px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between mb-10">
                    <h2 class="text-[38px] font-bold leading-9">
                        {{ t('offer.title') }}
                    </h2>

                    <div class="relative bg-mainWhite p-1  rounded-[20px] flex items-center ">
                        <span
                            class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-all duration-300 ease-out will-change-transform"
                            :style="sliderStyle" aria-hidden="true"></span>

                        <button type="button" :ref="el => tabRefs[0] = el"
                            class="relative z-[1] font-Gilroy cursor-pointer rounded-2xl text-center transition-colors py-3 px-[14px] "
                            :class="activeTab === 'all' ? 'text-mainWhite py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('all')">
                            {{ t('tabs.all') }}
                        </button>

                        <button type="button" :ref="el => tabRefs[1] = el"
                            class="relative z-[1] font-Gilroy cursor-pointer rounded-2xl text-center transition-colors py-3 px-[14px] "
                            :class="activeTab === 'transfers' ? 'text-[#EEF2ED] py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('transfers')">
                            {{ t('tabs.moneyTransfers') }}
                        </button>

                        <button type="button" :ref="el => tabRefs[2] = el"
                            class="relative z-[1] font-Gilroy cursor-pointer rounded-2xl text-center transition-colors py-3 px-[14px] "
                            :class="activeTab === 'information' ? 'text-[#EEF2ED] py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('information')">
                            {{ t('tabs.information') }}
                        </button>
                    </div>
                </div>

                <div v-show="activeTab === 'all'" class="grid gap-4 lg:grid-cols-12">
                    <div class="lg:col-span-12 grid gap-4 lg:grid-cols-12 sm:grid-cols-2">
                        <RouterLink v-for="(it, idx) in visibleAllItems" :key="idx"
                            :to="it.type === 'transfer' ? { name: 'transfer', params: { id: it.data.id } } : it.data.to"
                            :class="it.type === 'transfer'
                                ? (idx === 5
                                    ? 'lg:col-span-8 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition'
                                    : 'lg:col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition')
                                : (it.data.special
                                    ? 'lg:col-span-4 lg:row-span-2 rounded-[20px] text-mainWhite relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow'
                                    : (idx === 5
                                        ? 'lg:col-span-8 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition'
                                        : 'lg:col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition'))">
                            <template v-if="it.type === 'transfer'">
                                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                                    {{ it.data.title || '' }}
                                </h6>
                                <!-- <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">
                                    {{ it.data.sub_title || '' }}
                                </p> -->
                                <span class="max-h-[120px] h-full flex items-end justify-end z-[1]">
                                    <img :src="it.data?.image_url" class="block max-h-full object-contain"
                                        alt="transfer">
                                </span>
                            </template>
                            <template v-else>
                                <h6
                                    :class="['text-[28px] leading-7 font-bold mb-[10px]', it.data.special ? 'text-mainWhite' : 'text-mainBlack']">
                                    {{ it.data.title }}</h6>
                                <!-- <p
                                    :class="['text-[17px] leading-5 mb-1 font-Gilroy', it.data.special ? 'text-mainWhite/80' : 'text-[#6F736D]']">
                                    {{ t('nav.informations.noReplenishment') }}
                                </p> -->
                                <span :class="it.data.special
                                    ? 'absolute right-1/2 translate-x-1/2 bottom-20 w-full max-w-[240px] z-[1]'
                                    : 'max-h-[120px] h-full flex items-end justify-end z-[1]'
                                    ">
                                    <img :src="it.data.img" class="block h-full object-contain" alt="card">
                                </span>
                            </template>
                        </RouterLink>
                    </div>

                    <button type="button" @click="toggleAllExpanded"
                        class="col-span-12 mt-[26px] flex items-center justify-center gap-[10px] cursor-pointer">
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

                <div v-show="activeTab === 'transfers'" class="grid gap-4 lg:grid-cols-12">
                    <div class="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                        <article v-if="transfersLoading" v-for="n in 2" :key="n"
                            class="rounded-[20px] bg-white p-8 animate-pulse">
                            <div class="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                            <div class="h-4 bg-gray-200 rounded w-28"></div>
                        </article>

                        <div v-else-if="transfersError && transfers.length === 0"
                            class="col-span-2 rounded-[20px] bg-white p-8">
                            <p class="text-[17px] text-[#6F736D] font-Gilroy">{{ transfersError }}</p>
                        </div>

                        <RouterLink v-else v-for="item in transfers" :key="item.id"
                            :to="{ name: 'transfer', params: { id: item.id } }"
                            class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
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

                <div v-show="activeTab === 'information'" class="grid gap-4 lg:grid-cols-12">
                    <RouterLink v-for="(item, idx) in informationItems" :key="idx" :to="item.to" :class="item.special
                        ? 'lg:col-span-4 lg:row-span-2 rounded-[20px] text-mainWhite relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow'
                        : 'col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition'">
                        <h6
                            :class="['leading-7 font-bold mb-[10px]', item.special ? 'text-mainWhite text-[34px] leading-9' : 'text-[28px] text-mainBlack']">
                            {{ item.title }}
                        </h6>
                        <!-- <p
                            :class="item.special ? 'text-mainWhite max-w-[420px] opacity-60' : 'text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy'">
                            {{ item.subtitle }}
                        </p> -->
                        <span :class="item.special
                            ? 'absolute right-1/2 translate-x-1/2 bottom-20 w-full max-w-[240px] z-[1]'
                            : 'max-h-[120px] h-full flex items-end justify-end'">
                            <img :src="item.img" :class="item.special
                                ? 'block w-full h-full object-contain select-none pointer-events-none'
                                : 'block max-h-full object-contain'" :alt="item.title">
                        </span>
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-[60px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div
                    class="flex items-center justify-between relative bg-mainWhite rounded-[20px] p-8 overflow-hidden mb-10">
                    <div class="block max-w-[460px]">
                        <h4 class=" text-[28px] font-bold mb-[10px] text-mainBlack leading-tight">
                            {{ t('bankService.title') }}
                        </h4>
                        <p class="text-[#6F736D] text-[17px] mb-8 leading-tight">
                            {{ t('bankService.text') }}
                        </p>
                        <RouterLink to="/information"
                            class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                            {{ t('btn.learnMore') }}
                        </RouterLink>
                    </div>

                    <span class="max-h-[220px] flex items-end justify-end">
                        <img src="../../assets/images/GradientGlass.png" class="block max-h-full object-contain"
                            alt="card">
                    </span>

                    <span class="bg-circle"></span>
                </div>

                <div class="flex items-center justify-between relative bg-mainWhite rounded-[20px] p-8 overflow-hidden">
                    <div class="block max-w-[500px]">
                        <h4 class=" text-[28px] font-bold mb-[10px] text-mainBlack leading-tight">
                            {{ t('docs.title') }}
                        </h4>
                        <p class="text-[#6F736D] text-[17px] mb-8 leading-tight">
                            {{ t('docs.subTitle') }}
                        </p>
                        <RouterLink to="/documents"
                            class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                            {{ t('btn.learnMore') }}
                        </RouterLink>
                    </div>

                    <span class="max-h-[220px] flex items-end justify-end">
                        <img src="../../assets/images/GradientGlass.png" class="block max-h-full object-contain"
                            alt="card">
                    </span>

                    <span class="bg-circle"></span>
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
