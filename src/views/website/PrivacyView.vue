<script setup>
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'


    const { t, tm } = useI18n()
    const route = useRoute()

    const pageType = computed(() => String(route.query?.type || route.params?.type || 'bank').toLowerCase())
    const isPayment = computed(() => pageType.value === 'payment')

    const privacyTitle = computed(() => t(isPayment.value ? 'privacy.title_2' : 'privacy.title_1'))
    const privacySupTitle = computed(() => t(isPayment.value ? 'privacy.supTitle_2' : 'privacy.supTitle_1'))
    const privacySections = computed(() => {
        const arr = tm('privacy.desc')
        return Array.isArray(arr) ? arr : []
    })

    const breadcrumbItems = computed(() => ([
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('privacy.subTitle') },
    ]))
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center flex-wrap gap-2 mb-[60px] text-center">
                    <Breadcrumb :items="breadcrumbItems"
                        linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] font-Gilroy text-mainWhite" />
                </div>


                <h1
                    class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ privacyTitle }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ t('privacy.subTitle') }}
                </p>


                <span class="block mt-[80px] md:mt-[125px] w-[210px] md:w-[300px] max-w-[390px] mx-auto relative z-10">
                    <img src="../../assets/images/senagat-big.png" class="block w-full h-full object-contain"
                        alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"></span>
    </section>

    <!-- Information ============================================== -->
    <section class="py-[50px] pb-[80px] md:pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-10 leading-tight">
                    {{ privacySupTitle }}
                </h2>

                <div v-for="(section, idx) in privacySections" :key="idx" class="block mb-5 md:mb-10">
                    <h4 class="text-[#191B19] text-[18px] sm:text-[22px] md:text-[28px] font-bold mb-2 mb:mb-5">
                        {{ section.title }}
                    </h4>
                    <p v-if="section.text" class="text-[#6F736D] text-sm md:text-[17px] font-Gilroy mb-5"
                        v-html="section.text">
                    </p>
                    <ul v-if="Array.isArray(section.list)" class="list-outside">
                        <li v-for="(li, i) in section.list" :key="i" class="mb-5">
                            <p class="text-[#6F736D] text-sm md:text-[17px] font-Gilroy" v-html="li"></p>
                        </li>
                    </ul>
                    <p v-if="section.subText" class="text-[#6F736D] text-sm md:text-[17px] font-Gilroy mb-5"
                        v-html="section.subText"></p>
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

    ul {
        margin-bottom: 16px;

        li {
            padding-left: 30px;
            margin-bottom: 10px;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                top: 10px;
                left: 10px;
                width: 6px;
                height: 6px;
                transform: rotate(45deg);
                background-color: #2C702C;
                border-radius: 2px;
                display: block;
            }

            ul {
                margin-top: 16px;
            }
        }
    }
</style>
