<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import apiService from '@/services/apiService'

    import NewsSection from '@/components/website/NewsSection.vue';


    const { t, tm } = useI18n()
    const route = useRoute()

    const depositId = computed(() => route.params?.id || route.query?.id)
    const deposit = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const breadcrumbItems = computed(() => {
        const currentTitle = deposit.value?.title || ''
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: t('nav.informations.title'), path: '/services' },
            { label: t('nav.informations.bankGuarantees') },
        ]
    })

    const fetchDepositDetail = async () => {
        if (!depositId.value) return
        loading.value = true
        error.value = null
        try {
            const response = await apiService.get(`/v1/deposits/${depositId.value}`)
            const data = response?.data || response
            if (data && !Array.isArray(data)) {
                deposit.value = data
            } else {
                deposit.value = null
                error.value = 'Deposit not found'
            }
        } catch (e) {
            error.value = e.message || 'Failed to load deposit'
            deposit.value = null
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchDepositDetail()
    })


    const guaranteeAdvs = computed(() => {
        const obj = tm('guaranteees.adv') || {}
        return Object.values(obj)
    })

</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div
                    class="flex items-center flex-wrap justify-center text-center md:text-lef gap-2 mb-10 md:mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems"
                        linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] font-Gilroy text-mainWhite" />
                </div>


                <h1
                    class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ t('guaranteees.title') }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ t('yanardag.subTitle') }}
                </p>


                <span class="block mt-[80px] md:mt-[125px] w-[210px] md:w-[300px] max-w-[390px] mx-auto relative z-10">
                    <img src="../../assets/images/Guarantees.png" class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"
            :style="deposit?.background_color ? { background: deposit.background_color } : null"></span>
    </section>

    <!-- Info  ================================================ -->
    <section class="pt-[60px] md:pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-10 leading-tight">
                    {{ t('guaranteees.suptitle') }}
                </h2>

                <div v-for="(adv, idx) in guaranteeAdvs" :key="idx"
                    class="flex flex-col md:flex-row items-center justify-between gap-4 bg-mainWhite rounded-[20px] p-5 md:p-8 relative overflow-hidden  purple-glow mb-6">
                    <div class="block w-full md:max-w-[600px]">
                        <h6 class="text-[20px] md:text-[24px] text-mainBlack leading-7 font-bold mb-[10px]">
                            {{ adv.title || '' }}
                        </h6>
                        <p class="text-sm md:text-[17px] text-[#6F736D] leading-5 font-Gilroy max-w-[500px]">
                            {{ adv.description || '' }}
                        </p>
                    </div>

                    <span class="hidden md:block min-w-[310px] max-h-[220px]">
                        <img src="../../assets/images/GradientGlass.png" class="block max-h-full object-contain"
                            alt="card">
                    </span>
                </div>
            </div>
        </div>
    </section>

    <!-- News ===================================================================================== -->
    <NewsSection class="pb-[80px] md:pb-[120px]" />


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

    @media (max-width: 768px) {
        .purple-glow::after {
            display: none;
            content: none;
        }
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
