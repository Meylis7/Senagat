<script setup>
    import Date from '@/components/dashboard/Date.vue'
    import { RouterLink } from 'vue-router';



</script>

<template>
    <section class="pb-10">
        <div class="auto_container">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-[28px] font-bold leading-9">
                    Сервисы
                </h2>

                <Date />
            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4">
                    <RouterLink :to="{ name: 'dashboard.loan-application' }"
                        class="block relative bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden">
                        <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                            Заявка на кредит
                        </h4>
                        <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                            На карте города
                        </p>

                        <span class="block h-[138px] absolute -right-4 top-1/2 -translate-y-1/2 z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/loan-cart.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-1"></span>
                    </RouterLink>
                </div>

                <div class=" col-span-4">
                    <RouterLink :to="{ name: 'dashboard.loan-application' }"
                        class="block relative bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden">
                        <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                            Получить справку
                        </h4>
                        <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                            На карте города
                        </p>

                        <span class="block h-[138px] absolute -right-4 top-1/2 -translate-y-1/2 z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/GradientGlass.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-2"></span>
                    </RouterLink>
                </div>

                <div class=" col-span-4">
                    <RouterLink :to="{ name: 'dashboard.loan-application' }"
                        class="block relative bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden">
                        <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                            Оформление карты
                        </h4>
                        <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                            На карте города
                        </p>

                        <span class="block h-[138px] absolute -right-4 top-1/2 -translate-y-1/2 z-[2]">
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
