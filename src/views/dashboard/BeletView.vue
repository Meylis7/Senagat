<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import CustomDropdown from '@/components/dashboard/CustomDropdown.vue';
    import apiService from '@/services/apiService';
    import { useUserStore } from '@/stores/userStore';
    import { toast } from 'vue3-toastify';

    const { t, locale } = useI18n();

    const phone = ref('');
    const isPhoneError = ref(false);
    const onPhoneInput = (e) => {
        let val = String(e?.target?.value || '').replace(/\D/g, '');
        if (val.length > 8) val = val.slice(0, 8);
        phone.value = val;
        if (e?.target) e.target.value = val;
        if (isPhoneError.value) isPhoneError.value = false;
    };
    const phoneCheckLoading = ref(false);
    const phoneCheckValid = ref(null);
    const submitting = ref(false);
    const isVerifyModalOpen = ref(false);
    const selectedServiceTitle = ref('Internet & TV');
    const router = useRouter();
    const closeVerifyModal = () => { isVerifyModalOpen.value = false; };
    const proceedToVerify = () => { isVerifyModalOpen.value = false; router.push('/dashboard'); };
    const checkPhone = async () => {
        const digits = String(phone.value || '');
        if (digits.length !== 8) {
            phoneCheckValid.value = null;
            return;
        }
        const token = getAuthToken();
        if (!token) {
            phoneCheckValid.value = null;
            return;
        }
        try {
            phoneCheckLoading.value = true;
            const res = await apiService.checkBeletPhone(token, `993${digits}`);
            const ok = res?.success ?? true;
            phoneCheckValid.value = !!ok;
            if (!phoneCheckValid.value) isVerifyModalOpen.value = true;
        } catch {
            phoneCheckValid.value = false;
            isVerifyModalOpen.value = true;
        } finally {
            phoneCheckLoading.value = false;
        }
    };

    const userStore = useUserStore();
    const bankOptions = ref([]);
    const selectedBankName = ref(null);
    const errors = ref({ phone: false, bank: false, amount: false });
    const bankTitleClass = computed(() => (errors.value.bank ? 'border-solid border-[1px] border-red-500' : ''));

    const amountOptions = ref([]);
    const selectedAmount = ref(null);
    const balancesLoading = ref(false);

    const getAuthToken = () =>
        userStore.authToken ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        '';
    const parseItems = (res) => {
        const list = res?.data?.items || res?.items || res?.data || res || [];
        return Array.isArray(list) ? list : [];
    };

    const fetchBanks = async () => {
        const token = getAuthToken();
        if (!token) {
            bankOptions.value = [];
            return;
        }
        try {
            const res = await apiService.fetchBanksAuth(token);
            bankOptions.value = parseItems(res).map((it) => ({
                id: it.id,
                name: it.name,
                bank_name: it.bank_name,
            }));
        } catch {
            bankOptions.value = [];
        }
    };

    const fetchBalances = async () => {
        const token = getAuthToken();
        if (!token) {
            amountOptions.value = [];
            return;
        }
        try {
            balancesLoading.value = true;
            const res = await apiService.fetchBeletBalancesAuth(token);
            amountOptions.value = parseItems(res).map((it) => ({
                title: it.title,
                value: it.value,
            }));
        } catch {
            amountOptions.value = [];
        } finally {
            balancesLoading.value = false;
        }
    };

    const handleBankSelected = (option) => {
        selectedBankName.value = typeof option === 'object' ? option.bank_name : option;
        errors.value.bank = false;
    };

    const customAmount = ref('');
    const onCustomAmountFocus = () => {
        selectedAmount.value = null;
    };
    const onCustomAmountInput = (e) => {
        let v = e?.target?.value ?? customAmount.value;
        v = String(v || '').replace(/[^\d]/g, '');
        if (!v) {
            customAmount.value = '';
            return;
        }
        let n = Math.floor(Number(v));
        if (!Number.isFinite(n)) {
            customAmount.value = '';
            return;
        }
        if (n < 1) n = 1;
        if (n > 500) n = 500;
        customAmount.value = n;
        selectedAmount.value = null;
    };

    const canSubmit = computed(() => {
        const phoneOk = phoneCheckValid.value === true;
        const bankOk = !!selectedBankName.value;
        const amountOk = selectedAmount.value != null || Number(customAmount.value || 0) >= 1;
        return phoneOk && bankOk && amountOk;
    });

    const submitBelet = async () => {
        errors.value.phone = false;
        errors.value.bank = false;
        errors.value.amount = false;

        const digits = String(phone.value || '').trim();
        if (digits.length !== 8) {
            isPhoneError.value = true;
            errors.value.phone = true;
            toast.error('Введите корректный номер телефона');
            return;
        }
        await checkPhone();
        if (phoneCheckValid.value !== true) {
            isPhoneError.value = true;
            errors.value.phone = true;
            toast.error('Номер телефона не зарегистрирован в Belet');
            return;
        }

        if (!selectedBankName.value) {
            errors.value.bank = true;
            toast.error('Выберите филиал банка');
            return;
        }

        const chosenAmount = selectedAmount.value != null
            ? Number(selectedAmount.value)
            : customAmount.value
                ? Number(customAmount.value)
                : NaN;
        if (!Number.isFinite(chosenAmount) || chosenAmount < 1) {
            errors.value.amount = true;
            toast.error('Выберите сумму оплаты');
            return;
        }

        submitting.value = true;
        const payload = {
            bank_name: selectedBankName.value || undefined,
            amount_in_manats: selectedAmount.value != null
                ? Number(selectedAmount.value)
                : customAmount.value
                    ? Number(customAmount.value)
                    : undefined,
            phone: phone.value ? `993${String(phone.value)}` : undefined,
        };
        try {
            const token = getAuthToken();
            console.log('Belet top-up payload:', payload);
            const res = await apiService.submitBeletTopUp(payload, token);
            console.log('Belet top-up response:', res);
            const ok = !!(res?.success ?? false);
            const url = res?.data?.form_url || res?.form_url || '';
            if (ok && /^https?:\/\//i.test(String(url))) {
                window.location.href = String(url);
            }
        } finally {
            submitting.value = false;
        }
    };
    watch(selectedAmount, (v) => {
        if (v != null) errors.value.amount = false;
    });
    watch(customAmount, (v) => {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 1) errors.value.amount = false;
    });

    onMounted(() => {
        fetchBanks();
        fetchBalances();
    });
    watch(locale, () => {
        fetchBanks();
        fetchBalances();
    });
    watch(() => userStore.authToken, () => {
        fetchBanks();
        fetchBalances();
    });
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center mb-[22px] gap-2">
                    <RouterLink to="/dashboard" class="text-[#6F736D] text-[28px] font-bold">
                        {{ t('dashboard.PageTitles.home') }}
                    </RouterLink>
                    <p class="text-[28px] font-bold">
                        / Belet Film
                    </p>
                </div>

                <form class="grid grid-cols-12 gap-4" @submit.prevent="submitBelet">
                    <div class="col-span-5 p-[22px] rounded-[20px] bg-mainWhite">
                        <div class="block">
                            <label for="phone_s" class="block text-[15px] font-bold text-[#191B19] mb-4">
                                {{ t('form.input.enterPhone') }}
                            </label>
                            <div class="flex relative">
                                <input type="number" value="+993" placeholder="+993" readonly
                                    class="py-3 text-center rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] mr-1 w-[72px] block">

                                <input type="number" id="phone_s" :placeholder="t('form.input.enterPhone')"
                                    v-model="phone" @input="onPhoneInput" @blur="checkPhone"
                                    :class="['py-3 px-5 rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] w-[calc(100%-75px)]', { 'border-solid border border-red-500': isPhoneError }]">

                                <span class="absolute top-1/2 right-5 -translate-y-1/2 z-10">
                                    <svg v-show="phoneCheckLoading" :class="phoneCheckLoading ? 'animate-spin' : ''"
                                        width="18" height="18" viewBox="0 0 18 18" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <mask id="path-1-inside-1_613_3287" fill="white">
                                            <path
                                                d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9L2.9914 9C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914L9 0Z" />
                                        </mask>
                                        <path
                                            d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9L2.9914 9C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914L9 0Z"
                                            stroke="#2C702C" stroke-width="8" mask="url(#path-1-inside-1_613_3287)" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-col h-fit mt-5">
                            <h6 class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.select.selectBankBranch') }}
                            </h6>

                            <CustomDropdown :options="bankOptions" :placeholder="t('form.select.bankBranch')"
                                :titleClass="bankTitleClass" @option-selected="handleBankSelected" />
                        </div>
                    </div>

                    <div class="col-span-7 p-[22px] rounded-[20px] bg-mainWhite">
                        <div class="flex flex-col h-fit mb-4">
                            <h6 class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.paymentOptions') }}
                            </h6>

                            <div class="grid grid-cols-2 gap-4">
                                <template v-if="balancesLoading">
                                    <div v-for="i in 3" :key="'sk-' + i" class="flex items-center">
                                        <div class="w-full h-[40px] rounded-[7px] bg-[#EEF2ED] animate-pulse"></div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div v-for="(opt, idx) in amountOptions" :key="idx" class="flex items-center">
                                        <input type="radio" class="payment-check hidden"
                                            :id="`payment-check-${idx + 1}`" name="payment-check" :value="opt.value"
                                            v-model="selectedAmount">
                                        <label :for="`payment-check-${idx + 1}`"
                                            :class="['text-[15px] font-Gilroy', errors.amount ? 'border-solid border border-red-500 rounded-[7px]' : '']">
                                            {{ opt.title }}
                                        </label>
                                    </div>
                                </template>

                                <div class="flex items-center relative">
                                    <input type="number" min="1" max="500" v-model="customAmount"
                                        @input="onCustomAmountInput" @focus="onCustomAmountFocus"
                                        class="bg-[#EEF2ED] p-[10px] w-[calc(100%-0px)] rounded-[7px] text-[15px] font-medium text-center"
                                        placeholder="-">
                                </div>
                            </div>
                        </div>

                        <button type="submit" :disabled="!canSubmit || submitting" :class="[
                            'bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] w-full md:min-w-[300px] py-[14px] text-[15px] flex items-center justify-center gap-3',
                            (!canSubmit || submitting) ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                        ]">
                            {{ t('dashboard.btn.pay') }}

                            <svg v-show="!submitting" width="7" height="13" viewBox="0 0 7 13" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.164822 0.960766C0.11256 0.908503 0.071104 0.846459 0.04282 0.778176C0.014536 0.709892 -2.23984e-05 0.636706 -2.23919e-05 0.562796C-2.23855e-05 0.488887 0.014536 0.415701 0.04282 0.347417C0.071104 0.279134 0.11256 0.217089 0.164822 0.164827C0.217084 0.112565 0.279128 0.0711096 0.347412 0.0428256C0.415695 0.0145416 0.488881 -1.67599e-05 0.562791 -1.67534e-05C0.636701 -1.6747e-05 0.709887 0.0145417 0.77817 0.0428257C0.846454 0.0711096 0.908498 0.112566 0.96076 0.164828L6.58576 5.78983C6.63806 5.84207 6.67955 5.90411 6.70786 5.97239C6.73616 6.04068 6.75073 6.11388 6.75073 6.1878C6.75073 6.26172 6.73616 6.33492 6.70786 6.4032C6.67955 6.47149 6.63806 6.53353 6.58576 6.58577L0.960759 12.2108C0.855211 12.3163 0.712057 12.3756 0.56279 12.3756C0.413523 12.3756 0.270369 12.3163 0.164821 12.2108C0.059273 12.1052 -2.33855e-05 11.9621 -2.33754e-05 11.8128C-2.33653e-05 11.6635 0.0592731 11.5204 0.164821 11.4148L5.39256 6.1878L0.164822 0.960766Z"
                                    fill="#EEF2ED" />
                            </svg>

                            <svg v-show="submitting" :class="submitting ? 'animate-spin' : ''" width="18" height="18"
                                viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="path-1-inside-1_442_1166" fill="white">
                                    <path
                                        d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9H2.9914C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914V0Z" />
                                </mask>
                                <path
                                    d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9H2.9914C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914V0Z"
                                    stroke="#EEF2ED" stroke-width="8" mask="url(#path-1-inside-1_442_1166)" />
                            </svg>
                        </button>
                    </div>
                </form>

                <div v-if="isVerifyModalOpen" class="fixed inset-0 z-[60]">
                    <div class="absolute inset-0 bg-[#000]/50" @click="closeVerifyModal"></div>
                    <div
                        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-mainWhite rounded-[20px] p-6 w-[90%] max-w-[520px] shadow-lg">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-[20px] font-bold text-[#1D2417]">
                                Unregistered phone nomber
                            </h3>
                            <button type="button" class="w-6 h-6" @click="closeVerifyModal">
                                <svg class="w-full h-full object-contain" width="20" height="20" viewBox="0 0 20 20"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M11.4141 10.0001L16.7071 15.2931C16.8947 15.4806 17.0001 15.735 17.0001 16.0001C17.0001 16.2652 16.8947 16.5196 16.7071 16.7071C16.5196 16.8947 16.2652 17.0001 16.0001 17.0001C15.735 17.0001 15.4806 16.8947 15.2931 16.7071L10.0001 11.4141L4.70711 16.7071C4.51956 16.8947 4.26522 17.0001 4.00011 17.0001C3.735 17.0001 3.48066 16.8947 3.29311 16.7071C3.10556 16.5196 3.00012 16.2652 3.00012 16.0001C3.00012 15.735 3.10556 15.4806 3.29311 15.2931L8.58611 10.0001L3.29311 4.7071C3.10556 4.51955 3.00012 4.26521 3.00012 4.0001C3.00012 3.73499 3.10556 3.48065 3.29311 3.2931C3.48066 3.10555 3.735 3.00011 4.00011 3.00011C4.26522 3.00011 4.51956 3.10555 4.70711 3.2931L10.0001 8.58611L15.2931 3.2931C15.4806 3.10555 15.735 3.00011 16.0001 3.00011C16.2652 3.00011 16.5196 3.10555 16.7071 3.2931C16.8947 3.48065 17.0001 3.73499 17.0001 4.0001C17.0001 4.26521 16.8947 4.51955 16.7071 4.7071L11.4141 10.0001Z"
                                        fill="#191B19" />
                                </svg>
                            </button>
                        </div>

                        <p class="text-[15px] text-[#6F736D] mb-5 text-center">
                            You don't have registered phone number in Belet film. To proceed payment, first you need to
                            register phone
                            number in Belet film.
                        </p>

                        <div class="flex items-center justify-center">
                            <button type="button"
                                class="text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[10px] text-center"
                                @click="proceedToVerify">
                                Register
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </section>
</template>



<style scoped>
    .payment-check~label {
        background-color: #EEF2ED;
        display: block;
        width: 100%;
        text-align: center;
        padding: 12px;
        border-radius: 7px;

        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.3s linear;
    }

    .payment-check~label:hover {
        background: #2C702C;
        color: #fff;
    }

    .payment-check:checked~label {
        background: #2C702C;
        color: #fff;
    }
</style>
