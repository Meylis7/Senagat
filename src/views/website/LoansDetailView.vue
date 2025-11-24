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

    const { t } = useI18n()
    const route = useRoute()
    const creditId = computed(() => route.params?.id || route.query?.id)
    const credit = ref(null)
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
        } catch (e) {
            error.value = e.message || 'Failed to load credit'
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


                <h1 class="m-auto max-w-[660px] text-mainWhite mb-[10px] text-center text-5xl font-bold">
                    {{ credit?.title || '' }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ credit?.description || '' }}
                </p>

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
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold leading-9 mb-8">
                    {{ t('pageTitle.depositApplication') }}
                </h2>

                <div class="grid lg:grid-cols-2 gap-6">
                    <div class="bg-mainWhite rounded-[20px] p-6">
                        <div class="mb-6">
                            <label class="block text-[#6F736D] text-[17px] mb-3">Сумма кредита</label>
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
                            <label class="block text-mainBlack font-bold mb-3">Срок</label>
                            <div class="flex flex-wrap gap-3">
                                <button v-for="term in termOptions" :key="term" type="button"
                                    @click="creditSelectedTerm = term"
                                    :class="creditSelectedTerm === term ? 'bg-mainBlack text-white' : 'bg-white text-[#6F736D]'"
                                    class="h-[48px] px-5 rounded-[12px]">{{ term }}</button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-mainWhite rounded-[20px] p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <p class="text-[#6F736D] mb-2">Ежемесячный платёж</p>
                                <h3 class="text-[42px] font-bold">1000 манат</h3>
                            </div>
                            <div>
                                <span
                                    class="inline-flex items-center justify-center h-[44px] w-[44px] rounded-[12px] bg-mainBlack text-white">1%</span>
                                <p class="text-[#6F736D] mt-2 text-center">Ставка</p>
                            </div>
                        </div>

                        <div class="bg-white rounded-[12px] p-4 mb-6">
                            <p class="text-mainBlack font-bold mb-2">Вам понадобится:</p>
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