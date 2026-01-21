<script setup>
    import CustomDropdown from '@/components/dashboard/CustomDropdown.vue';
    import { useI18n } from 'vue-i18n';
    import { ref, computed, onMounted, watch } from 'vue';
    import apiService from '@/services/apiService';
    import { toast } from 'vue3-toastify';
    import { useUserStore } from '@/stores/userStore';
    import Loading from '@/components/dashboard/Loading.vue';
    const { t, locale } = useI18n();
    const userStore = useUserStore();

    const branchOptions = ref([]);
    const selectedBranch = ref(null);
    const fetchBranches = async () => {
        try {
            const res = await apiService.fetchBranches();
            const list = res?.data || res || [];
            const arr = Array.isArray(list) ? list : [];
            branchOptions.value = arr.map((it) => ({
                id: it.id,
                name: it.name,
            }));
        } catch {
            branchOptions.value = [];
        }
    };
    const paymentTypeOptions = ref([]);
    const selectedPaymentTypeId = ref(null);
    const fetchPaymentTypes = async () => {
        const prevId = selectedPaymentTypeId.value;
        try {
            const res = await apiService.fetchInternationalPaymentTypes();
            const list = res?.data || res || [];
            const arr = Array.isArray(list) ? list : [];
            paymentTypeOptions.value = arr.map((it) => ({
                id: it.id,
                title: it.title,
                required_files: it.required_files,
            }));
            const exists = paymentTypeOptions.value.some((it) => String(it.id) === String(prevId));
            selectedPaymentTypeId.value = exists ? prevId : null;
        } catch {
            paymentTypeOptions.value = [];
            selectedPaymentTypeId.value = prevId;
        }
    };
    const selectedPaymentType = computed(() => {
        const id = selectedPaymentTypeId.value;
        const opts = Array.isArray(paymentTypeOptions.value) ? paymentTypeOptions.value : [];
        return opts.find((it) => String(it.id) === String(id)) || null;
    });
    const requiredFiles = computed(() => {
        const req = selectedPaymentType.value?.required_files;
        if (Array.isArray(req)) {
            return req.map((it) => (typeof it === 'object' ? (it.title ?? '') : String(it))).filter(Boolean);
        }
        if (typeof req === 'string') {
            return req ? [req] : [];
        }
        return [];
    });
    const paymentTypeDefaultOption = computed(() => {
        const opt = selectedPaymentType.value;
        if (!opt) return '';
        return opt.title ?? opt.name ?? opt.label ?? String(opt.id ?? '');
    });
    const fileUploads = ref([]);
    const onSingleFileChange = (event, idx) => {
        const file = Array.from(event?.target?.files || [])[0] || null;
        fileUploads.value[idx] = file;
        if (event?.target) event.target.value = '';
    };

    // Form inputs and validation ============================================
    const submitting = ref(false);
    const overlayOpen = ref(false);
    const overlayLoading = ref(false);
    const errors = ref({
        paymentType: false,
        branch: false,
        files: false,
    });
    const branchTitleClass = computed(() => (errors.value.branch ? 'border-solid border-[1px] border-red-500' : ''));
    const paymentTypeTitleClass = computed(() => (errors.value.paymentType ? 'border-solid border-[1px] border-red-500' : ''));
    const handlePaymentSelected = (option) => {
        selectedPaymentTypeId.value = typeof option === 'object' ? option.id : option;
        errors.value.paymentType = false;
    };
    const handleBranchSelected = (option) => {
        selectedBranch.value = typeof option === 'object' ? option.id : option;
        errors.value.branch = false;
    };
    const validateForm = () => {
        errors.value.paymentType = !selectedPaymentTypeId.value;
        errors.value.branch = !selectedBranch.value;
        errors.value.files =
            requiredFiles.value.length > 0 &&
            (fileUploads.value.length !== requiredFiles.value.length ||
                fileUploads.value.some((f) => !f));
        const anyError = Object.values(errors.value).some(Boolean);
        if (anyError) {
            if (errors.value.paymentType) toast.error('Выберите тип платежа');
            if (errors.value.branch) toast.error('Выберите филиал банка');
            if (errors.value.files) toast.error('Загрузите документы');
        }
        return !anyError;
    };

    /* Removed base64 conversion; files will be sent as multipart form-data */

    const submitOrder = async () => {
        submitting.value = true;
        try {
            if (!validateForm()) {
                submitting.value = false;
                return;
            }
            overlayOpen.value = true;
            overlayLoading.value = true;
            const token =
                userStore.authToken ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('access_token') ||
                localStorage.getItem('token') ||
                '';
            const fd = new FormData();
            fd.append('payment_type_id', String(selectedPaymentTypeId.value));
            fd.append('branch_id', String(selectedBranch.value));
            fileUploads.value.forEach((f) => {
                if (f) fd.append('uploaded_files[]', f, f.name || 'file');
            });
            console.log('POST /v1/international-payment-order form fields:', {
                payment_type_id: selectedPaymentTypeId.value,
                branch_id: selectedBranch.value,
                files: fileUploads.value.map((f) => ({
                    name: f?.name || '',
                    type: f?.type || '',
                    size: f?.size || 0,
                })),
            });
            await apiService.submitInternationalPaymentOrder(fd, token);
            toast.success('Заявка отправлена');
            overlayLoading.value = false;
            overlayOpen.value = false;
        } catch (e) {
            const msg = String(e?.message || 'Ошибка отправки заявки');
            toast.error(msg);
            overlayOpen.value = false;
        } finally {
            submitting.value = false;
        }
    };
    onMounted(() => {
        fetchBranches();
        fetchPaymentTypes();
    });
    watch(requiredFiles, (list) => {
        const len = Array.isArray(list) ? list.length : 0;
        fileUploads.value = Array(len).fill(null);
    });
    watch(locale, () => {
        fetchBranches();
        fetchPaymentTypes();
    });

    /* Removed personal input watchers */
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="wrap">
                <Loading :open="overlayOpen" :loading="overlayLoading" />
                <div class="flex flex-col sm:flex-row gap-3  items-center justify-between mb-6">
                    <h2 class="text-[22px] sm:text-[38px] font-bold leading-9">
                        {{ t('dashboard.header.internationalPayments') }}
                    </h2>
                </div>

                <form class="grid grid-cols-12 gap-4" @submit.prevent="submitOrder">
                    <div class="col-span-4">
                        <div class="flex flex-col gap-4 h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <div class="block">
                                <h6 class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.select.selectApplicationType') }}
                                </h6>
                                <CustomDropdown v-if="paymentTypeOptions.length" :options="paymentTypeOptions"
                                    :defaultOption="paymentTypeDefaultOption" :title-class="paymentTypeTitleClass"
                                    :placeholder="t('form.select.applicationType')"
                                    @option-selected="handlePaymentSelected" />
                            </div>

                            <div class="block">
                                <h6 class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.select.selectBankBranch') }}
                                </h6>
                                <CustomDropdown :options="branchOptions" :placeholder="t('form.select.bankBranch')"
                                    :titleClass="branchTitleClass" @option-selected="handleBranchSelected" />
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedPaymentType && requiredFiles.length" class="col-span-8">
                        <div class="flex flex-col gap-4 h-fit p-[22px] rounded-[20px] bg-mainWhite">
                            <h5 class="text-[20px] font-bold mb-[10px] block leading-tight">
                                {{ t('form.filesToUpload') }}
                            </h5>

                            <!-- <ul class="mb-4">
                                <li v-for="(file, idx) in requiredFiles" :key="idx"
                                    class="block relative pl-[30px] mb-[10px] after:content-[''] after:absolute after:top-[10px] after:left-[10px] after:w-[6px] after:h-[6px] after:rotate-45 after:bg-[#2C702C] after:rounded-[2px]">
                                    <p class="text-[15px] block">{{ file }}</p>
                                </li>
                            </ul> -->

                            <div v-for="(title, idx) in requiredFiles" :key="'upload-' + idx" class="block relative">
                                <h6 class="text-[15px] font-bold mb-[10px] block">
                                    {{ title }}
                                </h6>
                                <label :for="'scan-' + idx"
                                    class="block w-full text-[15px] leading-tight border-solid border-1 border-[#EEF2ED] rounded-[10px] py-3 px-5 pr-[45px] placeholder:text-[#6F736D] text-[#191B19] cursor-pointer"
                                    :class="{ 'border-solid border-[1px] border-red-500': errors.files && !fileUploads[idx] }">
                                    {{ fileUploads[idx]?.name || 'Загрузить файл' }}
                                </label>

                                <input class="hidden" type="file" :id="'scan-' + idx"
                                    @change="onSingleFileChange($event, idx)">

                                <span class="absolute bottom-[14px] right-4 w-5 h-5">
                                    <svg class="w-full h-full object-contain" width="16" height="16" viewBox="0 0 16 16"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16 10.9976V12.9976C15.9991 13.793 15.6828 14.5556 15.1204 15.118C14.5579 15.6804 13.7954 15.9967 13 15.9976H3C2.20462 15.9967 1.44206 15.6804 0.879639 15.118C0.317218 14.5556 0.000868196 13.793 0 12.9976V10.9976C0 10.7324 0.105357 10.478 0.292893 10.2905C0.48043 10.103 0.734784 9.99762 1 9.99762C1.26522 9.99762 1.51957 10.103 1.70711 10.2905C1.89464 10.478 2 10.7324 2 10.9976V12.9976C2.00026 13.2628 2.10571 13.517 2.29319 13.7044C2.48066 13.8919 2.73486 13.9974 3 13.9976H13C13.2651 13.9974 13.5193 13.8919 13.7068 13.7044C13.8943 13.517 13.9997 13.2628 14 12.9976V10.9976C14 10.7324 14.1054 10.478 14.2929 10.2905C14.4804 10.103 14.7348 9.99762 15 9.99762C15.2652 9.99762 15.5196 10.103 15.7071 10.2905C15.8946 10.478 16 10.7324 16 10.9976ZM5.686 4.55328L7 3.31445V10.9976C7 11.2628 7.10536 11.5172 7.29289 11.7047C7.48043 11.8923 7.73478 11.9976 8 11.9976C8.26522 11.9976 8.51957 11.8923 8.70711 11.7047C8.89464 11.5172 9 11.2628 9 10.9976V3.31445L10.314 4.55328C10.5075 4.73216 10.7638 4.82744 11.0271 4.8184C11.2905 4.80937 11.5396 4.69675 11.7204 4.50502C11.9012 4.3133 11.999 4.05797 11.9925 3.79454C11.9861 3.5311 11.8759 3.28086 11.686 3.09821L8.686 0.270076C8.63969 0.234427 8.59021 0.203106 8.53817 0.176507C8.48735 0.136747 8.4327 0.102152 8.37502 0.0732365C8.13451 -0.0244122 7.86541 -0.0244122 7.6249 0.0732365C7.56722 0.102152 7.51257 0.136747 7.46175 0.176507C7.40971 0.203106 7.36023 0.234427 7.31392 0.270076L4.31392 3.09821C4.12296 3.28063 4.01191 3.53119 4.00501 3.79519C3.99812 4.0592 4.09594 4.31521 4.27712 4.50735C4.4583 4.69949 4.70814 4.81216 4.97209 4.82077C5.23605 4.82937 5.49269 4.73321 5.686 4.55328Z"
                                            fill="#cecece" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 flex justify-center mt-5">
                        <button type="submit"
                            class="bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] w-[250px]"
                            :disabled="submitting">
                            {{ t('dashboard.btn.sendApplication') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped></style>
