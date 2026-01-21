<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import apiService from '@/services/apiService'

    import NewsSection from '@/components/website/NewsSection.vue';


    const { t, tm } = useI18n()

    const breadcrumbItems = computed(() => {
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: t('bankService.title') },
        ]
    })

    const bankServiceItems = computed(() => {
        const items = tm('bankService.list')
        return Array.isArray(items) ? items : []
    })

</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center flex-wrap text-center gap-2 mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems" linkClass="text-[17px] text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] text-mainWhite" />
                </div>


                <h1
                    class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ t('bankService.title') }}
                </h1>

                <!-- <p class="text-[17px] text-mainWhite/60 text-center">
                    {{ t('yanardag.subTitle') }}
                </p> -->


                <span class="block mt-[80px] md:mt-[125px] w-[210px] md:w-[300px] max-w-[390px] mx-auto relative z-10">
                    <img src="../../assets/images/GradientGlass.png" class="block w-full h-full object-contain"
                        alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"></span>
    </section>

    <!-- Useful information ============================================== -->
    <section class="py-[50px] pb-[80px] md:pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="block">
                    <h2
                        class="text-[22px] md:text-[28px] lg:text-[38px] text-center sm:text-left font-bold mb-7 md:mb-10 leading-9">
                        {{
                            t('bankService.subTitle') }}</h2>

                    <h6 class="col-span-6 text-[18px] text-center sm:text-left md:text-[24px] font-bold mb-6">
                        {{ t('bankService.text') }}
                    </h6>

                    <div class="grid gap-4 grid-cols-12">
                        <div v-for="(item, idx) in bankServiceItems" :key="idx"
                            class="col-span-12 md:col-span-6 lg:col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[17px] md:text-[22px] text-mainBlack leading-7 font-bold mb-[10px]">
                                {{ item.title }}
                            </h6>
                            <p v-if="item.text"
                                class="text-sm md:text-[16px] text-[#6F736D] leading-tight mb-1 font-Gilroy">
                                {{ item.text }}
                            </p>
                            <div v-else-if="Array.isArray(item.list)"
                                class="text-sm md:text-[17px] text-[#6F736D] leading-tight font-Gilroy">
                                <span v-for="(sub, sidx) in item.list" :key="sidx"
                                    class="relative block mb-2 pl-3 after:content-[''] after:absolute after:top-[7px] after:left-[0px] after:w-[6px] after:h-[6px] after:rotate-45 after:bg-[#6F736D] after:rounded-[2px] after:block">{{
                                        sub }}</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </section>

</template>



<style lang="scss" scoped>
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

    .card-bg-circle {
        display: block;
        position: absolute;
        width: 560px;
        height: 560px;
        left: 50%;
        transform: translateX(-50%);
        bottom: -362px;
        background: #2C702C;
        filter: blur(137.15px);
        border-radius: 50%;
        z-index: 1;
    }
</style>
