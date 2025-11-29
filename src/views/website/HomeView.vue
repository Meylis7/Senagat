<script setup>
  import Hero from '@/components/website/Hero.vue';
  import NewsSection from '@/components/website/NewsSection.vue';
  import { ref, computed, onMounted, watch } from 'vue';
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

  // Exchange calculator (uses "sale" rates) ================================================
  const fromAmount = ref(100)
  const toAmount = ref(0)
  const fromCurrency = ref('USD')
  const toCurrency = ref('EUR')

  const getSale = (code) => {
    const item = (exchangeRates.value || []).find((r) => String(r.currency) === String(code))
    const s = Number(item?.sale)
    return Number.isFinite(s) ? s : null
  }

  const recalcExchange = () => {
    const f = getSale(fromCurrency.value)
    const t = getSale(toCurrency.value)
    if (f && t) {
      toAmount.value = Number(((Number(fromAmount.value) || 0) * f) / t)
    } else {
      toAmount.value = 0
    }
  }

  watch([fromAmount, fromCurrency, toCurrency, exchangeRates], recalcExchange, { immediate: true })
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
      const list = response?.data || response || []
      const arr = Array.isArray(list) ? list : []
      cards.value = arr.filter((it) => String(it.category) === 'individual')
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
      id: d.id,
      title: d.title,
      subtitle: d.sub_title || '',
      image_url: d.image_url,
      type: 'deposit',
      color: d.background_color
    })))
    const cre = shuffle((credits.value || []).map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.interest + ' %' || '',
      image_url: c.image_url,
      type: 'credit',
    })))
    const car = shuffle((cards.value || []).map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.sub_title || '',
      image_url: c.image_url,
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

  const getOfferLink = (item) => {
    if (!item || !item.type) return '/'
    if (item.type === 'deposit') return { name: 'deposits-detail', query: { id: item.id } }
    if (item.type === 'credit') return { name: 'loans-detail', query: { id: item.id } }
    if (item.type === 'card') return { name: 'cards-detail', query: { id: item.id } }
    return '/'
  }

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
            <RouterLink v-for="(item, i) in visibleAllOffers" :key="item.id || i" :to="getOfferLink(item)"
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
            </RouterLink>

            <button v-show="visibleAllOffers.length > 4" type="button" @click="toggleAllExpanded"
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
            <RouterLink :to="`/deposits-detail?id=${item.id}`" v-for="(item, i) in deposits.slice(0, 4)" :key="item.id"
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
            </RouterLink>
          </div>

          <div v-show="activeTab === 'Кредиты'" class="grid gap-4 lg:grid-cols-12">
            <RouterLink :to="`/loans-detail?id=${item.id}`" v-for="item in credits" :key="item.id"
              class="rounded-[20px] bg-white p-8 col-span-4 flex flex-col shadow-sm hover:shadow-md transition">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                {{ item.title }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.interest + ' %' }}</p>
              <div class="max-h-[120px] h-full mt-auto flex items-end justify-end">
                <img :src="item.image_url || '../../assets/images/cart.png'" class="block max-h-full object-contain"
                  alt="cart">
              </div>
            </RouterLink>
          </div>

          <div v-show="activeTab === 'Карты'" class="grid gap-4 lg:grid-cols-12">
            <RouterLink :to="`/cards-detail?id=${item.id}`" v-for="item in cards" :key="item.id"
              class="rounded-[20px] col-span-4 bg-white p-8 flex flex-col shadow-sm hover:shadow-md transition">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                {{ item.title }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.sub_title }}</p>
              <div class="max-h-[120px] h-full mt-auto flex items-end justify-end">
                <img :src="item.image_url || '../../assets/images/altyn-asyr-card.png'"
                  class="block max-h-full object-contain" alt="card">
              </div>
            </RouterLink>
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
          <!-- <h2 class="text-[38px] font-bold mb-10 leading-9">{{ t('exchange.title') }}</h2> -->

          <div class="flex gap-4">
            <RouterLink to="/branches"
              class="group glow w-full max-w-[390px] min-h-[407px] relative rounded-[20px] overflow-hidden bg-mainWhite p-8 hover:bg-[#1D2417] transition duration-300">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px] group-hover:text-white">{{
                t('exchange.branches') }}</h6>
              <p class="text-[17px] text-[#6F736D] leading-6 mb-6 font-Gilroy group-hover:text-white">{{
                t('exchange.onCityMap') }}</p>
              <span class="block w-[260px] absolute left-1/2 -translate-x-1/2 -bottom-[55px] z-[1]">
                <img src="../../assets/images/currency.png" class="block w-full h-full object-contain" alt="currency">
              </span>
            </RouterLink>

            <div class="w-full max-w-[calc(100%-406px)] rounded-[20px] bg-mainWhite p-8">
              <div class="flex items-center justify-between mb-8">
                <h6 class="text-[24px] text-mainBlack leading-7 font-bold">{{ t('exchange.exchangeRates') }}</h6>

                <!-- <div class="relative bg-white p-1 rounded-[20px] grid grid-cols-2 items-center min-w-[260px]">
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
                </div> -->
              </div>

              <div v-show="currencyActiveTab === 'Текущий курс'"
                class="grid grid-cols-12 gap-y-10 text-mainBlack h-[calc(100%-60px)] ">
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">{{ t('exchange.currency') }}
                </div>
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">{{ t('exchange.buy') }}</div>
                <div class="col-span-4 leading-7 text-[17px] font-Gilroy text-[#6F736D]">{{ t('exchange.sell') }}</div>

                <template v-for="r in rates" :key="r.code">
                  <div class="col-span-4 leading-7 flex items-center  text-[28px] font-bold">{{ r.code }}</div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[28px] font-bold">
                    {{ r.buy.toFixed(2) }}
                    <!-- <span v-if="r.trend === 'up'" class="text-[#2C702C] w-4 block">
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
                    </span> -->
                  </div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[28px] font-bold">
                    {{ r.sell.toFixed(2) }}
                    <!-- <span v-if="r.trend === 'up'" class="text-[#2C702C] w-4 block">
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
                    </span> -->
                  </div>
                </template>

                <div class="block mt-auto col-span-10 max-w-[450px]">
                  <h6 class="col-span-8 text-[#6F736D]  text-[17px]  font-Gilroy">
                    {{ t('exchange.rateDisclaimer') }}
                  </h6>
                  <a href="https://www.cbt.tm/kurs/kurs_today.html" target="_blank"
                    class="block text-[#2C702C] font-bold text-[17px] font-Gilroy mt-4">
                    Türkmenistanyň Merkezi bankyň walýuta kursy
                  </a>
                </div>
              </div>

              <!-- <div v-show="currencyActiveTab === 'Обмен'" class="text-[#6F736D] h-[calc(100%-60px)] grid grid-cols-1">
                <div class="grid grid-cols-12 relative gap-[56px]">
                  <div class="flex flex-col col-span-6 gap-[10px]">
                    <input type="number" id="currency_from" v-model.number="fromAmount"
                      class="w-full bg-[#EEF2ED] rounded-[10px] p-5 text-[17px] text-mainBlack" placeholder="100">
                    <div class="flex flex-wrap gap-4">
                      <div class="block check_currency">
                        <input type="radio" id="usd_from" name="currency_from" class="hidden" v-model="fromCurrency" value="USD" checked>
                        <label for="usd_from">USD</label>
                      </div>
                      <div class="block check_currency">
                        <input type="radio" id="tmt_from" name="currency_from" class="hidden">
                        <label for="tmt_from">TMT</label>
                      </div>
                      <div class="block check_currency">
                        <input type="radio" id="eur_from" name="currency_from" class="hidden" v-model="fromCurrency" value="EUR">
                        <label for="eur_from">EUR</label>
                      </div>
                    </div>
                  </div>

                  <button type="button" class="absolute top-[24px] right-1/2 -translate-x-[-9px] cursor-pointer">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.2812 13.281L13.2812 16.281C13.1405 16.4218 12.9496 16.5008 12.7506 16.5008C12.5516 16.5008 12.3607 16.4218 12.22 16.281C12.0792 16.1403 12.0002 15.9494 12.0002 15.7504C12.0002 15.5514 12.0792 15.3605 12.22 15.2198L13.9403 13.5004H0.75059C0.551678 13.5004 0.360912 13.4214 0.22026 13.2807C0.0796079 13.1401 0.000590086 12.9493 0.000590086 12.7504C0.000590086 12.5515 0.0796079 12.3607 0.22026 12.2201C0.360912 12.0794 0.551678 12.0004 0.75059 12.0004H13.9403L12.22 10.281C12.0792 10.1403 12.0002 9.94944 12.0002 9.75042C12.0002 9.55139 12.0792 9.36052 12.22 9.21979C12.3607 9.07906 12.5516 9 12.7506 9C12.9496 9 13.1405 9.07906 13.2812 9.21979L16.2812 12.2198C16.3509 12.2894 16.4063 12.3722 16.444 12.4632C16.4818 12.5543 16.5012 12.6519 16.5012 12.7504C16.5012 12.849 16.4818 12.9466 16.444 13.0376C16.4063 13.1287 16.3509 13.2114 16.2812 13.281ZM3.21996 7.28104C3.3607 7.42177 3.55157 7.50083 3.75059 7.50083C3.94961 7.50083 4.14048 7.42177 4.28122 7.28104C4.42195 7.14031 4.50101 6.94944 4.50101 6.75042C4.50101 6.55139 4.42195 6.36052 4.28122 6.21979L2.5609 4.50042H15.7506C15.9495 4.50042 16.1403 4.4214 16.2809 4.28075C16.4216 4.14009 16.5006 3.94933 16.5006 3.75042C16.5006 3.5515 16.4216 3.36074 16.2809 3.22009C16.1403 3.07943 15.9495 3.00042 15.7506 3.00042H2.5609L4.28122 1.28104C4.42195 1.14031 4.50101 0.94944 4.50101 0.750417C4.50101 0.551394 4.42195 0.360523 4.28121 0.219792C4.14048 0.0790615 3.94961 2.96567e-09 3.75059 0C3.55157 -2.96567e-09 3.3607 0.0790615 3.21996 0.219792L0.219965 3.21979C0.150233 3.28945 0.0949136 3.37216 0.0571704 3.46321C0.0194272 3.55426 0 3.65186 0 3.75042C0 3.84898 0.0194272 3.94657 0.0571704 4.03762C0.0949136 4.12867 0.150233 4.21139 0.219965 4.28104L3.21996 7.28104Z"
                        fill="#6F736D" />
                    </svg>
                  </button>

                  <div class="flex flex-col col-span-6 gap-[10px]">
                    <input type="number" id="currency_to" :value="toAmount.toFixed(2)" readonly
                      class="w-full bg-[#EEF2ED] rounded-[10px] p-5 text-[17px] text-mainBlack" placeholder="100">
                    <div class="flex flex-wrap gap-4">
                      <div class="block check_currency">
                        <input type="radio" id="eur_to" name="currency_to" class="hidden" v-model="toCurrency" value="EUR" checked>
                        <label for="eur_to">EUR</label>
                      </div>
                      <div class="block check_currency">
                        <input type="radio" id="tmt_to" name="currency_to" class="hidden" checked>
                        <label for="tmt_to">TMT</label>
                      </div>
                      <div class="block check_currency">
                        <input type="radio" id="usd_to" name="currency_to" class="hidden" v-model="toCurrency" value="USD">
                        <label for="usd_to">USD</label>
                      </div>
                    </div>
                  </div>
                </div>


                <h6 class="col-span-8 text-[#6F736D] mt-auto text-[17px] max-w-[450px] font-Gilroy">
                  {{ t('exchange.rateDisclaimer') }}
                </h6>
              </div> -->
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

          <div class="grid grid-cols-12 gap-4">
            <RouterLink :to="{ name: 'awards-detail', query: { id: item.id } }" v-for="item in awards" :key="item.id"
              class="award_glow relative overflow-hidden group col-span-4 last:col-span-12 block bg-mainWhite rounded-[20px] p-8 hover:bg-[#1D2417] transition-all duration-300">
              <h4 class=" text-[20px] font-bold text-mainBlack mb-2 group-hover:text-white transition-all duration-300">
                {{ item.title || '' }}
              </h4>
              <p class="text-sm text-[#6F736D] mb-6 group-hover:text-white transition-all duration-300">
                {{ item.sub_title || '' }}
              </p>
              <span class="h-[180px] flex justify-end relative z-[1]">
                <img :src="item.image_url || '../../assets/images/fact.png'" class="block h-full object-contain"
                  alt="card">
              </span>
            </RouterLink>
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

              <RouterLink to="/documents"
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
              <div class="flex gap-4">
                <RouterLink to="/"
                  class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-8 px-5 py-[14px] flex items-center gap-3 min-w-[150px]">
                  <span class="w-6 block">
                    <svg class="w-full h-full object-contain" width="30" height="30" viewBox="0 0 30 30" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.6816 18.0789C17.3184 14.76 16.9132 15.5025 20.7952 12.3711C24.9612 15.315 25.7452 14.4037 20.6816 18.0789Z"
                        fill="#2C702C" />
                      <path
                        d="M16.9587 14.3549C6.5359 4.48444 7.11158 4.02691 19.2538 11.3885C19.3637 11.501 19.803 11.5948 19.6023 11.786C18.716 12.6335 17.8563 13.4848 16.9587 14.3549Z"
                        fill="#2C702C" />
                      <path
                        d="M9.63763 23.2953C11.8911 20.8165 14.3832 18.5176 16.72 16.1025C16.9056 15.915 16.9775 15.9112 17.1555 16.0912C17.9811 16.92 18.8068 17.7526 19.6324 18.5851C17.1404 20.7602 13.3568 22.549 9.952 23.3666C9.81184 23.3328 9.72474 23.314 9.63763 23.2953Z"
                        fill="#2C702C" />
                      <path
                        d="M8.56587 22.9134C8.11898 23.2959 7.76298 21.8708 7.85767 21.6308C7.74026 20.5845 6.65326 4.5638 8.82343 7.83394C10.9784 9.99779 13.1486 12.1429 15.3111 14.2992C15.4778 14.6067 16.2731 14.933 15.9853 15.293C13.4553 17.7756 10.933 20.277 8.56587 22.9134Z"
                        fill="#2C702C" />
                      <path
                        d="M19.2538 11.3885C7.11155 4.02692 6.53588 4.48445 16.9587 14.3549C17.8562 13.4849 18.7122 12.6336 19.6022 11.786C19.8029 11.591 19.3636 11.4973 19.2538 11.3885ZM19.6325 18.5851C18.8069 17.7563 17.9812 16.92 17.1556 16.0912C16.9776 15.9112 16.9056 15.9187 16.72 16.1025C14.3832 18.5176 11.8912 20.8165 9.63772 23.2953C9.72482 23.314 9.81192 23.3328 9.95204 23.3628C13.3569 22.549 17.1404 20.7565 19.6325 18.5851ZM20.7952 12.3711C16.9132 15.5024 17.3184 14.7599 20.6816 18.0788C25.7453 14.4037 24.9613 15.315 20.7952 12.3711ZM8.82344 7.83337C6.65328 4.56323 7.74024 20.5802 7.85768 21.6302C7.76678 21.8702 8.12278 23.2953 8.56589 22.9128C10.933 20.2764 13.4516 17.7751 15.9853 15.2962C16.2731 14.9324 15.4778 14.6099 15.3112 14.3024C13.1486 12.146 10.9784 9.99722 8.82344 7.83337ZM19.2879 29.7569C4.92625 30.9232 -1.10697 28.298 0.165574 12.9523C0.211022 6.16828 1.9191 0.351775 9.86115 0.243019C26.1278 -0.867029 31.1422 1.27056 29.7902 18.4576C29.2864 25.3804 26.9118 29.7156 19.2879 29.7569Z"
                        fill="white" />
                    </svg>

                  </span>
                  Google store
                </RouterLink>
                <RouterLink to="/"
                  class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-8 px-5 py-[14px] flex items-center gap-3 min-w-[150px]">
                  <span class="w-6 block">
                    <svg class="w-full h-full object-contain" width="30" height="30" viewBox="0 0 30 30" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M23.3022 21.8917C24.0322 23.1442 22.1767 24.1867 21.4428 23.0167C19.8497 20.5867 18.4504 18.0368 16.8876 15.5843C16.4086 14.4143 14.9979 13.173 15.6405 11.8531C17.3325 9.6443 18.7394 12.708 19.3858 14.1368C21.1044 17.6543 19.998 16.7055 23.8155 16.6793C25.4733 16.683 25.6444 19.188 23.9904 19.368C23.3592 19.4392 22.7394 19.4317 22.1007 19.4468C22.5379 20.253 22.8345 21.1005 23.3022 21.8917Z"
                        fill="#2C702C" />
                      <path
                        d="M14.8154 6.65866C15.2831 5.65368 16.4428 4.43492 17.515 5.42867C18.2413 6.08115 17.747 7.10118 17.2527 7.76865C15.3819 10.6412 13.899 13.7236 12.1994 16.6898C13.7165 16.8211 15.245 16.7273 16.7508 16.9898C18.2337 17.2524 18.036 19.4161 16.5264 19.4498C13.591 19.5623 10.6556 19.3411 7.71639 19.4986C6.66697 19.4198 5.32474 19.9748 4.51486 19.1011C2.89125 16.3749 7.25634 16.7873 8.8495 16.6786C9.84573 15.7336 10.3362 14.1399 11.1423 12.9699C11.8077 11.7999 12.4579 10.6186 13.1233 9.44863C13.2412 9.08116 12.7089 8.77741 12.5758 8.43991C10.0511 5.64617 13.591 3.47493 14.8154 6.65866Z"
                        fill="#2C702C" />
                      <path
                        d="M9.33238 21.134C9.29816 19.8515 7.59091 19.3565 6.86086 20.4927C6.53768 21.0252 6.12701 21.5577 5.98253 22.169C5.69734 23.3802 7.24869 24.2052 8.11564 23.3015C8.69359 22.6902 9.13845 21.9477 9.33238 21.134ZM17.515 5.42908C16.439 4.43158 15.2831 5.65035 14.8154 6.65907C13.591 3.47535 10.0472 5.64659 12.5758 8.44408C12.7089 8.78155 13.2374 9.08155 13.1233 9.45281C12.4579 10.6266 11.8077 11.8041 11.1423 12.974C10.3362 14.144 9.84569 15.734 8.84949 16.6828C7.2563 16.7878 2.89121 16.3752 4.51863 19.1053C5.32851 19.9827 6.67074 19.424 7.7202 19.5027C10.6594 19.3453 13.591 19.5665 16.5302 19.454C18.0397 19.4202 18.2375 17.2565 16.7545 16.994C15.2488 16.7315 13.7203 16.8215 12.2032 16.694C13.9028 13.7278 15.3857 10.6415 17.2565 7.77282C17.747 7.10532 18.2412 6.08533 17.515 5.42908ZM9.78866 0.239115C14.3971 0.164116 19.1386 -0.552132 23.6178 0.925366C28.3745 2.37286 30.0323 7.42781 29.9867 11.8941C30.0209 15.0553 30.0323 18.2427 29.4581 21.359C28.519 27.2052 25.1653 29.7627 19.2451 29.8227C12.8381 30.0364 3.32469 31.1127 0.735295 23.6802C-0.329349 19.4915 0.0584866 15.0478 0.115524 10.7578C0.526176 4.52158 2.97489 0.374114 9.78866 0.239115ZM23.9942 19.3677C25.6482 19.1877 25.4771 16.6827 23.8193 16.679C20.0017 16.7052 21.1082 17.654 19.3896 14.1365C18.7394 12.7078 17.3363 9.64779 15.6443 11.8528C15.0017 13.169 16.4161 14.4103 16.8914 15.584C18.4542 18.0327 19.8535 20.5827 21.4466 23.0165C22.1805 24.1864 24.036 23.144 23.306 21.8915C22.8383 21.1002 22.5417 20.2527 22.1044 19.4465C22.7394 19.4315 23.363 19.439 23.9942 19.3677Z"
                        fill="white" />
                      <path
                        d="M6.86459 20.4923C7.59464 19.3523 9.30189 19.851 9.33612 21.1335C9.14218 21.9473 8.69352 22.6897 8.12318 23.3048C7.25623 24.2047 5.70488 23.3835 5.99007 22.1722C6.13074 21.5573 6.5376 21.0247 6.86459 20.4923Z"
                        fill="#2C702C" />
                    </svg>
                  </span>
                  App store
                </RouterLink>
              </div>

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
  .check_currency {
    label {
      background: #EEF2ED;
      padding: 12px 20px;
      border-radius: 20px;
      color: #6F736D;
      font-size: 17px;
      font-weight: 400;
      font-family: 'Gilroy';
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      display: inline-block;
    }

    input:checked+label {
      background: #1D2417;
      color: #EEF2ED;
    }
  }


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

  .glow::after {
    content: "";
    position: absolute;
    width: 321px;
    height: 321px;
    right: -120px;
    bottom: -97px;
    background: #2C702C;
    filter: blur(137.15px);
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  .glow:hover::after {
    opacity: 1;
  }

  .award_glow::after {
    content: "";
    position: absolute;
    width: 321px;
    height: 321px;
    right: -180px;
    bottom: -97px;
    background: #b7771e;
    filter: blur(137.15px);
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  .award_glow:hover::after {
    opacity: 1;
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
