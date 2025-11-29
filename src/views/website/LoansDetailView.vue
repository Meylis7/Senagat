<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import apiService from '@/services/apiService'
    import diamond1 from '@/assets/images/dimond-1.png'
    import diamond2 from '@/assets/images/dimond-2.png'
    import '@/assets/css/text.scss'

    import NewsSection from '@/components/website/NewsSection.vue';


    const credit = ref(null)
    const creditMin = computed(() => {
        const minAmount = Number(credit.value?.min_amount)
        return Number.isFinite(minAmount) && minAmount > 0 ? minAmount : 1000
    })
    const creditMax = computed(() => {
        const maxAmount = Number(credit.value?.max_amount)
        return Number.isFinite(maxAmount) && maxAmount > 0 ? maxAmount : 60000
    })
    const creditAmount = ref(0);


    // Utility Functions =========================================================================
    const formatMoney = (amount) => amount.toLocaleString('ru-RU');
    const toFixedDown = (value, digits = 2) => {
        const p = 10 ** digits
        return Math.trunc(Number(value) * p) / p
    }
    const formatMoneyFixed = (amount, digits = 2) => toFixedDown(amount, digits).toLocaleString('ru-RU', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const roundToStep = (value, step) => Math.round(value / step) * step;

    // Term Options ==============================================================================
    const creditSelectedTerm = ref('2 года');
    const creditSelectedTermMonths = ref(24);
    const termOptions = computed(() => {
        const termYears = Number(credit.value?.term);
        const maxYears = Number.isFinite(termYears) && termYears > 0 ? termYears : NaN;
        const steps = Number.isFinite(maxYears)
            ? Array.from({ length: maxYears }, (_, index) => index + 1)
            : [1, 2, 3, 4, 5];
        return steps.map((years) => ({
            label: years === 1 ? '1 year' : `${years} years`,
            months: years * 12,
        }));
    })

    const { t } = useI18n()
    const route = useRoute()
    const creditId = computed(() => route.params?.id || route.query?.id)

    const loading = ref(false)
    const error = ref(null)

    const breadcrumbItems = computed(() => {
        const currentTitle = credit.value?.title || credit.value?.name || ''
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.loans'), path: '/loans' },
            { label: currentTitle },
        ]
    })

    const fetchCreditDetail = async () => {
        if (!creditId.value) return
        loading.value = true
        error.value = null
        try {
            const res = await apiService.get(`/v1/credit/types/${creditId.value}`)
            const data = res?.data || res
            credit.value = data && !Array.isArray(data) ? data : null
            const minA = Number(credit.value?.min_amount)
            const maxA = Number(credit.value?.max_amount)
            if (Number.isFinite(minA) && Number.isFinite(maxA) && maxA > minA) {
                creditAmount.value = roundToStep(minA, 100)
            }
        } catch (err) {
            error.value = err.message || 'Failed to load credit'
            credit.value = null
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchCreditDetail()
    })

    watch(creditId, (val, oldVal) => {
        if (val && val !== oldVal) {
            fetchCreditDetail()
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    })

    watch(termOptions, (opts) => {
        const first = Array.isArray(opts) && opts.length ? opts[0] : null
        if (first) {
            creditSelectedTerm.value = first.label
            creditSelectedTermMonths.value = first.months
        }
    }, { immediate: true })

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

    const hasAmountRange = computed(() => {
        const creditData = credit.value
        return !!(creditData && creditData.min_amount != null && creditData.max_amount != null)
    })

    const monthlyRate = computed(() => {
        const interestPercent = Number(credit.value?.interest)
        return Number.isFinite(interestPercent) && interestPercent > 0 ? interestPercent / 100 : 0
    })

    const monthlyPayment = computed(() => {
        const principal = clamp(roundToStep(Number(creditAmount.value) || 0, 100), creditMin.value, creditMax.value)
        const totalMonths = Number(creditSelectedTermMonths.value) || 0
        const monthlyInterestRate = monthlyRate.value
        if (!Number.isFinite(principal) || !Number.isFinite(totalMonths) || totalMonths <= 0) return 0
        return (principal + principal * monthlyInterestRate) / totalMonths
    })

    const totalPayment = computed(() => {
        const totalMonths = Number(creditSelectedTermMonths.value) || 0
        return toFixedDown(monthlyPayment.value * totalMonths, 2)
    })

</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center gap-x-2 mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems"
                        linkClass="text-[17px] font-Gilroy text-[#6F736D] whitespace-nowrap"
                        currentClass="text-[17px] font-Gilroy text-mainWhite" />
                </div>

                <div class="m-auto max-w-[760px]">
                    <h1 class=" text-mainWhite mb-[10px] text-center text-5xl font-bold">
                        {{ credit?.title || '' }}
                    </h1>

                    <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                        {{ credit?.description || '' }}
                    </p>
                </div>

                <span class="block mt-[125px] w-full max-w-[390px] mx-auto relative z-10">
                    <img :src="credit?.image_url || '../../assets/images/loan-note.png'"
                        class="block w-full h-full object-contain" alt="credit">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"
            :style="credit?.background_color ? { background: credit.background_color } : null"></span>
    </section>

    <!-- Info  ================================================ -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="grid grid-cols-12 gap-x-4">
                    <div class="col-span-4 bg-mainWhite rounded-[20px] p-8 pb-0 flex flex-col justify-center">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            {{ credit?.interest || '' }} %
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D] ">
                            {{ t('credit.fixedRate') }}
                        </p>
                        <span class="block w-[230px] mx-auto mt-auto relative ">
                            <img :src="diamond1" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>

                    <div class="col-span-4 bg-mainWhite rounded-[20px] p-8 pb-0 flex flex-col justify-center">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            {{ credit?.term_text || '' }}
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D] ">
                            {{ t('credit.term') }}
                        </p>
                        <span class="block w-[230px] mx-auto mt-auto relative ">
                            <img :src="diamond2" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>

                    <div class="col-span-4 bg-mainWhite rounded-[20px] p-8 pb-0 flex flex-col justify-center">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            {{ credit?.max_amount ? credit?.max_amount + ' TMT' : credit?.amount_text || '' }}
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D] ">
                            {{ t('credit.amount') }}
                        </p>
                        <span class="block w-[230px] mx-auto mt-auto relative ">
                            <img :src="diamond1" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Calc ===================================================================================== -->
    <section class="py-[50px]" v-if="hasAmountRange">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold leading-9 mb-8">
                    {{ t('pageTitle.depositApplication') }}
                </h2>

                <div class="grid lg:grid-cols-12 gap-6">
                    <div class="lg:col-span-8 bg-mainWhite rounded-[20px] p-6">
                        <div class="mb-6">
                            <div class="bg-[#EEF2ED] rounded-[20px] p-5 relative">
                                <label class="block text-[#6F736D] text-[17px] mb-1 leading-tight">
                                    {{ t('calc.loanAmount') }}
                                </label>
                                <h3 class="text-[17px] font-bold text-[#1D2417] leading-tight">{{
                                    formatMoney(creditAmount) }}
                                </h3>

                                <input type="range" :min="creditMin" :max="creditMax" step="100" v-model="creditAmount"
                                    class="amount-range w-full absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer max-w-[calc(100%-30px)]"
                                    :style="{ '--progress': progressPercent }" />
                            </div>
                            <div class="mt-3">

                                <div class="flex justify-between text-[#6F736D] mt-2">
                                    <span>
                                        {{ credit && credit.min_amount ? formatMoney(credit.min_amount) :
                                            formatMoney(creditMin) }}
                                    </span>
                                    <span>
                                        {{ credit && credit.max_amount ? formatMoney(credit.max_amount) :
                                            formatMoney(creditMax) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-mainBlack font-bold mb-3"> {{ t('credit.term') }}</label>
                            <div class="flex flex-wrap gap-3">
                                <button v-for="opt in termOptions" :key="opt.label" type="button"
                                    @click="creditSelectedTerm = opt.label; creditSelectedTermMonths = opt.months"
                                    :class="creditSelectedTerm === opt.label ? 'bg-mainBlack text-white' : 'bg-white text-[#6F736D]'"
                                    class="h-[48px] px-5 rounded-[12px] leading-tight">{{ opt.label }}</button>
                            </div>
                        </div>

                        <p class="text-[#6F736D] text-[17px] font-Gilroy mt-8">
                            {{ t('calc.calculatorDisclaimer') }}
                        </p>
                    </div>

                    <div class="lg:col-span-4 bg-mainWhite rounded-[20px] p-6 flex flex-col justify-center">
                        <div class="flex flex-col text-center items-center justify-between mb-6">
                            <div>
                                <p class="text-[#6F736D] mb-2 leading-tight"> {{ t('calc.monthlyPayment') }}</p>
                                <h3 class="text-[42px] font-bold leading-tight">{{ formatMoneyFixed(monthlyPayment) }}
                                    манат
                                </h3>
                            </div>
                            <div>
                                <p class="text-[#6F736D] mb-2 leading-tight"> {{ t('calc.rate') }}</p>
                                <h3 class="text-[42px] font-bold leading-tight">{{ credit?.interest || 0 }}%</h3>
                            </div>
                        </div>

                        <RouterLink to="/"
                            class="block mt-5 text-center text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[20px] py-3">
                            {{ t('btn.fillOutForm') }}
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
                <h2 class="text-[38px] font-bold mb-10 leading-9">
                    {{ t('pageTitle.usefulInformation') }}
                </h2>

                <div class="block p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <div class="text-[17px] description"
                        v-html="credit && credit.requirements_description ? credit.requirements_description : ''">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- News ===================================================================================== -->
    <NewsSection class="pb-[120px]" />

</template>



<style lang="scss" scoped>
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

    .card-bg-circle {
        display: block;
        position: absolute;
        width: 560px;
        height: 560px;
        left: 50%;
        transform: translateX(-50%);
        bottom: -362px;
        // background: #BB28ED;
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
