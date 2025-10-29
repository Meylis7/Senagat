<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

// Tabs ==============================================================
const activeTab = ref('Все');
const setActiveTab = (tab) => {
    activeTab.value = tab; // Change active tab
};

const tabOrder = ['Все', 'Вклад', 'Кредиты', 'Карты'];
const activeIndex = computed(() => tabOrder.indexOf(activeTab.value));
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

                    <h6 class="text-[17px] font-Gilroy text-[#191B19]">
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

                    <div class="relative bg-[#F7F8F6] p-1 rounded-[20px] grid grid-cols-4 items-center">
                        <span
                            class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                            :style="{ width: 'calc((100% - 8px) / 4)', transform: `translateX(calc(${activeIndex} * 100%))`, left: '4px' }"
                            aria-hidden="true"></span>

                        <button type="button"
                            class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                            :class="activeTab === 'Все' ? 'text-[#F7F8F6]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('Все')">
                            Все
                        </button>

                        <button type="button"
                            class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                            :class="activeTab === 'Вклад' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('Вклад')">
                            Денежные переводы
                        </button>

                        <button type="button"
                            class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                            :class="activeTab === 'Кредиты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('Кредиты')">
                            Электронные платежи
                        </button>

                        <button type="button"
                            class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                            :class="activeTab === 'Карты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setActiveTab('Карты')">
                            Гарантии
                        </button>
                    </div>
                </div>

                <div v-show="activeTab === 'Все'" class="grid gap-4 lg:grid-cols-12">
                    <div class="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Банковская карта «Алтын Асыр»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain"
                                    alt="card">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Потребительские кредиты
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/cart.png" class="block max-h-full object-contain" alt="cart">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Депозитный вклад «Забота о родителях»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/10p.png" class="block max-h-full object-contain"
                                    alt="percent">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Банковская карта «Гоюм»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain"
                                    alt="card">
                            </span>
                        </div>
                    </div>

                    <div
                        class="lg:col-span-4 rounded-[20px] text-[#F7F8F6] relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow">
                        <h6 class="text-[34px] leading-9 font-bold mb-[10px]">
                            Депозитный вклад «Выгодный»
                        </h6>
                        <p class="text-[#F7F8F6] max-w-[420px] opacity-60">
                            Без пополнения и снятия с возможностью расторжения в любой момент
                        </p>

                        <span class="absolute right-1/2 translate-x-1/2 bottom-20 w-full max-w-[240px]">
                            <img src="../../assets/images/1.5p.png"
                                class="block w-full h-full object-contain select-none pointer-events-none"
                                alt="percent">
                        </span>
                    </div>
                </div>

                <div v-show="activeTab === 'Вклад'" class="grid gap-4 lg:grid-cols-12">
                    <div class="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Депозитный вклад «Забота о родителях»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/10p.png" class="block max-h-full object-contain"
                                    alt="percent">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Депозитный вклад «Забота о родителях»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/10p.png" class="block max-h-full object-contain"
                                    alt="percent">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Депозитный вклад «Забота о родителях»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/10p.png" class="block max-h-full object-contain"
                                    alt="percent">
                            </span>
                        </div>
                    </div>

                    <div
                        class="lg:col-span-4 rounded-[20px] text-[#F7F8F6] relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow">
                        <h6 class="text-[34px] leading-9 font-bold mb-[10px]">
                            Депозитный вклад «Выгодный»
                        </h6>
                        <p class="text-[#F7F8F6] max-w-[420px] opacity-60">
                            Без пополнения и снятия с возможностью расторжения в любой момент
                        </p>

                        <span class="absolute right-1/2 translate-x-1/2 bottom-20 max-w-[240]">
                            <img src="../../assets/images/1.5p.png"
                                class="block w-full h-full object-contain select-none pointer-events-none"
                                alt="percent">
                        </span>
                    </div>
                </div>

                <div v-show="activeTab === 'Кредиты'" class="grid gap-4 lg:grid-cols-12">
                    <div class="lg:col-span-7 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Потребительские кредиты
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/cart.png" class="block max-h-full object-contain" alt="cart">
                            </span>
                        </div>
                    </div>
                </div>

                <div v-show="activeTab === 'Карты'" class="grid gap-4 lg:grid-cols-12">
                    <div class="lg:col-span-7 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Банковская карта «Алтын Асыр»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain"
                                    alt="card">
                            </span>
                        </div>

                        <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                                Банковская карта «Гоюм»
                            </h6>
                            <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                            <span class="max-h-[120px] h-full flex items-end justify-end">
                                <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain"
                                    alt="card">
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Foundation ======================================================== -->
    <section class="pt-[60px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between relative bg-[#F7F8F6] rounded-[20px] p-8 overflow-hidden">
                    <div class="block max-w-[460px]">
                        <h4 class=" text-[28px] font-bold mb-[10px] text-[#191B19]">
                            Перечень документов для открытия счета
                        </h4>
                        <p class="text-[#6F736D] text-[17px] leading-6 mb-8">
                            Любые взаимоотношения Клиента с Банком начинаются с открытия счета. Открытие расчетных
                            счетов регулируется действующим законодательством Туркменистана.
                        </p>
                        <RouterLink to="/"
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