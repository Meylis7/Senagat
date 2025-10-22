<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';


// Accordion ===========================================================================
const activeAccordion = ref('card-conditions'); // First accordion open by default
const accordionItems = ref([
    { id: 'card-conditions', title: 'Условия по карте' },
    { id: 'payment-methods', title: 'Способы пополнения' },
    { id: 'cashback', title: 'Все о Кэшбэке' }
]);

function toggleAccordion(id) {
    if (activeAccordion.value === id) {
        activeAccordion.value = null; // Close if already open
    } else {
        activeAccordion.value = id; // Open clicked accordion
    }
}

// Calculator Section ========================================================================
const calcActiveTab = ref('Кредит');
const setCalcTab = (tab) => {
    calcActiveTab.value = tab;
};
const calcTabOrder = ['Кредит', 'Вклад'];
const calcActiveIndex = computed(() => calcTabOrder.indexOf(calcActiveTab.value));

// Deposit Form State ========================================================================
// const depositTypes = ['Накопительный', 'Срочный', 'До востребования'];
// const depositType = ref(depositTypes[0]);
// const isDepositTypeOpen = ref(false);
// const setDepositType = (t) => {
//     depositType.value = t;
//     isDepositTypeOpen.value = false;
// };

const depositMin = 5000;
const depositMax = 60000;
const depositAmount = ref(10000);
const creditMin = 5000;
const creditMax = 60000;
const creditAmount = ref(10000);
const creditTypes = ['Потребительский', 'Ипотечный', 'Автокредит'];
const creditType = ref(creditTypes[0]);
const isCreditTypeOpen = ref(false);
const setCreditType = (t) => {
    creditType.value = t;
    isCreditTypeOpen.value = false;
};

// Utility Functions =========================================================================
const formatMoney = (n) => n.toLocaleString('ru-RU');
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const roundToStep = (v, step) => Math.round(v / step) * step;

// Input Handlers ============================================================================
const onDepositAmountInput = (e) => {
    const raw = String(e.target.value).replace(/\D/g, '');
    const num = clamp(roundToStep(Number(raw || 0), 500), depositMin, depositMax);
    depositAmount.value = num;
    // reflect formatted value back to the input element
    e.target.value = formatMoney(num);
};

const onCreditAmountInput = (e) => {
    const raw = String(e.target.value).replace(/\D/g, '');
    const num = clamp(roundToStep(Number(raw || 0), 500), creditMin, creditMax);
    creditAmount.value = num;
    e.target.value = formatMoney(num);
};

// Term Options ==============================================================================
const termOptions = ['6 мес', '1 год', '1.5 года', '2 года', '3 года'];
const selectedTerm = ref('2 года');
const creditSelectedTerm = ref('2 года');
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[145px] pb-[60px] bg-[#191B19] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center gap-x-2 mb-[60px]">
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

                    <RouterLink to="/" class="text-[17px] font-Gilroy text-[#6F736D]">
                        Кредиты
                    </RouterLink>

                    <span class="block w-[18px]">
                        <svg class="block w-full object-contain" width="7" height="14" viewBox="0 0 7 14" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.77279 7.39792L1.14779 13.0229C1.09553 13.0752 1.03349 13.1166 0.965204 13.1449C0.89692 13.1732 0.823734 13.1878 0.749825 13.1878C0.675915 13.1878 0.602729 13.1732 0.534445 13.1449C0.466162 13.1166 0.404117 13.0752 0.351855 13.0229C0.299593 12.9707 0.258137 12.9086 0.229853 12.8403C0.201569 12.772 0.187012 12.6989 0.187012 12.6249C0.187012 12.551 0.201569 12.4779 0.229853 12.4096C0.258137 12.3413 0.299593 12.2792 0.351855 12.227L5.57959 6.99995L0.351855 1.77292C0.246308 1.66737 0.187012 1.52421 0.187012 1.37495C0.187012 1.22568 0.246308 1.08253 0.351855 0.976978C0.457403 0.87143 0.600557 0.812134 0.749825 0.812134C0.899092 0.812134 1.04225 0.87143 1.14779 0.976978L6.77279 6.60198C6.82509 6.65422 6.86658 6.71626 6.89489 6.78454C6.9232 6.85283 6.93777 6.92603 6.93777 6.99995C6.93777 7.07387 6.9232 7.14706 6.89489 7.21535C6.86658 7.28364 6.82509 7.34567 6.77279 7.39792Z"
                                fill="#6F736D" />
                        </svg>
                    </span>

                    <h6 class="text-[17px] font-Gilroy text-[#F7F8F6]">
                        На образование
                    </h6>
                </div>


                <h1 class="m-auto max-w-[660px] text-[#F7F8F6] mb-[10px] text-center text-5xl font-bold">
                    Успешное образование
                </h1>

                <p class="text-[17px] font-Gilroy text-[#F7F8F6]/60 text-center">
                    Обратитесь в удобный для вас офис
                </p>

                <RouterLink to="/"
                    class="block mt-5 w-fit text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[20px] py-3 px-[35px] mx-auto">
                    Подать заявку
                </RouterLink>

                <span class="block mt-[125px] w-full max-w-[390px] mx-auto relative z-10">
                    <img src="../assets/images/loan-note.png" class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"></span>
    </section>

    <!-- Info  ================================================ -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="grid grid-cols-12 gap-x-4">
                    <div class="col-span-6 block bg-[#F7F8F6] rounded-[20px] p-8">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            6% годовых
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D]">
                            Депозит на остаток денежных средств на карте
                        </p>

                        <span class="block w-[230px] mx-auto relative -bottom-8">
                            <img src="../assets/images/dimond-1.png" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>

                    <div class="col-span-6 block bg-[#F7F8F6] rounded-[20px] p-8">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            6% годовых
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D]">
                            Депозит на остаток денежных средств на карте
                        </p>

                        <span class="block w-[230px] mx-auto relative -bottom-8">
                            <img src="../assets/images/dimond-2.png" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Calc ===================================================================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-[38px] font-bold leading-9">Заявка на открытие вклада</h2>

                    <div class="relative bg-[#F7F8F6] p-1 rounded-[20px] grid grid-cols-2 items-center min-w-[240px]">
                        <span
                            class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                            :style="{ width: 'calc((100% - 8px) / 2)', transform: `translateX(calc(${calcActiveIndex} * 100%))`, left: '4px' }"
                            aria-hidden="true"></span>

                        <button type="button"
                            class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                            :class="calcActiveTab === 'Кредит' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setCalcTab('Кредит')">
                            Я клиент Сенагат банка
                        </button>

                        <button type="button"
                            class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                            :class="calcActiveTab === 'Вклад' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                            @click="setCalcTab('Вклад')">
                            Не клиент банка
                        </button>
                    </div>
                </div>

                <div v-show="calcActiveTab === 'Кредит'" class="grid lg:grid-cols-2 gap-6">
                    <div class="bg-[#F7F8F6] rounded-[20px] p-6">
                        <div class="mb-6">
                            <label class="block text-[#6F736D] text-[17px] mb-3">Сумма кредита</label>
                            <div class="h-[56px] bg-white rounded-[12px] flex items-center px-4">
                                <input type="text" :value="formatMoney(creditAmount)" @input="onCreditAmountInput"
                                    class="w-full outline-none bg-transparent text-[#191B19] font-bold" />
                            </div>
                            <div class="mt-3">
                                <input type="range" :min="creditMin" :max="creditMax" step="500" v-model="creditAmount"
                                    class="w-full accent-[#2C702C]" />
                                <div class="flex justify-between text-[#6F736D] mt-2">
                                    <span>{{ formatMoney(creditMin) }}</span>
                                    <span>{{ formatMoney(creditMax) }}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-[#191B19] font-bold mb-3">Срок</label>
                            <div class="flex flex-wrap gap-3">
                                <button v-for="term in termOptions" :key="term" type="button"
                                    @click="creditSelectedTerm = term"
                                    :class="creditSelectedTerm === term ? 'bg-[#191B19] text-white' : 'bg-white text-[#6F736D]'"
                                    class="h-[48px] px-5 rounded-[12px]">{{ term }}</button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#F7F8F6] rounded-[20px] p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <p class="text-[#6F736D] mb-2">Ежемесячный платёж</p>
                                <h3 class="text-[42px] font-bold">1000 манат</h3>
                            </div>
                            <div>
                                <span
                                    class="inline-flex items-center justify-center h-[44px] w-[44px] rounded-[12px] bg-[#191B19] text-white">1%</span>
                                <p class="text-[#6F736D] mt-2 text-center">Ставка</p>
                            </div>
                        </div>

                        <div class="bg-white rounded-[12px] p-4 mb-6">
                            <p class="text-[#191B19] font-bold mb-2">Вам понадобится:</p>
                            <ul class="text-[#6F736D] space-y-2">
                                <li>Паспорт</li>
                                <li>Справка о доходах</li>
                            </ul>
                        </div>

                        <RouterLink to="/"
                            class="block mt-5 text-center text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[20px] py-3">
                            Заполнить анкету
                        </RouterLink>
                    </div>
                </div>

                <div v-show="calcActiveTab === 'Вклад'" class="grid lg:grid-cols-2 gap-6">
                    <div class="bg-[#F7F8F6] rounded-[20px] p-6">
                        <!-- Amount: input + slider -->
                        <div class="mb-6">
                            <label class="block text-[#6F736D] text-[17px] mb-3">Сумма вклада</label>
                            <div class="h-[56px] bg-white rounded-[12px] flex items-center px-4">
                                <input type="text" :value="formatMoney(depositAmount)" @input="onDepositAmountInput"
                                    class="w-full outline-none bg-transparent text-[#191B19] font-bold" />
                            </div>
                            <div class="mt-3">
                                <input type="range" :min="depositMin" :max="depositMax" step="500"
                                    v-model="depositAmount" class="w-full accent-[#2C702C]" />
                                <div class="flex justify-between text-[#6F736D] mt-2">
                                    <span>{{ formatMoney(depositMin) }}</span>
                                    <span>{{ formatMoney(depositMax) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Term: radio-like buttons -->
                        <div>
                            <label class="block text-[#191B19] font-bold mb-3">Срок</label>
                            <div class="flex flex-wrap gap-3">
                                <button v-for="term in termOptions" :key="term" type="button"
                                    @click="selectedTerm = term"
                                    :class="selectedTerm === term ? 'bg-[#191B19] text-white' : 'bg-white text-[#6F736D]'"
                                    class="h-[48px] px-5 rounded-[12px]">
                                    {{ term }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#F7F8F6] rounded-[20px] p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <p class="text-[#6F736D] mb-2">Ожидаемый доход</p>
                                <h3 class="text-[42px] font-bold">1000 манат</h3>
                            </div>
                            <div>
                                <span
                                    class="inline-flex items-center justify-center h-[44px] px-3 rounded-[12px] bg-[#191B19] text-white">Годовая
                                    ставка</span>
                            </div>
                        </div>

                        <div class="bg-white rounded-[12px] p-4 mb-6">
                            <p class="text-[#191B19] font-bold mb-2">Итоги</p>
                            <ul class="text-[#6F736D] space-y-2">
                                <li>Тип: {{ depositType }}</li>
                                <li>Сумма: {{ formatMoney(depositAmount) }} манат</li>
                                <li>Срок: {{ selectedTerm }}</li>
                            </ul>
                        </div>

                        <RouterLink to="/"
                            class="block mt-5 text-center text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[20px] py-3">
                            Заполнить анкету
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Useful information ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Полезная информация</h2>

                <div class="block p-8 rounded-[20px] mb-4 bg-[#F7F8F6]">
                    <div class="flex items-center justify-between cursor-pointer"
                        @click="toggleAccordion('card-conditions')">
                        <h4 class="text-[28px] font-bold">
                            Способы пополнения
                        </h4>

                        <button type="button" class="transition-transform duration-300 block w-[32px]">
                            <!-- Plus icon when closed -->
                            <svg v-if="activeAccordion !== 'card-conditions'" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9957 12.5535 27.6247 9.2494 25.1876 6.81236C22.7506 4.37532 19.4465 3.0043 16 3ZM21 17H17V21C17 21.2652 16.8946 21.5196 16.7071 21.7071C16.5196 21.8946 16.2652 22 16 22C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21V17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H15V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                            <!-- Minus icon when open -->
                            <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM21 17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                        </button>
                    </div>

                    <Transition name="accordion" mode="out-in">
                        <div v-if="activeAccordion === 'card-conditions'" class="block">
                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Стоимость оформления
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    30 манат
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Ориентировочная доходность
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    6,00 % годовых
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Снятие наличных
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    Наличные деньги не принимаются по любой другой карте, которая изначально была
                                    внесена на «Гоюм» банковскую карту, а затем снята наличными без подтверждения ее
                                    происхождения
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="block p-8 rounded-[20px] mb-4 bg-[#F7F8F6]">
                    <div class="flex items-center justify-between cursor-pointer"
                        @click="toggleAccordion('payment-methods')">
                        <h4 class="text-[28px] font-bold">
                            Способы пополнения
                        </h4>

                        <button type="button" class="transition-transform duration-300 block w-[32px]">
                            <!-- Plus icon when closed -->
                            <svg v-if="activeAccordion !== 'payment-methods'" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9957 12.5535 27.6247 9.2494 25.1876 6.81236C22.7506 4.37532 19.4465 3.0043 16 3ZM21 17H17V21C17 21.2652 16.8946 21.5196 16.7071 21.7071C16.5196 21.8946 16.2652 22 16 22C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21V17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H15V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                            <!-- Minus icon when open -->
                            <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM21 17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                        </button>
                    </div>

                    <Transition name="accordion" mode="out-in">
                        <div v-if="activeAccordion === 'payment-methods'" class="block">
                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Стоимость оформления
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    30 манат
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Ориентировочная доходность
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    6,00 % годовых
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Снятие наличных
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    Наличные деньги не принимаются по любой другой карте, которая изначально была
                                    внесена на «Гоюм» банковскую карту, а затем снята наличными без подтверждения ее
                                    происхождения
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="block p-8 rounded-[20px] bg-[#F7F8F6]">
                    <div class="flex items-center justify-between cursor-pointer" @click="toggleAccordion('cashback')">
                        <h4 class="text-[28px] font-bold">
                            Способы пополнения
                        </h4>

                        <button type="button" class="transition-transform duration-300 block w-[32px]">
                            <!-- Plus icon when closed -->
                            <svg v-if="activeAccordion !== 'cashback'" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9957 12.5535 27.6247 9.2494 25.1876 6.81236C22.7506 4.37532 19.4465 3.0043 16 3ZM21 17H17V21C17 21.2652 16.8946 21.5196 16.7071 21.7071C16.5196 21.8946 16.2652 22 16 22C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21V17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H15V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                            <!-- Minus icon when open -->
                            <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM21 17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                        </button>
                    </div>

                    <Transition name="accordion" mode="out-in">
                        <div v-if="activeAccordion === 'cashback'" class="block">
                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Стоимость оформления
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    30 манат
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Ориентировочная доходность
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    6,00 % годовых
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Снятие наличных
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    Наличные деньги не принимаются по любой другой карте, которая изначально была
                                    внесена на «Гоюм» банковскую карту, а затем снята наличными без подтверждения ее
                                    происхождения
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </section>

    <!-- News ===================================================================================== -->
    <section class="pt-[50px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-[38px] font-bold">Новости, которыми хочется делиться</h2>
                    <RouterLink to="/" class="text-[#2C702C] hover:opacity-80 inline-flex items-center gap-2">
                        Показать все
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.35196 3.77314C6.29969 3.72088 6.25824 3.65884 6.22995 3.59055C6.20167 3.52227 6.18711 3.44908 6.18711 3.37517C6.18711 3.30127 6.20167 3.22808 6.22995 3.1598C6.25824 3.09151 6.29969 3.02947 6.35196 2.97721C6.40422 2.92494 6.46626 2.88349 6.53455 2.8552C6.60283 2.82692 6.67602 2.81236 6.74992 2.81236C6.82383 2.81236 6.89702 2.82692 6.9653 2.8552C7.03359 2.88349 7.09563 2.92494 7.14789 2.97721L12.7729 8.60221C12.8252 8.65445 12.8667 8.71649 12.895 8.78477C12.9233 8.85306 12.9379 8.92625 12.9379 9.00018C12.9379 9.0741 12.9233 9.14729 12.895 9.21558C12.8667 9.28387 12.8252 9.3459 12.7729 9.39814L7.14789 15.0231C7.04234 15.1287 6.89919 15.188 6.74992 15.188C6.60066 15.188 6.4575 15.1287 6.35195 15.0231C6.24641 14.9176 6.18711 14.7744 6.18711 14.6252C6.18711 14.4759 6.24641 14.3328 6.35195 14.2272L11.5797 9.00018L6.35196 3.77314Z"
                                fill="#6F736D" />
                        </svg>

                    </RouterLink>
                </div>

                <div class="flex gap-4">
                    <!-- Promo card left -->
                    <div
                        class="w-full max-w-[390px] flex-shrink-0 rounded-[20px] overflow-hidden bg-[#0E0F0E] p-8 text-white relative min-h-[500px] news-promo-glow">
                        <h6 class="text-[28px] leading-9 text[#F7F8F6] font-bold mb-[10px]">
                            Скачай приложение
                        </h6>
                        <p class="text-[#F7F8F6] text-[17px] leading-7 opacity-60 font-Gilroy">
                            Курс действует на текущее время. <br> Точный курс будет определён на момент совершения
                            операции
                        </p>

                        <span class="block min-w-[232px] z-10 absolute -bottom-[113px] left-1/2 -translate-x-1/2">
                            <img src="../assets/images/mobile-app.png" alt="app"
                                class="block w-full h-auto object-contain" />
                        </span>
                    </div>

                    <!-- News cards right -->
                    <div class="flex-1 grid sm:grid-cols-2 gap-4">
                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>
                    </div>
                </div>

            </div>
        </div>
    </section>

</template>



<style lang="scss" scoped>
.card-bg-circle {
    display: block;
    position: absolute;
    width: 560px;
    height: 560px;
    left: 50%;
    transform: translateX(-50%);
    bottom: -362px;
    background: #BB28ED;
    filter: blur(137.15px);
    border-radius: 50%;
    z-index: 1;
}

/* Accordion animations */
.accordion-enter-active,
.accordion-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.accordion-enter-from {
    opacity: 0;
    max-height: 0;
}

.accordion-leave-to {
    opacity: 0;
    max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    opacity: 1;
    max-height: 500px;
}
</style>