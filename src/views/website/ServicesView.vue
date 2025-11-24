<script setup>
    import { ref, computed, onMounted, nextTick, watch } from 'vue'
    import { RouterLink } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import apiService from '@/services/apiService'
    import imgCash from '@/assets/images/cash.png'
    import imgTerminal from '@/assets/images/terminal.png'
    import imgGuarantees from '@/assets/images/Guarantees.png'
    import imgAudit from '@/assets/images/audit.png'
    import imgGlass from '@/assets/images/GradientGlass.png'
    const { t } = useI18n()

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
            const response = await apiService.get('/v1/money-transfers')
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
        { to: '/cash', title: 'Расчетная касса', img: imgCash },
        { to: '/terminal', title: 'Документы по установке терминала', img: imgTerminal },
        { to: '/guarantees', title: 'Банковские гарантии', img: imgGuarantees, special: true },
        { to: '/audit', title: 'Аудиторские отчеты', img: imgAudit },
        { to: '/documents', title: 'Тарифы на услуги', img: imgGlass },
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
                    <RouterLink to="/" class="text-[17px] font-Gilroy text-[#6F736D]">
                        Главная
                    </RouterLink>

                    <span class="block w-[18px]">
                        <svg class="block w-full object-contain" width="7" height="14" viewBox="0 0 7 14" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.77279 7.39792L1.14779 13.0229C1.09553 13.0752 1.03349 13.1166 0.965204 13.1449C0.89692 13.1732 0.823734 13.1878 0.749825 13.1878C0.675915 13.1878 0.602729 13.1732 0.534445 13.1449C0.466162 13.1166 0.404117 13.0752 0.351855 13.0229C0.299593 12.9707 0.258137 12.9086 0.229853 12.8403C0.201569 12.772 0.187012 12.6989 0.187012 12.6249C0.187012 12.551 0.201569 12.4779 0.229853 12.4096C0.258137 12.3413 0.299593 12.2792 0.351855 12.227L5.57959 6.99995L0.351855 1.77292C0.246308 1.66737 0.187012 1.52421 0.187012 1.37495C0.187012 1.22568 0.246308 1.08253 0.351855 0.976978C0.457403 0.87143 0.600557 0.812134 0.749825 0.812134C0.899092 0.812134 1.04225 0.87143 1.14779 0.976978L6.77279 6.60198C6.82509 6.65422 6.86658 6.71626 6.89489 6.78454C6.9232 6.85283 6.93777 6.92603 6.93777 6.99995C6.93777 7.07387 6.9232 7.14706 6.89489 7.21535C6.86658 7.28364 6.82509 7.34567 6.77279 7.39792Z"
                                fill="#6F736D" />
                        </svg>
                    </span>

                    <h6 class="text-[17px] font-Gilroy text-mainBlack">
                        Сервисы и услуги
                    </h6>
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
                        Предложения
                    </h2>

                    <div class="relative bg-mainWhite p-1  rounded-[20px] flex items-center gap-5">
                        <span
                            class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-all duration-300 ease-out will-change-transform"
                            :style="sliderStyle" aria-hidden="true"></span>

                        <button type="button" :ref="el => tabRefs[0] = el"
                            class="relative z-[1] font-Gilroy cursor-pointer rounded-2xl text-center transition-colors"
                            :class="activeTab === 'all' ? 'text-mainWhite py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('all')">
                            {{ t('tabs.all') }}
                        </button>

                        <button type="button" :ref="el => tabRefs[1] = el"
                            class="relative z-[1] font-Gilroy cursor-pointer rounded-2xl text-center transition-colors"
                            :class="activeTab === 'transfers' ? 'text-[#EEF2ED] py-3 px-[14px]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('transfers')">
                            {{ t('tabs.moneyTransfers') }}
                        </button>

                        <button type="button" :ref="el => tabRefs[2] = el"
                            class="relative z-[1] font-Gilroy cursor-pointer rounded-2xl text-center transition-colors"
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
                                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">
                                    {{ it.data.main_title || '' }}
                                </p>
                                <span class="max-h-[120px] h-full flex items-end justify-end z-[1]">
                                    <img src="../../assets/images/GradientGlass.png"
                                        class="block max-h-full object-contain" alt="transfer">
                                </span>
                            </template>
                            <template v-else>
                                <h6
                                    :class="['text-[28px] leading-7 font-bold mb-[10px]', it.data.special ? 'text-mainWhite' : 'text-mainBlack']">
                                    {{ it.data.title }}</h6>
                                <p
                                    :class="['text-[17px] leading-5 mb-1 font-Gilroy', it.data.special ? 'text-mainWhite/80' : 'text-[#6F736D]']">
                                    Без пополнения</p>
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
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">{{ item?.main_title || ''
                            }}</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/GradientGlass.png" class="block max-h-full object-contain"
                                    alt="transfer">
                            </span>
                        </RouterLink>
                    </div>
                </div>

                <div v-show="activeTab === 'information'" class="grid gap-4 lg:grid-cols-12">
                    <RouterLink to="/cash"
                        class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                        <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                            Расчетная касса
                        </h6>
                        <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                        <span class="max-h-[120px] h-full flex items-end justify-end">
                            <img src="../../assets/images/cash.png" class="block max-h-full object-contain" alt="card">
                        </span>
                    </RouterLink>

                    <RouterLink to="/terminal"
                        class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                        <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                            Документы по установке терминала
                        </h6>
                        <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                        <span class="max-h-[120px] h-full flex items-end justify-end">
                            <img src="../../assets/images/terminal.png" class="block max-h-full object-contain"
                                alt="cart">
                        </span>
                    </RouterLink>

                    <RouterLink to="/guarantees"
                        class="lg:col-span-4 lg:row-span-2 rounded-[20px] text-mainWhite relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow">
                        <h6 class="text-mainWhite text-[34px] leading-9 font-bold mb-[10px]">
                            Банковские гарантии
                        </h6>
                        <p class="text-mainWhite max-w-[420px] opacity-60">
                            Без пополнения и снятия с возможностью расторжения в любой момент
                        </p>
                        <span class="absolute right-1/2 translate-x-1/2 bottom-20 w-full max-w-[240px] z-[1]">
                            <img src="../../assets/images/Guarantees.png"
                                class="block w-full h-full object-contain select-none pointer-events-none"
                                alt="percent">
                        </span>
                    </RouterLink>

                    <RouterLink to="/audit"
                        class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                        <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                            Аудиторские отчеты
                        </h6>
                        <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Cамый простой способ
                            перевести
                            деньги</p>
                        <span class="max-h-[120px] h-full flex items-end justify-end">
                            <img src="../../assets/images/audit.png" class="block max-h-full object-contain"
                                alt="percent">
                        </span>
                    </RouterLink>

                    <RouterLink to="/documents"
                        class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                        <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                            Тарифы на услуги
                        </h6>
                        <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                        <span class="max-h-[120px] h-full flex items-end justify-end">
                            <img src="../../assets/images/GradientGlass.png" class="block max-h-full object-contain"
                                alt="card">
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
                            Услуги банка
                        </h4>
                        <p class="text-[#6F736D] text-[17px] leading-6 mb-8 leading-tight">
                            АКБ «Сенагат» предлагает Вам следующие услуги и виды деятельности
                        </p>
                        <RouterLink to="/information"
                            class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                            Узнать больше
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
                            Перечень документов для открытия счета
                        </h4>
                        <p class="text-[#6F736D] text-[17px] leading-6 mb-8 leading-tight">
                            Любые взаимоотношения Клиента с Банком начинаются с открытия счета. Открытие расчетных
                            счетов регулируется действующим законодательством Туркменистана.
                        </p>
                        <RouterLink to="/documents"
                            class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                            Узнать больше
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
