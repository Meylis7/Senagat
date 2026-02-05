<script setup>
    import { useI18n } from 'vue-i18n';
    import { ref, computed, onMounted, watch } from 'vue';
    import { useUserStore } from '@/stores/userStore';
    import apiService from '@/services/apiService';
    const { t, locale } = useI18n();

    import Date from '@/components/dashboard/Date.vue';

    const userStore = useUserStore();

    const cards = ref([]);
    const loans = ref([]);
    const certificates = ref([]);
    const loading = ref(false);
    const activeTab = ref('cards');

    const getAuthToken = () =>
        userStore.authToken ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        '';

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

    const deliveryLabel = (val) => (val ? t('dashboard.orders.yes') : t('dashboard.orders.no'));

    const loadApplications = async () => {
        loading.value = true;
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
            loading.value = false;
        }
    };

    const hasAnyCards = computed(() => cards.value.length > 0);
    const hasAnyLoans = computed(() => loans.value.length > 0);
    const hasAnyCertificates = computed(() => certificates.value.length > 0);

    const filteredCards = computed(() => cards.value);
    const filteredLoans = computed(() => loans.value);
    const filteredCertificates = computed(() => certificates.value);

    const showEmptyState = computed(() => {
        if (activeTab.value === 'cards') return !hasAnyCards.value && !loading.value;
        if (activeTab.value === 'loans') return !hasAnyLoans.value && !loading.value;
        if (activeTab.value === 'certificates') return !hasAnyCertificates.value && !loading.value;
        return false;
    });

    watch(locale, () => {
        loadApplications();
    });

    onMounted(() => {
        loadApplications();
    });
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-10">
                    <h2 class="text-[22px] sm:text-[28px] font-bold leading-9">
                        {{ t('dashboard.PageTitles.applicationsHistory') }}
                    </h2>

                    <Date />
                </div>

                <div class="block">
                    <div class="flex items-center justify-between gap-2 mb-4">
                        <h6 class="text-[15px] sm:text-[17px] font-bold">
                            <h4 class="text-md font-bold" v-if="activeTab === 'cards'">
                                {{ t('dashboard.orders.cards') }}
                            </h4>
                            <h4 class="text-md font-bold" v-else-if="activeTab === 'loans'">
                                {{ t('dashboard.orders.loans') }}
                            </h4>
                            <h4 class="text-md font-bold" v-else>
                                {{ t('dashboard.orders.certificates') }}
                            </h4>
                        </h6>

                        <div class="inline-flex rounded-[20px] p-1 gap-1 text-sm font-medium bg-mainWhite">
                            <button type="button" class="px-4 py-2 rounded-[14px] transition-colors"
                                :class="activeTab === 'cards' ? 'bg-[#2C702C] text-mainWhite' : 'text-[#6F736D]'"
                                @click="activeTab = 'cards'">
                                {{ t('dashboard.orders.cards') }}
                            </button>
                            <button type="button" class="px-4 py-2 rounded-[14px] transition-colors"
                                :class="activeTab === 'loans' ? 'bg-[#2C702C] text-mainWhite' : 'text-[#6F736D]'"
                                @click="activeTab = 'loans'">
                                {{ t('dashboard.orders.loans') }}
                            </button>
                            <button type="button" class="px-4 py-2 rounded-[14px] transition-colors"
                                :class="activeTab === 'certificates' ? 'bg-[#2C702C] text-mainWhite' : 'text-[#6F736D]'"
                                @click="activeTab = 'certificates'">
                                {{ t('dashboard.orders.certificates') }}
                            </button>
                        </div>
                    </div>

                    <div v-if="loading" class="grid grid-cols-12 gap-4">
                        <div v-for="n in 3" :key="n"
                            class="block col-span-12 md:col-span-6 lg:col-span-4 p-3 mm:p-[22px] rounded-[20px] bg-mainWhite border border-[#EEF2ED]">
                            <div class="animate-pulse">
                                <div class="flex items-center justify-between gap-2 mb-5">
                                    <div class="h-5 bg-[#F0F2EE] rounded w-24"></div>
                                    <div class="h-4 bg-[#F0F2EE] rounded w-20"></div>
                                </div>

                                <div class="py-3">
                                    <div
                                        class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                            <div class="h-4 bg-[#F0F2EE] rounded mb-2"></div>
                                            <div class="h-4 bg-[#F0F2EE] rounded w-3/4 mx-auto"></div>
                                        </div>

                                        <div class="block p-2">
                                            <div class="h-4 bg-[#F0F2EE] rounded mb-2 w-2/3 mx-auto"></div>
                                            <div class="h-4 bg-[#F0F2EE] rounded w-1/2 mx-auto"></div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 text-center">
                                        <div class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
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
                        </div>
                    </div>

                    <div v-else>
                        <div v-if="showEmptyState" class="py-8 text-center">
                            <p class="text-sm sm:text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                {{ t('dashboard.noApplicationsYet') }}
                            </p>
                        </div>

                        <div v-else class="grid grid-cols-12 gap-4">
                            <template v-if="activeTab === 'cards'">
                                <div v-for="(card, idx) in filteredCards" :key="idx"
                                    class="block col-span-12 md:col-span-6 lg:col-span-4 p-3 mm:p-[22px] rounded-[20px] bg-mainWhite border border-[#EEF2ED]">
                                    <div class="py-3">
                                        <div class="flex items-center justify-between mb-5">
                                            <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                                {{ card.created_at }}
                                            </p>

                                            <h6
                                                :class="['text-[15px] text-[#EEF2ED] leading-tight py-1 px-[10px] rounded-[10px] w-fit', statusProps(card.status).cls]">
                                                {{ statusProps(card.status).text }}
                                            </h6>
                                        </div>

                                        <div
                                            class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                                    {{ t('dashboard.orders.cardType') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ card.card_title }}
                                                </p>
                                            </div>

                                            <div class="block p-2">
                                                <p class="text-sm text-[#6F736D]/70">
                                                    {{ t('dashboard.orders.paymentAmount') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ card.card_price }} TMT
                                                </p>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 text-center">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <p class="text-sm text-[#6F736D]/70">
                                                    {{ t('dashboard.orders.bankBranch') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ card.bank_branch }}
                                                </p>
                                            </div>

                                            <div class="block p-2">
                                                <p class="text-sm text-[#6F736D]/70">
                                                    {{ t('dashboard.orders.deliveryService') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ deliveryLabel(card.delivery) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="activeTab === 'loans'">
                                <div v-for="(loan, idx) in filteredLoans" :key="idx"
                                    class="block col-span-12 md:col-span-6 lg:col-span-4 p-3 mm:p-[22px] rounded-[20px] bg-mainWhite border border-[#EEF2ED]">
                                    <div class="py-3">
                                        <div
                                            class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                                    {{ loan.created_at }}
                                                </p>
                                                <h6 class="text-[15px] leading-5 font-bold mb-1">
                                                    {{ loan.credit_name }}
                                                </h6>
                                            </div>

                                            <div class="flex justify-center items-center p-2">
                                                <h6
                                                    :class="['text-[15px] text-[#EEF2ED] leading-tight py-1 px-[10px] rounded-[10px] w-fit', statusProps(loan.status).cls]">
                                                    {{ statusProps(loan.status).text }}
                                                </h6>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 text-center">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <p class="text-sm text-[#6F736D]/70">
                                                    {{ t('dashboard.orders.amount') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ loan.amount }} TMT
                                                </p>
                                            </div>

                                            <div class="block p-2">
                                                <p class="text-sm text-[#6F736D]/70">
                                                    {{ t('dashboard.orders.monthlyPayment') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ loan.monthly_payment }} TMT
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="activeTab === 'certificates'">
                                <div v-for="(certificate, idx) in filteredCertificates" :key="idx"
                                    class="block col-span-12 md:col-span-6 lg:col-span-4 p-3 mm:p-[22px] rounded-[20px] bg-mainWhite border border-[#EEF2ED]">
                                    <div class="py-3">
                                        <div
                                            class="grid grid-cols-2 gap-4 text-center mb-6 border-solid border-0 border-b-[1px] border-[#E5E5E5] pb-4">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                                    {{ certificate.created_at }}
                                                </p>
                                                <h6 class="text-[15px] leading-5 font-bold mb-1">
                                                    {{ certificate.certificate_name }}
                                                </h6>
                                            </div>

                                            <div class="flex justify-center items-center">
                                                <h6
                                                    :class="['text-[15px] text-[#EEF2ED] leading-tight py-1 px-[10px] rounded-[10px] w-fit', statusProps(certificate.status).cls]">
                                                    {{ statusProps(certificate.status).text }}
                                                </h6>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 text-center">
                                            <div
                                                class="block p-2 border-solid border-0 border-r-[1px] border-[#E5E5E5]">
                                                <p class="text-sm text-[#6F736D]/70">
                                                    {{ t('dashboard.orders.paymentAmount') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ certificate.certificate_price }} TMT
                                                </p>
                                            </div>

                                            <div class="block">
                                                <p class="text-sm text-[#6F736D]/70">
                                                    {{ t('dashboard.orders.bankBranch') }}
                                                </p>
                                                <p class="text-[15px] font-bold">
                                                    {{ certificate.bank_branch }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped></style>
