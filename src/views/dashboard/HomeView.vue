<script setup>
    import CurrentDate from '@/components/dashboard/Date.vue';
    import { useI18n } from 'vue-i18n';
    import { computed, ref, onMounted, watch } from 'vue';
    import { useUserStore } from '@/stores/userStore';
    import apiService from '@/services/apiService';
    const { t, locale } = useI18n();

    // Get current month index (0-11)
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();

    // Get expenses title with translated month
    const expensesTitle = computed(() => {
        const monthName = t(`date.months.${monthIndex}`);
        return t('expensesFor', { month: monthName });
    });

    const payments = ref([]);
    const paymentsLimited = computed(() => payments.value.slice(0, 5));
    const cards = ref([]);
    const loans = ref([]);
    const certificates = ref([]);
    const cardsLoading = ref(false);
    const loansLoading = ref(false);
    const certificatesLoading = ref(false);
    const firstCard = computed(() =>
        cards.value.length ? cards.value[cards.value.length - 1] : null
    );
    const firstLoan = computed(() =>
        loans.value.length ? loans.value[loans.value.length - 1] : null
    );
    const firstCertificate = computed(() =>
        certificates.value.length ? certificates.value[certificates.value.length - 1] : null
    );

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
    const deliveryLabel = (val) => (val ? t('dashboard.orders.yes') : t('dashboard.orders.no'));

    const parseItems = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            const trimmed = val.trim();
            if (!trimmed) return [];
            try {
                const parsed = JSON.parse(trimmed);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    };

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

    const loadUserInfoBlocks = async () => {
        cardsLoading.value = true;
        loansLoading.value = true;
        certificatesLoading.value = true;
        try {
            const token = getAuthToken();
            if (!token) {
                cards.value = [];
                loans.value = [];
                certificates.value = [];
                return;
            }
            const res = await apiService.fetchUserInfo(token);
            const data = res?.data || res || {};

            const cardItems = parseItems(data.cards);
            const loanItems = parseItems(data.loans);
            const certificateItems = parseItems(data.certificates);

            cards.value = cardItems.map((it) => ({
                card_title: it.card_title,
                card_price: it.card_price,
                bank_branch: it.bank_branch,
                delivery: it.delivery,
                status: it.status,
                created_at: it.created_at,
            }));

            loans.value = loanItems.map((it) => ({
                credit_name: it.credit_name,
                amount: it.amount,
                monthly_payment: it.monthly_payment,
                bank_branch: it.bank_branch,
                status: it.status,
                created_at: it.created_at,
            }));

            certificates.value = certificateItems.map((it) => ({
                certificate_name: it.certificate_name,
                bank_branch: it.bank_branch,
                certificate_price: it.certificate_price,
                status: it.status,
                created_at: it.created_at,
            }));
        } catch {
            cards.value = [];
            loans.value = [];
            certificates.value = [];
        } finally {
            cardsLoading.value = false;
            loansLoading.value = false;
            certificatesLoading.value = false;
        }
    };

    watch(locale, () => {
        loadUserInfoBlocks();
    });

    onMounted(() => {
        loadPayments();
        loadUserInfoBlocks();
    });

    const statusProps = (s) => {
        const v = String(s || '').toLowerCase();
        switch (v) {
            case 'pending':
                return { text: t('dashboard.status.pending'), cls: 'bg-[#ebb618]' };
            case 'approved':
            case 'approved':
                return { text: t('dashboard.status.approved'), cls: 'bg-[#2C702C]' };
            case 'rejected':
                return { text: t('dashboard.status.rejected'), cls: 'bg-[#F44336]' };
            default:
                return { text: t('dashboard.status.pending'), cls: 'bg-[#ebb618]' };
        }
    };
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
                    <h2 class="text-[22px] sm:text-[28px] font-bold leading-9">
                        {{ t('dashboard.PageTitles.home') }}
                    </h2>

                    <CurrentDate />
                </div>

                <div class="flex flex-col gap-4">
                    <div class="block p-3 mm:p-[22px] rounded-[20px] bg-mainWhite">
                        <h6 class="text-[15px] sm:text-[17px] font-bold mb-4">
                            {{ t('dashboard.blockTitiles.selectToPay') }}
                        </h6>

                        <div
                            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mm:grid-cols-4 xl:!grid-cols-5 gap-2 sm:gap-4">
                            <RouterLink to="/dashboard"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/tmCell.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    TM CELL
                                </p>
                            </RouterLink>

                            <RouterLink to="/dashboard"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/astu.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    CDMA
                                </p>
                            </RouterLink>

                            <RouterLink to="/dashboard"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/astu.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    IP TV
                                </p>
                            </RouterLink>

                            <RouterLink to="/dashboard"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/astu.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    {{ t('dashboard.payments.homePhone') }}
                                </p>
                            </RouterLink>

                            <RouterLink to="/dashboard"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/astu.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    ASTU {{ t('dashboard.payments.internet') }}
                                </p>
                            </RouterLink>

                            <RouterLink to="/dashboard"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/telecom-logo.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    Telekom {{ t('dashboard.payments.internet') }}
                                </p>
                            </RouterLink>

                            <RouterLink :to="{ name: 'dashboard.belet' }"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/beletIcon.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    Belet film
                                </p>
                            </RouterLink>

                            <RouterLink to="/dashboard"
                                class="flex items-center gap-[10px] p-2 sm:p-3 hover:shadow-md hover:bg-[#fafafa] rounded-xl transition-all duration-300">
                                <span class="block w-9 sm:w-[50px] h-9 sm:h-[50px]">
                                    <img class="w-full h-full object-contain"
                                        src="../../assets/images/payments/policeCar.png" alt="payment-icon">
                                </span>
                                <p class="text-sm sm:text-[15px] font-bold leading-tight">
                                    {{ t('dashboard.payments.trafficPolice') }}
                                </p>
                            </RouterLink>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div v-if="cardsLoading || firstCard"
                            class="block col-span-12 md:col-span-6 lg:col-span-4 p-3 mm:p-[22px] rounded-[20px] bg-mainWhite">
                            <template v-if="cardsLoading">
                                <div class="animate-pulse">
                                    <div class="flex items-center justify-between gap-2 mb-5">
                                        <div class="h-5 bg-[#F0F2EE] rounded w-24"></div>
                                        <div class="h-4 bg-[#F0F2EE] rounded w-20"></div>
                                    </div>

                                    <div class="py-3">
                                        <div
                                            class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-3/4 mx-auto"></div>
                                            </div>

                                            <div class="block p-2">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-1/2 mx-auto"></div>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 text-center">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-3/4 mx-auto"></div>
                                            </div>

                                            <div class="block p-2">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-1/2 mx-auto"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="flex items-center justify-between gap-2 mb-5">
                                    <h6 class="text-[15px] sm:text-[17px] font-bold">
                                        {{ t('dashboard.orders.cards') }}
                                    </h6>

                                    <RouterLink :to="{ name: 'dashboard.application-history' }"
                                        class="flex items-center gap-2">
                                        <p class="text-sm sm:text-[15px] font-bold leading-tight text-[#2C702C]">
                                            {{ t('btn.showAll') }}
                                        </p>
                                    </RouterLink>
                                </div>

                                <div class="py-3">
                                    <div
                                        class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                            <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                                {{ firstCard.created_at }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ firstCard.card_title }}
                                            </p>
                                        </div>

                                        <div class="block p-2">
                                            <p class="text-sm text-[#6F736D]/70">
                                                {{ t('dashboard.orders.paymentAmount') }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ firstCard.card_price }} TMT
                                            </p>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 text-center">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                            <p class="text-sm text-[#6F736D]/70">
                                                {{ t('dashboard.orders.bankBranch') }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ firstCard.bank_branch }}
                                            </p>
                                        </div>

                                        <div class="block p-2">
                                            <p class="text-sm text-[#6F736D]/70">
                                                {{ t('dashboard.orders.deliveryService') }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ deliveryLabel(firstCard.delivery) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <div v-if="loansLoading || firstLoan"
                            class="block col-span-12 md:col-span-6 lg:col-span-4 p-3 mm:p-[22px] rounded-[20px] bg-mainWhite">
                            <template v-if="loansLoading">
                                <div class="animate-pulse">
                                    <div class="flex items-center justify-between gap-2 mb-5">
                                        <div class="h-5 bg-[#F0F2EE] rounded w-24"></div>
                                        <div class="h-4 bg-[#F0F2EE] rounded w-20"></div>
                                    </div>

                                    <div class="py-3">
                                        <div
                                            class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-3/4 mx-auto"></div>
                                            </div>

                                            <div class="flex justify-center items-center p-2">
                                                <div class="h-6 bg-[#F0F2EE] rounded-full w-24"></div>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 text-center">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-3/4 mx-auto"></div>
                                            </div>

                                            <div class="block p-2">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-1/2 mx-auto"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="flex items-center justify-between gap-2 mb-5">
                                    <h6 class="text-[15px] sm:text-[17px] font-bold">
                                        {{ t('dashboard.orders.loans') }}
                                    </h6>

                                    <RouterLink :to="{ name: 'dashboard.application-history' }"
                                        class="flex items-center gap-2">
                                        <p class="text-sm sm:text-[15px] font-bold leading-tight text-[#2C702C]">
                                            {{ t('btn.showAll') }}
                                        </p>
                                    </RouterLink>
                                </div>

                                <div class="py-3">
                                    <div
                                        class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                            <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                                {{ firstLoan.created_at }}
                                            </p>
                                            <h6 class="text-[15px] leading-5 font-bold mb-1">
                                                {{ firstLoan.credit_name }}
                                            </h6>
                                        </div>

                                        <div class="flex justify-center items-center p-2">
                                            <h6
                                                :class="['text-[15px] text-[#EEF2ED] leading-tight py-1 px-[10px] rounded-[10px] w-fit', statusProps(firstLoan.status).cls]">
                                                {{ statusProps(firstLoan.status).text }}
                                            </h6>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 text-center">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                            <p class="text-sm text-[#6F736D]/70">
                                                {{ t('dashboard.orders.amount') }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ firstLoan.amount }} TMT
                                            </p>
                                        </div>

                                        <div class="block p-2">
                                            <p class="text-sm text-[#6F736D]/70">
                                                {{ t('dashboard.orders.monthlyPayment') }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ firstLoan.monthly_payment }} TMT
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <div v-if="certificatesLoading || firstCertificate"
                            class="block col-span-12 md:col-span-6 lg:col-span-4 p-3 mm:p-[22px] rounded-[20px] bg-mainWhite">
                            <template v-if="certificatesLoading">
                                <div class="animate-pulse">
                                    <div class="flex items-center justify-between gap-2 mb-5">
                                        <div class="h-5 bg-[#F0F2EE] rounded w-32"></div>
                                        <div class="h-4 bg-[#F0F2EE] rounded w-20"></div>
                                    </div>

                                    <div class="py-3">
                                        <div
                                            class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-3/4 mx-auto"></div>
                                            </div>

                                            <div class="flex justify-center items-center p-2">
                                                <div class="h-6 bg-[#F0F2EE] rounded-full w-24"></div>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 text-center">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-3/4 mx-auto"></div>
                                            </div>

                                            <div class="block p-2">
                                                <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                                <div class="h-4 bg-[#F0F2EE] rounded w-1/2 mx-auto"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="flex items-center justify-between gap-2 mb-5">
                                    <h6 class="text-[15px] sm:text-[17px] font-bold">
                                        {{ t('dashboard.orders.certificates') }}
                                    </h6>

                                    <RouterLink :to="{ name: 'dashboard.application-history' }"
                                        class="flex items-center gap-2">
                                        <p class="text-sm sm:text-[15px] font-bold leading-tight text-[#2C702C]">
                                            {{ t('btn.showAll') }}
                                        </p>
                                    </RouterLink>
                                </div>

                                <div class="py-3">
                                    <div
                                        class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                            <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                                {{ firstCertificate.created_at }}
                                            </p>
                                            <h6 class="text-[15px] leading-5 font-bold mb-1">
                                                {{ firstCertificate.certificate_name }}
                                            </h6>
                                        </div>

                                        <div class="flex justify-center items-center">
                                            <h6
                                                :class="['text-[15px] text-[#EEF2ED] leading-tight py-1 px-[10px] rounded-[10px] w-fit', statusProps(firstCertificate.status).cls]">
                                                {{ statusProps(firstCertificate.status).text }}
                                            </h6>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 text-center">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                            <p class="text-sm text-[#6F736D]/70">
                                                {{ t('dashboard.orders.paymentAmount') }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ firstCertificate.certificate_price }} TMT
                                            </p>
                                        </div>

                                        <div class="block">
                                            <p class="text-sm text-[#6F736D]/70">
                                                {{ t('dashboard.orders.bankBranch') }}
                                            </p>
                                            <p class="text-[15px] font-bold">
                                                {{ firstCertificate.bank_branch }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 lg:col-span-8">
                            <div class="block p-3 mm:p-[22px] rounded-[20px] bg-mainWhite">
                                <div class="flex items-center justify-between gap-2 mb-4">
                                    <h6 class="text-[15px] sm:text-[17px] font-bold">
                                        {{ t('dashboard.blockTitiles.paymentHistory') }}
                                    </h6>

                                    <RouterLink :to="{ name: 'dashboard.history' }" class="flex items-center gap-2">
                                        <!-- {{ t('dashboard.viewAll') }} -->
                                        <p class="text-sm sm:text-[15px] font-bold leading-tight text-[#2C702C]">
                                            {{ t('dashboard.payment.allHistory') }}
                                        </p>
                                    </RouterLink>
                                </div>

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

                                        <div v-for="payment in paymentsLimited" :key="payment.id"
                                            class="flex flex-wrap justify-center sm:grid grid-cols-5 gap-4 sm:gap-2 px-3 py-3 border-solid border-0 border-b border-[#EEF2ED] last:border-b-0 text-center">


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
                                </div>
                            </div>
                        </div>

                        <div class="hidden lg:block col-span-12 lg:col-span-4">
                            <div class="block p-3 mm:p-[22px] rounded-[20px] bg-[#1D2417]">
                                <h6 class="text-[17px] text-mainWhite font-bold mb-3">
                                    {{ t('exchange.branches') }}
                                </h6>

                                <p class="text-xs text-[#F7F8F6]/60 mb-3">
                                    {{ t('exchange.onCityMap') }}
                                </p>

                                <RouterLink to="/branches" class="block relative w-full rounded-[10px]">
                                    <img class="w-full h-[200px] object-cover rounded-[16px]"
                                        src="../../assets/images/map.png" alt="map">

                                    <span class="block absolute right-[87px] -top-6 rounded-[100px]">
                                        <svg class="w-[52px] h-[52px] object-contain" width="52" height="52"
                                            viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="3" width="46" height="46" rx="23" fill="#2C702C" />
                                            <rect x="3" y="3" width="46" height="46" rx="23" stroke="#1D2417"
                                                stroke-width="6" />
                                            <path
                                                d="M26 21C25.3819 21 24.7777 21.1833 24.2638 21.5267C23.7499 21.87 23.3494 22.3581 23.1129 22.9291C22.8764 23.5001 22.8145 24.1285 22.935 24.7347C23.0556 25.3408 23.3533 25.8977 23.7903 26.3347C24.2273 26.7717 24.7842 27.0694 25.3903 27.19C25.9965 27.3105 26.6249 27.2486 27.1959 27.0121C27.7669 26.7756 28.255 26.3751 28.5983 25.8612C28.9417 25.3473 29.125 24.7431 29.125 24.125C29.125 23.2962 28.7958 22.5013 28.2097 21.9153C27.6237 21.3292 26.8288 21 26 21ZM26 26C25.6292 26 25.2666 25.89 24.9583 25.684C24.65 25.478 24.4096 25.1851 24.2677 24.8425C24.1258 24.4999 24.0887 24.1229 24.161 23.7592C24.2334 23.3955 24.412 23.0614 24.6742 22.7992C24.9364 22.537 25.2705 22.3584 25.6342 22.286C25.9979 22.2137 26.3749 22.2508 26.7175 22.3927C27.0601 22.5346 27.353 22.775 27.559 23.0833C27.765 23.3916 27.875 23.7542 27.875 24.125C27.875 24.6223 27.6775 25.0992 27.3258 25.4508C26.9742 25.8025 26.4973 26 26 26ZM26 17.25C24.1773 17.2521 22.4298 17.9771 21.1409 19.2659C19.8521 20.5548 19.1271 22.3023 19.125 24.125C19.125 26.5781 20.2586 29.1781 22.4062 31.6445C23.3713 32.759 24.4574 33.7626 25.6445 34.6367C25.7496 34.7103 25.8748 34.7498 26.0031 34.7498C26.1314 34.7498 26.2566 34.7103 26.3617 34.6367C27.5467 33.7623 28.6307 32.7587 29.5938 31.6445C31.7383 29.1781 32.875 26.5781 32.875 24.125C32.8729 22.3023 32.1479 20.5548 30.8591 19.2659C29.5702 17.9771 27.8227 17.2521 26 17.25ZM26 33.3438C24.7086 32.3281 20.375 28.5977 20.375 24.125C20.375 22.6332 20.9676 21.2024 22.0225 20.1475C23.0774 19.0926 24.5082 18.5 26 18.5C27.4918 18.5 28.9226 19.0926 29.9775 20.1475C31.0324 21.2024 31.625 22.6332 31.625 24.125C31.625 28.5961 27.2914 32.3281 26 33.3438Z"
                                                fill="#EEF2ED" />
                                        </svg>
                                    </span>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</template>



<style scoped>
    .bg-circle::after {
        content: "";
        position: absolute;
        width: 440px;
        height: 440px;
        left: 50%;
        transform: translateX(-50%);
        bottom: -100px;
        background: #2C702C;
        filter: blur(137.15px);
        border-radius: 9999px;
        pointer-events: none;
    }
</style>
