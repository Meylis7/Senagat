<script setup>
  import Hero from '@/components/website/Hero.vue';
  import NewsSection from '@/components/website/NewsSection.vue';
  import { ref, computed, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import apiService from '@/services/apiService';
  const { t, locale } = useI18n();

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
  const creditType = ref('');
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

  const exchangeRates = ref([])
  const exchangeLoading = ref(false)
  const exchangeError = ref(null)

  const rates = computed(() => {
    return (exchangeRates.value || []).map((item) => {
      const buy = Number(item.purchase)
      const sell = Number(item.sale)
      return {
        code: item.currency,
        buy,
        sell,
        trend: sell >= buy ? 'up' : 'down',
      }
    })
  })

  const fetchExchangeRates = async () => {
    exchangeLoading.value = true
    exchangeError.value = null
    try {
      const response = await apiService.fetchExchangeRates()
      if (response?.success && Array.isArray(response?.data)) {
        exchangeRates.value = response.data
      } else if (Array.isArray(response)) {
        exchangeRates.value = response
      } else if (Array.isArray(response?.data)) {
        exchangeRates.value = response.data
      } else {
        exchangeRates.value = []
      }
    } catch (error) {
      exchangeError.value = error.message || 'Failed to load exchange rates'
      exchangeRates.value = []
    } finally {
      exchangeLoading.value = false
    }
  }
  // Awards Section ============================================================================
  const awards = ref([])
  const awardsLoading = ref(false)
  const awardsError = ref(null)

  const fetchAwards = async () => {
    awardsLoading.value = true
    awardsError.value = null
    try {
      const response = await apiService.fetchAwards()
      if (response?.success && Array.isArray(response?.data)) {
        awards.value = response.data
      } else if (Array.isArray(response)) {
        awards.value = response
      } else if (Array.isArray(response?.data)) {
        awards.value = response.data
      } else {
        awards.value = []
      }
    } catch (error) {
      awardsError.value = error.message || 'Failed to load awards'
      awards.value = []
    } finally {
      awardsLoading.value = false
    }
  }

  // Deposits Section ============================================================================
  const deposits = ref([])
  const depositsLoading = ref(false)
  const depositsError = ref(null)

  const fetchDeposits = async () => {
    depositsLoading.value = true
    depositsError.value = null
    try {
      const response = await apiService.fetchDeposits()
      if (response?.success && Array.isArray(response?.data)) {
        deposits.value = response.data
      } else if (Array.isArray(response)) {
        deposits.value = response
      } else if (Array.isArray(response?.data)) {
        deposits.value = response.data
      } else {
        deposits.value = []
      }
    } catch (error) {
      depositsError.value = error.message || 'Failed to load deposits'
      deposits.value = []
    } finally {
      depositsLoading.value = false
    }
  }


  // Fetch news on component mount
  onMounted(() => {
    fetchExchangeRates();
    fetchAwards();
    fetchCredits();
    fetchDeposits();
  });

  // Clients Section ========================================================================
  const credits = ref([])
  const creditsLoading = ref(false)
  const creditsError = ref(null)

  const fetchCredits = async () => {
    creditsLoading.value = true
    creditsError.value = null
    try {
      const response = await apiService.fetchCreditTypes()
      if (response?.success && Array.isArray(response?.data)) {
        credits.value = response.data
      } else if (Array.isArray(response)) {
        credits.value = response
      } else if (Array.isArray(response?.data)) {
        credits.value = response.data
      } else {
        credits.value = []
      }
    } catch (error) {
      creditsError.value = error.message || 'Failed to load credits'
      credits.value = []
    } finally {
      creditsLoading.value = false
    }
  }

  const cards = ref([])
  const cardsLoading = ref(false)
  const cardsError = ref(null)

  const fetchCards = async () => {
    cardsLoading.value = true
    cardsError.value = null
    try {
      const response = await apiService.fetchCardTypes()
      if (response?.success && Array.isArray(response?.data)) {
        cards.value = response.data
      } else if (Array.isArray(response)) {
        cards.value = response
      } else if (Array.isArray(response?.data)) {
        cards.value = response.data
      } else {
        cards.value = []
      }
    } catch (error) {
      cardsError.value = error.message || 'Failed to load cards'
      cards.value = []
    } finally {
      cardsLoading.value = false
    }
  }

  const clients = ref([])
  const clientsLoading = ref(false)
  const clientsError = ref(null)

  const fetchClients = async () => {
    clientsLoading.value = true
    clientsError.value = null
    try {
      const response = await apiService.fetchClients()
      if (response?.success && Array.isArray(response?.data)) {
        clients.value = response.data
      } else if (Array.isArray(response)) {
        clients.value = response
      } else if (Array.isArray(response?.data)) {
        clients.value = response.data
      } else {
        clients.value = []
      }
    } catch (error) {
      clientsError.value = error.message || 'Failed to load clients'
      clients.value = []
    } finally {
      clientsLoading.value = false
    }
  }

  onMounted(() => {
    fetchClients()
    fetchCards()
  })

  const shuffle = (arr) => {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = a[i]
      a[i] = a[j]
      a[j] = t
    }
    return a
  }

  const allOffers = computed(() => {
    const dep = shuffle((deposits.value || []).map((d) => ({
      title: d.title,
      subtitle: d.sub_title || '',
      image_url: d.image_url,
      type: 'deposit',
      color: d.background_color
    })))
    const cre = shuffle((credits.value || []).map((c) => ({
      title: c.name,
      subtitle: c.interest + ' %' || '',
      image_url: c.image_url || '../../assets/images/cart.png',
      type: 'credit',
    })))
    const car = shuffle((cards.value || []).map((c) => ({
      title: c.title,
      subtitle: c.sub_title || '',
      image_url: c.image_url || '../../assets/images/altyn-asyr-card.png',
      type: 'card',
    })))

    const order = ['card', 'credit', 'deposit', 'credit', 'card', 'deposit', 'card', 'credit', 'deposit', 'credit', 'deposit', 'credit']
    const sources = { card: car, credit: cre, deposit: dep }
    const idx = { card: 0, credit: 0, deposit: 0 }
    const total = dep.length + cre.length + car.length
    const mixed = []
    let p = 0
    while (mixed.length < total) {
      const kind = order[p % order.length]
      if (idx[kind] < sources[kind].length) {
        mixed.push(sources[kind][idx[kind]++])
      } else {
        for (const k of ['card', 'credit', 'deposit']) {
          if (idx[k] < sources[k].length) {
            mixed.push(sources[k][idx[k]++])
            break
          }
        }
      }
      p++
    }
    return mixed
  })

  const isAllExpanded = ref(false)
  const visibleAllOffers = computed(() => (isAllExpanded.value ? allOffers.value : allOffers.value.slice(0, 5)))
  const toggleAllExpanded = () => { isAllExpanded.value = !isAllExpanded.value }

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
              {{ t('offer.title') }}
            </h2>

            <div class="relative bg-mainWhite p-1 rounded-[20px] grid grid-cols-4 items-center">
              <span
                class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                :style="{ width: 'calc((100% - 8px) / 4)', transform: `translateX(calc(${activeIndex} * 100%))`, left: '4px' }"
                aria-hidden="true"></span>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Все' ? 'text-mainWhite' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Все')">
                {{ t('tabs.all') }}
              </button>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Вклад' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Вклад')">
                {{ t('tabs.deposit') }}
              </button>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Кредиты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Кредиты')">
                {{ t('tabs.credits') }}
              </button>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Карты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Карты')">
                {{ t('tabs.cards') }}
              </button>
            </div>
          </div>

          <div v-show="activeTab === 'Все'" class="grid gap-4 grid-cols-12">
            <div v-for="(item, i) in visibleAllOffers" :key="i"
              :class="(i === 2 || i === 11)
                ? 'lg:col-span-4 row-span-2 rounded-[20px] text-mainWhite relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow '
                : (i === 5)
                  ? 'col-span-8 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition flex flex-col flex-end'
                  : (i === 8)
                    ? 'col-span-8 rounded-[20px] p-8 shadow-sm text-mainWhite hover:shadow-md transition flex flex-col flex-end  bg-[#191819] hot-glow relative overflow-hidden'
                    : 'lg:col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition flex flex-col flex-end'"
              :style="(i === 2 || i === 11 || i === 8) ? { '--promo-glow-bg': (item.color) } : null">
              <h6 class="text-[24px] "
                :class="(i === 2 || i === 11 || i === 8) ? 'leading-9 font-bold mb-[10px]' : 'text-mainBlack leading-7 font-bold mb-[10px]'">
                {{ item.title }}
              </h6>
              <p
                :class="(i === 2 || i === 11 || i === 8) ? 'text-mainWhite max-w-[420px] opacity-60 text-[17px]' : 'text-[17px] text-[#6F736D] leading-5 font-Gilroy mb-[10px]'">
                {{ item.subtitle }}
              </p>

              <span v-if="(i === 2 || i === 11)"
                class="absolute right-1/2 translate-x-1/2 bottom-20 w-full max-w-[240px] z-[2]">
                <img :src="item.image_url" class="block w-full h-full object-contain select-none pointer-events-none"
                  alt="offer-image">
              </span>
              <div v-else class="max-h-[120px] h-full mt-auto flex items-end justify-end z-[2]">
                <img :src="item.image_url" class="block max-h-full object-contain" alt="offer-image">
              </div>
            </div>

            <button type="button" @click="toggleAllExpanded"
              class="col-span-12 mt-[26px] flex items-center justify-center gap-[10px] cursor-pointer">
              <p class="text-[#2C702C] text-[17px] font-Gilroy">
                {{ isAllExpanded ? t('btn.hide') : t('btn.showAll') }}
              </p>

              <span>
                <svg :class="isAllExpanded ? 'rotate-180' : ''" class="transition-transform" width="14" height="8"
                  viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.5675 1.06754L7.31754 7.31754C7.25949 7.37565 7.19056 7.42175 7.11469 7.4532C7.03881 7.48465 6.95748 7.50084 6.87535 7.50084C6.79321 7.50084 6.71188 7.48465 6.63601 7.4532C6.56014 7.42175 6.49121 7.37565 6.43316 7.31754L0.18316 1.06754C0.0658846 0.95026 0 0.7912 0 0.625347C0 0.459495 0.0658846 0.300435 0.18316 0.18316C0.300435 0.0658843 0.459495 0 0.625347 0C0.7912 0 0.95026 0.0658843 1.06753 0.18316L6.87535 5.99175L12.6832 0.18316C12.7412 0.125091 12.8102 0.0790281 12.886 0.0476015C12.9619 0.0161748 13.0432 0 13.1253 0C13.2075 0 13.2888 0.0161748 13.3647 0.0476015C13.4405 0.0790281 13.5095 0.125091 13.5675 0.18316C13.6256 0.241229 13.6717 0.310167 13.7031 0.386037C13.7345 0.461908 13.7507 0.543226 13.7507 0.625347C13.7507 0.707469 13.7345 0.788787 13.7031 0.864658C13.6717 0.940528 13.6256 1.00947 13.5675 1.06754Z"
                    fill="#2C702C" />
                </svg>
              </span>
            </button>
          </div>

          <div v-show="activeTab === 'Вклад'" class="grid gap-4 lg:grid-cols-12">
            <div v-for="(item, i) in deposits.slice(0, 4)" :key="item.id"
              class="lg:col-span-4 rounded-[20px] p-8 shadow-sm hover:shadow-md transition"
              :class="i === 2 ? 'row-span-2 text-mainWhite relative overflow-hidden lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow' : 'bg-white'"
              :style="i === 2 ? { '--promo-glow-bg': (item.background_color) } : null">
              <h6 class="text-[24px] min-h-[56px]"
                :class="i === 2 ? 'leading-9 font-bold mb-[10px]' : 'text-mainBlack leading-7 font-bold mb-[10px]'">
                {{ item.title }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.sub_title }}</p>


              <span v-if="i === 2" class="absolute right-1/2 translate-x-1/2 bottom-20 max-w-[240]">
                <img :src="item.image_url" class="block w-full h-full object-contain select-none pointer-events-none"
                  alt="percent">
              </span>
              <span v-else class="max-h-[120px] h-full flex items-end justify-end">
                <img :src="item.image_url" class="block max-h-full object-contain" alt="percent">
              </span>
            </div>
          </div>

          <div v-show="activeTab === 'Кредиты'" class="grid gap-4 lg:grid-cols-12">
            <div v-for="item in credits" :key="item.id"
              class="rounded-[20px] bg-white p-8 col-span-4 flex flex-col shadow-sm hover:shadow-md transition">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                {{ item.name }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.interest + ' %' }}</p>
              <div class="max-h-[120px] h-full mt-auto flex items-end justify-end">
                <img :src="item.image_url || '../../assets/images/cart.png'" class="block max-h-full object-contain"
                  alt="cart">
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'Карты'" class="grid gap-4 lg:grid-cols-12">
            <div v-for="item in cards" :key="item.id"
              class="rounded-[20px] col-span-4 bg-white p-8 flex flex-col shadow-sm hover:shadow-md transition">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                {{ item.title }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.sub_title }}</p>
              <div class="max-h-[120px] h-full mt-auto flex items-end justify-end">
                <img :src="item.image_url || '../../assets/images/altyn-asyr-card.png'"
                  class="block max-h-full object-contain" alt="card">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Foundation =============================================================================== -->
    <!-- <section class="pt-[60px] pb-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="flex items-center justify-between bg-mainWhite rounded-[20px] p-8">
            <div class="block max-w-[460px]">
              <h4 class=" text-[28px] font-bold mb-[10px] text-mainBlack">
                {{ t('charity.title') }}
              </h4>
              <p class="text-[#6F736D] text-[17px] leading-6 mb-8 font-Gilroy">
                {{ t('charity.text') }}
              </p>
              <RouterLink to="/" class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                {{ t('btn.learnMore') }}
              </RouterLink>
            </div>

            <span class="max-h-[220px] flex items-end justify-end">
              <img src="../../assets/images/foundation.png" class="block max-h-full object-contain" alt="card">
            </span>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Calc ===================================================================================== -->
    <!-- <section class="py-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-[38px] font-bold leading-9"> {{ t('calc.calculateBenefit') }}</h2>

            <div class="relative bg-mainWhite p-1 rounded-[20px] grid grid-cols-2 items-center min-w-[240px]">
              <span
                class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                :style="{ width: 'calc((100% - 8px) / 2)', transform: `translateX(calc(${calcActiveIndex} * 100%))`, left: '4px' }"
                aria-hidden="true"></span>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="calcActiveTab === 'Кредит' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setCalcTab('Кредит')">
                {{ t('tabs.credits') }}
              </button>

              <button type="button"
                class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="calcActiveTab === 'Вклад' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setCalcTab('Вклад')">
                {{ t('tabs.deposit') }}
              </button>
            </div>
          </div>

          <div v-show="calcActiveTab === 'Кредит'" class="grid lg:grid-cols-2 gap-6">
            <div class="bg-mainWhite rounded-[20px] p-6">
              <div class="mb-6">
                <div class="relative">
                  <button type="button" @click="isCreditTypeOpen = !isCreditTypeOpen"
                    class="h-[56px] bg-white rounded-[12px] w-full flex items-center justify-between px-4 text-[#6F736D]">
                    <span>{{ creditType || t('calc.creditType') }}</span>
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
                        :class="t === creditType ? 'bg-[#2C702C] text-white' : 'hover:bg-mainWhite text-mainBlack'"
                        class="w-full text-left px-3 py-2 rounded-[8px]">{{ t }}</button>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-mainBlack font-bold mb-3">{{ t('calc.loanAmount') }}</label>
                <div class="h-[56px] bg-white rounded-[12px] flex items-center px-4">
                  <input type="text" :value="formatMoney(creditAmount)" @input="onCreditAmountInput"
                    class="w-full outline-none bg-transparent text-mainBlack font-bold" />
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
                <label class="block text-mainBlack font-bold mb-3">{{ t('calc.term') }}</label>
                <div class="flex flex-wrap gap-3">
                  <button v-for="term in termOptions" :key="term" type="button" @click="creditSelectedTerm = term"
                    :class="creditSelectedTerm === term ? 'bg-mainBlack text-white' : 'bg-white text-[#6F736D]'"
                    class="h-[48px] px-5 rounded-[12px]">{{ term }}</button>
                </div>
              </div>
            </div>

            <div class="bg-mainWhite rounded-[20px] p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <p class="text-[#6F736D] mb-2">{{ t('calc.monthlyPayment') }}</p>
                  <h3 class="text-[42px] font-bold">1000 манат</h3>
                </div>
                <div>
                  <span
                    class="inline-flex items-center justify-center h-[44px] w-[44px] rounded-[12px] bg-mainBlack text-white">1%</span>
                  <p class="text-[#6F736D] mt-2 text-center">{{ t('calc.rate') }}</p>
                </div>
              </div>

              <div class="bg-white rounded-[12px] p-4 mb-6">
                <p class="text-mainBlack font-bold mb-2">{{ t('calc.requiredDocs') }}:</p>
                <ul class="text-[#6F736D] space-y-2">
                  <li>{{ t('calc.passport') }}</li>
                  <li>{{ t('calc.incomeStatement') }}</li>
                </ul>
              </div>

              <p class="text-[#6F736D]">{{ t('calc.calculatorDisclaimer') }}</p>
            </div>
          </div>

          <div v-show="calcActiveTab === 'Вклад'" class="grid lg:grid-cols-2 gap-6">
            <div class="bg-mainWhite rounded-[20px] p-6">
              <div class="mb-6">
                <label class="block text-[#6F736D] text-[17px] mb-3">Тип вклада</label>
                <div class="relative">
                  <button type="button" @click="isDepositTypeOpen = !isDepositTypeOpen"
                    class="h-[56px] bg-white rounded-[12px] w-full flex items-center justify-between px-4 text-mainBlack">
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
                        :class="t === depositType ? 'bg-[#2C702C] text-white' : 'hover:bg-mainWhite text-mainBlack'"
                        class="w-full text-left px-3 py-2 rounded-[8px]">{{ t }}</button>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-[#6F736D] text-[17px] mb-3">Сумма вклада</label>
                <div class="h-[56px] bg-white rounded-[12px] flex items-center px-4">
                  <input type="text" :value="formatMoney(depositAmount)" @input="onDepositAmountInput"
                    class="w-full outline-none bg-transparent text-mainBlack font-bold" />
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

              <div>
                <label class="block text-mainBlack font-bold mb-3">Срок</label>
                <div class="flex flex-wrap gap-3">
                  <button v-for="term in termOptions" :key="term" type="button" @click="selectedTerm = term"
                    :class="selectedTerm === term ? 'bg-mainBlack text-white' : 'bg-white text-[#6F736D]'"
                    class="h-[48px] px-5 rounded-[12px]">
                    {{ term }}
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-mainWhite rounded-[20px] p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <p class="text-[#6F736D] mb-2">Ожидаемый доход</p>
                  <h3 class="text-[42px] font-bold">1 000 манат</h3>
                </div>
                <div>
                  <span
                    class="inline-flex items-center justify-center h-[44px] px-3 rounded-[12px] bg-mainBlack text-white">Годовая
                    ставка</span>
                </div>
              </div>

              <div class="bg-white rounded-[12px] p-4 mb-6">
                <p class="text-mainBlack font-bold mb-2">Итоги</p>
                <ul class="text-[#6F736D] space-y-2">
                  <li>Тип: {{ depositType }}</li>
                  <li>Сумма: {{ formatMoney(depositAmount) }} манат</li>
                  <li>Срок: {{ selectedTerm }}</li>
                </ul>
              </div>

              <p class="text-[#6F736D]">Расчёт калькулятора предварительный и носит справочный характер.</p>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Currency ================================================================================= -->
    <section class="py-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <h2 class="text-[38px] font-bold mb-10 leading-9">{{ t('exchange.title') }}</h2>

          <div class="flex gap-4">
            <!-- Left card: branches -->
            <div class="w-full max-w-[390px] min-h-[467px] relative rounded-[20px] overflow-hidden bg-mainWhite p-8">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">{{ t('exchange.branches') }}</h6>
              <p class="text-[17px] text-[#6F736D] leading-6 mb-6 font-Gilroy">{{ t('exchange.onCityMap') }}</p>
              <span class="block w-[300px] absolute left-1/2 -translate-x-1/2 -bottom-[55px]">
                <img src="../../assets/images/currency.png" class="block w-full h-full object-contain" alt="currency">
              </span>
            </div>

            <!-- Right card: exchange rates -->
            <div class="w-full max-w-[calc(100%-406px)] rounded-[20px] bg-mainWhite p-8">
              <div class="flex items-center justify-between mb-8">
                <h6 class="text-[24px] text-mainBlack leading-7 font-bold">{{ t('exchange.exchangeRates') }}</h6>

                <div class="relative bg-white p-1 rounded-[20px] grid grid-cols-2 items-center min-w-[260px]">
                  <span
                    class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                    :style="{ width: 'calc((100% - 8px) / 2)', transform: `translateX(calc(${currencyActiveIndex} * 100%))`, left: '4px' }"
                    aria-hidden="true"></span>

                  <button type="button"
                    class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl text-[17px] py-2.5 px-4 text-center transition-colors"
                    :class="currencyActiveTab === 'Текущий курс' ? 'text-mainWhite' : 'text-[#6F736D] hover:text-[#2C702C]'"
                    @click="setCurrencyTab('Текущий курс')">
                    {{ t('exchange.currentRate') }}
                  </button>

                  <button type="button"
                    class="relative z-[1] w-full font-Gilroy cursor-pointer rounded-2xl text-[17px] py-2.5 px-4 text-center transition-colors"
                    :class="currencyActiveTab === 'Обмен' ? 'text-mainWhite' : 'text-[#6F736D] hover:text-[#2C702C]'"
                    @click="setCurrencyTab('Обмен')">
                    {{ t('exchange.exchange') }}
                  </button>
                </div>
              </div>

              <!-- Rates table -->
              <div v-show="currencyActiveTab === 'Текущий курс'" class="grid grid-cols-12 gap-y-10 text-mainBlack">
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">{{ t('exchange.currency') }}
                </div>
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">{{ t('exchange.buy') }}</div>
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">{{ t('exchange.sell') }}</div>

                <template v-for="r in rates" :key="r.code">
                  <div class="col-span-4 leading-7 text-[28px] font-bold">{{ r.code }}</div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[28px] font-bold">
                    {{ r.buy.toFixed(2) }}
                    <span v-if="r.trend === 'up'" class="text-[#2C702C] w-4 block">
                      <svg class="w-full h-full object-contain" width="14" height="8" viewBox="0 0 14 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13.7028 7.11455C13.6556 7.22877 13.5755 7.32639 13.4727 7.39509C13.3699 7.46379 13.2491 7.50047 13.1255 7.50049H0.625492C0.501807 7.50059 0.380875 7.46399 0.278003 7.39532C0.175132 7.32665 0.0949484 7.229 0.0476031 7.11474C0.000257809 7.00047 -0.0121201 6.87473 0.0120364 6.75343C0.0361929 6.63212 0.0957976 6.52071 0.183305 6.4333L6.4333 0.183304C6.49135 0.125194 6.56028 0.0790947 6.63615 0.047642C6.71203 0.0161893 6.79336 0 6.87549 0C6.95763 0 7.03896 0.0161893 7.11483 0.047642C7.1907 0.0790947 7.25963 0.125194 7.31768 0.183304L13.5677 6.4333C13.6551 6.52076 13.7145 6.63216 13.7386 6.75343C13.7627 6.87469 13.7502 7.00036 13.7028 7.11455Z"
                          fill="#2C702C" />
                      </svg>
                    </span>
                    <span v-else class="text-[#ED3B3B] w-4 block">
                      <svg class="w-full h-full object-contain" width="14" height="8" viewBox="0 0 14 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13.5677 1.06719L7.31768 7.31719C7.25963 7.3753 7.1907 7.4214 7.11483 7.45285C7.03896 7.4843 6.95763 7.50049 6.87549 7.50049C6.79336 7.50049 6.71203 7.4843 6.63615 7.45285C6.56028 7.4214 6.49135 7.3753 6.4333 7.31719L0.183305 1.06719C0.0957976 0.979778 0.0361929 0.86837 0.0120364 0.747067C-0.0121201 0.625764 0.000257809 0.500021 0.0476031 0.385756C0.0949484 0.271492 0.175132 0.173844 0.278003 0.105175C0.380875 0.0365058 0.501807 -9.71422e-05 0.625492 1.93625e-07H13.1255C13.2492 -9.71422e-05 13.3701 0.0365058 13.473 0.105175C13.5759 0.173844 13.656 0.271492 13.7034 0.385756C13.7507 0.500021 13.7631 0.625764 13.7389 0.747067C13.7148 0.86837 13.6552 0.979778 13.5677 1.06719Z"
                          fill="#CC1717" />
                      </svg>
                    </span>
                  </div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[28px] font-bold">
                    {{ r.sell.toFixed(2) }}
                    <span v-if="r.trend === 'up'" class="text-[#2C702C] w-4 block">
                      <svg class="w-full h-full object-contain" width="14" height="8" viewBox="0 0 14 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13.7028 7.11455C13.6556 7.22877 13.5755 7.32639 13.4727 7.39509C13.3699 7.46379 13.2491 7.50047 13.1255 7.50049H0.625492C0.501807 7.50059 0.380875 7.46399 0.278003 7.39532C0.175132 7.32665 0.0949484 7.229 0.0476031 7.11474C0.000257809 7.00047 -0.0121201 6.87473 0.0120364 6.75343C0.0361929 6.63212 0.0957976 6.52071 0.183305 6.4333L6.4333 0.183304C6.49135 0.125194 6.56028 0.0790947 6.63615 0.047642C6.71203 0.0161893 6.79336 0 6.87549 0C6.95763 0 7.03896 0.0161893 7.11483 0.047642C7.1907 0.0790947 7.25963 0.125194 7.31768 0.183304L13.5677 6.4333C13.6551 6.52076 13.7145 6.63216 13.7386 6.75343C13.7627 6.87469 13.7502 7.00036 13.7028 7.11455Z"
                          fill="#2C702C" />
                      </svg>
                    </span>
                    <span v-else class="text-[#ED3B3B] w-4 block">
                      <svg class="w-full h-full object-contain" width="14" height="8" viewBox="0 0 14 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13.5677 1.06719L7.31768 7.31719C7.25963 7.3753 7.1907 7.4214 7.11483 7.45285C7.03896 7.4843 6.95763 7.50049 6.87549 7.50049C6.79336 7.50049 6.71203 7.4843 6.63615 7.45285C6.56028 7.4214 6.49135 7.3753 6.4333 7.31719L0.183305 1.06719C0.0957976 0.979778 0.0361929 0.86837 0.0120364 0.747067C-0.0121201 0.625764 0.000257809 0.500021 0.0476031 0.385756C0.0949484 0.271492 0.175132 0.173844 0.278003 0.105175C0.380875 0.0365058 0.501807 -9.71422e-05 0.625492 1.93625e-07H13.1255C13.2492 -9.71422e-05 13.3701 0.0365058 13.473 0.105175C13.5759 0.173844 13.656 0.271492 13.7034 0.385756C13.7507 0.500021 13.7631 0.625764 13.7389 0.747067C13.7148 0.86837 13.6552 0.979778 13.5677 1.06719Z"
                          fill="#CC1717" />
                      </svg>
                    </span>
                  </div>
                </template>

                <div class="col-span-8 text-[#6F736D] mt-auto text-[17px] max-w-[450px] font-Gilroy">
                  {{ t('exchange.rateDisclaimer') }}
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
            {{ t('facts.title') }}
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div v-for="item in awards.slice(0, 2)" :key="item.id" class="block bg-mainWhite rounded-[20px] p-8">
              <RouterLink :to="{ name: 'awards-detail', query: { id: item.id } }" class="block">
                <h4 class=" text-[28px] font-bold text-mainBlack mb-2">
                  {{ item.title || '' }}
                </h4>
              </RouterLink>
              <p class="text-[17px] text-[#6F736D] mb-6">
                {{ item.sub_title || '' }}
              </p>
              <span class="h-[220px] flex justify-end relative">
                <img :src="item.image_url || '../../assets/images/fact.png'" class="block h-full object-contain"
                  alt="card">
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
            class="flex items-center justify-between bg-mainWhite rounded-[20px] p-8 relative overflow-hidden purple-glow">
            <div class="block max-w-[600px]">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                {{ t('docs.title') }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 font-Gilroy max-w-[500px]">
                {{ t('docs.subTitle') }}
              </p>

              <RouterLink to="/"
                class="block w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-[85px] px-5 py-[14px]">
                {{ t('btn.learnMore') }}
              </RouterLink>
            </div>

            <span class="max-h-[220px] block">
              <img src="../../assets/images/GradientGlass.png" class="block max-h-full object-contain" alt="card">
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- News ===================================================================================== -->
    <NewsSection />

    <!-- Clients ================================================================================== -->
    <section class="pt-[50px] pb-[60px]">
      <div class="auto_container">
        <div class="wrap">
          <h2 class="text-[38px] font-bold mb-10">
            {{ t('clients.title') }}
          </h2>

          <div class="grid grid-cols-5">
            <div v-for="(client, idx) in clients" :key="client.id"
              :class="['grid place-items-center border-solid border-[#6F736D1A]/10 border-0', idx < clients.length - 1 ? 'border-r-[1px]' : '']">
              <img class="h-[100px] block object-contain" :src="client.image_url" alt="client-image">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- App ====================================================================================== -->
    <section class="pt-[60px] pb-[120px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="block relative overflow-hidden">
            <div class=" bg-mainBlack rounded-[20px] p-8 relative overflow-hidden ellipse">
              <h4 class="text-[28px] max-w-[370px] text-mainWhite font-bold mb-[10px] leading-8 z-10">
                {{ t('app.title') }}
              </h4>
              <p class="text-mainWhite/60 font-Gilroy text-[17px] leading-6 z-10 max-w-[330px]">
                {{ t('app.subTitle') }}
              </p>
              <RouterLink to="/"
                class="block w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-8 px-5 py-[14px]">
                {{ t('btn.downloadAppButton') }}
              </RouterLink>

              <div class="app-circle"></div>

            </div>
            <span class="block w-[258px] absolute top-8 right-8 z-10">
              <img class="block w-full h-full object-contain" src="../../assets/images/mobile-app.png" alt="app-image">
            </span>
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

  .offer-circle::after {
    content: "";
    position: absolute;
    width: 321px;
    height: 321px;
    right: -130px;
    bottom: -134px;
    background: #2C702C;
    filter: blur(137.15px);
    border-radius: 9999px;
    pointer-events: none;
  }

  .hot-glow::after {
    content: "";
    position: absolute;
    width: 321px;
    height: 321px;
    right: -120px;
    bottom: -97px;
    background: var(--promo-glow-bg, #ED6328);
    /* background: #ED6328; */
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

  

  .app-circle {
    position: absolute;
    width: 321px;
    height: 321px;
    background: #2C702C;
    border-radius: 50%;
    filter: blur(274.3px);
    z-index: 1;
    right: -16px;
    bottom: -216px;
    transform: translateY(-50%);
  }
</style>
