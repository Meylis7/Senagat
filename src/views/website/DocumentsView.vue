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
            { label: t('docs.title') },
        ]
    })
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center flex-wrap justify-center gap-2 mb-[60px] text-center">
                    <Breadcrumb :items="breadcrumbItems" linkClass="text-[17px] text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] text-mainWhite" />
                </div>


                <h1
                    class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ t('docs.title') }}
                </h1>

                <p class="text-[17px] text-mainWhite/60 text-center">
                    {{ t('docs.supTitle') }}
                </p>


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
                <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-10 leading-tight">
                    {{ t('pageTitle.usefulInformation') }}
                </h2>

                <div v-for="(adv, idx) in (tm('docs.adv') ? Object.values(tm('docs.adv')) : [])" :key="idx"
                    class="block p-5 md:p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <h6 class="text-[20px] md:text-[24px] font-bold mb-6">
                        {{ adv.title || '' }}
                    </h6>
                    <p v-if="adv.subtitle" class="text-sm md:text-[17px] mb-2">
                        {{ adv.subtitle }}
                    </p>
                    <p v-if="adv.text" class="text-sm md:text-[17px] mb-2" v-html="adv.text"></p>
                    <div v-if="Array.isArray(adv.list) && adv.list.length">
                        <ul class="text-sm md:text-[17px] list-disc space-y-2 pl-0">
                            <li v-for="(line, i) in adv.list" :key="i"
                                class="py-[10px] md:py-[20px] border-solid border-0 border-b border-[#6F736D]">{{ line
                                }}</li>
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
