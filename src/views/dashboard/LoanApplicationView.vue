<script setup>
    import Date from '@/components/dashboard/Date.vue';
    import CustomDropdown from '@/components/dashboard/CustomDropdown.vue';
    import Loading from '@/components/dashboard/Loading.vue';
    import { ref, computed, onMounted, watch } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import apiService from '@/services/apiService'
    import { toast } from 'vue3-toastify'
    import { useUserStore } from '@/stores/userStore';
    const { t, locale } = useI18n()



    // Loan types loaded from API
    const loanOptions = ref([]);
    const selectedLoanId = ref(null);
    const loanTitleClass = ref('');
    const activeStep = ref(1);
    const roleOptions = ['Manager', 'Entrepreneur'];
    const filteredLoanOptions = computed(() => {
        const arr = Array.isArray(loanOptions.value) ? loanOptions.value : [];
        return arr.filter((it) => it?.min_amount != null && it?.max_amount != null);
    });

    const branchOptions = ref([]);
    const selectedBranch = ref(null);
    const branchTitleClass = ref('');
    const selectedRole = ref(null);
    const roleId = ref(null);
    const roleLabelClass = ref('');
    const patentClass = ref('');
    const registrationClass = ref('');
    const workAddressClass = ref('');
    const workplaceClass = ref('');
    const positionClass = ref('');
    const managerWorkAddressClass = ref('');
    const salaryClass = ref('');

    const isManager = computed(() => (selectedRole.value || '').toLowerCase() === 'manager');
    const isEntrepreneur = computed(() => (selectedRole.value || '').toLowerCase() === 'entrepreneur');
    const patentNumber = ref('');
    const registrationNumber = ref('');
    const workAddress = ref('');
    const workplace = ref('');
    const position = ref('');
    const managerWorkAddress = ref('');
    const salary = ref('');
    const loadingOpen = ref(false);
    const loadingActive = ref(false);
    const userStore = useUserStore();
    const proceedToStep2 = () => {
        if (!selectedLoanId.value) {
            loanTitleClass.value = 'border-solid border-[1px] border-red-500';
            toast.error('Выберите тип кредита');
            return;
        }
        loanTitleClass.value = '';
        activeStep.value = 2;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle dropdown selection
    const handleOptionSelected = (option) => {
        const id = typeof option === 'object' ? option.id : option;
        selectedLoanId.value = id;
        loanTitleClass.value = '';
        const found = Array.isArray(loanOptions.value) ? loanOptions.value.find(it => it.id === id) : null;
        if (found) {
            credit.value = found;
            const minA = Number(found?.min_amount);
            const maxA = Number(found?.max_amount);
            if (Number.isFinite(minA) && Number.isFinite(maxA) && maxA > minA) {
                creditAmount.value = roundToStep(minA, 100);
            }
        }
    };
    const handleRoleSelected = (option) => {
        const value = typeof option === 'object'
            ? (option.title ?? option.name ?? option.label ?? option.value ?? '')
            : option;
        selectedRole.value = value;
        const lower = (value || '').toLowerCase();
        roleId.value = lower === 'manager' ? 'manager' : (lower === 'entrepreneur' ? 'entrepreneur' : null);
        roleLabelClass.value = '';
    };
    const handleBranchSelected = (option) => {
        selectedBranch.value = typeof option === 'object' ? option.id : option;
        branchTitleClass.value = '';
    };

    // Calculate credit min and max amount
    const credit = ref(null)
    const creditMin = computed(() => {
        const minAmount = Number(credit.value?.min_amount)
        return Number.isFinite(minAmount) && minAmount > 0 ? minAmount : 0
    })
    const creditMax = computed(() => {
        const maxAmount = Number(credit.value?.max_amount)
        return Number.isFinite(maxAmount) && maxAmount > 0 ? maxAmount : 0
    })
    const creditAmount = ref(0);


    // Utility Functions =========================================================================
    const formatMoney = (amount) => amount.toLocaleString('ru-RU');
    const toFixedDown = (value, digits = 2) => {
        const p = 10 ** digits
        return Math.trunc(Number(value) * p) / p
    }
    const formatMoneyFixed = (amount, digits = 2) => toFixedDown(amount, digits).toLocaleString('ru-RU', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const roundToStep = (value, step) => Math.round(value / step) * step;

    // Term Options ==============================================================================
    const creditSelectedTerm = ref('');
    const creditSelectedTermMonths = ref(0);
    const termOptions = computed(() => {
        const termYears = Number(credit.value?.term);
        const maxYears = Number.isFinite(termYears) && termYears > 0 ? termYears : NaN;
        const steps = Number.isFinite(maxYears)
            ? Array.from({ length: maxYears }, (_, index) => index + 1)
            : [];
        return steps.map((years) => ({
            label: `${years} ${(() => {
                if (locale.value === 'ru') {
                    const mod10 = years % 10;
                    const mod100 = years % 100;
                    if (mod10 === 1 && mod100 !== 11) return t('date.year');
                    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return t('date.yearsFew');
                    return t('date.years');
                }
                return years === 1 ? t('date.year') : t('date.years');
            })()}`,
            months: years * 12,
        }));
    })

    const fetchLoanTypes = async () => {
        try {
            const res = await apiService.fetchCreditTypes();
            const list = res?.data || res || [];
            const arr = Array.isArray(list) ? list : [];
            loanOptions.value = arr.map(it => ({
                id: it.id,
                title: it.title,
                description: it.description,
                term: it.term,
                term_text: it.term_text,
                min_amount: it.min_amount,
                max_amount: it.max_amount,
                interest: it.interest,
                image_url: it.image_url,
                background_color: it.background_color,
            }));
        } catch {
            loanOptions.value = [];
        }
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
        fetchLoanTypes()
        fetchBranches()
    })

    watch(termOptions, (opts) => {
        const first = Array.isArray(opts) && opts.length ? opts[0] : null
        if (first) {
            creditSelectedTerm.value = first.label
            creditSelectedTermMonths.value = first.months
        }
    }, { immediate: true })

    watch(locale, () => {
        fetchLoanTypes()
        fetchBranches()
    })

    const progressPercent = computed(() => {
        const min = creditMin.value
        const max = creditMax.value
        const denom = max - min
        if (!Number.isFinite(min) || !Number.isFinite(max) || denom <= 0) return '0%'
        const selectedAmount = clamp(creditAmount.value, min, max)
        return ((selectedAmount - min) / denom) * 100 + '%'
    })

    watch([creditMin, creditMax], ([min, max]) => {
        if (hasAmountRange.value && Number.isFinite(min) && Number.isFinite(max) && max > min) {
            creditAmount.value = min
        }
    })

    const hasAmountRange = computed(() => {
        const creditData = credit.value
        return !!(creditData && creditData.min_amount != null && creditData.max_amount != null)
    })

    const monthlyRate = computed(() => {
        const interestPercent = Number(credit.value?.interest)
        return Number.isFinite(interestPercent) && interestPercent > 0 ? interestPercent / 100 : 0
    })

    const monthlyPayment = computed(() => {
        if (!selectedLoanId.value || !credit.value) return 0
        const principal = clamp(roundToStep(Number(creditAmount.value) || 0, 100), creditMin.value, creditMax.value)
        const totalMonths = Number(creditSelectedTermMonths.value) || 0
        const monthlyInterestRate = monthlyRate.value
        if (!Number.isFinite(principal) || !Number.isFinite(totalMonths) || totalMonths <= 0) return 0
        return (principal + principal * monthlyInterestRate) / totalMonths
    })

    const totalPayment = computed(() => {
        const totalMonths = Number(creditSelectedTermMonths.value) || 0
        return toFixedDown(monthlyPayment.value * totalMonths, 2)
    })
    const validateForm = () => {
        let errors = 0;
        if (!selectedLoanId.value) {
            errors++;
            toast.error('Выберите тип кредита');
        }
        if (!roleId.value) {
            roleLabelClass.value = 'text-red-500';
            errors++;
        } else {
            roleLabelClass.value = '';
        }
        if (!selectedBranch.value) {
            branchTitleClass.value = 'border-solid border-[1px] border-red-500';
            errors++;
        } else {
            branchTitleClass.value = '';
        }
        if (roleId.value === 'entrepreneur') {
            if (!String(patentNumber.value || '').trim()) { patentClass.value = 'border-solid border-[1px] border-red-500'; errors++; } else { patentClass.value = ''; }
            if (!String(registrationNumber.value || '').trim()) { registrationClass.value = 'border-solid border-[1px] border-red-500'; errors++; } else { registrationClass.value = ''; }
            if (!String(workAddress.value || '').trim()) { workAddressClass.value = 'border-solid border-[1px] border-red-500'; errors++; } else { workAddressClass.value = ''; }
        }
        if (roleId.value === 'manager') {
            if (!String(workplace.value || '').trim()) { workplaceClass.value = 'border-solid border-[1px] border-red-500'; errors++; } else { workplaceClass.value = ''; }
            if (!String(position.value || '').trim()) { positionClass.value = 'border-solid border-[1px] border-red-500'; errors++; } else { positionClass.value = ''; }
            if (!String(managerWorkAddress.value || '').trim()) { managerWorkAddressClass.value = 'border-solid border-[1px] border-red-500'; errors++; } else { managerWorkAddressClass.value = ''; }
        }
        if (!(Number(salary.value) > 0)) {
            salaryClass.value = 'border-solid border-[1px] border-red-500';
            errors++;
        } else {
            salaryClass.value = '';
        }
        if (errors > 0) {
            if (errors > 1) toast.error('Заполните обязательные поля');
            return false;
        }
        return true;
    }
    const submitApplication = async () => {
        if (!validateForm()) return;
        loadingOpen.value = true;
        loadingActive.value = true;
        const payload = {
            credit_id: selectedLoanId.value,
            term: Math.round((Number(creditSelectedTermMonths.value) || 0) / 12),
            amount: Number(creditAmount.value) || 0,
            monthly_payment: Number(monthlyPayment.value) || 0,
            role: roleId.value,
            patent_number: isEntrepreneur.value ? (patentNumber.value || undefined) : undefined,
            registration_number: isEntrepreneur.value ? (registrationNumber.value || undefined) : undefined,
            work_address: isEntrepreneur.value ? (workAddress.value || undefined) : undefined,
            workplace: isManager.value ? (workplace.value || undefined) : undefined,
            position: isManager.value ? (position.value || undefined) : undefined,
            manager_work_address: isManager.value ? (managerWorkAddress.value || undefined) : undefined,
            salary: salary.value ? Number(salary.value) : undefined,
            bank_branch_id: selectedBranch.value,
        };
        try {
            const token =
                userStore.authToken ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('access_token') ||
                localStorage.getItem('token') ||
                '';
            await apiService.submitCreditOrder(payload, token);
            loadingActive.value = false;
            toast.success('Заявка отправлена');
        } catch (e) {
            const msg = String(e?.message || 'Ошибка отправки заявки');
            if (msg.toLowerCase().includes('unauthenticated') || msg.includes('401')) {
                toast.error('Авторизация истекла. Войдите заново.');
            } else {
                toast.error(msg);
            }
            loadingOpen.value = false;
            loadingActive.value = true;
        }
    };

    watch(patentNumber, (v) => { if (String(v || '').trim()) patentClass.value = '' })
    watch(registrationNumber, (v) => { if (String(v || '').trim()) registrationClass.value = '' })
    watch(workAddress, (v) => { if (String(v || '').trim()) workAddressClass.value = '' })
    watch(workplace, (v) => { if (String(v || '').trim()) workplaceClass.value = '' })
    watch(position, (v) => { if (String(v || '').trim()) positionClass.value = '' })
    watch(managerWorkAddress, (v) => { if (String(v || '').trim()) managerWorkAddressClass.value = '' })
    watch(salary, (v) => { if (Number(v) > 0) salaryClass.value = '' })
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="warp">
                <Loading :open="loadingOpen" :loading="loadingActive" />
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center mb-[22px]">
                        <RouterLink :to="{ name: 'dashboard.payments' }" class="text-[#6F736D] text-[28px] font-bold">
                            {{ t('dashboard.header.services') }}
                        </RouterLink>
                        <p class="text-[28px] font-bold">
                            /{{ t('dashboard.services.loanApplication') }}
                        </p>
                    </div>

                    <Date />
                </div>

                <form @submit.prevent="submitApplication">
                    <div v-if="activeStep === 1" class="grid grid-cols-12 gap-4">
                        <div class="col-span-4">
                            <div class="flex flex-col h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                                <h6 class="text-[17px] font-bold mb-4">
                                    {{ t('dashboard.blockTitiles.selectCreditType') }}
                                </h6>

                                <CustomDropdown :options="filteredLoanOptions" :placeholder="t('form.select.loanType')"
                                    :titleClass="loanTitleClass" @option-selected="handleOptionSelected" />
                            </div>
                        </div>

                        <div v-if="selectedLoanId" class="col-span-5">
                            <div class="bg-mainWhite rounded-[20px] p-6">
                                <div class="mb-6">
                                    <div class="bg-[#EEF2ED] rounded-[20px] p-5 relative">
                                        <label class="block text-[#6F736D] text-[17px] mb-1 leading-tight">
                                            {{ t('calc.loanAmount') }}
                                        </label>
                                        <h3 class="text-[17px] font-bold text-[#1D2417] leading-tight">{{
                                            formatMoney(creditAmount) }}
                                        </h3>

                                        <input type="range" :min="creditMin" :max="creditMax" step="100"
                                            v-model="creditAmount"
                                            class="amount-range w-full absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer max-w-[calc(100%-30px)]"
                                            :style="{ '--progress': progressPercent }" />
                                    </div>
                                    <div class="mt-3">

                                        <div class="flex justify-between text-[#6F736D] mt-2">
                                            <span>
                                                {{ credit && credit.min_amount ? formatMoney(credit.min_amount) :
                                                    formatMoney(creditMin) }}
                                            </span>
                                            <span>
                                                {{ credit && credit.max_amount ? formatMoney(credit.max_amount) :
                                                    formatMoney(creditMax) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-mainBlack font-bold mb-3"> {{ t('credit.term') }}</label>
                                    <div class="flex flex-wrap gap-3">
                                        <button v-for="opt in termOptions" :key="opt.label" type="button"
                                            @click="creditSelectedTerm = opt.label; creditSelectedTermMonths = opt.months"
                                            :class="creditSelectedTerm === opt.label ? 'bg-mainBlack text-white' : 'bg-white text-[#6F736D]'"
                                            class="h-[48px] px-5 rounded-[12px] leading-tight">{{ opt.label }}</button>
                                    </div>
                                </div>

                                <p class="text-[#6F736D] text-[17px] font-Gilroy mt-8 leading-6">
                                    {{ t('calc.calculatorDisclaimer') }}
                                </p>
                            </div>
                        </div>

                        <div v-if="selectedLoanId" class="col-span-3">
                            <div class="bg-mainWhite rounded-[20px] p-6 flex flex-col justify-center">
                                <div class="flex flex-col text-center items-center justify-between mb-6 gap-5">
                                    <div>
                                        <p class="text-[#6F736D] mb-2 leading-tight"> {{ t('calc.monthlyPayment') }}</p>
                                        <h3 class="text-[28px] font-bold leading-tight">{{
                                            formatMoneyFixed(monthlyPayment) }}
                                            {{ t('calc.currencyManat') }}
                                        </h3>
                                    </div>
                                    <div>
                                        <p class="text-[#6F736D] mb-2 leading-tight"> {{ t('calc.rate') }}</p>
                                        <h3 class="text-3xl font-bold leading-tight">{{ credit?.interest
                                            || 0 }}%
                                        </h3>
                                    </div>

                                    <!-- <div class="flex items-center justify-between w-full">
                                        <h6 class="text-[#6F736D] font-Gilroy text-[15px]">
                                            {{ t('calc.incomeStatement') }}
                                        </h6>

                                        <p class="text-[#191B19] font-Gilroy text-[15px]">
                                            1%
                                        </p>
                                    </div> -->
                                </div>

                                <button type="button" @click="proceedToStep2"
                                    class="block mt-auto text-center text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[20px] py-3">
                                    {{ t('dashboard.btn.submitApplication') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeStep === 2" class="grid grid-cols-12 gap-4 mt-10">
                        <div class="col-span-4">
                            <div
                                class="flex flex-col p-[22px] rounded-[20px] h-[calc(100%-16px)] gap-4 mb-4 bg-mainWhite">
                                <div class="block mb-4">
                                    <label class="text-[15px] font-bold mb-[10px] block">
                                        {{ t('form.select.selectBankBranch') }}
                                    </label>
                                    <CustomDropdown :options="branchOptions" :placeholder="t('form.select.bankBranch')"
                                        :titleClass="branchTitleClass" @option-selected="handleBranchSelected" />
                                </div>

                                <div class="block mb-4">
                                    <label :class="['text-[15px] font-bold mb-[10px] block', roleLabelClass]">
                                        {{ t('form.select.isEntrepreneur') }}
                                    </label>
                                    <div class="flex items-center gap-6">
                                        <div class="block">
                                            <input type="radio" name="role" id="role-yes-manager" class="role hidden"
                                                :checked="isManager" @change="handleRoleSelected('Manager')">
                                            <label for="role-yes-manager"
                                                class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                                {{ t('form.select.yes') }}
                                            </label>
                                        </div>

                                        <div class="block">
                                            <input type="radio" name="role" id="role-no-entrepreneur"
                                                class="role hidden" :checked="isEntrepreneur"
                                                @change="handleRoleSelected('Entrepreneur')">
                                            <label for="role-no-entrepreneur"
                                                class="block text-[15px] font-bold p-[12px] cursor-pointer">
                                                {{ t('form.select.no') }}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit"
                                    class="bg-[#2C702C] mt-auto rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-full">
                                    {{ t('dashboard.btn.sendApplication') }}
                                </button>
                            </div>
                        </div>

                        <div class="col-span-4">
                            <div
                                class="flex flex-col p-[22px] rounded-[20px] h-[calc(100%-16px)] gap-4 mb-4 bg-mainWhite">

                                <template v-if="isEntrepreneur">
                                    <div class="block">
                                        <label for="patent" class="text-[15px] font-bold mb-[10px] block">
                                            {{ t('form.input.patentNumber') }}
                                        </label>
                                        <input
                                            :class="['block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]', patentClass]"
                                            type="text" id="patent" :placeholder="t('form.input.patentNumber')"
                                            v-model="patentNumber">
                                    </div>
                                    <div class="block">
                                        <label for="getIssue" class="text-[15px] font-bold mb-[10px] block">
                                            {{ t('form.input.registrationNumber') }}
                                        </label>
                                        <input
                                            :class="['block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]', registrationClass]"
                                            type="text" id="getIssue" :placeholder="t('form.input.registrationNumber')"
                                            v-model="registrationNumber">
                                    </div>
                                    <div class="block">
                                        <label for="workAddress" class="text-[15px] font-bold mb-[10px] block">
                                            {{ t('form.input.workAddress') }}
                                        </label>
                                        <input
                                            :class="['block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]', workAddressClass]"
                                            type="text" id="workAddress" :placeholder="t('form.input.workAddress')"
                                            v-model="workAddress">
                                    </div>
                                </template>

                                <template v-if="isManager">
                                    <div class="block">
                                        <label for="workPlaceName" class="text-[15px] font-bold mb-[10px] block">
                                            {{ t('form.input.workplace') }}
                                        </label>
                                        <input
                                            :class="['block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]', workplaceClass]"
                                            type="text" id="workPlaceName" :placeholder="t('form.input.workplace')"
                                            v-model="workplace">
                                    </div>
                                    <div class="block">
                                        <label for="position" class="text-[15px] font-bold mb-[10px] block">
                                            {{ t('form.input.position') }}
                                        </label>
                                        <input
                                            :class="['block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]', positionClass]"
                                            type="text" id="position" :placeholder="t('form.input.position')"
                                            v-model="position">
                                    </div>
                                    <div class="block">
                                        <label for="workAddress2" class="text-[15px] font-bold mb-[10px] block">
                                            {{ t('form.input.workAddress') }}
                                        </label>
                                        <input
                                            :class="['block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]', managerWorkAddressClass]"
                                            type="text" id="workAddress2" :placeholder="t('form.input.workAddress')"
                                            v-model="managerWorkAddress">
                                    </div>
                                </template>

                                <div class="block">
                                    <label for="workAddress" class="text-[15px] font-bold mb-[10px] block">
                                         {{ t('form.input.salary') }}
                                    </label>
                                    <input
                                        :class="['block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]', salaryClass]"
                                        type="number" id="salary" :placeholder="t('form.input.salary')" v-model="salary">
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped>
    .amount-range {
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        border-radius: 9999px;
        background: linear-gradient(to right, #2C702C var(--progress, 0%), #E6EAE3 var(--progress, 0%));
        outline: none;
    }

    .amount-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: radial-gradient(circle at center, #2C702C 0 7px, #ffffff 8px);
        border: 0;
        box-shadow: 0 0 0 4px #ffffff;
        cursor: pointer;
        margin-top: 0px;
    }

    .amount-range::-moz-range-track {
        height: 8px;
        border-radius: 9999px;
        background: linear-gradient(to right, #2C702C var(--progress, 0%), #E6EAE3 var(--progress, 0%));
    }

    .amount-range::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: radial-gradient(circle at center, #2C702C 0 7px, #ffffff 8px);
        border: 0;
        box-shadow: 0 0 0 4px #ffffff;
        cursor: pointer;
    }

    .role~label {
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

    .role:checked~label::after {
        opacity: 100%;
    }
</style>
