<script setup>
  import Hero from '@/components/website/Hero.vue';
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

  // News Section ============================================================================
  const news = ref([]);
  const newsLoading = ref(false);
  const newsError = ref(null);

  // Fetch news from API
  const fetchNews = async () => {
    newsLoading.value = true;
    newsError.value = null;
    try {
      // Fetch latest 4 news items for homepage
      const response = await apiService.fetchNews({ limit: 4 });

      // Handle API response structure: { success: true, code: "news_listed", data: [...] }
      if (response?.success && response?.data && Array.isArray(response.data)) {
        news.value = response.data;
      } else if (Array.isArray(response)) {
        // Fallback: if response is directly an array
        news.value = response;
      } else if (response?.data && Array.isArray(response.data)) {
        // Fallback: if response has data property
        news.value = response.data;
      } else {
        news.value = [];
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      newsError.value = error.message || 'Failed to load news';
      news.value = [];
    } finally {
      newsLoading.value = false;
    }
  };

  // Fetch news on component mount
  onMounted(() => {
    fetchNews();
    fetchExchangeRates();
    fetchAwards();
  });

  // Clients Section ========================================================================
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
  })

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
            <div class="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Алтын Асыр»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Потребительские кредиты
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/cart.png" class="block max-h-full object-contain" alt="cart">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>
            </div>

            <div
              class="lg:col-span-4 rounded-[20px] text-mainWhite relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow">
              <h6 class="text-[28px] leading-9 font-bold mb-[10px]">
                Депозитный вклад «Выгодный»
              </h6>
              <p class="text-mainWhite max-w-[420px] opacity-60">
                Без пополнения и снятия с возможностью расторжения в любой момент
              </p>

              <span class="absolute right-1/2 translate-x-1/2 bottom-20 w-full max-w-[240px]">
                <img src="../../assets/images/1.5p.png"
                  class="block w-full h-full object-contain select-none pointer-events-none" alt="percent">
              </span>
            </div>

            <div class="col-span-12 grid gap-4 grid-cols-12">
              <div class="col-span-8 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>

              <div class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>

              <div
                class="col-span-8 rounded-[20px] p-8 shadow-sm hover:shadow-md transition offer-circle overflow-hidden relative bg-[#1D2417]">
                <h6 class="text-[28px] text-mainWhite leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-mainWhite/60 leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>

              <div class="col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>
            </div>


            <button type="button"
              class="col-span-12 mt-[26px] flex items-center justify-center gap-[10px] cursor-pointer">
              <p class="text-[#2C702C] text-[17px] font-Gilroy">
                Показать все
              </p>

              <span>
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.5675 1.06754L7.31754 7.31754C7.25949 7.37565 7.19056 7.42175 7.11469 7.4532C7.03881 7.48465 6.95748 7.50084 6.87535 7.50084C6.79321 7.50084 6.71188 7.48465 6.63601 7.4532C6.56014 7.42175 6.49121 7.37565 6.43316 7.31754L0.18316 1.06754C0.0658846 0.95026 0 0.7912 0 0.625347C0 0.459495 0.0658846 0.300435 0.18316 0.18316C0.300435 0.0658843 0.459495 0 0.625347 0C0.7912 0 0.95026 0.0658843 1.06753 0.18316L6.87535 5.99175L12.6832 0.18316C12.7412 0.125091 12.8102 0.0790281 12.886 0.0476015C12.9619 0.0161748 13.0432 0 13.1253 0C13.2075 0 13.2888 0.0161748 13.3647 0.0476015C13.4405 0.0790281 13.5095 0.125091 13.5675 0.18316C13.6256 0.241229 13.6717 0.310167 13.7031 0.386037C13.7345 0.461908 13.7507 0.543226 13.7507 0.625347C13.7507 0.707469 13.7345 0.788787 13.7031 0.864658C13.6717 0.940528 13.6256 1.00947 13.5675 1.06754Z"
                    fill="#2C702C" />
                </svg>
              </span>
            </button>
          </div>

          <div v-show="activeTab === 'Вклад'" class="grid gap-4 lg:grid-cols-12">
            <div class="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Депозитный вклад «Забота о родителях»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/10p.png" class="block max-h-full object-contain" alt="percent">
                </span>
              </div>
            </div>

            <div
              class="lg:col-span-4 rounded-[20px] text-mainWhite relative overflow-hidden p-8 lg:p-10 min-h-[520px] flex flex-col justify-start bg-[#191819] bg-deposit hot-glow">
              <h6 class="text-[28px] leading-9 font-bold mb-[10px]">
                Депозитный вклад «Выгодный»
              </h6>
              <p class="text-mainWhite max-w-[420px] opacity-60">
                Без пополнения и снятия с возможностью расторжения в любой момент
              </p>

              <span class="absolute right-1/2 translate-x-1/2 bottom-20 max-w-[240]">
                <img src="../../assets/images/1.5p.png"
                  class="block w-full h-full object-contain select-none pointer-events-none" alt="percent">
              </span>
            </div>
          </div>

          <div v-show="activeTab === 'Кредиты'" class="grid gap-4 lg:grid-cols-12">
            <div class="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
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
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Алтын Асыр»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
                </span>
              </div>

              <div class="rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
                  Банковская карта «Гоюм»
                </h6>
                <p class="text-[17px] text-[#6F736D] leading-5 mb-1 font-Gilroy">Без пополнения</p>
                <span class="max-h-[120px] h-full flex items-end justify-end">
                  <img src="../../assets/images/altyn-asyr-card.png" class="block max-h-full object-contain" alt="card">
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
    </section>

    <!-- Calc ===================================================================================== -->
    <section class="py-[50px]">
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
              <!-- Type of deposit: custom select -->
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

              <!-- Amount: input + slider -->
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

              <!-- Term: radio-like buttons -->
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

          <div class="relative overflow-hidden rounded-[32px] bg-mainBlack mt-4 py-8 px-6 text-white form-glow">
            <form class="max-w-[390px] mx-auto block">
              <h1 class="text-center text-[38px] leading-tight font-bold mb-10">Заполните данные</h1>

              <div class="mb-4">
                <input type="text" placeholder="Фамилия, имя и отчество"
                  class=" text-[17px] w-full rounded-[10px] bg-white placeholder:text-[#6F736D] text-[#1D2417] placeholder-[#6F736D] p-5 outline-none font-Gilroy" />
                <span class="block text-mainWhite/60 mt-[10px] font-Gilroy">Уточните точно как в паспорте</span>
              </div>

              <div class="mb-4">
                <div class="flex items-center">
                  <input type="text" value="+993" readonly
                    class=" text-[17px] w-[85px] rounded-[10px] bg-white placeholder:text-[#6F736D] text-[#1D2417] mr-[6px] p-5 outline-none select-none font-Gilroy" />
                  <input type="tel" placeholder="Номер телефона"
                    class=" text-[17px] flex-1 rounded-[10px] bg-white placeholder:text-[#6F736D] text-[#1D2417] placeholder-[#6F736D] p-5 outline-none font-Gilroy" />
                </div>
                <span class="block text-mainWhite/60 text-[15px] mt-[10px] font-Gilroy">На него поступит смс
                  оповещение</span>
              </div>

              <div class="mb-8">
                <input type="text" placeholder="Дата рождения"
                  class=" text-[17px] w-full rounded-[10px] bg-white placeholder:text-[#6F736D] text-[#1D2417] placeholder-[#6F736D] p-5 outline-none font-Gilroy" />
              </div>

              <button type="submit"
                class="block mx-auto w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                Продолжить
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
          <h2 class="text-[38px] font-bold mb-10 leading-9">{{ t('exchange.title') }}</h2>

          <div class="flex gap-4">
            <!-- Left card: branches -->
            <div class="w-full max-w-[390px] min-h-[467px] relative rounded-[20px] overflow-hidden bg-mainWhite p-8">
              <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">{{ t('exchange.branches') }}</h6>
              <p class="text-[17px] text-[#6F736D] leading-6 mb-6 font-Gilroy">{{ t('exchange.onCityMap') }}</p>
              <span class="block w-[300px] absolute left-1/2 -translate-x-1/2 -bottom-[55px]">
                <img src="../../assets/images/currency.png" class="block w-full h-full object-contain" alt="currency">
              </span>
            </div>

            <!-- Right card: exchange rates -->
            <div class="w-full max-w-[calc(100%-406px)] rounded-[20px] bg-mainWhite p-8">
              <div class="flex items-center justify-between mb-8">
                <h6 class="text-[28px] text-mainBlack leading-7 font-bold">{{ t('exchange.exchangeRates') }}</h6>

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
              <h6 class="text-[28px] text-mainBlack leading-7 font-bold mb-[10px]">
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
    <section class="py-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-[38px] font-bold">
              {{ t('news.title') }}
            </h2>
            <RouterLink to="/news" class="text-[#2C702C] hover:opacity-80 inline-flex items-center gap-2">
              {{ t('btn.showAll') }}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.35196 3.77314C6.29969 3.72088 6.25824 3.65884 6.22995 3.59055C6.20167 3.52227 6.18711 3.44908 6.18711 3.37517C6.18711 3.30127 6.20167 3.22808 6.22995 3.1598C6.25824 3.09151 6.29969 3.02947 6.35196 2.97721C6.40422 2.92494 6.46626 2.88349 6.53455 2.8552C6.60283 2.82692 6.67602 2.81236 6.74992 2.81236C6.82383 2.81236 6.89702 2.82692 6.9653 2.8552C7.03359 2.88349 7.09563 2.92494 7.14789 2.97721L12.7729 8.60221C12.8252 8.65445 12.8667 8.71649 12.895 8.78477C12.9233 8.85306 12.9379 8.92625 12.9379 9.00018C12.9379 9.0741 12.9233 9.14729 12.895 9.21558C12.8667 9.28387 12.8252 9.3459 12.7729 9.39814L7.14789 15.0231C7.04234 15.1287 6.89919 15.188 6.74992 15.188C6.60066 15.188 6.4575 15.1287 6.35195 15.0231C6.24641 14.9176 6.18711 14.7744 6.18711 14.6252C6.18711 14.4759 6.24641 14.3328 6.35195 14.2272L11.5797 9.00018L6.35196 3.77314Z"
                  fill="#6F736D" />
              </svg>

            </RouterLink>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 rounded-[20px] overflow-hidden bg-[#1D2417] p-8 text-white relative news-promo-glow">
              <h6 class="text-[28px] leading-9 text-mainWhite font-bold mb-[10px]">
                {{ t('news.readUsSocial') }}
              </h6>
              <p class="text-mainWhite text-[17px] leading-7 opacity-60 font-Gilroy">
                {{ t('news.subscribeFirstNews') }}
              </p>

              <span class="block ml-auto mt-[20px] w-[200px] z-10 relative">
                <img src="../../assets/images/megaphone.png" alt="news-icon"
                  class="block w-full h-auto object-contain" />
              </span>
            </div>

            <div class="col-span-8 grid sm:grid-cols-2 gap-4">
              <!-- Loading state -->
              <template v-if="newsLoading">
                <article v-for="n in 4" :key="n" class="bg-white rounded-[20px] overflow-hidden p-8 animate-pulse">
                  <div class="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                  <div class="h-6 bg-gray-200 rounded w-full mb-8"></div>
                  <div class="flex items-center gap-x-[10px]">
                    <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </article>
              </template>

              <!-- Error state -->
              <template v-else-if="newsError && news.length === 0">
                <div class="col-span-2 bg-white rounded-[20px] p-8 text-center">
                  <p class="text-[#6F736D] text-[17px]">{{ newsError }}</p>
                </div>
              </template>

              <!-- News articles -->
              <template v-else class="col-span-8 grid sm:grid-cols-2 gap-4">
                <article v-for="item in news" :key="item.id" class="bg-white rounded-[20px] overflow-hidden p-8">
                  <p class="text-[17px] text-[#6F736D] leading-4 font-Gilroy">
                    {{ item.published_at }}
                  </p>
                  <RouterLink :to="`/news-detail?id=${item.id}`"
                    class="block mt-[20px] text-[#1D2417] text-[17px] font-bold leading-5 hover:text-[#2C702C] transition-colors overflow-hidden [text-overflow:ellipsis] [-webkit-line-clamp:3] [display:-webkit-box] [-webkit-box-orient:vertical] min-h-[60px]">
                    {{ item.title || t('news.news') }}
                  </RouterLink>


                  <!-- <div v-if="item.tags && item.tags.length > 0" class="flex items-center gap-x-[10px] flex-wrap">
                    <p v-for="(tag, index) in item.tags" :key="index"
                      class="text-[14px] font-Gilroy text-[#2C702C] py-[6px] px-[10px] rounded-2xl bg-[#EEF2ED] w-fit leading-[18px]">
                      {{ tag.name || tag || t('news.news') }}
                    </p>
                  </div> -->
                </article>

                <!-- Fallback if no news -->
                <template v-if="news.length === 0">
                  <div class="col-span-2 grid place-items-center bg-white rounded-[20px] p-8 text-center">
                    <p class="text-[#6F736D] font-bold leading-5 text-[17px]">
                      {{ t('news.noNews') }}
                    </p>
                  </div>
                </template>
              </template>
            </div>
          </div>

        </div>
      </div>
    </section>

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
    right: -120px;
    bottom: -97px;
    background: #2C702C;
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
