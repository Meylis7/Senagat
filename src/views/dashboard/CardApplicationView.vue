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

    const route = useRoute();
    const userStore = useUserStore();
    const submitting = ref(false);
    const workPosition = ref('');
    const workPhone = ref('');
    const secretWord = ref('');
    const email = ref('');
    const internetService = ref(false);
    const deliveryService = ref(false);
    const overlayOpen = ref(false);
    const overlayLoading = ref(false);
    const cardTitle = computed(() => String(route.query.title || ''));

    const submitCardOrder = async () => {
        submitting.value = true;
        const cardTypeId = Number(route.query.id) || 0;
        if (!cardTypeId) {
            toast.error('Тип карты не указан. Откройте из списка карт.');
            submitting.value = false;
            return;
        }
        if (!selectedBranch.value) {
            toast.error('Выберите филиал банка');
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
    const { locale } = useI18n();
    const branchOptions = ref([]);
    const selectedBranch = ref(null);
    const branchTitleClass = computed(() => '');
    const handleBranchSelected = (option) => {
        selectedBranch.value = typeof option === 'object' ? option.id : option;
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
                            Карты
                        </RouterLink>
                        <p class="text-[28px] font-bold leading-tight">
                            /«{{ cardTitle }}»
                        </p>
                    </div>

                    <Date />
                </div>

                <form class="grid grid-cols-12 gap-4" @submit.prevent="submitCardOrder">
                    <div class="col-span-4">
                        <div class="flex flex-col h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <h6 class="text-[15px] font-bold mb-[10px] block">
                                Выберите тип cправки
                            </h6>

                            <CustomDropdown :options="branchOptions" placeholder="Филиал банка"
                                :titleClass="branchTitleClass" @option-selected="handleBranchSelected" />
                        </div>
                    </div>

                    <div class="col-span-4">
                        <div class="flex flex-col h-fit gap-4 p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <div class="block">
                                <label for="work_position" class="text-[15px] font-bold mb-[10px] block">
                                    Должность
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="work_position" placeholder="Должность" v-model="workPosition">
                            </div>
                            <div class="block">
                                <label for="work_phone" class="text-[15px] font-bold mb-[10px] block">
                                    Рабочий телефон
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="work_phone" placeholder="Рабочий телефон" v-model="workPhone">
                            </div>

                            <div class="block">
                                <label for="secret_word" class="text-[15px] font-bold mb-[10px] block">
                                    Секретный код
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="secret_word" placeholder="Секретный код" v-model="secretWord">
                            </div>

                            <div class="block">
                                <label for="email" class="text-[15px] font-bold mb-[10px] block">
                                    Email
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="email" placeholder="email" v-model="email">
                            </div>
                        </div>
                    </div>

                    <div class="col-span-4">
                        <div class="flex flex-col h-fit gap-4 p-[22px] rounded-[20px] mb-4 bg-mainWhite">

                            <div class="block mb-4">
                                <label class="text-[15px] font-bold mb-[10px] block">
                                    интернет сервис
                                </label>
                                <div class="flex items-center gap-6">
                                    <div class="block">
                                        <input type="radio" name="internet" id="yes-internet" class="radio hidden"
                                            :checked="internetService" @change="internetService = true">
                                        <label for="yes-internet"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            Yes
                                        </label>
                                    </div>

                                    <div class="block">
                                        <input type="radio" name="internet" id="no-internet" class="radio hidden"
                                            :checked="!internetService" @change="internetService = false">
                                        <label for="no-internet"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="block mb-4">
                                <label class="text-[15px] font-bold mb-[10px] block">
                                    доставка
                                </label>
                                <div class="flex items-center gap-6">
                                    <div class="block">
                                        <input type="radio" name="delivery" id="yes-delivery" class="radio hidden"
                                            :checked="deliveryService" @change="deliveryService = true">
                                        <label for="yes-delivery"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            Yes
                                        </label>
                                    </div>

                                    <div class="block">
                                        <input type="radio" name="delivery" id="no-delivery" class="radio hidden"
                                            :checked="!deliveryService" @change="deliveryService = false">
                                        <label for="no-delivery"
                                            class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit"
                                class="my-4 bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-full mt-auto"
                                :disabled="submitting">
                                Отправить заявку
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
