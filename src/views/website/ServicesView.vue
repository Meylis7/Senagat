<script setup>
    import { ref, computed, onMounted, nextTick, watch } from 'vue'
    import { RouterLink } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import apiService from '@/services/apiService'
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
                    <div class="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                                Вклад Банковская карта «Алтын Асыр»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/altyn-asyr-card.png"
                                    class="block max-h-full object-contain" alt="card">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                                Потребительские кредиты
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/cart.png" class="block max-h-full object-contain"
                                    alt="cart">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                                Депозитный вклад «Забота о родителях»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/10p.png" class="block max-h-full object-contain"
                                    alt="percent">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                                Банковская карта «Гоюм»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/altyn-asyr-card.png"
                                    class="block max-h-full object-contain" alt="card">
                            </span>
                        </div>
                    </div>

                    <div
                        class="lg:col-span-4 rounded-[20px] text-mainWhite relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow">
                        <h6 class="text-[34px] leading-9 font-bold mb-[10px]">
                            Депозитный вклад «Выгодный»
                        </h6>
                        <p class="text-mainWhite max-w-[420px] opacity-60">
                            Без пополнения и снятия с возможностью расторжения в любой момент
                        </p>

                        <span class="absolute right-1/2 translate-x-1/2 bottom-20 w-full max-w-[240px]">
                            <img src="../../assets/images/1.5p.png"
                                class="block w-full h-full object-contain select-none pointer-events-none"
                                alt="percent">
                        </span>
                    </div>
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
                        <h4 class=" text-[28px] font-bold mb-[10px] text-mainBlack">
                            Услуги банка
                        </h4>
                        <p class="text-[#6F736D] text-[17px] leading-6 mb-8">
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
                        <h4 class=" text-[28px] font-bold mb-[10px] text-mainBlack">
                            Перечень документов для открытия счета
                        </h4>
                        <p class="text-[#6F736D] text-[17px] leading-6 mb-8">
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
        background: #ED6328;
        filter: blur(137.15px);
        border-radius: 9999px;
        /* makes it a circle */
        pointer-events: none;
    }
</style>
