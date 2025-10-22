<script setup>
import Hero from '@/components/Hero.vue';
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

// Offers Section ============================================================================
const activeTab = ref('Все');
const setActiveTab = (tab) => {
  activeTab.value = tab; // Change active tab
};

const tabOrder = ['Все', 'Вклад', 'Кредиты', 'Карты'];
const activeIndex = computed(() => tabOrder.indexOf(activeTab.value));

// Calculator Section ========================================================================
const calcActiveTab = ref('Кредит');
const setCalcTab = (tab) => {
  calcActiveTab.value = tab;
};
const calcTabOrder = ['Кредит', 'Вклад'];
const calcActiveIndex = computed(() => calcTabOrder.indexOf(calcActiveTab.value));

// Deposit Form State ========================================================================
const depositTypes = ['Накопительный', 'Срочный', 'До востребования'];
const depositType = ref(depositTypes[0]);
const isDepositTypeOpen = ref(false);
const setDepositType = (t) => {
  depositType.value = t;
  isDepositTypeOpen.value = false;
};

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

// Currency Section ==========================================================================
const currencyTabs = ['Текущий курс', 'Обмен'];
const currencyActiveTab = ref('Текущий курс');
const currencyActiveIndex = computed(() => currencyTabs.indexOf(currencyActiveTab.value));
const setCurrencyTab = (t) => {
  currencyActiveTab.value = t;
};

const rates = [
  { code: 'USD', buy: 19.30, sell: 19.30, trend: 'up' },
  { code: 'RUB', buy: 20.65, sell: 20.65, trend: 'down' },
  { code: 'EUR', buy: 21.00, sell: 21.00, trend: 'up' },
];

</script>

<template>
  <main>
    <Hero />

    <!-- Offers =================================================================================== -->
    <section class="pt-[100px] pb-[60px]">
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
                Вклад
              </button>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Кредиты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Кредиты')">
                Кредиты
              </button>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Карты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Карты')">
                Карты
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
                  <img src="../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                  Потребительские кредиты
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../assets/images/cart.png" class="block max-h-full object-contain" alt="cart">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
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
                <img src="../assets/images/1.5p.png"
                  class="block w-full h-full object-contain select-none pointer-events-none" alt="percent">
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
                  <img src="../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
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
                <img src="../assets/images/1.5p.png"
                  class="block w-full h-full object-contain select-none pointer-events-none" alt="percent">
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
                  <img src="../assets/images/cart.png" class="block max-h-full object-contain" alt="cart">
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
                  <img src="../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Foundation =============================================================================== -->
    <section class="pt-[60px] pb-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8">
            <div class="block max-w-[460px]">
              <h4 class=" text-[28px] font-bold mb-[10px] text-[#191B19]">
                Благотворительный фонд
              </h4>
              <p class="text-[#6F736D] text-[17px] leading-6 mb-8">
                Расчет предварительного платежа носит информационный характер и рассчитан при условии оформления
                финансовой защиты кредита. Не является публичной офертой
              </p>
              <RouterLink to="/" class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                Узнать больше
              </RouterLink>
            </div>

            <span class="max-h-[220px] flex items-end justify-end">
              <img src="../assets/images/foundation.png" class="block max-h-full object-contain" alt="card">
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Calc ===================================================================================== -->
    <section class="py-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-[38px] font-bold leading-9">Рассчитать выгоду</h2>

            <div class="relative bg-[#F7F8F6] p-1 rounded-[20px] grid grid-cols-2 items-center min-w-[240px]">
              <span
                class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                :style="{ width: 'calc((100% - 8px) / 2)', transform: `translateX(calc(${calcActiveIndex} * 100%))`, left: '4px' }"
                aria-hidden="true"></span>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="calcActiveTab === 'Кредит' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setCalcTab('Кредит')">
                Кредит
              </button>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="calcActiveTab === 'Вклад' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setCalcTab('Вклад')">
                Вклад
              </button>
            </div>
          </div>

          <div v-show="calcActiveTab === 'Кредит'" class="grid lg:grid-cols-2 gap-6">
            <div class="bg-[#F7F8F6] rounded-[20px] p-6">
              <div class="mb-6">
                <label class="block text-[#6F736D] text-[17px] mb-3">Тип кредита</label>
                <div class="relative">
                  <button type="button" @click="isCreditTypeOpen = !isCreditTypeOpen"
                    class="h-[56px] bg-white rounded-[12px] w-full flex items-center justify-between px-4 text-[#191B19]">
                    <span>{{ creditType }}</span>
                    <svg :class="isCreditTypeOpen ? 'rotate-180' : ''" class="transition-transform" width="18"
                      height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#6F736D" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                  </button>
                  <ul v-show="isCreditTypeOpen"
                    class="absolute z-10 mt-2 w-full bg-white rounded-[12px] shadow p-2 space-y-1">
                    <li v-for="t in creditTypes" :key="t">
                      <button type="button" @click="setCreditType(t)"
                        :class="t === creditType ? 'bg-[#2C702C] text-white' : 'hover:bg-[#F7F8F6] text-[#191B19]'"
                        class="w-full text-left px-3 py-2 rounded-[8px]">{{ t }}</button>
                    </li>
                  </ul>
                </div>
              </div>

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
                  <button v-for="term in termOptions" :key="term" type="button" @click="creditSelectedTerm = term"
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

              <p class="text-[#6F736D]">Расчёт калькулятора предварительный. Персональные условия вы сможете узнать
                после оформления заявки</p>
            </div>
          </div>

          <div v-show="calcActiveTab === 'Вклад'" class="grid lg:grid-cols-2 gap-6">
            <div class="bg-[#F7F8F6] rounded-[20px] p-6">
              <!-- Type of deposit: custom select -->
              <div class="mb-6">
                <label class="block text-[#6F736D] text-[17px] mb-3">Тип вклада</label>
                <div class="relative">
                  <button type="button" @click="isDepositTypeOpen = !isDepositTypeOpen"
                    class="h-[56px] bg-white rounded-[12px] w-full flex items-center justify-between px-4 text-[#191B19]">
                    <span>{{ depositType }}</span>
                    <svg :class="isDepositTypeOpen ? 'rotate-180' : ''" class="transition-transform" width="18"
                      height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#6F736D" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                  </button>
                  <ul v-show="isDepositTypeOpen"
                    class="absolute z-10 mt-2 w-full bg-white rounded-[12px] shadow p-2 space-y-1">
                    <li v-for="t in depositTypes" :key="t">
                      <button type="button" @click="setDepositType(t)"
                        :class="t === depositType ? 'bg-[#2C702C] text-white' : 'hover:bg-[#F7F8F6] text-[#191B19]'"
                        class="w-full text-left px-3 py-2 rounded-[8px]">{{ t }}</button>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Amount: input + slider -->
              <div class="mb-6">
                <label class="block text-[#6F736D] text-[17px] mb-3">Сумма вклада</label>
                <div class="h-[56px] bg-white rounded-[12px] flex items-center px-4">
                  <input type="text" :value="formatMoney(depositAmount)" @input="onDepositAmountInput"
                    class="w-full outline-none bg-transparent text-[#191B19] font-bold" />
                </div>
                <div class="mt-3">
                  <input type="range" :min="depositMin" :max="depositMax" step="500" v-model="depositAmount"
                    class="w-full accent-[#2C702C]" />
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
                  <button v-for="term in termOptions" :key="term" type="button" @click="selectedTerm = term"
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
                  <h3 class="text-[42px] font-bold">1 000 манат</h3>
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

              <p class="text-[#6F736D]">Расчёт калькулятора предварительный и носит справочный характер.</p>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-[32px] bg-[#191B19] mt-4 py-8 px-6 text-white form-glow">
            <form class="max-w-[390px] mx-auto block">
              <h1 class="text-center text-[38px] leading-tight font-bold mb-10">Заполните данные</h1>

              <div class="mb-4">
                <input type="text" placeholder="Фамилия, имя и отчество"
                  class=" text-[17px] w-full rounded-[10px] bg-white text-[#6F736D] placeholder-[#6F736D] p-5 outline-none font-Gilroy" />
                <span class="block text-[#F7F8F6]/60 mt-[10px] font-Gilroy">Уточните точно как в паспорте</span>
              </div>

              <div class="mb-4">
                <div class="flex items-center">
                  <input type="text" value="+993" readonly
                    class=" text-[17px] w-[85px] rounded-[10px] bg-white text-[#6F736D] mr-[6px] p-5 outline-none select-none font-Gilroy" />
                  <input type="tel" placeholder="Номер телефона"
                    class=" text-[17px] flex-1 rounded-[10px] bg-white text-[#6F736D] placeholder-[#6F736D] p-5 outline-none font-Gilroy" />
                </div>
                <span class="block text-[#F7F8F6]/60 text-[15px] mt-[10px] font-Gilroy">На него поступит смс
                  оповещение</span>
              </div>

              <div class="mb-8">
                <input type="text" placeholder="Дата рождения"
                  class=" text-[17px] w-full rounded-[10px] bg-white text-[#6F736D] placeholder-[#6F736D] p-5 outline-none font-Gilroy" />
              </div>

              <button type="submit"
                class="block mx-auto w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                Интернет банк
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Currency ================================================================================= -->
    <section class="py-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <h2 class="text-[38px] font-bold mb-6 leading-9">Спланируйте обмен валюты</h2>

          <div class="flex gap-4">
            <!-- Left card: branches -->
            <div class="w-full max-w-[390px] min-h-[467px] relative rounded-[20px] overflow-hidden bg-[#F7F8F6] p-8">
              <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">Отделения</h6>
              <p class="text-[17px] text-[#6F736D] leading-6 mb-6 font-Gilroy">На карте города</p>
              <span class="block w-[300px] absolute left-1/2 -translate-x-1/2 -bottom-[55px]">
                <img src="../assets/images/currency.png" class="block w-full h-full object-contain" alt="currency">
              </span>
            </div>

            <!-- Right card: exchange rates -->
            <div class="w-full max-w-[calc(100%-406px)] rounded-[20px] bg-[#F7F8F6] p-8">
              <div class="flex items-center justify-between mb-8">
                <h6 class="text-[28px] text-[#191B19] leading-7 font-bold">Обменные курсы</h6>

                <div class="relative bg-white p-1 rounded-[20px] grid grid-cols-2 items-center min-w-[260px]">
                  <span
                    class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                    :style="{ width: 'calc((100% - 8px) / 2)', transform: `translateX(calc(${currencyActiveIndex} * 100%))`, left: '4px' }"
                    aria-hidden="true"></span>

                  <button type="button"
                    class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl text-[17px] py-2.5 px-4 text-center transition-colors"
                    :class="currencyActiveTab === 'Текущий курс' ? 'text-[#F7F8F6]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                    @click="setCurrencyTab('Текущий курс')">
                    Текущий курс
                  </button>

                  <button type="button"
                    class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl text-[17px] py-2.5 px-4 text-center transition-colors"
                    :class="currencyActiveTab === 'Обмен' ? 'text-[#F7F8F6]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                    @click="setCurrencyTab('Обмен')">
                    Обмен
                  </button>
                </div>
              </div>

              <!-- Rates table -->
              <div v-show="currencyActiveTab === 'Текущий курс'" class="grid grid-cols-12 gap-y-10 text-[#191B19]">
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">Валюта</div>
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">Покупка</div>
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">Продажа</div>

                <template v-for="r in rates" :key="r.code">
                  <div class="col-span-4 leading-7 text-[28px] font-bold">{{ r.code }}</div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[28px] font-bold">
                    {{ r.buy.toFixed(2) }}
                    <span v-if="r.trend === 'up'" class="text-[#2C702C]">▲</span>
                    <span v-else class="text-[#ED3B3B]">▼</span>
                  </div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[28px] font-bold">
                    {{ r.sell.toFixed(2) }}
                    <span v-if="r.trend === 'up'" class="text-[#2C702C]">▲</span>
                    <span v-else class="text-[#ED3B3B]">▼</span>
                  </div>
                </template>

                <div class="col-span-8 text-[#6F736D] text-[17px] max-w-[450px]">
                  Курс действует на текущее время. Точный курс будет определён на момент совершения операции
                </div>
              </div>

              <!-- Exchange action placeholder -->
              <div v-show="currencyActiveTab === 'Обмен'" class="text-[#6F736D]">
                Раздел обмена: здесь может быть форма расчёта и кнопка оформления.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Facts ==================================================================================== -->
    <section class="pt-[50px] pb-[60px]">
      <div class="auto_container">
        <div class="wrap">
          <h2 class="text-[38px] font-bold mb-10 leading-9">
            Факты, которые говорят сами за себя
          </h2>

          <div class="flex gap-x-4">
            <div class="block bg-[#F7F8F6] rounded-[20px] p-8 w-[calc(50%-8px)]">
              <h4 class=" text-[28px] font-bold text-[#191B19] mb-8">
                Банк года Туркменистана
              </h4>

              <span class="max-h-[220px] flex items-end justify-end">
                <img src="../assets/images/fact.png" class="block max-h-full object-contain" alt="card">
              </span>
            </div>

            <div class="block bg-[#F7F8F6] rounded-[20px] p-8 w-[calc(50%-8px)]">
              <h4 class=" text-[28px] font-bold text-[#191B19] mb-8">
                Награжден премией
              </h4>

              <span class="max-h-[220px] flex items-end justify-end">
                <img src="../assets/images/fact.png" class="block max-h-full object-contain" alt="card">
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Docs ===================================================================================== -->
    <section class="pt-[60px] pb-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div
            class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8 relative overflow-hidden purple-glow">
            <div class="block max-w-[600px]">
              <h6 class="text-[28px] text-[#191B19] leading-7 font-bold mb-[10px]">
                Перечень документов для открытия счета
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 font-Gilroy max-w-[500px]">
                Любые взаимоотношения Клиента с Банком начинаются с открытия счета. Открытие расчетных счетов
                регулируется
                действующим законодательством Туркменистана.
              </p>

              <RouterLink to="/"
                class="block w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-[85px] px-5 py-[14px]">
                Узнать больше
              </RouterLink>
            </div>

            <span class="max-h-[220px] block">
              <img src="../assets/images/GradientGlass.png" class="block max-h-full object-contain" alt="card">
            </span>
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
                Курс действует на текущее время. <br> Точный курс будет определён на момент совершения операции
              </p>

              <span class="block min-w-[232px] z-10 absolute -bottom-[113px] left-1/2 -translate-x-1/2">
                <img src="../assets/images/mobile-app.png" alt="app" class="block w-full h-auto object-contain" />
              </span>
            </div>

            <!-- News cards right -->
            <div class="flex-1 grid sm:grid-cols-2 gap-4">
              <article class="bg-white rounded-[20px] overflow-hidden">
                <span class="block h-[200px] overflow-hidden rounded-2xl">
                  <img src="../assets/images/news.png" class="block w-full h-full object-cover" alt="news" />
                </span>
                <div class="p-4">
                  <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                    Газпромбанк расширил возможности РКО для
                    предпринимателей
                    сегмента МСБ
                  </RouterLink>
                </div>
              </article>

              <article class="bg-white rounded-[20px] overflow-hidden">
                <span class="block h-[200px] overflow-hidden rounded-2xl">
                  <img src="../assets/images/news.png" class="block w-full h-full object-cover" alt="news" />
                </span>
                <div class="p-4">
                  <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                    Газпромбанк расширил возможности РКО для
                    предпринимателей
                    сегмента МСБ
                  </RouterLink>
                </div>
              </article>

              <article class="bg-white rounded-[20px] overflow-hidden">
                <span class="block h-[200px] overflow-hidden rounded-2xl">
                  <img src="../assets/images/news.png" class="block w-full h-full object-cover" alt="news" />
                </span>
                <div class="p-4">
                  <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                    Газпромбанк расширил возможности РКО для
                    предпринимателей
                    сегмента МСБ
                  </RouterLink>
                </div>
              </article>

              <article class="bg-white rounded-[20px] overflow-hidden">
                <span class="block h-[200px] overflow-hidden rounded-2xl">
                  <img src="../assets/images/news.png" class="block w-full h-full object-cover" alt="news" />
                </span>
                <div class="p-4">
                  <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                    Газпромбанк расширил возможности РКО для
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

  </main>
</template>

<style scoped>
.bg-deposit::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
  pointer-events: none;
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

/* Form section blurred green ellipse */
.form-glow::after {
  content: "";
  position: absolute;
  width: 226px;
  height: 226px;
  left: calc(50% - 226px/2 - 543px);
  bottom: -71px;
  background: #2C702C;
  /* Green/main */
  filter: blur(137.15px);
  border-radius: 9999px;
  pointer-events: none;
}

/* Docs section purple ellipse */
.purple-glow::after {
  content: "";
  position: absolute;
  width: 298px;
  height: 298px;
  left: calc(50% - 298px/2 + 591px);
  bottom: -147px;
  background: #BB28ED;
  filter: blur(137.15px);
  border-radius: 9999px;
  pointer-events: none;
}

/* News promo green ellipse */
.news-promo-glow::after {
  content: "";
  position: absolute;
  width: 321px;
  height: 321px;
  left: 190px;
  top: 312px;
  background: #2C702C;
  filter: blur(137.15px);
  border-radius: 9999px;
  pointer-events: none;
}
</style>
