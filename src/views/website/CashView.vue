<script setup>
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'

    import NewsSection from '@/components/website/NewsSection.vue';


    const { t, tm } = useI18n()
    const route = useRoute()

    const breadcrumbItems = computed(() => {
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: t('nav.informations.title'), path: '/services' },
            { label: t('nav.informations.title') },
        ]
    })
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center gap-x-2 mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems"
                        linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] font-Gilroy text-mainWhite" />
                </div>


                <h1 class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-5xl font-bold">
                    {{ t('cash.title') }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ t('cash.subTitle') }}
                </p>


                <span class="block mt-[125px] w-full max-w-[390px] mx-auto relative z-10">
                    <img src="../../assets/images/cash.png" class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"></span>
    </section>

    <!-- Useful information ============================================== -->
    <section class="py-[50px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">
                    {{ t('pageTitle.usefulInformation') }}
                </h2>

                <div class="block p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <h6 class="col-span-6 text-[24px] font-bold mb-6">
                        {{ t('cash.adv.adv_1.title') }}
                    </h6>
                    <p class="col-span-6 text-[17px] font-Gilroy mb-2">
                        {{ t('cash.adv.adv_1.subtitle') }}
                    </p>
                    <p class="col-span-6 text-[17px] font-Gilroy mb-2">
                        {{ t('cash.adv.adv_1.text') }}
                    </p>
                    <div>
                        <ul class="text-[17px] font-Gilroy list-disc space-y-2 pl-0">
                            <li v-for="(line, i) in (tm('cash.adv.adv_1.list') || [])" :key="i"
                                class="py-[20px] border-solid border-0 border-b border-[#6F736D]">{{ line }}</li>
                        </ul>
                    </div>
                </div>

                <div class="block p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <h6 class="col-span-6 text-[24px] font-bold mb-6">
                        {{ t('cash.adv.adv_2.title') }}
                    </h6>
                    <p class="col-span-6 text-[17px] font-Gilroy mb-2">
                        {{ t('cash.adv.adv_2.subtitle') }}
                    </p>
                    <p class="col-span-6 text-[17px] font-Gilroy mb-2">
                        {{ t('cash.adv.adv_2.text') }}
                    </p>
                    <div>
                        <ul class="text-[17px] font-Gilroy list-disc space-y-2 pl-0">
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