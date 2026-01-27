<script setup>
    import { useI18n } from 'vue-i18n';
    import { computed, ref, onMounted } from 'vue';
    import { useUserStore } from '@/stores/userStore';
    import apiService from '@/services/apiService';
    const { t } = useI18n();


    import CurrentDate from '@/components/dashboard/Date.vue';

    // Get current month index (0-11)
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();

    // Get expenses title with translated month
    const expensesTitle = computed(() => {
        const monthName = t(`date.months.${monthIndex}`);
        return t('expensesFor', { month: monthName });
    });

    const payments = ref([]);
    const userStore = useUserStore();
    const getAuthToken = () =>
        userStore.authToken ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        '';
    const statusLabel = (s) => {
        const v = String(s || '').toLowerCase();
        if (['approve', 'confirmed', 'success', 'proceed', 'processed'].includes(v)) return t('dashboard.status.success');
        if (['rejected', 'failed', 'canceled'].includes(v)) return t('dashboard.status.rejected');
        if (['pending'].includes(v)) return t('dashboard.status.pending');
        if (['notconfirmed'].includes(v)) return t('dashboard.status.notConfirmed');
        return t('dashboard.status.notConfirmed');
    };
    const statusTextClass = (s) => {
        const v = String(s || '').toLowerCase();
        if (['approve', 'confirmed', 'success', 'proceed', 'processed'].includes(v)) return 'text-[#2C702C]';
        if (['rejected', 'failed', 'canceled'].includes(v)) return 'text-[#F44336]';
        if (['pending'].includes(v)) return 'text-[#EBB618]';
        if (['notconfirmed'].includes(v)) return 'text-[#6F736D]';
        return 'text-[#6F736D]';
    };
    const statusBgClass = (s) => {
        const v = String(s || '').toLowerCase();
        if (['approve', 'confirmed', 'success', 'proceed', 'processed'].includes(v)) return 'bg-[#2C702C]/10';
        if (['rejected', 'failed', 'canceled'].includes(v)) return 'bg-[#F44336]/10';
        if (['pending'].includes(v)) return 'bg-[#EBB618]/10';
        if (['notconfirmed'].includes(v)) return 'bg-[#6F736D]/10';
        return 'bg-[#6F736D]/10';
    };

    // Pagination
    const pageSize = 20;
    const currentPage = ref(1);
    const totalPages = computed(() => {
        const len = Array.isArray(payments.value) ? payments.value.length : 0;
        return Math.max(1, Math.ceil(len / pageSize));
    });
    const pagedPayments = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        const end = start + pageSize;
        return (payments.value || []).slice(start, end);
    });
    const goToPage = (p) => {
        const target = Math.min(Math.max(1, Number(p) || 1), totalPages.value);
        currentPage.value = target;
    };
    const prevPage = () => { goToPage(currentPage.value - 1); };
    const nextPage = () => { goToPage(currentPage.value + 1); };
    // end

    const loadPayments = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                payments.value = [];
                return;
            }
            const res = await apiService.fetchPaymentHistoryAuth(token);
            const list = res?.data?.items || res?.items || res?.data || res || [];
            const arr = Array.isArray(list) ? list : [];
            payments.value = arr.map((it) => ({
                id: it.id,
                title: it.type,
                date: it.created_at,
                amount: it.amount,
                status: it.status,
                description: it?.payment_target?.type
                    ? `${it.payment_target.value}`
                    : `${it.value}`,
            }));
        } catch (e) {
            payments.value = [];
        }
    };
    onMounted(() => {
        loadPayments();
    });
</script>

<template>
    <section class="pb-10">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
                    <h2 class="text-[22px] sm:text-[28px] font-bold leading-9">
                        {{ t('dashboard.PageTitles.history') }}
                    </h2>

                    <CurrentDate />
                </div>


                <div class="block p-3 mm:p-[22px] rounded-[20px] bg-mainWhite">
                    <div v-if="!payments.length" class="py-8 text-center">
                        <p class="text-sm sm:text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                            {{ t('dashboard.noPaymentsYet') }}
                        </p>
                    </div>

                    <div v-else>
                        <div class="rounded-[12px] border border-[#EEF2ED] overflow-hidden">
                            <!-- <div
                                class="hidden sm:grid grid-cols-5 gap-2 bg-[#EEF2ED]/60 text-[#6F736D] px-3 py-3 font-bold text-center">
                              
                                <div class="block">
                                    {{ t('dashboard.payment.title') }}
                                </div>
                                <div class="block">
                                    {{ t('dashboard.payment.amount') }}
                                </div>
                                <div class="block">
                                    {{ t('dashboard.payment.date') }}
                                </div>
                                <div class="block">
                                    {{ t('dashboard.payment.description') }}
                                </div> 
                                 <div class="block">
                                    {{ t('dashboard.payment.status') }}
                                </div>
                            </div> -->

                            <div v-for="payment in pagedPayments" :key="payment.id"
                                class="flex flex-wrap justify-center sm:grid grid-cols-5 gap-4 sm:gap-2 px-3 py-3 border-solid border-0 border-b border-[#EEF2ED] last:border-b-0 text-center transition-all hover:bg-[#EEF2ED]/90 hover:shadow-sm duration-300 rounded-md">


                                <div class="flex justify-center text-center w-[calc(50%-20px)] sm:w-full">
                                    <p
                                        class="text-sm sm:text-[15px] font-bold leading-5 text-mainBlack capitalize font-Gilroy">
                                        {{ payment.title }}
                                    </p>
                                </div>

                                <div class="flex justify-center text-center w-[calc(50%-20px)] sm:w-full">
                                    <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                        {{ payment.amount }} TMT
                                    </p>
                                </div>

                                <div class="flex justify-center text-center w-[calc(50%-20px)] sm:w-full">
                                    <p class="text-sm sm:text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        {{ payment.date }}
                                    </p>
                                </div>

                                <div class="flex justify-center text-center w-[calc(50%-20px)] sm:w-full">
                                    <p class="text-sm sm:text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        {{ payment.description }}
                                    </p>
                                </div>
                                <div
                                    :class="['px-2 py-2 sm:py-1 rounded-[8px] text-xs sm:text-[13px] font-bold w-full', statusTextClass(payment.status), statusBgClass(payment.status)]">
                                    {{ statusLabel(payment.status) }}
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-center gap-2 mt-4">
                            <button type="button" @click="prevPage"
                                :class="['px-3 py-2 rounded-[8px] bg-[#EEF2ED] text-[#6F736D] transition min-w-[40px]', currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2C702C]/20']"
                                :disabled="currentPage === 1">
                                ‹
                            </button>
                            <button v-for="p in totalPages" :key="p" type="button" @click="goToPage(p)"
                                class="px-3 py-2 rounded-[8px] transition min-w-[40px] block"
                                :class="p === currentPage ? 'bg-[#2C702C] text-white' : 'bg-[#EEF2ED] text-[#6F736D] hover:bg-[#2C702C]/20'">
                                {{ p }}
                            </button>
                            <button type="button" @click="nextPage"
                                :class="['px-3 py-2 rounded-[8px] bg-[#EEF2ED] text-[#6F736D] transition min-w-[40px]', currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2C702C]/20']"
                                :disabled="currentPage === totalPages">
                                ›
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>
