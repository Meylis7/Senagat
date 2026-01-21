<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import Date from '@/components/dashboard/Date.vue';
    import Loading from '@/components/dashboard/Loading.vue';
    import CustomDropdown from '@/components/dashboard/CustomDropdown.vue';
    import { ref, computed, onMounted, watch } from 'vue';
    import apiService from '@/services/apiService';
    import { useI18n } from 'vue-i18n';
    import { toast } from 'vue3-toastify';
    import { useUserStore } from '@/stores/userStore';
    const { t, locale } = useI18n()
    const route = useRoute();
    const userStore = useUserStore();
    const cardTitle = ref('');
    const loadCardTitle = async () => {
        const id = Number(route.query.id) || 0;
        if (id) {
            try {
                const res = await apiService.fetchCardTypes();
                const list = res?.data || res || [];
                const arr = Array.isArray(list) ? list : [];
                const match = arr.find((it) => Number(it.id) === id);
                cardTitle.value = match?.title || String(route.query.title || '');
            } catch {
                cardTitle.value = String(route.query.title || '');
            }
        } else {
            cardTitle.value = String(route.query.title || '');
        }
    };
    onMounted(() => {
        loadCardTitle();
    });
    const submitting = ref(false);
    const workPosition = ref('');
    const workPhone = ref('');
    const secretWord = ref('');
    const email = ref('');
    const internetService = ref(false);
    const deliveryService = ref(false);
    const overlayOpen = ref(false);
    const overlayLoading = ref(false);
    const errors = ref({
        workPosition: false,
        workPhone: false,
        secretWord: false,
        email: false,
        branch: false,
    });
    const isValidEmail = (val) => {
        const v = String(val || '').trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    };

    const validateForm = () => {
        errors.value.workPosition = !String(workPosition.value || '').trim();
        errors.value.workPhone = !String(workPhone.value || '').trim();
        errors.value.secretWord = !String(secretWord.value || '').trim();
        const emailVal = String(email.value || '').trim();
        errors.value.email = !emailVal || !isValidEmail(emailVal);
        errors.value.branch = !selectedBranch.value;
        const anyError = Object.values(errors.value).some(Boolean);
        if (anyError) {
            if (errors.value.branch) toast.error('Выберите филиал банка');
            if (errors.value.workPosition) toast.error('Введите должность');
            if (errors.value.workPhone) toast.error('Введите рабочий телефон');
            if (errors.value.secretWord) toast.error('Введите секретный код');
            if (!emailVal) toast.error('Введите email');
            else if (!isValidEmail(emailVal)) toast.error('Введите корректный email');
        }
        return !anyError;
    };

    const submitCardOrder = async () => {
        submitting.value = true;
        const cardTypeId = Number(route.query.id) || 0;
        if (!cardTypeId) {
            toast.error('Тип карты не указан. Откройте из списка карт.');
            submitting.value = false;
            return;
        }
        if (!validateForm()) {
            submitting.value = false;
            return;
        }
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
                card_type_id: cardTypeId,
                bank_branch_id: selectedBranch.value,
                work_position: workPosition.value || undefined,
                work_phone: workPhone.value ? Number(workPhone.value) : undefined,
                internet_service: Boolean(internetService.value),
                delivery: Boolean(deliveryService.value),
                secret_word: secretWord.value || undefined,
                email: email.value || undefined,
            };
            await apiService.submitCardOrder(payload, token);
            toast.success('Заявка отправлена');
            overlayLoading.value = false;
        } catch (e) {
            const msg = String(e?.message || 'Ошибка отправки заявки');
            toast.error(msg);
            overlayOpen.value = false;
        } finally {
            submitting.value = false;
        }
    };
    // Fetch branches like CertificateApplicationView ===============================================
    const branchOptions = ref([]);
    const selectedBranch = ref(null);
    const branchTitleClass = computed(() => (errors.value.branch ? 'border-solid border-[1px] border-red-500' : ''));
    const handleBranchSelected = (option) => {
        selectedBranch.value = typeof option === 'object' ? option.id : option;
        errors.value.branch = false;
    };
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
    onMounted(() => {
        fetchBranches();
    });
    watch(locale, () => {
        fetchBranches();
        loadCardTitle();
    });
    watch(workPosition, (val) => {
        if (String(val || '').trim()) errors.value.workPosition = false;
    });
    watch(workPhone, (val) => {
        if (String(val || '').trim()) errors.value.workPhone = false;
    });
    watch(secretWord, (val) => {
        if (String(val || '').trim()) errors.value.secretWord = false;
    });
    watch(email, (val) => {
        const v = String(val || '').trim();
        if (v && isValidEmail(v)) errors.value.email = false;
    });


</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="warp">
                <Loading :open="overlayOpen" :loading="overlayLoading" />
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center">
                        <RouterLink :to="{ name: 'dashboard.cards' }"
                            class="text-[#6F736D] text-[28px] font-bold leading-tight">
                            {{ t('dashboard.cards') }}
                        </RouterLink>
                        <p class="text-[28px] font-bold leading-tight">
                            / {{ cardTitle }}
                        </p>
                    </div>

                    <Date />
                </div>

                <form class="grid grid-cols-12 gap-4" @submit.prevent="submitCardOrder">
                    <div class="col-span-4">
                        <div class="flex flex-col h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <h6 class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.select.selectBankBranch') }}
                            </h6>

                            <CustomDropdown :options="branchOptions" :placeholder="t('form.select.bankBranch')"
                                :titleClass="branchTitleClass" @option-selected="handleBranchSelected" />
                        </div>
                    </div>

                    <div class="col-span-4">
                        <div class="flex flex-col h-fit gap-4 p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <div class="block">
                                <label for="work_position" class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.input.position') }}
                                </label>
                                <input
                                    class="block w-full text-[15px] bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    :class="{ 'border-solid border-[1px] border-red-500': errors.workPosition }"
                                    type="text" id="work_position" :placeholder="t('form.input.position')"
                                    v-model="workPosition">
                            </div>
                            <div class="block">
                                <label for="work_phone" class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.input.workPhone') }}
                                </label>
                                <input
                                    class="block w-full text-[15px] bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    :class="{ 'border-solid border-[1px] border-red-500': errors.workPhone }"
                                    type="text" id="work_phone" :placeholder="t('form.input.workPhone')"
                                    v-model="workPhone">
                            </div>

                            <div class="block">
                                <label for="secret_word" class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.input.secretCode') }}
                                </label>
                                <input
                                    class="block w-full text-[15px] bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    :class="{ 'border-solid border-[1px] border-red-500': errors.secretWord }"
                                    type="text" id="secret_word" placeholder="Секретный код" v-model="secretWord">
                            </div>

                            <div class="block">
                                <label for="email" class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.input.email') }}
                                </label>
                                <input
                                    class="block w-full text-[15px] bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    :class="{ 'border-solid border-[1px] border-red-500': errors.email }" type="text"
                                    id="email" :placeholder="t('form.input.email')" v-model="email">
                            </div>
                        </div>
                    </div>

                    <div class="col-span-4">
                        <div class="flex flex-col h-fit gap-4 p-[22px] rounded-[20px] mb-4 bg-mainWhite">

                            <div class="block mb-4">
                                <label class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.select.internetService') }}
                                </label>
                                <div class="flex items-center gap-6">
                                    <div class="block">
                                        <input type="radio" name="internet" id="yes-internet" class="radio hidden"
                                            :checked="internetService" @change="internetService = true">
                                        <label for="yes-internet"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            {{ t('form.select.yes') }}
                                        </label>
                                    </div>

                                    <div class="block">
                                        <input type="radio" name="internet" id="no-internet" class="radio hidden"
                                            :checked="!internetService" @change="internetService = false">
                                        <label for="no-internet"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            {{ t('form.select.no') }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="block mb-4">
                                <label class="text-[15px] font-bold mb-[10px] block">
                                    {{ t('form.select.delivery') }}
                                </label>
                                <div class="flex items-center gap-6">
                                    <div class="block">
                                        <input type="radio" name="delivery" id="yes-delivery" class="radio hidden"
                                            :checked="deliveryService" @change="deliveryService = true">
                                        <label for="yes-delivery"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            {{ t('form.select.yes') }}
                                        </label>
                                    </div>

                                    <div class="block">
                                        <input type="radio" name="delivery" id="no-delivery" class="radio hidden"
                                            :checked="!deliveryService" @change="deliveryService = false">
                                        <label for="no-delivery"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            {{ t('form.select.no') }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit"
                                class="my-4 bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] w-full mt-auto"
                                :disabled="submitting">
                                {{ t('dashboard.btn.sendApplication') }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped>
    .radio~label {
        position: relative;
        padding-left: 40px;
        cursor: pointer;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #EEF2ED;
        }

        &::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #2C702C;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
    }

    .radio:checked~label::after {
        opacity: 100%;
    }
</style>
