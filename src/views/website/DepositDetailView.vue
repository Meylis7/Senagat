<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import apiService from '@/services/apiService'
    import diamond1 from '@/assets/images/dimond-1.png'
    import diamond2 from '@/assets/images/dimond-2.png'

    import NewsSection from '@/components/website/NewsSection.vue';


    const { t } = useI18n()
    const route = useRoute()

    const depositId = computed(() => route.params?.id || route.query?.id)
    const deposit = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const breadcrumbItems = computed(() => {
        const currentTitle = deposit.value?.title || ''
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.deposits'), path: '/deposits' },
            { label: currentTitle },
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

    const diamondImages = [diamond1, diamond2]

    const advColSpan = computed(() => {
        const n = (deposit.value?.advantages || []).length
        return n === 2 ? 'col-span-6' : 'col-span-4'
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
                    {{ deposit?.title }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ deposit?.description }}
                </p>


                <span class="block mt-[125px] w-full max-w-[390px] mx-auto relative z-10">
                    <img :src="deposit?.image_url || '../../assets/images/deposit-6.png'"
                        class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"
            :style="deposit?.background_color ? { background: deposit.background_color } : null"></span>
    </section>

    <!-- Info  ================================================ -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="grid grid-cols-12 gap-x-4">
                    <div v-for="(adv, idx) in (deposit?.advantages || [])" :key="idx"
                        :class="[advColSpan, 'bg-mainWhite rounded-[20px] p-8 pb-0 flex flex-col justify-center']">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            {{ adv?.name || '' }}
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D] ">
                            {{ adv?.description || '' }}
                        </p>
                        <span class="block w-[230px] mx-auto mt-auto relative ">
                            <img :src="diamondImages[Math.floor(Math.random() * diamondImages.length)]" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
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
                    <div v-for="(adv, i) in (deposit?.details || [])" :key="i">
                        <div class="py-[20px] border-solid border-0 border-b border-[#6F736D]">
                            <p class=" text-[17px] font-Gilroy">
                                {{ adv?.description }}
                            </p>
                        </div>
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
        // background: #EDC928;
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