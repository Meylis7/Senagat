<script setup>
  import Hero from '@/components/website/Hero.vue';
  import NewsSection from '@/components/website/NewsSection.vue';
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { RouterLink } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import apiService from '@/services/apiService';
  import CustomDropdown from '@/components/dashboard/CustomDropdown.vue';
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay } from 'swiper/modules'
  import 'swiper/css'
  const { t, locale } = useI18n();

  // Offers Section ============================================================================
  const activeTab = ref('Все');
  const setActiveTab = (tab) => {
    activeTab.value = tab; // Change active tab
  };

  const tabOrder = ['Все', 'Вклад', 'Кредиты', 'Карты'];
  const activeIndex = computed(() => tabOrder.indexOf(activeTab.value));



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
      const buy = item.purchase
      const sell = item.sale
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
  // Calc
  const selectedLoanId = ref(null)
  const loanOptions = computed(() => {
    const list = credits.value || []
    const arr = Array.isArray(list) ? list : []
    return arr.map(it => ({
      id: it.id,
      title: it.title,
      description: it.description,
      term: it.term,
      term_text: it.term_text,
      min_amount: it.min_amount,
      max_amount: it.max_amount,
      interest: it.interest,
      image_url: it.image_url,
      background_color: it.background_color,
    }))
  })
  const filteredLoanOptions = computed(() => {
    const arr = Array.isArray(loanOptions.value) ? loanOptions.value : []
    return arr.filter((it) => it?.min_amount != null && it?.max_amount != null)
  })
  const defaultLoanTitle = computed(() => {
    const arr = Array.isArray(filteredLoanOptions.value) ? filteredLoanOptions.value : []
    if (!arr.length) return ''
    const sel = selectedLoanId.value
    if (sel) {
      const found = arr.find(it => it.id === sel)
      if (found && found.title) return found.title
    }
    return arr[0].title || ''
  })
  const credit = ref(null)
  const creditMin = computed(() => {
    const minAmount = Number(credit.value?.min_amount)
    return Number.isFinite(minAmount) && minAmount > 0 ? minAmount : 0
  })
  const creditMax = computed(() => {
    const maxAmount = Number(credit.value?.max_amount)
    return Number.isFinite(maxAmount) && maxAmount > 0 ? maxAmount : 0
  })
  const creditAmount = ref(0)
  const formatMoney = (amount) => amount.toLocaleString('ru-RU')
  const toFixedDown = (value, digits = 2) => {
    const p = 10 ** digits
    return Math.trunc(Number(value) * p) / p
  }
  const formatMoneyFixed = (amount, digits = 2) => toFixedDown(amount, digits).toLocaleString('ru-RU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
  const roundToStep = (value, step) => Math.round(value / step) * step
  const creditSelectedTerm = ref('')
  const creditSelectedTermMonths = ref(0)
  const termOptions = computed(() => {
    const termYears = Number(credit.value?.term)
    const maxYears = Number.isFinite(termYears) && termYears > 0 ? termYears : NaN
    const steps = Number.isFinite(maxYears) ? Array.from({ length: maxYears }, (_, index) => index + 1) : []
    return steps.map((years) => ({
      label: `${years} ${(() => {
        if (locale.value === 'ru') {
          const mod10 = years % 10
          const mod100 = years % 100
          if (mod10 === 1 && mod100 !== 11) return t('date.year')
          if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return t('date.yearsFew')
          return t('date.years')
        }
        return years === 1 ? t('date.year') : t('date.years')
      })()}`,
      months: years * 12,
    }))
  })
  watch(termOptions, (opts) => {
    const first = Array.isArray(opts) && opts.length ? opts[0] : null
    if (first) {
      creditSelectedTerm.value = first.label
      creditSelectedTermMonths.value = first.months
    }
  }, { immediate: true })
  watch(credits, (list) => {
    const arr = Array.isArray(list) ? list : []
    const first = arr.length ? arr[0] : null
    if (first) {
      selectedLoanId.value = first.id
      credit.value = {
        id: first.id,
        title: first.title,
        description: first.description,
        term: first.term,
        term_text: first.term_text,
        min_amount: first.min_amount,
        max_amount: first.max_amount,
        interest: first.interest,
        image_url: first.image_url,
        background_color: first.background_color,
      }
      const minA = Number(first?.min_amount)
      const maxA = Number(first?.max_amount)
      if (Number.isFinite(minA) && Number.isFinite(maxA) && maxA > minA) {
        creditAmount.value = roundToStep(minA, 100)
      }
    }
  }, { immediate: true })
  const handleOptionSelected = (option) => {
    const id = typeof option === 'object' ? option.id : option
    selectedLoanId.value = id
    const found = Array.isArray(loanOptions.value) ? loanOptions.value.find(it => it.id === id) : null
    if (found) {
      credit.value = found
      const minA = Number(found?.min_amount)
      const maxA = Number(found?.max_amount)
      if (Number.isFinite(minA) && Number.isFinite(maxA) && maxA > minA) {
        creditAmount.value = roundToStep(minA, 100)
      }
    }
  }
  const progressPercent = computed(() => {
    const min = creditMin.value
    const max = creditMax.value
    const denom = max - min
    if (!Number.isFinite(min) || !Number.isFinite(max) || denom <= 0) return '0%'
    const selectedAmount = clamp(creditAmount.value, min, max)
    return ((selectedAmount - min) / denom) * 100 + '%'
  })
  watch([creditMin, creditMax], ([min, max]) => {
    if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
      creditAmount.value = min
    }
  })
  const monthlyRate = computed(() => {
    const interestPercent = Number(credit.value?.interest)
    return Number.isFinite(interestPercent) && interestPercent > 0 ? interestPercent / 100 : 0
  })
  const monthlyPayment = computed(() => {
    if (!selectedLoanId.value || !credit.value) return 0
    const principal = clamp(roundToStep(Number(creditAmount.value) || 0, 100), creditMin.value, creditMax.value)
    const totalMonths = Number(creditSelectedTermMonths.value) || 0
    const monthlyInterestRate = monthlyRate.value
    if (!Number.isFinite(principal) || !Number.isFinite(totalMonths) || totalMonths <= 0) return 0
    return (principal + principal * monthlyInterestRate) / totalMonths
  })
  // Calc end

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

  // Clients slider activation: only below 900px
  const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
  const isClientsSliderActiveSmall = computed(() => viewportWidth.value < 900)
  const onResize = () => { viewportWidth.value = window.innerWidth }
  onMounted(() => { window.addEventListener('resize', onResize) })
  onUnmounted(() => { window.removeEventListener('resize', onResize) })

  const swiperModules = [Autoplay,]

  const OFFERS_SEED_KEY = 'home_offers_seed_v1'
  const getOrCreateOffersSeed = () => {
    if (typeof window === 'undefined') return 1
    const raw = window.localStorage.getItem(OFFERS_SEED_KEY)
    const parsed = raw == null ? NaN : Number(raw)
    if (Number.isFinite(parsed)) return parsed >>> 0
    const created = (Math.random() * 0xFFFFFFFF) >>> 0
    window.localStorage.setItem(OFFERS_SEED_KEY, String(created))
    return created
  }

  const baseOffersSeed = getOrCreateOffersSeed()
  const offersLoading = computed(() => depositsLoading.value || creditsLoading.value || cardsLoading.value)

  const hashString32 = (str) => {
    let h = 2166136261
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return h >>> 0
  }

  const mulberry32 = (seed) => {
    let a = seed >>> 0
    return () => {
      a = (a + 0x6D2B79F5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  const seededShuffle = (arr, seed) => {
    const a = arr.slice()
    const rnd = mulberry32(seed)
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      const t = a[i]
      a[i] = a[j]
      a[j] = t
    }
    return a
  }

  const stableSortById = (list) => {
    const a = (Array.isArray(list) ? list : []).slice()
    a.sort((x, y) => {
      const ax = x?.id
      const ay = y?.id
      const nx = Number(ax)
      const ny = Number(ay)
      if (Number.isFinite(nx) && Number.isFinite(ny)) return nx - ny
      return String(ax ?? '').localeCompare(String(ay ?? ''), undefined, { numeric: true, sensitivity: 'base' })
    })
    return a
  }

  const allOffers = computed(() => {
    const depSeed = (baseOffersSeed ^ hashString32('deposit')) >>> 0
    const creSeed = (baseOffersSeed ^ hashString32('credit')) >>> 0
    const carSeed = (baseOffersSeed ^ hashString32('card')) >>> 0

    const dep = seededShuffle(stableSortById(deposits.value).map((d) => ({
      id: d.id,
      title: d.title,
      subtitle: d.sub_title || '',
      image_url: d.image_url,
      type: 'deposit',
      color: d.background_color
    })), depSeed)
    const cre = seededShuffle(stableSortById(credits.value).map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.interest + ' %' || '',
      image_url: c.image_url,
      type: 'credit',
    })), creSeed)
    const car = seededShuffle(stableSortById(cards.value).map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.sub_title || '',
      image_url: c.image_url,
      type: 'card',
    })), carSeed)

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

    <!-- Calc ===================================================================================== -->
    <section class="pb-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold leading-9">
              {{ t('calc.calculateBenefit') }}
            </h2>
          </div>

          <div class="grid grid-cols-12 gap-6">
            <div class="bg-mainWhite col-span-12 lg:col-span-8 rounded-[20px] p-6">
              <div class="mb-6">
                <h6 class="text-[17px] font-bold mb-4">
                  {{ t('dashboard.blockTitiles.selectCreditType') }}
                </h6>
                <CustomDropdown :options="filteredLoanOptions" :default-option="defaultLoanTitle"
                  @option-selected="handleOptionSelected" />
              </div>

              <div class="mb-6">
                <div class="bg-[#EEF2ED] rounded-[20px] p-5 relative">
                  <label class="block text-[#6F736D] text-[17px] mb-1 leading-tight">
                    {{ t('calc.loanAmount') }}
                  </label>
                  <h3 class="text-[17px] font-bold text-[#1D2417] leading-tight">{{ formatMoney(creditAmount) }}</h3>
                  <input type="range" :min="creditMin" :max="creditMax" step="100" v-model="creditAmount"
                    class="amount-range w-full absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer max-w-[calc(100%-30px)]"
                    :style="{ '--progress': progressPercent }" />
                </div>
                <div class="mt-3">
                  <div class="flex justify-between text-[#6F736D] mt-2">
                    <span>
                      {{ credit && credit.min_amount ? formatMoney(credit.min_amount) : formatMoney(creditMin) }}
                    </span>
                    <span>
                      {{ credit && credit.max_amount ? formatMoney(credit.max_amount) : formatMoney(creditMax) }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-mainBlack font-bold mb-3"> {{ t('calc.term') }}</label>
                <div class="flex flex-wrap gap-3">
                  <button v-for="opt in termOptions" :key="opt.label" type="button"
                    @click="creditSelectedTerm = opt.label; creditSelectedTermMonths = opt.months"
                    :class="creditSelectedTerm === opt.label ? 'bg-mainBlack text-white' : 'bg-white text-[#6F736D]'"
                    class="h-[48px] px-5 rounded-[12px] leading-tight">
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <!-- <p class="text-[#6F736D] text-[17px] mt-8 leading-6">
                {{ t('calc.calculatorDisclaimer') }}
              </p> -->
            </div>

            <div
              class="bg-mainWhite col-span-12 lg:col-span-4 rounded-[20px] p-6 flex flex-col items-center justify-center">
              <div class="flex flex-col text-center items-center justify-between mb-6 gap-5">
                <div>
                  <p class="text-[#6F736D] text-[17px] mb-2 leading-tight"> {{ t('calc.monthlyPayment') }}</p>
                  <h3 class="text-[32px] font-bold leading-tight">{{
                    formatMoneyFixed(monthlyPayment) }}
                    {{ t('calc.currencyManat') }}
                  </h3>
                </div>

                <div>
                  <p class="text-[#6F736D] text-[17px] mb-2 leading-tight"> {{ t('calc.rate') }}</p>
                  <h3 class="text-[32px] font-bold leading-tight">
                    {{ credit?.interest || 0 }}%
                  </h3>
                </div>
              </div>

              <RouterLink :to="{ name: 'dashboard.loan-application' }" @click="proceedToStep2"
                class="block w-fit min-w-[70%] px-8 text-center text-white text-[17px] font-normal bg-[#2C702C] rounded-[20px] py-3">
                {{ t('btn.fillOutForm') }}
              </RouterLink>


            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Offers =================================================================================== -->
    <section class="md:pt-[100px] pb-[30px]">
      <div class="auto_container">
        <div class="wrap">
          <div class="flex items-center justify-between flex-col sm:flex-row gap-4 mb-5 md:mb-10">
            <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold leading-9">
              {{ t('offer.title') }}
            </h2>

            <div class="relative bg-mainWhite p-1 rounded-[20px] grid grid-cols-4 items-center">
              <span
                class="absolute top-1 bottom-1 rounded-[16px] bg-[#2C702C] transition-transform duration-300 ease-out will-change-transform"
                :style="{ width: 'calc((100% - 8px) / 4)', transform: `translateX(calc(${activeIndex} * 100%))`, left: '4px' }"
                aria-hidden="true"></span>

              <button type="button"
                class="relative z-[1] w-full cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Все' ? 'text-mainWhite' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Все')">
                {{ t('tabs.all') }}
              </button>

              <button type="button"
                class="relative z-[1] w-full cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Вклад' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Вклад')">
                {{ t('tabs.deposit') }}
              </button>

              <button type="button"
                class="relative z-[1] w-full cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Кредиты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Кредиты')">
                {{ t('tabs.credits') }}
              </button>

              <button type="button"
                class="relative z-[1] w-full cursor-pointer rounded-2xl py-3 px-[14px] text-center transition-colors"
                :class="activeTab === 'Карты' ? 'text-[#EEF2ED]' : 'text-[#6F736D] hover:text-[#2C702C]'"
                @click="setActiveTab('Карты')">
                {{ t('tabs.cards') }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'Все' && offersLoading" class="grid gap-4 grid-cols-12">
            <div v-for="i in 5" :key="i"
              :class="['col-span-12 sm:col-span-6 lg:col-span-4 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm grid grid-cols-6 gap-2 animate-pulse', i === 3 ? 'lg:row-span-2' : '']">
              <div class="grid col-span-12 gap-5 h-fit">
                <div class="h-6 bg-[#E1E5DE] rounded-[12px] col-span-4"></div>
                <div class="h-4 bg-[#E1E5DE] rounded-[10px] col-span-6"></div>
                <div class="h-4 bg-[#E1E5DE] rounded-[10px] col-span-5"></div>
              </div>
              <div class="mt-auto col-span-6 grid justify-end">
                <div class="h-[80px] w-[100px] bg-[#E1E5DE] rounded-[16px] col-span-3"></div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'Все'" class="grid gap-4 grid-cols-12">
            <RouterLink v-for="(item, i) in visibleAllOffers"
              :key="item && item.type && item.id != null ? (item.type + '-' + item.id) : i" :to="getOfferLink(item)"
              :class="(i === 2 || i === 11)
                ? 'col-span-12 sm:col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 rounded-[20px] text-mainBlack relative overflow-hidden p-8 lg:p-10 lg:min-h-[520px] hover:shadow-md transition flex flex-col justify-start bg-[#F7F8F6]'
                : (i === 5)
                  ? 'col-span-12 sm:col-span-6 lg:col-span-8 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition flex flex-col flex-end'
                  : (i === 8)
                    ? 'col-span-12 sm:col-span-6 lg:col-span-8 rounded-[20px] p-8 shadow-sm text-mainBlack hover:shadow-md transition flex flex-col flex-end  bg-[#F7F8F6] relative overflow-hidden'
                    : 'col-span-12 sm:col-span-6 lg:col-span-4 rounded-[20px] bg-[#F7F8F6] p-8 shadow-sm hover:shadow-md transition flex flex-col flex-end'"
              :style="(i === 2 || i === 11 || i === 8) ? { '--promo-glow-bg': (item.color) } : null">
              <h6 class="text-lg leading-tight lg:text-[24px]"
                :class="(i === 2 || i === 11 || i === 8) ? 'leading-9 font-bold mb-[10px]' : 'text-mainBlack leading-7 font-bold mb-[10px]'">
                {{ item.title }}
              </h6>
              <p
                :class="(i === 2 || i === 11 || i === 8) ? 'text-mainWhite max-w-[420px] opacity-60 text-[17px]' : 'text-[17px] text-[#6F736D] leading-tight mb-[10px]'">
                {{ item.subtitle }}
              </p>

              <div v-if="(i === 2 || i === 11)"
                class="lg:absolute lg:right-1/2 lg:translate-x-1/2 lg:bottom-20 ml-auto lg:ml-0 lg:w-full max-w-[120px] lg:max-w-[240px] z-[2]">
                <template v-if="item.type === 'credit'">
                  <svg class="h-full object-contain" viewBox="0 0 100 85" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.20364 85.0001H17.3404C17.928 84.9981 18.4913 84.7654 18.909 84.3521C19.3268 83.9388 19.5656 83.378 19.5742 82.7903L19.6081 79.6861L23.7671 77.7501C24.9656 77.2223 26.3058 77.1091 27.5758 77.4286L47.2908 82.4182C54.0976 84.14 61.2962 83.3599 67.5765 80.2199L96.9624 65.5226C98.2282 64.8896 99.201 63.7926 99.6782 62.4599C100.155 61.1273 100.1 59.6619 99.524 58.369C98.9479 57.0761 97.8953 56.0554 96.5855 55.5196C95.2756 54.9837 93.8097 54.9741 92.4929 55.4926L71.582 61.9793C71.4151 60.8141 70.8817 59.7323 70.059 58.8907C69.2363 58.0491 68.167 57.4914 67.0062 57.2984L45.9564 53.7888L37.352 51.5105C34.1498 50.6649 30.786 50.6417 27.5724 51.443L19.8974 53.3624L19.9451 49.0322C19.9489 48.7442 19.8936 48.4584 19.7825 48.1927C19.6715 47.9269 19.507 47.6868 19.2994 47.4872C19.0896 47.2835 18.8407 47.1242 18.5678 47.0191C18.2949 46.9139 18.0036 46.8649 17.7114 46.8751H2.20364C0.971918 46.8751 0.000121012 47.7757 0.000121012 49.0078V82.7657C-0.00293059 83.0575 0.0517606 83.3469 0.161044 83.6174C0.270326 83.8879 0.432041 84.1341 0.636868 84.3418C0.841695 84.5495 1.08558 84.7146 1.35449 84.8276C1.62339 84.9405 1.91198 84.9992 2.20364 85.0001ZM28.2793 54.2726C31.0153 53.5903 33.8793 53.6101 36.6056 54.3301L45.2764 56.6251C45.3203 56.6368 45.3649 56.6459 45.4097 56.6538L66.5268 60.1747C66.9539 60.2454 67.3568 60.4207 67.6997 60.685C68.0425 60.9493 68.3147 61.2944 68.4918 61.6895C68.7639 62.2807 68.8025 62.953 68.5999 63.5716C68.5972 63.5807 68.5951 63.5901 68.5924 63.5993C68.5207 63.8124 68.4232 64.016 68.3021 64.2055C68.0672 64.5783 67.7413 64.8851 67.355 65.0969C66.9688 65.3088 66.5349 65.4187 66.0944 65.4163H51.0801C50.6934 65.4163 50.3226 65.57 50.0492 65.8435C49.7758 66.117 49.6222 66.4879 49.6222 66.8747C49.6222 67.2615 49.7758 67.6324 50.0492 67.9059C50.3226 68.1794 50.6934 68.333 51.0801 68.333H66.0946C67.0215 68.3331 67.9336 68.1002 68.747 67.6558C69.5605 67.2114 70.2493 66.5696 70.7501 65.7895C70.8731 65.5971 70.9844 65.3975 71.0834 65.1918L93.4114 58.2632C93.4518 58.2507 93.4914 58.2353 93.5303 58.2195C94.0865 57.9928 94.7044 57.9673 95.2774 58.1473C95.8504 58.3274 96.3427 58.7018 96.6694 59.2059C96.8665 59.5105 96.9972 59.8532 97.0528 60.2117C97.1085 60.5702 97.0879 60.9364 96.9924 61.2864C96.8969 61.6364 96.7287 61.9623 96.4986 62.2428C96.2686 62.5233 95.982 62.7521 95.6576 62.9143L66.2723 77.6109C60.6169 80.4381 54.1348 81.1404 48.0054 79.5901L28.2903 74.6005C26.3827 74.1209 24.3696 74.2929 22.571 75.0893L22.5481 75.0997L19.6431 76.4518L19.8637 56.3768L28.2793 54.2726ZM2.91593 49.7918H17.0218L16.666 82.0834H2.91593V49.7918Z"
                      fill="#4D4D4D" />
                    <path
                      d="M78.4127 17.112C78.176 16.8061 77.8275 16.6069 77.444 16.5581C77.0604 16.5092 76.6732 16.6148 76.3674 16.8515L57.2251 31.6757C57.0722 31.7924 56.9439 31.9382 56.8475 32.1047C56.7511 32.2712 56.6887 32.4552 56.6637 32.6459C56.6387 32.8367 56.6517 33.0305 56.702 33.2162C56.7522 33.4019 56.8387 33.5759 56.9565 33.728C57.0742 33.8801 57.2209 34.0075 57.388 34.1027C57.5552 34.1978 57.7395 34.259 57.9304 34.2826C58.1213 34.3062 58.315 34.2918 58.5002 34.2402C58.6855 34.1886 58.8588 34.1008 59.01 33.982L78.1523 19.1578C78.458 18.921 78.6572 18.5725 78.7061 18.1888C78.7549 17.8051 78.6493 17.4178 78.4127 17.112Z"
                      fill="#4D4D4D" />
                    <path
                      d="M61.1384 23.7111C62.2859 23.8572 63.451 23.6597 64.4863 23.1434C65.5215 22.6272 66.3805 21.8154 66.9546 20.8108C67.5286 19.8062 67.792 18.6539 67.7113 17.4996C67.6306 16.3453 67.2096 15.2408 66.5014 14.3259C65.7932 13.4109 64.8297 12.7266 63.7326 12.3595C62.6356 11.9923 61.4544 11.9588 60.3384 12.2632C59.2223 12.5675 58.2216 13.1961 57.4627 14.0695C56.7038 14.9428 56.2208 16.0216 56.0749 17.1695C55.8819 18.7081 56.3065 20.2606 57.2556 21.4867C58.2047 22.7128 59.6009 23.5127 61.1384 23.7111ZM58.9674 17.5372C59.0581 16.8296 59.4033 16.1792 59.9383 15.7075C60.4733 15.2358 61.1616 14.9749 61.8748 14.9736C61.9993 14.9737 62.1237 14.9815 62.2472 14.9972C62.8226 15.0705 63.3634 15.3128 63.8011 15.6935C64.2389 16.0742 64.5539 16.5762 64.7065 17.136C64.859 17.6958 64.8422 18.2883 64.6581 18.8385C64.474 19.3888 64.1309 19.872 63.6722 20.2272C63.2136 20.5824 62.6599 20.7936 62.0813 20.8341C61.5026 20.8745 60.925 20.7424 60.4214 20.4545C59.9178 20.1665 59.5108 19.7357 59.252 19.2164C58.9932 18.6972 58.8942 18.1128 58.9674 17.5372Z"
                      fill="#4D4D4D" />
                    <path
                      d="M74.239 27.122C73.0914 26.9759 71.9262 27.1734 70.8909 27.6897C69.8556 28.206 68.9965 29.0177 68.4224 30.0224C67.8483 31.027 67.5849 32.1794 67.6656 33.3338C67.7463 34.4881 68.1673 35.5927 68.8756 36.5076C69.5838 37.4226 70.5474 38.107 71.6445 38.4741C72.7415 38.8413 73.9228 38.8748 75.0389 38.5704C76.155 38.266 77.1558 37.6373 77.9147 36.7639C78.6736 35.8905 79.1566 34.8117 79.3025 33.6637C79.4968 32.1248 79.0727 30.5717 78.1234 29.3452C77.1741 28.1188 75.7771 27.3192 74.239 27.122ZM76.41 33.296C76.3387 33.8559 76.1075 34.3833 75.7441 34.815C75.3807 35.2467 74.9005 35.5644 74.3611 35.73C73.8217 35.8956 73.246 35.9021 72.7031 35.7486C72.1601 35.5951 71.673 35.2882 71.3 34.8648C70.927 34.4413 70.684 33.9192 70.6002 33.3611C70.5164 32.803 70.5954 32.2325 70.8276 31.7181C71.0597 31.2037 71.4353 30.7673 71.9093 30.461C72.3832 30.1548 72.9354 29.9918 73.4996 29.9916C73.6241 29.9917 73.7485 29.9997 73.872 30.0154C74.643 30.1148 75.3431 30.516 75.8188 31.131C76.2946 31.7459 76.5072 32.5245 76.41 33.296Z"
                      fill="#4D4D4D" />
                    <path
                      d="M91.0733 29.5023C92.0222 28.3671 93.0977 27.0806 93.0977 25.4167C93.0977 23.7527 92.0222 22.4663 91.0733 21.331C90.5266 20.6771 89.9613 20.001 89.8236 19.4838C89.6729 18.9198 89.8272 18.0208 89.9765 17.1517C90.2223 15.7194 90.5012 14.0963 89.6962 12.7048C88.8806 11.2944 87.3219 10.7231 85.9473 10.2192C85.1304 9.91958 84.2855 9.60958 83.8881 9.21208C83.4907 8.81458 83.181 7.96958 82.8815 7.15229C82.3775 5.77729 81.8066 4.21896 80.3966 3.40229C79.0054 2.59708 77.3825 2.87583 75.9511 3.12188C75.0819 3.27125 74.1834 3.42583 73.6194 3.27479C73.1023 3.13667 72.4265 2.57125 71.7727 2.02479C70.638 1.07583 69.352 0 67.6885 0C66.025 0 64.7389 1.07583 63.6041 2.025C62.9503 2.57188 62.2745 3.13729 61.7573 3.275C61.1935 3.42604 60.2948 3.27146 59.4259 3.12208C57.9938 2.87625 56.3712 2.5975 54.9804 3.4025C53.5704 4.21833 52.9993 5.7775 52.4955 7.1525C52.196 7.96958 51.8861 8.81479 51.4887 9.21229C51.0913 9.60979 50.2465 9.91958 49.4295 10.2192C48.0549 10.7233 46.497 11.2944 45.6806 12.7048C44.8758 14.0965 45.1545 15.7196 45.4003 17.1517C45.5496 18.021 45.7039 18.92 45.5531 19.484C45.415 20.0013 44.8498 20.6773 44.3035 21.3313C43.3548 22.4663 42.2793 23.7527 42.2793 25.4167C42.2793 27.0806 43.3548 28.3671 44.3037 29.5023C44.8504 30.1563 45.4157 30.8323 45.5533 31.3496C45.7041 31.9135 45.5498 32.8125 45.4005 33.6819C45.1547 35.114 44.876 36.7371 45.6808 38.1285C46.4964 39.539 48.0551 40.1102 49.4297 40.6142C50.2465 40.9138 51.0915 41.2238 51.4889 41.6213C51.8863 42.0188 52.196 42.8638 52.4955 43.681C52.9995 45.056 53.5704 46.6144 54.9804 47.431C56.3714 48.2358 57.9943 47.9573 59.4259 47.7115C60.295 47.5621 61.1937 47.4077 61.7575 47.5585C62.2747 47.6967 62.9507 48.2621 63.6045 48.8085C64.7391 49.7577 66.0254 50.8335 67.6887 50.8335C69.352 50.8335 70.6382 49.7577 71.7731 48.8085C72.4269 48.2617 73.1027 47.6963 73.6199 47.5585C74.1839 47.4075 75.0824 47.5621 75.9513 47.7115C77.3833 47.9573 79.006 48.236 80.3968 47.431C81.8068 46.6152 82.3779 45.056 82.8817 43.681C83.1812 42.864 83.4911 42.0188 83.8885 41.6213C84.2859 41.2238 85.1307 40.9129 85.9477 40.6144C87.3223 40.1102 88.8802 39.5392 89.6966 38.1288C90.5014 36.7371 90.2227 35.114 89.9769 33.6819C89.8276 32.8125 89.6733 31.9135 89.8241 31.3496C89.9613 30.8333 90.5266 30.1563 91.0733 29.5023ZM88.8364 27.6313C88.0867 28.5283 87.3111 29.456 87.0061 30.5963C86.6906 31.7777 86.8999 32.9967 87.1024 34.1754C87.2644 35.12 87.4483 36.1904 87.1719 36.6679C86.8849 37.1642 85.8981 37.526 84.9434 37.8763C83.8296 38.2848 82.678 38.7071 81.826 39.5592C80.974 40.4113 80.5518 41.5635 80.1436 42.6777C79.7937 43.6323 79.4319 44.6192 78.9356 44.9069C78.4582 45.1833 77.3881 44.9994 76.4438 44.8373C75.2654 44.6348 74.047 44.4254 72.8657 44.741C71.7258 45.046 70.7984 45.8217 69.9016 46.5719C69.1102 47.2336 68.2927 47.9177 67.6877 47.9177C67.0826 47.9177 66.2647 47.2336 65.4737 46.5719C64.5769 45.8219 63.6495 45.046 62.5096 44.741C62.0777 44.6295 61.6331 44.5752 61.1871 44.5794C60.4293 44.6016 59.6747 44.6878 58.9315 44.8373C57.9872 44.9996 56.9171 45.1833 56.4397 44.9069C55.9436 44.6198 55.5818 43.6327 55.2317 42.6777C54.8233 41.5635 54.4011 40.4117 53.5493 39.5594C52.6975 38.7071 51.5455 38.2848 50.4317 37.8765C49.4774 37.5265 48.4908 37.1646 48.2032 36.6681C47.9268 36.1904 48.1107 35.1202 48.2727 34.1756C48.4752 32.9969 48.6845 31.7779 48.369 30.5965C48.0641 29.4563 47.2887 28.5285 46.5387 27.6315C45.8772 26.8398 45.1932 26.0221 45.1932 25.4169C45.1932 24.8117 45.8772 23.9935 46.5387 23.2023C47.2884 22.3052 48.0641 21.3775 48.369 20.2373C48.6845 19.0558 48.4752 17.8369 48.2727 16.6581C48.1107 15.7135 47.9268 14.6431 48.2032 14.1656C48.4902 13.6694 49.477 13.3075 50.4317 12.9573C51.5455 12.5488 52.6971 12.1265 53.5491 11.2744C54.4011 10.4223 54.8233 9.27 55.2315 8.15583C55.5814 7.20125 55.9432 6.21438 56.4395 5.92667C56.9169 5.65021 57.987 5.83417 58.9313 5.99625C60.1099 6.19875 61.3281 6.40833 62.5094 6.0925C63.6493 5.7875 64.5767 5.01188 65.4735 4.26167C66.2656 3.60083 67.0845 2.91667 67.6885 2.91667C68.2925 2.91667 69.1114 3.60083 69.9024 4.2625C70.7992 5.0125 71.7267 5.78833 72.8665 6.09333C74.0474 6.40896 75.2663 6.19979 76.4447 5.99708C77.389 5.835 78.4593 5.65125 78.9364 5.9275C79.4325 6.21458 79.7943 7.20167 80.1444 8.15667C80.5528 9.27083 80.975 10.4227 81.8268 11.275C82.6787 12.1273 83.8306 12.5496 84.9445 12.9579C85.8988 13.3079 86.8853 13.6698 87.173 14.1663C87.4493 14.644 87.2654 15.7144 87.1034 16.6588C86.901 17.8375 86.6916 19.0565 87.0072 20.2379C87.3121 21.3781 88.0875 22.3058 88.8375 23.2029C89.4989 23.9946 90.1829 24.8123 90.1829 25.4175C90.1829 26.0227 89.4979 26.84 88.8364 27.6313Z"
                      fill="#4D4D4D" />
                  </svg>

                </template>
                <template v-else>
                  <img :src="item.image_url"
                    class="block lg:w-full h-full object-contain select-none pointer-events-none" alt="offer-image">
                </template>
              </div>
              <div v-else class="max-h-[95px] lg:max-h-[120px] h-full mt-auto flex items-end justify-end z-[2]">
                <template v-if="item.type === 'credit'">
                  <svg class="h-full object-contain" viewBox="0 0 100 85" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.20364 85.0001H17.3404C17.928 84.9981 18.4913 84.7654 18.909 84.3521C19.3268 83.9388 19.5656 83.378 19.5742 82.7903L19.6081 79.6861L23.7671 77.7501C24.9656 77.2223 26.3058 77.1091 27.5758 77.4286L47.2908 82.4182C54.0976 84.14 61.2962 83.3599 67.5765 80.2199L96.9624 65.5226C98.2282 64.8896 99.201 63.7926 99.6782 62.4599C100.155 61.1273 100.1 59.6619 99.524 58.369C98.9479 57.0761 97.8953 56.0554 96.5855 55.5196C95.2756 54.9837 93.8097 54.9741 92.4929 55.4926L71.582 61.9793C71.4151 60.8141 70.8817 59.7323 70.059 58.8907C69.2363 58.0491 68.167 57.4914 67.0062 57.2984L45.9564 53.7888L37.352 51.5105C34.1498 50.6649 30.786 50.6417 27.5724 51.443L19.8974 53.3624L19.9451 49.0322C19.9489 48.7442 19.8936 48.4584 19.7825 48.1927C19.6715 47.9269 19.507 47.6868 19.2994 47.4872C19.0896 47.2835 18.8407 47.1242 18.5678 47.0191C18.2949 46.9139 18.0036 46.8649 17.7114 46.8751H2.20364C0.971918 46.8751 0.000121012 47.7757 0.000121012 49.0078V82.7657C-0.00293059 83.0575 0.0517606 83.3469 0.161044 83.6174C0.270326 83.8879 0.432041 84.1341 0.636868 84.3418C0.841695 84.5495 1.08558 84.7146 1.35449 84.8276C1.62339 84.9405 1.91198 84.9992 2.20364 85.0001ZM28.2793 54.2726C31.0153 53.5903 33.8793 53.6101 36.6056 54.3301L45.2764 56.6251C45.3203 56.6368 45.3649 56.6459 45.4097 56.6538L66.5268 60.1747C66.9539 60.2454 67.3568 60.4207 67.6997 60.685C68.0425 60.9493 68.3147 61.2944 68.4918 61.6895C68.7639 62.2807 68.8025 62.953 68.5999 63.5716C68.5972 63.5807 68.5951 63.5901 68.5924 63.5993C68.5207 63.8124 68.4232 64.016 68.3021 64.2055C68.0672 64.5783 67.7413 64.8851 67.355 65.0969C66.9688 65.3088 66.5349 65.4187 66.0944 65.4163H51.0801C50.6934 65.4163 50.3226 65.57 50.0492 65.8435C49.7758 66.117 49.6222 66.4879 49.6222 66.8747C49.6222 67.2615 49.7758 67.6324 50.0492 67.9059C50.3226 68.1794 50.6934 68.333 51.0801 68.333H66.0946C67.0215 68.3331 67.9336 68.1002 68.747 67.6558C69.5605 67.2114 70.2493 66.5696 70.7501 65.7895C70.8731 65.5971 70.9844 65.3975 71.0834 65.1918L93.4114 58.2632C93.4518 58.2507 93.4914 58.2353 93.5303 58.2195C94.0865 57.9928 94.7044 57.9673 95.2774 58.1473C95.8504 58.3274 96.3427 58.7018 96.6694 59.2059C96.8665 59.5105 96.9972 59.8532 97.0528 60.2117C97.1085 60.5702 97.0879 60.9364 96.9924 61.2864C96.8969 61.6364 96.7287 61.9623 96.4986 62.2428C96.2686 62.5233 95.982 62.7521 95.6576 62.9143L66.2723 77.6109C60.6169 80.4381 54.1348 81.1404 48.0054 79.5901L28.2903 74.6005C26.3827 74.1209 24.3696 74.2929 22.571 75.0893L22.5481 75.0997L19.6431 76.4518L19.8637 56.3768L28.2793 54.2726ZM2.91593 49.7918H17.0218L16.666 82.0834H2.91593V49.7918Z"
                      fill="#4D4D4D" />
                    <path
                      d="M78.4127 17.112C78.176 16.8061 77.8275 16.6069 77.444 16.5581C77.0604 16.5092 76.6732 16.6148 76.3674 16.8515L57.2251 31.6757C57.0722 31.7924 56.9439 31.9382 56.8475 32.1047C56.7511 32.2712 56.6887 32.4552 56.6637 32.6459C56.6387 32.8367 56.6517 33.0305 56.702 33.2162C56.7522 33.4019 56.8387 33.5759 56.9565 33.728C57.0742 33.8801 57.2209 34.0075 57.388 34.1027C57.5552 34.1978 57.7395 34.259 57.9304 34.2826C58.1213 34.3062 58.315 34.2918 58.5002 34.2402C58.6855 34.1886 58.8588 34.1008 59.01 33.982L78.1523 19.1578C78.458 18.921 78.6572 18.5725 78.7061 18.1888C78.7549 17.8051 78.6493 17.4178 78.4127 17.112Z"
                      fill="#4D4D4D" />
                    <path
                      d="M61.1384 23.7111C62.2859 23.8572 63.451 23.6597 64.4863 23.1434C65.5215 22.6272 66.3805 21.8154 66.9546 20.8108C67.5286 19.8062 67.792 18.6539 67.7113 17.4996C67.6306 16.3453 67.2096 15.2408 66.5014 14.3259C65.7932 13.4109 64.8297 12.7266 63.7326 12.3595C62.6356 11.9923 61.4544 11.9588 60.3384 12.2632C59.2223 12.5675 58.2216 13.1961 57.4627 14.0695C56.7038 14.9428 56.2208 16.0216 56.0749 17.1695C55.8819 18.7081 56.3065 20.2606 57.2556 21.4867C58.2047 22.7128 59.6009 23.5127 61.1384 23.7111ZM58.9674 17.5372C59.0581 16.8296 59.4033 16.1792 59.9383 15.7075C60.4733 15.2358 61.1616 14.9749 61.8748 14.9736C61.9993 14.9737 62.1237 14.9815 62.2472 14.9972C62.8226 15.0705 63.3634 15.3128 63.8011 15.6935C64.2389 16.0742 64.5539 16.5762 64.7065 17.136C64.859 17.6958 64.8422 18.2883 64.6581 18.8385C64.474 19.3888 64.1309 19.872 63.6722 20.2272C63.2136 20.5824 62.6599 20.7936 62.0813 20.8341C61.5026 20.8745 60.925 20.7424 60.4214 20.4545C59.9178 20.1665 59.5108 19.7357 59.252 19.2164C58.9932 18.6972 58.8942 18.1128 58.9674 17.5372Z"
                      fill="#4D4D4D" />
                    <path
                      d="M74.239 27.122C73.0914 26.9759 71.9262 27.1734 70.8909 27.6897C69.8556 28.206 68.9965 29.0177 68.4224 30.0224C67.8483 31.027 67.5849 32.1794 67.6656 33.3338C67.7463 34.4881 68.1673 35.5927 68.8756 36.5076C69.5838 37.4226 70.5474 38.107 71.6445 38.4741C72.7415 38.8413 73.9228 38.8748 75.0389 38.5704C76.155 38.266 77.1558 37.6373 77.9147 36.7639C78.6736 35.8905 79.1566 34.8117 79.3025 33.6637C79.4968 32.1248 79.0727 30.5717 78.1234 29.3452C77.1741 28.1188 75.7771 27.3192 74.239 27.122ZM76.41 33.296C76.3387 33.8559 76.1075 34.3833 75.7441 34.815C75.3807 35.2467 74.9005 35.5644 74.3611 35.73C73.8217 35.8956 73.246 35.9021 72.7031 35.7486C72.1601 35.5951 71.673 35.2882 71.3 34.8648C70.927 34.4413 70.684 33.9192 70.6002 33.3611C70.5164 32.803 70.5954 32.2325 70.8276 31.7181C71.0597 31.2037 71.4353 30.7673 71.9093 30.461C72.3832 30.1548 72.9354 29.9918 73.4996 29.9916C73.6241 29.9917 73.7485 29.9997 73.872 30.0154C74.643 30.1148 75.3431 30.516 75.8188 31.131C76.2946 31.7459 76.5072 32.5245 76.41 33.296Z"
                      fill="#4D4D4D" />
                    <path
                      d="M91.0733 29.5023C92.0222 28.3671 93.0977 27.0806 93.0977 25.4167C93.0977 23.7527 92.0222 22.4663 91.0733 21.331C90.5266 20.6771 89.9613 20.001 89.8236 19.4838C89.6729 18.9198 89.8272 18.0208 89.9765 17.1517C90.2223 15.7194 90.5012 14.0963 89.6962 12.7048C88.8806 11.2944 87.3219 10.7231 85.9473 10.2192C85.1304 9.91958 84.2855 9.60958 83.8881 9.21208C83.4907 8.81458 83.181 7.96958 82.8815 7.15229C82.3775 5.77729 81.8066 4.21896 80.3966 3.40229C79.0054 2.59708 77.3825 2.87583 75.9511 3.12188C75.0819 3.27125 74.1834 3.42583 73.6194 3.27479C73.1023 3.13667 72.4265 2.57125 71.7727 2.02479C70.638 1.07583 69.352 0 67.6885 0C66.025 0 64.7389 1.07583 63.6041 2.025C62.9503 2.57188 62.2745 3.13729 61.7573 3.275C61.1935 3.42604 60.2948 3.27146 59.4259 3.12208C57.9938 2.87625 56.3712 2.5975 54.9804 3.4025C53.5704 4.21833 52.9993 5.7775 52.4955 7.1525C52.196 7.96958 51.8861 8.81479 51.4887 9.21229C51.0913 9.60979 50.2465 9.91958 49.4295 10.2192C48.0549 10.7233 46.497 11.2944 45.6806 12.7048C44.8758 14.0965 45.1545 15.7196 45.4003 17.1517C45.5496 18.021 45.7039 18.92 45.5531 19.484C45.415 20.0013 44.8498 20.6773 44.3035 21.3313C43.3548 22.4663 42.2793 23.7527 42.2793 25.4167C42.2793 27.0806 43.3548 28.3671 44.3037 29.5023C44.8504 30.1563 45.4157 30.8323 45.5533 31.3496C45.7041 31.9135 45.5498 32.8125 45.4005 33.6819C45.1547 35.114 44.876 36.7371 45.6808 38.1285C46.4964 39.539 48.0551 40.1102 49.4297 40.6142C50.2465 40.9138 51.0915 41.2238 51.4889 41.6213C51.8863 42.0188 52.196 42.8638 52.4955 43.681C52.9995 45.056 53.5704 46.6144 54.9804 47.431C56.3714 48.2358 57.9943 47.9573 59.4259 47.7115C60.295 47.5621 61.1937 47.4077 61.7575 47.5585C62.2747 47.6967 62.9507 48.2621 63.6045 48.8085C64.7391 49.7577 66.0254 50.8335 67.6887 50.8335C69.352 50.8335 70.6382 49.7577 71.7731 48.8085C72.4269 48.2617 73.1027 47.6963 73.6199 47.5585C74.1839 47.4075 75.0824 47.5621 75.9513 47.7115C77.3833 47.9573 79.006 48.236 80.3968 47.431C81.8068 46.6152 82.3779 45.056 82.8817 43.681C83.1812 42.864 83.4911 42.0188 83.8885 41.6213C84.2859 41.2238 85.1307 40.9129 85.9477 40.6144C87.3223 40.1102 88.8802 39.5392 89.6966 38.1288C90.5014 36.7371 90.2227 35.114 89.9769 33.6819C89.8276 32.8125 89.6733 31.9135 89.8241 31.3496C89.9613 30.8333 90.5266 30.1563 91.0733 29.5023ZM88.8364 27.6313C88.0867 28.5283 87.3111 29.456 87.0061 30.5963C86.6906 31.7777 86.8999 32.9967 87.1024 34.1754C87.2644 35.12 87.4483 36.1904 87.1719 36.6679C86.8849 37.1642 85.8981 37.526 84.9434 37.8763C83.8296 38.2848 82.678 38.7071 81.826 39.5592C80.974 40.4113 80.5518 41.5635 80.1436 42.6777C79.7937 43.6323 79.4319 44.6192 78.9356 44.9069C78.4582 45.1833 77.3881 44.9994 76.4438 44.8373C75.2654 44.6348 74.047 44.4254 72.8657 44.741C71.7258 45.046 70.7984 45.8217 69.9016 46.5719C69.1102 47.2336 68.2927 47.9177 67.6877 47.9177C67.0826 47.9177 66.2647 47.2336 65.4737 46.5719C64.5769 45.8219 63.6495 45.046 62.5096 44.741C62.0777 44.6295 61.6331 44.5752 61.1871 44.5794C60.4293 44.6016 59.6747 44.6878 58.9315 44.8373C57.9872 44.9996 56.9171 45.1833 56.4397 44.9069C55.9436 44.6198 55.5818 43.6327 55.2317 42.6777C54.8233 41.5635 54.4011 40.4117 53.5493 39.5594C52.6975 38.7071 51.5455 38.2848 50.4317 37.8765C49.4774 37.5265 48.4908 37.1646 48.2032 36.6681C47.9268 36.1904 48.1107 35.1202 48.2727 34.1756C48.4752 32.9969 48.6845 31.7779 48.369 30.5965C48.0641 29.4563 47.2887 28.5285 46.5387 27.6315C45.8772 26.8398 45.1932 26.0221 45.1932 25.4169C45.1932 24.8117 45.8772 23.9935 46.5387 23.2023C47.2884 22.3052 48.0641 21.3775 48.369 20.2373C48.6845 19.0558 48.4752 17.8369 48.2727 16.6581C48.1107 15.7135 47.9268 14.6431 48.2032 14.1656C48.4902 13.6694 49.477 13.3075 50.4317 12.9573C51.5455 12.5488 52.6971 12.1265 53.5491 11.2744C54.4011 10.4223 54.8233 9.27 55.2315 8.15583C55.5814 7.20125 55.9432 6.21438 56.4395 5.92667C56.9169 5.65021 57.987 5.83417 58.9313 5.99625C60.1099 6.19875 61.3281 6.40833 62.5094 6.0925C63.6493 5.7875 64.5767 5.01188 65.4735 4.26167C66.2656 3.60083 67.0845 2.91667 67.6885 2.91667C68.2925 2.91667 69.1114 3.60083 69.9024 4.2625C70.7992 5.0125 71.7267 5.78833 72.8665 6.09333C74.0474 6.40896 75.2663 6.19979 76.4447 5.99708C77.389 5.835 78.4593 5.65125 78.9364 5.9275C79.4325 6.21458 79.7943 7.20167 80.1444 8.15667C80.5528 9.27083 80.975 10.4227 81.8268 11.275C82.6787 12.1273 83.8306 12.5496 84.9445 12.9579C85.8988 13.3079 86.8853 13.6698 87.173 14.1663C87.4493 14.644 87.2654 15.7144 87.1034 16.6588C86.901 17.8375 86.6916 19.0565 87.0072 20.2379C87.3121 21.3781 88.0875 22.3058 88.8375 23.2029C89.4989 23.9946 90.1829 24.8123 90.1829 25.4175C90.1829 26.0227 89.4979 26.84 88.8364 27.6313Z"
                      fill="#4D4D4D" />
                  </svg>

                </template>
                <template v-else>
                  <img :src="item.image_url" class="block max-h-full object-contain" alt="offer-image">
                </template>
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

          <div v-show="activeTab === 'Вклад'" class="grid gap-4 grid-cols-12">
            <RouterLink :to="`/deposits-detail?id=${item.id}`" v-for="(item, i) in deposits" :key="item.id"
              class="col-span-12 sm:col-span-6 lg:col-span-4 rounded-[20px] p-8 shadow-sm hover:shadow-md transition"
              :class="i === 2 ? 'row-span-1 lg:row-span-2 text-mainBlack relative overflow-hidden lg:p-10 lg:min-h-[520px] flex flex-col justify-start bg-[#F7F8F6]' : 'bg-[#F7F8F6]'"
              :style="i === 2 ? { '--promo-glow-bg': (item.background_color) } : null">
              <h6 class="text-lg leading-tight lg:text-[24px]"
                :class="i === 2 ? 'leading-tight font-bold mb-[10px]' : 'text-mainBlack leading-7 font-bold mb-[10px]'">
                {{ item.title }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.sub_title }}</p>


              <span v-if="i === 2"
                class="lg:absolute lg:right-1/2 lg:translate-x-1/2 lg:bottom-20 ml-auto lg:ml-0 lg:w-full max-w-[120px] lg:max-w-[240px] z-[2]">
                <img :src="item.image_url" class="block lg:w-full h-full object-contain select-none pointer-events-none"
                  alt="percent">
              </span>
              <span v-else class="max-h-[95px] lg:max-h-[120px] h-full flex items-end justify-end">
                <img :src="item.image_url" class="block max-h-full object-contain" alt="percent">
              </span>
            </RouterLink>
          </div>

          <div v-show="activeTab === 'Кредиты'" class="grid gap-4 grid-cols-12">
            <RouterLink :to="`/loans-detail?id=${item.id}`" v-for="item in credits" :key="item.id"
              class="rounded-[20px] bg-[#F7F8F6] p-8 col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col shadow-sm hover:shadow-md transition">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                {{ item.title }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.interest + ' %' }}</p>
              <div class="max-h-[95px] lg:max-h-[120px] h-full mt-auto flex items-end justify-end">
                <svg width="100" height="85" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.20364 85.0001H17.3404C17.928 84.9981 18.4913 84.7654 18.909 84.3521C19.3268 83.9388 19.5656 83.378 19.5742 82.7903L19.6081 79.6861L23.7671 77.7501C24.9656 77.2223 26.3058 77.1091 27.5758 77.4286L47.2908 82.4182C54.0976 84.14 61.2962 83.3599 67.5765 80.2199L96.9624 65.5226C98.2282 64.8896 99.201 63.7926 99.6782 62.4599C100.155 61.1273 100.1 59.6619 99.524 58.369C98.9479 57.0761 97.8953 56.0554 96.5855 55.5196C95.2756 54.9837 93.8097 54.9741 92.4929 55.4926L71.582 61.9793C71.4151 60.8141 70.8817 59.7323 70.059 58.8907C69.2363 58.0491 68.167 57.4914 67.0062 57.2984L45.9564 53.7888L37.352 51.5105C34.1498 50.6649 30.786 50.6417 27.5724 51.443L19.8974 53.3624L19.9451 49.0322C19.9489 48.7442 19.8936 48.4584 19.7825 48.1927C19.6715 47.9269 19.507 47.6868 19.2994 47.4872C19.0896 47.2835 18.8407 47.1242 18.5678 47.0191C18.2949 46.9139 18.0036 46.8649 17.7114 46.8751H2.20364C0.971918 46.8751 0.000121012 47.7757 0.000121012 49.0078V82.7657C-0.00293059 83.0575 0.0517606 83.3469 0.161044 83.6174C0.270326 83.8879 0.432041 84.1341 0.636868 84.3418C0.841695 84.5495 1.08558 84.7146 1.35449 84.8276C1.62339 84.9405 1.91198 84.9992 2.20364 85.0001ZM28.2793 54.2726C31.0153 53.5903 33.8793 53.6101 36.6056 54.3301L45.2764 56.6251C45.3203 56.6368 45.3649 56.6459 45.4097 56.6538L66.5268 60.1747C66.9539 60.2454 67.3568 60.4207 67.6997 60.685C68.0425 60.9493 68.3147 61.2944 68.4918 61.6895C68.7639 62.2807 68.8025 62.953 68.5999 63.5716C68.5972 63.5807 68.5951 63.5901 68.5924 63.5993C68.5207 63.8124 68.4232 64.016 68.3021 64.2055C68.0672 64.5783 67.7413 64.8851 67.355 65.0969C66.9688 65.3088 66.5349 65.4187 66.0944 65.4163H51.0801C50.6934 65.4163 50.3226 65.57 50.0492 65.8435C49.7758 66.117 49.6222 66.4879 49.6222 66.8747C49.6222 67.2615 49.7758 67.6324 50.0492 67.9059C50.3226 68.1794 50.6934 68.333 51.0801 68.333H66.0946C67.0215 68.3331 67.9336 68.1002 68.747 67.6558C69.5605 67.2114 70.2493 66.5696 70.7501 65.7895C70.8731 65.5971 70.9844 65.3975 71.0834 65.1918L93.4114 58.2632C93.4518 58.2507 93.4914 58.2353 93.5303 58.2195C94.0865 57.9928 94.7044 57.9673 95.2774 58.1473C95.8504 58.3274 96.3427 58.7018 96.6694 59.2059C96.8665 59.5105 96.9972 59.8532 97.0528 60.2117C97.1085 60.5702 97.0879 60.9364 96.9924 61.2864C96.8969 61.6364 96.7287 61.9623 96.4986 62.2428C96.2686 62.5233 95.982 62.7521 95.6576 62.9143L66.2723 77.6109C60.6169 80.4381 54.1348 81.1404 48.0054 79.5901L28.2903 74.6005C26.3827 74.1209 24.3696 74.2929 22.571 75.0893L22.5481 75.0997L19.6431 76.4518L19.8637 56.3768L28.2793 54.2726ZM2.91593 49.7918H17.0218L16.666 82.0834H2.91593V49.7918Z"
                    fill="#4D4D4D" />
                  <path
                    d="M78.4127 17.112C78.176 16.8061 77.8275 16.6069 77.444 16.5581C77.0604 16.5092 76.6732 16.6148 76.3674 16.8515L57.2251 31.6757C57.0722 31.7924 56.9439 31.9382 56.8475 32.1047C56.7511 32.2712 56.6887 32.4552 56.6637 32.6459C56.6387 32.8367 56.6517 33.0305 56.702 33.2162C56.7522 33.4019 56.8387 33.5759 56.9565 33.728C57.0742 33.8801 57.2209 34.0075 57.388 34.1027C57.5552 34.1978 57.7395 34.259 57.9304 34.2826C58.1213 34.3062 58.315 34.2918 58.5002 34.2402C58.6855 34.1886 58.8588 34.1008 59.01 33.982L78.1523 19.1578C78.458 18.921 78.6572 18.5725 78.7061 18.1888C78.7549 17.8051 78.6493 17.4178 78.4127 17.112Z"
                    fill="#4D4D4D" />
                  <path
                    d="M61.1384 23.7111C62.2859 23.8572 63.451 23.6597 64.4863 23.1434C65.5215 22.6272 66.3805 21.8154 66.9546 20.8108C67.5286 19.8062 67.792 18.6539 67.7113 17.4996C67.6306 16.3453 67.2096 15.2408 66.5014 14.3259C65.7932 13.4109 64.8297 12.7266 63.7326 12.3595C62.6356 11.9923 61.4544 11.9588 60.3384 12.2632C59.2223 12.5675 58.2216 13.1961 57.4627 14.0695C56.7038 14.9428 56.2208 16.0216 56.0749 17.1695C55.8819 18.7081 56.3065 20.2606 57.2556 21.4867C58.2047 22.7128 59.6009 23.5127 61.1384 23.7111ZM58.9674 17.5372C59.0581 16.8296 59.4033 16.1792 59.9383 15.7075C60.4733 15.2358 61.1616 14.9749 61.8748 14.9736C61.9993 14.9737 62.1237 14.9815 62.2472 14.9972C62.8226 15.0705 63.3634 15.3128 63.8011 15.6935C64.2389 16.0742 64.5539 16.5762 64.7065 17.136C64.859 17.6958 64.8422 18.2883 64.6581 18.8385C64.474 19.3888 64.1309 19.872 63.6722 20.2272C63.2136 20.5824 62.6599 20.7936 62.0813 20.8341C61.5026 20.8745 60.925 20.7424 60.4214 20.4545C59.9178 20.1665 59.5108 19.7357 59.252 19.2164C58.9932 18.6972 58.8942 18.1128 58.9674 17.5372Z"
                    fill="#4D4D4D" />
                  <path
                    d="M74.239 27.122C73.0914 26.9759 71.9262 27.1734 70.8909 27.6897C69.8556 28.206 68.9965 29.0177 68.4224 30.0224C67.8483 31.027 67.5849 32.1794 67.6656 33.3338C67.7463 34.4881 68.1673 35.5927 68.8756 36.5076C69.5838 37.4226 70.5474 38.107 71.6445 38.4741C72.7415 38.8413 73.9228 38.8748 75.0389 38.5704C76.155 38.266 77.1558 37.6373 77.9147 36.7639C78.6736 35.8905 79.1566 34.8117 79.3025 33.6637C79.4968 32.1248 79.0727 30.5717 78.1234 29.3452C77.1741 28.1188 75.7771 27.3192 74.239 27.122ZM76.41 33.296C76.3387 33.8559 76.1075 34.3833 75.7441 34.815C75.3807 35.2467 74.9005 35.5644 74.3611 35.73C73.8217 35.8956 73.246 35.9021 72.7031 35.7486C72.1601 35.5951 71.673 35.2882 71.3 34.8648C70.927 34.4413 70.684 33.9192 70.6002 33.3611C70.5164 32.803 70.5954 32.2325 70.8276 31.7181C71.0597 31.2037 71.4353 30.7673 71.9093 30.461C72.3832 30.1548 72.9354 29.9918 73.4996 29.9916C73.6241 29.9917 73.7485 29.9997 73.872 30.0154C74.643 30.1148 75.3431 30.516 75.8188 31.131C76.2946 31.7459 76.5072 32.5245 76.41 33.296Z"
                    fill="#4D4D4D" />
                  <path
                    d="M91.0733 29.5023C92.0222 28.3671 93.0977 27.0806 93.0977 25.4167C93.0977 23.7527 92.0222 22.4663 91.0733 21.331C90.5266 20.6771 89.9613 20.001 89.8236 19.4838C89.6729 18.9198 89.8272 18.0208 89.9765 17.1517C90.2223 15.7194 90.5012 14.0963 89.6962 12.7048C88.8806 11.2944 87.3219 10.7231 85.9473 10.2192C85.1304 9.91958 84.2855 9.60958 83.8881 9.21208C83.4907 8.81458 83.181 7.96958 82.8815 7.15229C82.3775 5.77729 81.8066 4.21896 80.3966 3.40229C79.0054 2.59708 77.3825 2.87583 75.9511 3.12188C75.0819 3.27125 74.1834 3.42583 73.6194 3.27479C73.1023 3.13667 72.4265 2.57125 71.7727 2.02479C70.638 1.07583 69.352 0 67.6885 0C66.025 0 64.7389 1.07583 63.6041 2.025C62.9503 2.57188 62.2745 3.13729 61.7573 3.275C61.1935 3.42604 60.2948 3.27146 59.4259 3.12208C57.9938 2.87625 56.3712 2.5975 54.9804 3.4025C53.5704 4.21833 52.9993 5.7775 52.4955 7.1525C52.196 7.96958 51.8861 8.81479 51.4887 9.21229C51.0913 9.60979 50.2465 9.91958 49.4295 10.2192C48.0549 10.7233 46.497 11.2944 45.6806 12.7048C44.8758 14.0965 45.1545 15.7196 45.4003 17.1517C45.5496 18.021 45.7039 18.92 45.5531 19.484C45.415 20.0013 44.8498 20.6773 44.3035 21.3313C43.3548 22.4663 42.2793 23.7527 42.2793 25.4167C42.2793 27.0806 43.3548 28.3671 44.3037 29.5023C44.8504 30.1563 45.4157 30.8323 45.5533 31.3496C45.7041 31.9135 45.5498 32.8125 45.4005 33.6819C45.1547 35.114 44.876 36.7371 45.6808 38.1285C46.4964 39.539 48.0551 40.1102 49.4297 40.6142C50.2465 40.9138 51.0915 41.2238 51.4889 41.6213C51.8863 42.0188 52.196 42.8638 52.4955 43.681C52.9995 45.056 53.5704 46.6144 54.9804 47.431C56.3714 48.2358 57.9943 47.9573 59.4259 47.7115C60.295 47.5621 61.1937 47.4077 61.7575 47.5585C62.2747 47.6967 62.9507 48.2621 63.6045 48.8085C64.7391 49.7577 66.0254 50.8335 67.6887 50.8335C69.352 50.8335 70.6382 49.7577 71.7731 48.8085C72.4269 48.2617 73.1027 47.6963 73.6199 47.5585C74.1839 47.4075 75.0824 47.5621 75.9513 47.7115C77.3833 47.9573 79.006 48.236 80.3968 47.431C81.8068 46.6152 82.3779 45.056 82.8817 43.681C83.1812 42.864 83.4911 42.0188 83.8885 41.6213C84.2859 41.2238 85.1307 40.9129 85.9477 40.6144C87.3223 40.1102 88.8802 39.5392 89.6966 38.1288C90.5014 36.7371 90.2227 35.114 89.9769 33.6819C89.8276 32.8125 89.6733 31.9135 89.8241 31.3496C89.9613 30.8333 90.5266 30.1563 91.0733 29.5023ZM88.8364 27.6313C88.0867 28.5283 87.3111 29.456 87.0061 30.5963C86.6906 31.7777 86.8999 32.9967 87.1024 34.1754C87.2644 35.12 87.4483 36.1904 87.1719 36.6679C86.8849 37.1642 85.8981 37.526 84.9434 37.8763C83.8296 38.2848 82.678 38.7071 81.826 39.5592C80.974 40.4113 80.5518 41.5635 80.1436 42.6777C79.7937 43.6323 79.4319 44.6192 78.9356 44.9069C78.4582 45.1833 77.3881 44.9994 76.4438 44.8373C75.2654 44.6348 74.047 44.4254 72.8657 44.741C71.7258 45.046 70.7984 45.8217 69.9016 46.5719C69.1102 47.2336 68.2927 47.9177 67.6877 47.9177C67.0826 47.9177 66.2647 47.2336 65.4737 46.5719C64.5769 45.8219 63.6495 45.046 62.5096 44.741C62.0777 44.6295 61.6331 44.5752 61.1871 44.5794C60.4293 44.6016 59.6747 44.6878 58.9315 44.8373C57.9872 44.9996 56.9171 45.1833 56.4397 44.9069C55.9436 44.6198 55.5818 43.6327 55.2317 42.6777C54.8233 41.5635 54.4011 40.4117 53.5493 39.5594C52.6975 38.7071 51.5455 38.2848 50.4317 37.8765C49.4774 37.5265 48.4908 37.1646 48.2032 36.6681C47.9268 36.1904 48.1107 35.1202 48.2727 34.1756C48.4752 32.9969 48.6845 31.7779 48.369 30.5965C48.0641 29.4563 47.2887 28.5285 46.5387 27.6315C45.8772 26.8398 45.1932 26.0221 45.1932 25.4169C45.1932 24.8117 45.8772 23.9935 46.5387 23.2023C47.2884 22.3052 48.0641 21.3775 48.369 20.2373C48.6845 19.0558 48.4752 17.8369 48.2727 16.6581C48.1107 15.7135 47.9268 14.6431 48.2032 14.1656C48.4902 13.6694 49.477 13.3075 50.4317 12.9573C51.5455 12.5488 52.6971 12.1265 53.5491 11.2744C54.4011 10.4223 54.8233 9.27 55.2315 8.15583C55.5814 7.20125 55.9432 6.21438 56.4395 5.92667C56.9169 5.65021 57.987 5.83417 58.9313 5.99625C60.1099 6.19875 61.3281 6.40833 62.5094 6.0925C63.6493 5.7875 64.5767 5.01188 65.4735 4.26167C66.2656 3.60083 67.0845 2.91667 67.6885 2.91667C68.2925 2.91667 69.1114 3.60083 69.9024 4.2625C70.7992 5.0125 71.7267 5.78833 72.8665 6.09333C74.0474 6.40896 75.2663 6.19979 76.4447 5.99708C77.389 5.835 78.4593 5.65125 78.9364 5.9275C79.4325 6.21458 79.7943 7.20167 80.1444 8.15667C80.5528 9.27083 80.975 10.4227 81.8268 11.275C82.6787 12.1273 83.8306 12.5496 84.9445 12.9579C85.8988 13.3079 86.8853 13.6698 87.173 14.1663C87.4493 14.644 87.2654 15.7144 87.1034 16.6588C86.901 17.8375 86.6916 19.0565 87.0072 20.2379C87.3121 21.3781 88.0875 22.3058 88.8375 23.2029C89.4989 23.9946 90.1829 24.8123 90.1829 25.4175C90.1829 26.0227 89.4979 26.84 88.8364 27.6313Z"
                    fill="#4D4D4D" />
                </svg>

                <!-- <img src="../../assets/images/loan.png" class="block max-h-full object-contain"
                  alt="cart"> -->
                <!-- <img :src="item.image_url || '../../assets/images/cart.png'" class="block max-h-full object-contain"
                  alt="cart"> -->
              </div>
            </RouterLink>
          </div>

          <div v-show="activeTab === 'Карты'" class="grid gap-4 grid-cols-12">
            <RouterLink :to="`/cards-detail?id=${item.id}`" v-for="item in cards" :key="item.id"
              class="rounded-[20px] col-span-12 sm:col-span-6 lg:col-span-4 bg-[#F7F8F6] p-8 flex flex-col shadow-sm hover:shadow-md transition">
              <h6 class="text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                {{ item.title }}
              </h6>
              <p class="text-[17px] text-[#6F736D] leading-5 mb-[10px] font-Gilroy">{{ item.sub_title }}</p>
              <div class="max-h-[95px] lg:max-h-[120px] h-full mt-auto flex items-end justify-end">
                <img :src="item.image_url || '../../assets/images/altyn-asyr-card.png'"
                  class="block max-h-full object-contain" alt="card">
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Currency ================================================================================= -->
    <section class="py-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <!-- <h2 class="text-[38px] font-bold mb-5 md:mb-10 leading-9">{{ t('exchange.title') }}</h2> -->

          <div class="grid grid-cols-12 gap-4">
            <RouterLink to="/branches"
              class="group text-center md:text-left glow w-full col-span-12 md:col-span-4 min-h-[260px] md:min-h-[407px] relative rounded-[20px] overflow-hidden bg-mainWhite p-8 hover:bg-[#1d5f1d] transition duration-300">
              <h6
                class="text-[18px] md:text-[24px] text-mainBlack leading-tight font-bold mb-[10px] group-hover:text-white">
                {{ t('exchange.branches') }}
              </h6>
              <p class="text-sm mdtext-[17px] text-[#6F736D] leading-tight mb-6 group-hover:text-white">{{
                t('exchange.onCityMap') }}</p>

              <span
                class="block w-[90px] md:w-[180px] absolute left-1/2 -translate-x-1/2 bottom-[40px] sm:bottom-[25px] z-[1]">
                <!-- <img src="../../assets/images/services/services (16).png" class="block w-full h-full object-contain"
                  alt="currency"> -->

                <svg class="w-full h-full object-contain" width="56" height="56" viewBox="0 0 56 56" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path class="group-hover:fill-[#fff]"
                    d="M18.7002 37.3001L29.9002 32.5001L23.5002 26.1001L18.7002 37.3001Z" fill="#2C702C" />
                  <path class="group-hover:fill-[#fff]"
                    d="M41.3 0H14.7C6.6 0 0 6.6 0 14.7V41.3C0 49.4 6.6 56 14.7 56H41.3C49.4 56 56 49.4 56 41.3V14.7C56 6.6 49.4 0 41.3 0ZM42.4 16L34.8 33.8C34.7 34.1 34.5 34.3 34.3 34.5C34.2 34.6 34 34.7 33.9 34.7L16 42.4C15.3 42.7 14.5 42.5 14 42C13.5 41.5 13.3 40.7 13.6 40L21.2 22.2C21.4 21.8 21.7 21.5 22.1 21.3L40 13.6C40.7 13.3 41.5 13.5 42 14C42.5 14.5 42.7 15.3 42.4 16Z"
                    fill="#cecece" />
                </svg>
              </span>
            </RouterLink>

            <div class="w-full col-span-12 md:col-span-8 rounded-[20px] bg-mainWhite p-6 md:p-8">
              <div class="flex items-center justify-between mb-8">
                <h6 class="text-[18px] md:text-[24px] text-mainBlack leading-7 font-bold">{{ t('exchange.exchangeRates')
                }}</h6>
              </div>

              <div v-show="currencyActiveTab === 'Текущий курс'"
                class="grid grid-cols-12 gap-6 md:gap-y-10 text-mainBlack h-[calc(100%-60px)] ">
                <div class="col-span-4 leading-7 text-sm ms:text-[17px] text-[#6F736D]">{{
                  t('exchange.currency') }}
                </div>
                <div class="col-span-4 leading-7 text-sm ms:text-[17px] text-[#6F736D]">{{ t('exchange.buy')
                }}</div>
                <div class="col-span-4 leading-7 text-sm ms:text-[17px] text-[#6F736D]">{{
                  t('exchange.sell') }}</div>

                <template v-for="r in rates" :key="r.code">
                  <div class="col-span-4 leading-7 flex items-center  text-[18px] md:text-[28px] font-bold">{{ r.code }}
                  </div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[18px] md:text-[28px] font-bold">
                    {{ r.buy }}
                  </div>
                  <div class="col-span-4 leading-7 flex items-center gap-2 text-[18px] md:text-[28px] font-bold">
                    {{ r.sell }}
                  </div>
                </template>

                <div class="block mt-auto col-span-10 max-w-[450px]">
                  <h6 class="col-span-8 text-[#6F736D] text-sm md:text-[17px] font-Gilroy">
                    {{ t('exchange.rateDisclaimer') }}
                  </h6>
                  <a href="https://www.cbt.tm/kurs/kurs_today.html" target="_blank"
                    class="block text-[#2C702C] font-bold text-sm md:text-[17px] mt-4">
                    {{ t('exchange.inform') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Award ==================================================================================== -->
    <section class="md:pt-[50px] pb-[30px] md:pb-[60px]">
      <div class="auto_container">
        <div class="wrap">
          <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-5 md:mb-10 leading-9">
            {{ t('facts.title') }}
          </h2>

          <div class="grid grid-cols-12 gap-4">
            <RouterLink :to="{ name: 'awards-detail', query: { id: item.id } }" v-for="item in awards" :key="item.id"
              class="award_glow relative overflow-hidden group col-span-12 sm:col-span-6 md:col-span-4 md:last:col-span-12 block bg-mainWhite rounded-[20px] p-8 hover:bg-[#1D2417] transition-all duration-300">
              <h4
                class="text-[18px] lg:text-[20px] leading-tight font-bold text-mainBlack mb-2 group-hover:text-white transition-all duration-300">
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
    <section class="mt-[30px] md:pt-[60px] pb-[50px]">
      <div class="auto_container">
        <div class="wrap">
          <div
            class="flex items-center justify-between bg-mainWhite rounded-[20px] p-8 relative overflow-hidden purple-glow">
            <div class="block max-w-[600px]">
              <h6 class="text-[18px] md:text-[24px] text-mainBlack leading-tight font-bold mb-[10px]">
                {{ t('docs.title') }}
              </h6>
              <p class="text-sm md:text-[17px] text-[#6F736D] leading-5 max-w-[500px]">
                {{ t('docs.subTitle') }}
              </p>

              <RouterLink to="/documents"
                class="block w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-8 md:mt-[85px] px-5 py-[14px]">
                {{ t('btn.learnMore') }}
              </RouterLink>
            </div>

            <div class="h-[160px] hidden md:block z-10">
              <!-- <img src="../../assets/images/services/services (6).png" class="block w-full h-full object-contain"
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
          </div>
        </div>
      </div>
    </section>

    <!-- News ===================================================================================== -->
    <NewsSection />

    <!-- Clients ================================================================================== -->
    <section class="md:pt-[50px] pb-[80px] md:pb-[60px]">
      <div class="auto_container">
        <div class="wrap">
          <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-5 md:mb-10">
            {{ t('clients.title') }}
          </h2>

          <div v-if="isClientsSliderActiveSmall" class="relative">
            <Swiper :modules="swiperModules"
              :breakpoints="{ 0: { slidesPerView: 2 }, 470: { slidesPerView: 2 }, 750: { slidesPerView: 3 } }"
              :autoplay="{ delay: 7000, disableOnInteraction: false }" :loop="true">
              <SwiperSlide v-for="client in clients" :key="client.id"
                class="border-solid border-[#6F736D1A]/10 border-0 border-r-[1px] px-1">
                <div class="grid place-items-center">
                  <img class="h-[100px] w-[calc(100%-15px)] block object-contain" :src="client.image_url"
                    alt="client-image">
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div v-else class="grid grid-cols-5">
            <div v-for="(client, idx) in clients" :key="client.id"
              :class="['grid place-items-center border-solid border-[#6F736D1A]/10 border-0', idx < clients.length - 1 ? 'border-r-[1px]' : '']">
              <img class="h-[100px] block object-contain" :src="client.image_url" alt="client-image">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- App ====================================================================================== -->
    <section class="pt-[60px] pb-[80px] md:pb-[120px] hidden md:block">
      <div class="auto_container">
        <div class="wrap">
          <div class="block relative overflow-hidden">
            <div class=" bg-mainWhite rounded-[20px] p-8 relative overflow-hidden ellipse">
              <h4 class="text-[28px] max-w-[370px] text-mainBlack font-bold mb-[10px] leading-8 z-10">
                {{ t('app.title') }}
              </h4>
              <p class="text-mainBlack/60 text-[17px] leading-6 z-10 max-w-[430px]">
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

              <!-- <div class="app-circle"></div> -->

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
  /* .purple-glow::after {
    content: "";
    position: absolute;
    width: 298px;
    height: 298px;
    left: calc(50% - 298px/2 + 590px);
    bottom: -147px;
    background: #2C702C;
    filter: blur(147.15px);
    border-radius: 9999px;
    pointer-events: none;
  } */

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
    filter: blur(160px);
    z-index: 1;
    right: -16px;
    bottom: -216px;
    transform: translateY(-50%);
  }

  /* Calc */
  .amount-range {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 9999px;
    background: linear-gradient(to right, #2C702C var(--progress, 0%), #E6EAE3 var(--progress, 0%));
    outline: none;
  }

  .amount-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at center, #2C702C 0 7px, #ffffff 8px);
    border: 0;
    box-shadow: 0 0 0 4px #ffffff;
    cursor: pointer;
    margin-top: 0px;
  }

  .amount-range::-moz-range-track {
    height: 8px;
    border-radius: 9999px;
    background: linear-gradient(to right, #2C702C var(--progress, 0%), #E6EAE3 var(--progress, 0%));
  }

  .amount-range::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(circle at center, #2C702C 0 7px, #ffffff 8px);
    border: 0;
    box-shadow: 0 0 0 4px #ffffff;
    cursor: pointer;
  }

  /* Calc end */
</style>
