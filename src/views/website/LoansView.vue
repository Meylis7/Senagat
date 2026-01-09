<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { ref, computed, onMounted, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    import apiService from '@/services/apiService';
    import NewsSection from '@/components/website/NewsSection.vue';
    import Breadcrumb from '@/components/website/Breadcrumb.vue';
    import imgLens from '@/assets/images/lense.png'


    const { t, tm } = useI18n()

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('tabs.credits') },
    ];

    const route = useRoute()
    const credits = ref([])
    const creditsLoading = ref(false)
    const creditsError = ref(null)

    const fetchCredits = async () => {
        creditsLoading.value = true
        creditsError.value = null
        try {
            const response = await apiService.fetchCreditTypes()
            if (response?.success && Array.isArray(response?.data)) {
                const raw = String(route.query?.category || '').toLowerCase()
                const category = raw === 'legal_entity' ? 'legal_entity' : 'individual'
                credits.value = (response.data || []).filter((it) => String(it.category) === category)
            } else if (Array.isArray(response)) {
                const raw = String(route.query?.category || '').toLowerCase()
                const category = raw === 'legal_entity' ? 'legal_entity' : 'individual'
                credits.value = (response || []).filter((it) => String(it.category) === category)
            } else if (Array.isArray(response?.data)) {
                const raw = String(route.query?.category || '').toLowerCase()
                const category = raw === 'legal_entity' ? 'legal_entity' : 'individual'
                credits.value = (response.data || []).filter((it) => String(it.category) === category)
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

    onMounted(() => {
        fetchCredits();
    });
    // Refetch when category changes via query
    watch(() => route.fullPath, () => {
        fetchCredits()
    })
</script>

<template>
    <!-- Breadcrumb ============================================= -->
    <section class="crumb pt-[110px] md:pt-[145px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center gap-2">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>
            </div>
        </div>
    </section>

    <!-- Loans =================================================== -->
    <section class="pt-[40px] md:pt-[60px] md:pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-5 md:mb-10 leading-9">
                    {{ t('tabs.credits') }}
                </h2>

                <div class="block space-y-4">
                    <div v-for="(credit, ci) in credits" :key="credit.id"
                        class="flex md:items-center justify-between flex-col-reverse md:flex-row bg-mainWhite rounded-[20px] p-2 md:p-8 relative overflow-hidden">
                        <div class="block p-5 px-4 md:p-0">
                            <h4 class="md:text-[28px] font-bold text-mainBlack mb-5 leading-7">
                                {{ credit?.title || '' }}
                            </h4>
                            <div class="flex items-center flex-wrap max-w-[560px] gap-[10px] mb-5 md:mb-[60px]">
                                <p v-if="credit?.term_text"
                                    class="text-sm md:text-[17px] font-Gilroy text-[#2C702C] p-3 rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    {{ credit.term_text }}
                                </p>
                                <p v-if="credit?.amount_text"
                                    class="text-sm md:text-[17px] font-Gilroy text-[#2C702C] p-3 rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    {{ credit.amount_text }}
                                </p>
                            </div>

                            <RouterLink :to="`/loans-detail?id=${credit.id}`"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                {{ t('btn.learnMore') }}
                            </RouterLink>
                        </div>

                        <span
                            class="block w-full min-w-[190px] h-[165px] md:max-w-[225px] relative z-10 bg-[#EEF2ED] md:bg-transparent rounded-2xl md:rounded-none overflow-hidden">
                            <img class="block w-full h-full object-contain relative top-[23px] md:top-0"
                                :src="credit?.image_url" alt="card-image">
                        </span>

                        <span class="loan-bg-circle hidden md:block"
                            :class="credit?.background_class || 'loan-bg-yellow'"
                            :style="credit?.background_color ? { background: credit.background_color } : null"></span>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- Loans info ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-5 md:mb-10 leading-9">
                    {{ t('pageTitle.howToGetCard') }}
                </h2>

                <div class="grid grid-cols-12 gap-4">
                    <template v-for="(step, idx) in tm('getCard') || []" :key="idx">
                        <div
                            :class="idx === 2 ? 'col-span-12 mm:col-span-6 bg-mainBlack rounded-[20px] p-8 relative overflow-hidden ellipse' : 'col-span-12 mm:col-span-3 bg-mainWhite rounded-[20px] p-8'">
                            <h6
                                :class="idx === 2 ? 'text-[60px] lg:text-[80px] text-mainWhite font-bold leading-none mb-8' : 'text-[60px] lg:text-[80px] font-bold leading-none mb-8'">
                                {{ idx + 1 }}</h6>
                            <h4
                                :class="idx === 2 ? 'text-[17px] lg:text-[28px] text-mainWhite font-bold mb-[10px] leading-8 z-10' : 'text-[20px] lg:text-[28px] font-bold mb-[10px] leading-8'">
                                {{ step.title }}
                            </h4>
                            <p
                                :class="idx === 2 ? 'text-mainWhite/60 font-Gilroy text-sm lg:text-[17px] leading-6 z-10' : 'text-[#6F736D] font-Gilroy text-[17px] leading-6'">
                                {{ step.text }}
                            </p>
                            <span v-if="idx === 2"
                                class="block w-[140px] sm:w-[180px] md:w-[220px] absolute top-0 right-[15px] md:right-[31px] z-[1]">
                                <img class="block w-full h-full object-contain" :src="imgLens" alt="card-image">
                            </span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </section>

    <!-- News ==================================================== -->
    <NewsSection class="pb-[80px] md:pb-[120px]" />

</template>



<style lang="scss" scoped>
    .ellipse::after {
        content: "";
        position: absolute;
        width: 250px;
        height: 250px;
        right: -125px;
        top: -125px;
        background: #2C702C;
        filter: blur(53.5px);
        border-radius: 9999px;
        z-index: 2;
    }

    /* Loan background circles */
    .loan-bg-circle {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        filter: blur(137.15px);
        z-index: 1;
        right: -150px;
        top: -10px;
    }

    /* Yellow background for young families */
    .loan-bg-yellow {
        background: #EDC928;
    }

    /* Green background for consumer */
    .loan-bg-green {
        background: #28ED2E;
    }

    /* Blue background for wedding */
    .loan-bg-blue {
        background: #28B8ED;
    }

    /* Purple background for education */
    .loan-bg-purple {
        background: #BB28ED;
    }

    /* Orange background for overdraft */
    .loan-bg-orange {
        background: #ED6328;
    }

    /* Yellow background for agriculture (slightly different shade) */
    .loan-bg-yellow-2 {
        background: #EDED28;
    }
</style>
