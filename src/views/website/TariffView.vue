<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import CustomDropdown from '@/components/dashboard/CustomDropdown.vue'
    import apiService from '@/services/apiService'
    import '@/assets/css/text.scss'



    const { t } = useI18n()

    const tariffOptions = ref([])
    const tariffsLoading = ref(false)
    const tariffsError = ref(null)
    const tariffsData = ref([])
    const selectedLoan = ref(t('tariff.all'))
    const handleOptionSelected = (option) => { selectedLoan.value = option }

    const selectedGroup = computed(() => {
        const arr = Array.isArray(tariffsData.value) ? tariffsData.value : []
        if (arr.length === 0) return null
        if (selectedLoan.value && selectedLoan.value !== t('tariff.all')) {
            const found = arr.find((g) => g?.title === selectedLoan.value)
            if (found) return found
        }
        return arr[0]
    })

    const groupTitle = computed(() => selectedGroup.value?.title || '')
    const groupId = computed(() => selectedGroup.value?.id || '')

    const tariffTables = computed(() => {
        const group = selectedGroup.value
        const items = Array.isArray(group?.items) ? group.items : []
        const out = []
        for (const it of items) {
            const subItems = Array.isArray(it?.items) ? it.items : []
            const rows = []
            let numberPrinted = false
            for (const sub of subItems) {
                const fees = Array.isArray(sub?.fees) ? sub.fees : []
                if (fees.length === 0) {
                    rows.push({
                        number: numberPrinted ? '' : (it?.number || ''),
                        service_type: sub?.sub_title || '',
                        service_cost: '',
                        vat: '',
                        total_payment: '',
                    })
                    numberPrinted = true
                } else {
                    for (const f of fees) {
                        rows.push({
                            number: numberPrinted ? '' : (it?.number || ''),
                            service_type: sub?.sub_title || '',
                            service_cost: f?.price || '',
                            vat: f?.gbss_fee || '',
                            total_payment: f?.total_fee || '',
                        })
                        numberPrinted = true
                    }
                }
            }
            out.push({ table_title: it?.title || '', rows })
        }
        return out
    })

    const groupsTables = computed(() => {
        const groups = Array.isArray(tariffsData.value) ? tariffsData.value : []
        const filteredGroups = selectedLoan.value && selectedLoan.value !== t('tariff.all')
            ? groups.filter((g) => g?.title === selectedLoan.value)
            : groups
        return filteredGroups.map((grp) => {
            const items = Array.isArray(grp?.items) ? grp.items : []
            const details = []
            for (const it of items) {
                const subItems = Array.isArray(it?.items) ? it.items : []
                const rows = []
                let numberPrinted = false
                for (const sub of subItems) {
                    const fees = Array.isArray(sub?.fees) ? sub.fees : []
                    if (fees.length === 0) {
                        rows.push({
                            number: numberPrinted ? '' : (it?.number || ''),
                            service_type: sub?.sub_title || '',
                            service_cost: '',
                            vat: '',
                            total_payment: '',
                        })
                        numberPrinted = true
                    } else {
                        for (const f of fees) {
                            rows.push({
                                number: numberPrinted ? '' : (it?.number || ''),
                                service_type: sub?.sub_title || '',
                                service_cost: f?.price || '',
                                vat: f?.gbss_fee || '',
                                total_payment: f?.total_fee || '',
                            })
                            numberPrinted = true
                        }
                    }
                }
                details.push({ table_title: it?.title || '', rows })
            }
            return { id: grp?.id || '', title: grp?.title || '', details }
        })
    })

    const breadcrumbItems = computed(() => {
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: t('tariff.title') },
        ]
    })

    const fetchTariffs = async () => {
        tariffsLoading.value = true
        tariffsError.value = null
        try {
            const res = await apiService.fetchTariffs()
            const list = res?.data || res
            const arr = Array.isArray(list) ? list : []
            tariffsData.value = arr
            tariffOptions.value = [t('tariff.all'), ...arr.map((grp) => grp?.title).filter(Boolean)]
        } catch (e) {
            tariffsError.value = e.message || 'Failed to load tariffs'
            tariffOptions.value = [t('tariff.all')]
        } finally {
            tariffsLoading.value = false
        }
    }

    onMounted(() => {
        fetchTariffs()
    })

</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] md:pb-[60px] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex flex-wrap text-center items-center justify-center gap-2 mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>


                <h1 class="m-auto max-w-[660px] mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ t('tariff.title') }}
                </h1>

                <p class="text-[17px] font-Gilroy text-[#6F736D] text-center">
                    {{ t('tariff.subTitle') }}
                </p>
            </div>
        </div>
    </section>

    <!-- Useful information ============================================== -->
    <section class="py-[50px] pb-[80px] md:pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between flex-col mm:flex-row gap-6">
                    <div class="block w-full mm:w-auto">
                        <h4 class="text-[15px] mb-2 text-mainBlack font-bold font-Gilroy max-w-[80%] truncate">
                            {{ t('tariff.section') }}
                        </h4>
                        <CustomDropdown :options="tariffOptions" :placeholder="t('tariff.all')" class="tariff-dd"
                            menu-class="max-h-[400px] overflow-auto absolute !min-w-full mm:min-w-[450px] !bg-mainWhite shadow"
                            title-class="!bg-mainWhite mm:min-w-[500px]" @option-selected="handleOptionSelected" />
                    </div>

                    <a href="../../assets/doc/Nyrhanama.pdf" download target="_blank" rel="noopener"
                        class="flex items-center gap-1">
                        <div class="w-8 block mr-2">
                            <svg class="w-full h-full object-contain" width="23" height="24" viewBox="0 0 23 24"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M23 16C23 16.2652 22.8946 16.5196 22.7071 16.7071C22.5196 16.8946 22.2652 17 22 17H19V19H21C21.2652 19 21.5196 19.1054 21.7071 19.2929C21.8946 19.4804 22 19.7348 22 20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H19V23C19 23.2652 18.8946 23.5196 18.7071 23.7071C18.5196 23.8946 18.2652 24 18 24C17.7348 24 17.4804 23.8946 17.2929 23.7071C17.1054 23.5196 17 23.2652 17 23V16C17 15.7348 17.1054 15.4804 17.2929 15.2929C17.4804 15.1054 17.7348 15 18 15H22C22.2652 15 22.5196 15.1054 22.7071 15.2929C22.8946 15.4804 23 15.7348 23 16ZM6.5 18.5C6.5 19.4283 6.13125 20.3185 5.47487 20.9749C4.8185 21.6313 3.92826 22 3 22H2V23C2 23.2652 1.89464 23.5196 1.70711 23.7071C1.51957 23.8946 1.26522 24 1 24C0.734784 24 0.48043 23.8946 0.292893 23.7071C0.105357 23.5196 0 23.2652 0 23V16C0 15.7348 0.105357 15.4804 0.292893 15.2929C0.48043 15.1054 0.734784 15 1 15H3C3.92826 15 4.8185 15.3687 5.47487 16.0251C6.13125 16.6815 6.5 17.5717 6.5 18.5ZM4.5 18.5C4.5 18.1022 4.34196 17.7206 4.06066 17.4393C3.77936 17.158 3.39782 17 3 17H2V20H3C3.39782 20 3.77936 19.842 4.06066 19.5607C4.34196 19.2794 4.5 18.8978 4.5 18.5ZM15.5 19.5C15.5 20.6935 15.0259 21.8381 14.182 22.682C13.3381 23.5259 12.1935 24 11 24H9C8.73478 24 8.48043 23.8946 8.29289 23.7071C8.10536 23.5196 8 23.2652 8 23V16C8 15.7348 8.10536 15.4804 8.29289 15.2929C8.48043 15.1054 8.73478 15 9 15H11C12.1935 15 13.3381 15.4741 14.182 16.318C15.0259 17.1619 15.5 18.3065 15.5 19.5ZM13.5 19.5C13.5 18.837 13.2366 18.2011 12.7678 17.7322C12.2989 17.2634 11.663 17 11 17H10V22H11C11.663 22 12.2989 21.7366 12.7678 21.2678C13.2366 20.7989 13.5 20.163 13.5 19.5ZM0 11V2C0 1.46957 0.210714 0.960859 0.585786 0.585787C0.960859 0.210714 1.46957 3.09198e-07 2 3.09198e-07H14C14.1314 -0.000102986 14.2615 0.0256758 14.3829 0.0758639C14.5042 0.126052 14.6146 0.199666 14.7075 0.2925L21.7075 7.2925C21.8003 7.38544 21.8739 7.49576 21.9241 7.61715C21.9743 7.73855 22.0001 7.86864 22 8V11C22 11.2652 21.8946 11.5196 21.7071 11.7071C21.5196 11.8946 21.2652 12 21 12C20.7348 12 20.4804 11.8946 20.2929 11.7071C20.1054 11.5196 20 11.2652 20 11V9H14C13.7348 9 13.4804 8.89464 13.2929 8.70711C13.1054 8.51957 13 8.26522 13 8V2H2V11C2 11.2652 1.89464 11.5196 1.70711 11.7071C1.51957 11.8946 1.26522 12 1 12C0.734784 12 0.48043 11.8946 0.292893 11.7071C0.105357 11.5196 0 11.2652 0 11ZM15 7H18.5863L15 3.41375V7Z"
                                    fill="#CC1717" />
                            </svg>
                        </div>

                        <h6 class="text-[17px] font-bold text-[#1D2417] underline leading-5">
                            {{ t('tariff.tariffList') }}
                        </h6>
                    </a>
                </div>

                <div class="my-10 overflow-auto" v-if="Array.isArray(tariffTables) && tariffTables.length">
                    <table class="rounded-[20px] w-full text-center min-w-[550px]">
                        <thead>
                            <tr class="bg-mainWhite">
                                <th class="text-left pt-6 pb-4 px-4">#</th>
                                <th class="text-left pt-6 pb-4 px-4"> {{ t('transfer.serviceType') }}</th>
                                <th class="pb-4 px-4 pt-6"> {{ t('transfer.serviceCost') }}</th>
                                <th class="pb-4 px-4 pt-6"> {{ t('transfer.vat') }}</th>
                                <th class="pb-4 px-4 pt-6"> {{ t('transfer.totalPayment') }}</th>
                            </tr>
                            <tr>
                                <td colspan="5" class="h-[20px]"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(grp, gi) in groupsTables" :key="`g-${gi}`">
                                <tr class="bg-[#2C702C] text-mainWhite rounded-lg overflow-hidden">
                                    <td class="text-left p-5 font-bold rounded-tl-lg rounded-bl-lg">{{ grp.id }}</td>
                                    <td colspan="4" class="text-left p-5 font-bold rounded-tr-lg rounded-br-lg">{{
                                        grp.title }}</td>
                                </tr>

                                <template v-for="(detail, di) in grp.details" :key="`d-${gi}-${di}`">
                                    <tr v-if="di > 0">
                                        <td colspan="5" class="h-[20px]"></td>
                                    </tr>
                                    <tr v-if="detail?.table_title">
                                        <td colspan="2" class="text-left p-5 font-bold">{{ detail.table_title }}</td>
                                        <td colspan="3"></td>
                                    </tr>
                                    <tr v-for="(row, ri) in (detail?.rows || [])" :key="`r-${gi}-${di}-${ri}`"
                                        :class="['border-solid border-0', ri === (detail.rows.length - 1) ? '' : 'border-b border-[#cecece]', 'bg-mainWhite overflow-hidden']">

                                        <td
                                            :class="['text-left p-5', ri === 0 ? 'rounded-tl-lg' : '', ri === (detail.rows.length - 1) ? 'rounded-bl-lg' : '']">
                                            {{ row?.number || '' }}</td>
                                        <td class="text-left p-5">{{ row?.service_type || '' }}</td>
                                        <td class="p-5">{{ row?.service_cost || '' }}</td>
                                        <td class="p-5">{{ row?.vat || '' }}</td>
                                        <td
                                            :class="['p-5', ri === 0 ? 'rounded-tr-lg' : '', ri === (detail.rows.length - 1) ? 'rounded-br-lg' : '']">
                                            {{ row?.total_payment || '' }}</td>
                                    </tr>
                                </template>
                                <tr>
                                    <td colspan="5" class="h-[20px]"></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </section>




</template>



<style lang="scss" scoped>
    :deep(.tariff-dd .bg\[\#EEF2ED\]) {
        background: #ffffff !important;
    }

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
</style>
