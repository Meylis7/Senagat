<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import apiService from '@/services/apiService'
    import diamond1 from '@/assets/images/dimond-1.png'
    import diamond2 from '@/assets/images/dimond-2.png'
    import '@/assets/css/text.scss'

    import NewsSection from '@/components/website/NewsSection.vue';


    const { t } = useI18n()
    const route = useRoute()

    const transferId = computed(() => route.params?.id || route.query?.id)
    const transfer = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const breadcrumbItems = computed(() => {
        const currentTitle = transfer.value?.title || ''
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: currentTitle },
        ]
    })

    const fetchTransferDetail = async () => {
        if (!transferId.value) return
        loading.value = true
        error.value = null
        try {
            const response = await apiService.get(`/v1/money-transfers/${transferId.value}`)
            const data = response?.data || response
            if (data && !Array.isArray(data)) {
                transfer.value = data
            } else {
                transfer.value = null
                error.value = 'Transfer not found'
            }
        } catch (e) {
            error.value = e.message || 'Failed to load transfer'
            transfer.value = null
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchTransferDetail()
    })

    const diamondImages = [diamond1, diamond2]

    const advColSpan = computed(() => {
        const n = (transfer.value?.advantages || []).length
        return n === 2 ? 'col-span-12 md:col-span-6' : 'col-span-12 md:col-span-6 lg:col-span-4'
    })

</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center flex-wrap justify-center gap-2 mb-10 md:mb-[60px] text-center md:text-left">
                    <Breadcrumb :items="breadcrumbItems"
                        linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] font-Gilroy text-mainWhite" />
                </div>


                <h1 class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[28px] md:text-5xl font-bold">
                    {{ transfer?.title }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ transfer?.sub_title || '' }}
                </p>


                <span class="block mt-[125px] w-full w-[210px] md:w-[300px] max-w-[390px] mx-auto relative z-10">
                    <img :src="transfer?.image_url" class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"
            :style="transfer?.background_color ? { background: transfer.background_color } : null"></span>
    </section>

    <!-- Info  ================================================ -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="grid grid-cols-12 gap-4">
                    <div v-for="(adv, idx) in (transfer?.advantages || [])" :key="idx"
                        :class="[advColSpan, 'bg-mainWhite rounded-[20px] p-8 pb-0 flex flex-col justify-center']">
                        <h3 class="text-[20px] sm:text-[24px] md:text-[28px] font-bold mb-[10px] leading-tight">
                            {{ adv?.title || adv?.name || '' }}
                        </h3>
                        <p v-if="adv?.description" class="text-[15px] md:text-[17px] font-Gilroy text-[#6F736D]">
                            {{ adv?.description }}
                        </p>
                        <span class="block w-[160px] md:w-[230px] mx-auto mt-auto relative ">
                            <img :src="diamondImages[Math.floor(Math.random() * diamondImages.length)]" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Useful information ============================================== -->
    <section class="md:py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="text-sm md:text-[18px] mb-10 leading-9 description" v-html="transfer?.header_text || ''">
                </div>

                <h2 class="text-[22px] md:text-[28px] font-bold mb-10 leading-9 text-center">
                    {{ t('transfer.tableTitle') }}
                </h2>

                <div class="my-10" v-if="Array.isArray(transfer?.tariff_details) && transfer.tariff_details.length">
                    <div v-for="(detail, di) in transfer.tariff_details" :key="di" class="mb-8">
                        <h3 v-if="detail?.table_title" class="text-[17px] md:text-[20px] text-center mb-4 leading-tight">
                            {{ detail.table_title }}
                        </h3>
                        <div class="block overflow-auto w-full">
                            <table class="rounded-[20px] bg-mainWhite w-full text-center min-w-[550px]">
                                <thead>
                                    <tr>
                                        <th class="text-left pt-6 pb-4 px-4">#</th>
                                        <th class="text-left pt-6 pb-4 px-4"> {{ t('transfer.serviceType') }}</th>
                                        <th class="pb-4 px-4 pt-6"> {{ t('transfer.serviceCost') }}</th>
                                        <th class="pb-4 px-4 pt-6"> {{ t('transfer.vat') }}</th>
                                        <th class="pb-4 px-4 pt-6"> {{ t('transfer.totalPayment') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, ri) in (detail?.rows || [])" :key="ri"
                                        class="border-solid border-0 border-b border-[#cecece] last:border-0 px-4 shadow-sm hover:shadow-md transition tr-3d">
                                        <td class="text-left py-3 px-4">{{ ri + 1 }}</td>
                                        <td class="text-left py-3 px-4">{{ row?.service_type || '' }}</td>
                                        <td class="py-3 px-4">{{ row?.service_cost || '' }}</td>
                                        <td class="py-3 px-4">{{ row?.vat || '' }}</td>
                                        <td class="py-3 px-4">{{ row?.total_payment || '' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="text-sm md:text-[18px] mb-10 leading-tight description" v-html="transfer?.footer_text || ''">
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
        box-shadow: 0 4px 0 0 #cecece;
    }

    .tr-3d {
        transition: transform .2s ease, box-shadow .2s ease;
        transform-style: preserve-3d;
    }

    .tr-3d:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06);
    }
</style>
