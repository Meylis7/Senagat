<script setup>
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();


    import CurrentDate from '@/components/dashboard/Date.vue'
    import { RouterLink } from 'vue-router';



</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
                <h2 class="text-[22px] sm:text-[28px] font-bold leading-9">
                    {{ t('dashboard.PageTitles.services') }}
                </h2>

                <CurrentDate />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div class="block">
                    <RouterLink :to="{ name: 'dashboard.loan-application' }"
                        class="flex justify-between flex-col sm:flex-row relative gap-2 bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden">
                        <div class="block">
                            <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                                {{ t('dashboard.services.loanApplication') }}
                            </h4>
                            <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                                {{ t('dashboard.services.online') }}
                            </p>
                        </div>

                        <span class="block h-[138px] ml-auto relative sm:-right-[30px] z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/loan-cart.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-1"></span>
                    </RouterLink>
                </div>

                <div class="block">
                    <RouterLink :to="{ name: 'dashboard.certificate-application' }"
                        class="flex justify-between flex-col sm:flex-row relative gap-2 bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden">
                        <div class="block">
                            <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                                {{ t('dashboard.services.getCertificate') }}
                            </h4>
                            <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                                {{ t('dashboard.services.fastAndEasy') }}
                            </p>
                        </div>

                        <span class="block h-[138px] ml-auto relative sm:-right-[30px] z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/GradientGlass.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-2"></span>
                    </RouterLink>
                </div>

                <div class="block">
                    <RouterLink :to="{ name: 'dashboard.cards' }"
                        class="flex justify-between flex-col sm:flex-row relative gap-2 bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden">
                        <div class="block">
                            <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                                {{ t('dashboard.services.cardIssuance') }}
                            </h4>
                            <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                                {{ t('dashboard.services.inFewSteps') }}
                            </p>
                        </div>

                        <span class="block h-[138px] ml-auto relative sm:-right-[30px] z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/card-1.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-1"></span>
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>

    .bg-circle {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        filter: blur(137.15px);
        /* z-index: 1; */
        right: -190px;
        top: -38px;
    }

    .circle-1 {
        background: #28ED2E;
    }

    .circle-2 {
        background: #BB28ED;
    }

</style>
