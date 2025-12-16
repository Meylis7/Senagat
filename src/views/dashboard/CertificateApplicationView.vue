<script setup>
    import { RouterLink } from 'vue-router';
    import Date from '@/components/dashboard/Date.vue';
    import CustomDropdown from '@/components/dashboard/CustomDropdown.vue';
    import Loading from '@/components/dashboard/Loading.vue';
    import { toast } from 'vue3-toastify';
    import { ref, computed, onMounted, watch } from 'vue';
    import apiService from '@/services/apiService';
    import { useI18n } from 'vue-i18n';
    import { useUserStore } from '@/stores/userStore';

    const { locale } = useI18n();
    const certificateOptions = ref([]);
    const selectedCertificate = ref(null);
    const certificatesLoading = ref(false);
    const certificatesError = ref(null);

    const branchOptions = ref([]);
    const selectedBranch = ref(null);
    const branchesLoading = ref(false);
    const branchesError = ref(null);

    const homeAddress = ref('');
    const submitting = ref(false);
    const submitError = ref(null);
    const errors = ref({
        certificate: false,
        branch: false,
        homeAddress: false
    });

    const overlayOpen = ref(false);
    const overlayLoading = ref(false);
    const userStore = useUserStore();

    const certificateTitleClass = computed(() => (errors.value.certificate ? 'border border-[#EF4444]' : ''));
    const branchTitleClass = computed(() => (errors.value.branch ? 'border border-[#EF4444]' : ''));

    const fetchCertificateTypes = async () => {
        certificatesLoading.value = true;
        certificatesError.value = null;
        try {
            const res = await apiService.fetchCertificateTypes();
            const list = res?.data || res || [];
            const arr = Array.isArray(list) ? list : [];
            certificateOptions.value = arr.map((it) => ({
                id: it.id,
                title: it.title,
                price: it.price
            }));
        } catch (e) {
            certificatesError.value = e?.message || 'Failed to load certificate types';
            certificateOptions.value = [];
        } finally {
            certificatesLoading.value = false;
        }
    };

    const fetchBranches = async () => {
        branchesLoading.value = true;
        branchesError.value = null;
        try {
            const res = await apiService.fetchBranches();
            const list = res?.data || res || [];
            const arr = Array.isArray(list) ? list : [];
            branchOptions.value = arr.map((it) => ({
                id: it.id,
                name: it.name
            }));
        } catch (e) {
            branchesError.value = e?.message || 'Failed to load branches';
            branchOptions.value = [];
        } finally {
            branchesLoading.value = false;
        }
    };

    onMounted(() => {
        fetchCertificateTypes();
        fetchBranches();
    });

    watch(locale, () => {
        fetchCertificateTypes();
        fetchBranches();
    });

    // Handle dropdown selection
    const handleOptionSelected = (option) => {
        selectedCertificate.value = typeof option === 'object' ? option.id : option;
        errors.value.certificate = false;
    };

    const handleBranchSelected = (option) => {
        selectedBranch.value = typeof option === 'object' ? option.id : option;
        errors.value.branch = false;
    };

    const submitOrder = async () => {
        submitError.value = null;
        errors.value.certificate = !selectedCertificate.value;
        errors.value.branch = !selectedBranch.value;
        errors.value.homeAddress = !String(homeAddress.value || '').trim();
        if (errors.value.certificate || errors.value.branch || errors.value.homeAddress) {
            if (errors.value.certificate) toast.error('Выберите тип справки');
            if (errors.value.branch) toast.error('Выберите филиал банка');
            if (errors.value.homeAddress) toast.error('Введите домашний адрес');
            return;
        }
        submitting.value = true;
        overlayOpen.value = true;
        overlayLoading.value = true;
        try {
            const token =
                userStore.authToken ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('access_token') ||
                localStorage.getItem('token') ||
                '';
            const payload = {
                certificate_type_id: selectedCertificate.value,
                bank_branch_id: selectedBranch.value,
                home_address: String(homeAddress.value).trim()
            };
            console.log('Selected certificate:', selectedCertificate.value);
            console.log('Selected branch:', selectedBranch.value);
            console.log('Home address:', homeAddress.value);
            console.log('Auth token present:', Boolean(token), 'length:', String(token).length);
            console.log('Certificate order payload:', payload);
            const res = await apiService.submitCertificateOrder(payload, token);
            console.log('Certificate order response:', res);
            overlayLoading.value = false;
        } catch (e) {
            const msg = String(e?.message || 'Failed to submit order');
            submitError.value = msg;
            if (msg.toLowerCase().includes('unauthenticated') || msg.includes('401')) {
                toast.error('Авторизация истекла. Войдите заново.');
            } else {
                toast.error(submitError.value);
            }
            overlayOpen.value = false;
        } finally {
            submitting.value = false;
        }
    };


</script>

<template>
    <section class="pb-[80px]">
        <Loading :open="overlayOpen" :loading="overlayLoading" />
        <div class="auto_container">
            <div class="warp">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center">
                        <RouterLink :to="{ name: 'dashboard.services' }"
                            class="text-[#6F736D] text-[28px] font-bold leading-tight">
                            Сервисы
                        </RouterLink>
                        <p class="text-[28px] font-bold leading-tight">
                            /Получить справку
                        </p>
                    </div>

                    <Date />
                </div>

                <form class="grid grid-cols-12 gap-4" @submit.prevent="submitOrder">
                    <div class="col-span-4">
                        <div class="flex flex-col h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <h6 class="text-[15px] font-bold mb-[10px] block">
                                Выберите тип cправки
                            </h6>

                            <CustomDropdown :options="certificateOptions" placeholder="Тип cправки"
                                :titleClass="certificateTitleClass" @option-selected="handleOptionSelected" />
                        </div>
                    </div>


                    <div class="col-span-4">
                        <div class="flex flex-col gap-4 h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <div class="block">
                                <h6 class="text-[15px] font-bold mb-[10px] block">
                                    Филиал банка
                                </h6>
                                <CustomDropdown :options="branchOptions" placeholder="Филиал банка"
                                    :titleClass="branchTitleClass" @option-selected="handleBranchSelected" />
                            </div>
                        </div>
                    </div>

                    <div class="col-span-4">
                        <div class="flex flex-col gap-4 h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <div class="block">
                                <label for="issued_date" class="text-[15px] font-bold mb-[10px] block">
                                    Домашний адрес
                                </label>
                                <input v-model="homeAddress"
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    :class="{ 'border border-[#EF4444]': errors.homeAddress }" type="text"
                                    id="issued_date" placeholder="Домашний адрес">
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 flex justify-center">
                        <button type="submit"
                            class="bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-[250px]"
                            :disabled="submitting">
                            Отправить заявку
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>
