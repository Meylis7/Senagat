<script setup>
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'

    import greenBg from '@/assets/images/green_bg.png'



    const { t, tm } = useI18n()
    const route = useRoute()

    const breadcrumbItems = computed(() => {
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: t('cash.title') },
        ]
    })
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden bg-cover bg-center"
        :style="{ backgroundImage: `url(${greenBg})` }">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center flex-wrap gap-2 mb-10 md:mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems" linkClass="text-[17px] text-mainWhite/60"
                        currentClass="text-[17px] text-mainWhite" />
                </div>


                <h1
                    class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ t('cash.title') }}
                </h1>

                <p class="text-[17px] text-mainWhite/60 text-center">
                    {{ t('cash.subTitle') }}
                </p>


                <span class="block mt-[80px] md:mt-[125px] w-[210px] md:w-[300px] max-w-[390px] mx-auto relative z-10">
                    <img src="../../assets/images/services/services (12).png" class="block w-full h-full object-contain"
                        alt="card">
                </span>
            </div>
        </div>

        <!-- <span class="card-bg-circle"></span> -->
    </section>

    <!-- Useful information ============================================== -->
    <section class="py-[50px] pb-[80px] md:pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[20px] sm:text-[24px] md:text-[28px] font-bold mb-10 leading-tight">
                    {{ t('pageTitle.usefulInformation') }}
                </h2>

                <div class="block p-5 md:p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <h6 class="text-[20px] md:text-[24px] font-bold mb-6">
                        {{ t('cash.adv.adv_1.title') }}
                    </h6>
                    <p class="text-sm md:text-[17px] mb-2">
                        {{ t('cash.adv.adv_1.subtitle') }}
                    </p>
                    <p class="text-sm md:text-[17px] mb-2">
                        {{ t('cash.adv.adv_1.text') }}
                    </p>
                    <div>
                        <ul class="text-sm md:text-[17px] list-disc space-y-2 pl-0">
                            <li v-for="(line, i) in (tm('cash.adv.adv_1.list') || [])" :key="i"
                                class="py-[20px] border-solid border-0 border-b border-[#6F736D]">{{ line }}</li>
                        </ul>
                    </div>
                </div>

                <div class="block p-5 md:p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <h6 class="text-[20px] md:text-[24px] font-bold mb-6">
                        {{ t('cash.adv.adv_2.title') }}
                    </h6>
                    <p class="text-sm md:text-[17px] mb-2">
                        {{ t('cash.adv.adv_2.subtitle') }}
                    </p>
                    <p class="text-sm md:text-[17px] mb-2">
                        {{ t('cash.adv.adv_2.text') }}
                    </p>
                    <div>
                        <ul class="text-sm md:text-[17px] list-disc space-y-2 pl-0">
                            <li v-for="(line, i) in (tm('cash.adv.adv_2.list') || [])" :key="i"
                                class="py-[20px] border-solid border-0 border-b border-[#6F736D]">{{ line }}</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </section>

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
        background: #2C702C;
        filter: blur(137.15px);
        border-radius: 50%;
        z-index: 1;
    }
</style>