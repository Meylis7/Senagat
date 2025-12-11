<script setup>
    import { RouterLink } from 'vue-router';
    import Date from '@/components/dashboard/Date.vue';
    import CustomDropdown from '@/components/dashboard/CustomDropdown.vue';
    import { ref, computed } from 'vue';

    // Additional dropdown options
    const cityOptions = ['Ашхабад', 'Мары', 'Туркменабад', 'Дашогуз', 'Балканабад'];
    const bankOptions = ['Сенагат банк', 'Туркменбаши банк', 'Халкбанк', 'Рысгал банк'];

    // List of loan options
    const loanOptions = [
        'Молодым семьям',
        'Потребительский',
        'Свадьба и день рождения',
        'На образование',
        'Овердрафт',
        'Сельское хозяйство'
    ];

    // Handle dropdown selection
    const handleOptionSelected = (option) => {
        console.log('Selected option:', option);
    };

    // Calculator Section ========================================================================
    const calcActiveTab = ref('Кредит');
    const setCalcTab = (tab) => {
        calcActiveTab.value = tab;
    };
    const calcTabOrder = ['Кредит', 'Вклад'];
    const calcActiveIndex = computed(() => calcTabOrder.indexOf(calcActiveTab.value));

    // Deposit Form State ========================================================================
    // const depositTypes = ['Накопительный', 'Срочный', 'До востребования'];
    // const depositType = ref(depositTypes[0]);
    // const isDepositTypeOpen = ref(false);
    // const setDepositType = (t) => {
    //     depositType.value = t;
    //     isDepositTypeOpen.value = false;
    // };

    const depositMin = 5000;
    const depositMax = 60000;
    const depositAmount = ref(10000);
    const creditMin = 5000;
    const creditMax = 60000;
    const creditAmount = ref(10000);
    const creditTypes = ['Потребительский', 'Ипотечный', 'Автокредит'];
    const creditType = ref(creditTypes[0]);
    const isCreditTypeOpen = ref(false);
    const setCreditType = (t) => {
        creditType.value = t;
        isCreditTypeOpen.value = false;
    };

    // Utility Functions =========================================================================
    const formatMoney = (n) => n.toLocaleString('ru-RU');
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const roundToStep = (v, step) => Math.round(v / step) * step;

    // Input Handlers ============================================================================
    const onDepositAmountInput = (e) => {
        const raw = String(e.target.value).replace(/\D/g, '');
        const num = clamp(roundToStep(Number(raw || 0), 500), depositMin, depositMax);
        depositAmount.value = num;
        // reflect formatted value back to the input element
        e.target.value = formatMoney(num);
    };

    const onCreditAmountInput = (e) => {
        const raw = String(e.target.value).replace(/\D/g, '');
        const num = clamp(roundToStep(Number(raw || 0), 500), creditMin, creditMax);
        creditAmount.value = num;
        e.target.value = formatMoney(num);
    };

    // Term Options ==============================================================================
    const termOptions = ['1 год', '1.5 года', '2 год', '2.5 год', '3 год'];
    const selectedTerm = ref('2 год');
    const creditSelectedTerm = ref('2 год');
</script>

<template>
    <section class="pb-10">
        <div class="auto_container">
            <div class="warp">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center mb-[22px]">
                        <RouterLink :to="{ name: 'dashboard.payments' }" class="text-[#6F736D] text-[28px] font-bold">
                            Сервисы
                        </RouterLink>
                        <p class="text-[28px] font-bold">
                            /Заявка на кредит
                        </p>
                    </div>

                    <Date />
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-4">
                        <div class="flex flex-col h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <h6 class="text-[17px] font-bold mb-4">
                                Выберите тип кредита
                            </h6>

                            <!-- Using the new CustomDropdown component -->
                            <CustomDropdown :options="loanOptions" placeholder="Тип кридита"
                                @option-selected="handleOptionSelected" />
                        </div>
                    </div>

                    <div class=" col-span-5">
                        <div class="bg-mainWhite h-[calc(100%-16px)] rounded-[20px] p-[22px]">
                            <div class="mb-6">
                                <label class="block text-[#6F736D] text-[17px] mb-3">Сумма кредита</label>
                                <div class="h-[56px] bg-white rounded-[12px] flex items-center px-4">
                                    <input type="text" :value="formatMoney(creditAmount)" @input="onCreditAmountInput"
                                        class="w-full outline-none bg-transparent text-mainBlack font-bold" />
                                </div>
                                <div class="mt-3">
                                    <input type="range" :min="creditMin" :max="creditMax" step="500"
                                        v-model="creditAmount" class="w-full accent-[#2C702C]" />
                                    <div class="flex justify-between text-[#6F736D] mt-2">
                                        <span>{{ formatMoney(creditMin) }}</span>
                                        <span>{{ formatMoney(creditMax) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-mainBlack font-bold mb-3">Срок</label>
                                <div class="flex flex-wrap gap-3">
                                    <button v-for="term in termOptions" :key="term" type="button"
                                        @click="creditSelectedTerm = term"
                                        :class="creditSelectedTerm === term ? 'bg-[#1D2417] text-white' : 'bg-white text-[#6F736D]'"
                                        class="py-3 px-5 rounded-[20px] text-[15px] font-Gilroy">{{ term }}</button>
                                </div>
                            </div>

                            <p class="mt-[22px] text-[15px] text-[#6F736D] font-Gilroy">
                                Расчет предварительного платежа носит информационный характер и рассчитан при условии
                                оформления финансовой защиты кредита. Не является публичной офертой
                            </p>
                        </div>
                    </div>

                    <div class=" col-span-3">
                        <div class="flex flex-col h-[calc(100%-16px)] p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <h6 class="text-[15px] text-[#6F736D] mb-[10px] font-Gilroy">
                                Ежемесячный платеж
                            </h6>

                            <p class="text-[28px] font-bold mb-[22px]">
                                1000 манат
                            </p>

                            <div class="bg-[#EEF2ED] rounded-[10px] p-[22px] flex flex-col gap-3 mb-[22px]">
                                <h6 class="text-[15px] font-bold">
                                    Вам понадобится:
                                </h6>
                                <p class="text-[#6F736D] font-Gilroy text-[15px]">
                                    Паспорт
                                </p>
                                <p class="text-[#6F736D] font-Gilroy text-[15px]">
                                    Справка о доходах
                                </p>
                            </div>

                            <div class="flex items-center justify-between">
                                <h6 class="text-[#6F736D] font-Gilroy text-[15px]">
                                    Справка о доходах
                                </h6>

                                <p class="text-[#191B19] font-Gilroy text-[15px]">
                                    1%
                                </p>
                            </div>

                            <button type="submit"
                                class="my-4 bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-full">
                                Оплатить
                            </button>


                        </div>
                    </div>
                </div>

                <form class="grid grid-cols-12 gap-4 mt-10">
                    <div class="col-span-3">
                        <div class="flex flex-col p-[22px] rounded-[20px] gap-4 mb-4 bg-mainWhite h-[calc(100%-16px)]">
                            <div class="block">
                                <label for="name" class="text-[15px] font-bold mb-[10px] block">
                                    Имя
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="name" placeholder="Имя">
                            </div>
                            <div class="block">
                                <label for="fullName" class="text-[15px] font-bold mb-[10px] block">
                                    Фамилия
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="fullName" placeholder="Фамилия">
                            </div>
                            <div class="block">
                                <label for="patronymic" class="text-[15px] font-bold mb-[10px] block">
                                    Отчество
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="patronymic" placeholder="Отчество">
                            </div>

                            <h1 class="text-[48px] font-bold mt-auto">
                                1
                            </h1>
                        </div>
                    </div>

                    <div class="col-span-3">
                        <div class="flex flex-col p-[22px] rounded-[20px] h-[calc(100%-16px)] gap-4 mb-4 bg-mainWhite">
                            <div class="block">
                                <label for="birthdate" class="text-[15px] font-bold mb-[10px] block">
                                    Дата рождения
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="birthdate" placeholder="Дата рождения">
                            </div>
                            <div class="block">
                                <label for="passportNumber" class="text-[15px] font-bold mb-[10px] block">
                                    Номер паспорта
                                </label>
                                <div class="flex">
                                    <input
                                        class="block text-[15px] font-Gilroy w-[58px] mr-1 bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                        type="text" id="passportId" placeholder="AS">
                                    <input
                                        class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                        type="text" id="passportNumber" placeholder="Номер паспорта">
                                </div>
                            </div>
                            <div class="block">
                                <label for="issued_date" class="text-[15px] font-bold mb-[10px] block">
                                    Дата выдачи
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="issued_date" placeholder="Дата выдачи">
                            </div>
                            <div class="block">
                                <label for="issued_by" class="text-[15px] font-bold mb-[10px] block">
                                    Место выдачи
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="issued_by" placeholder="Место выдачи">
                            </div>

                            <h1 class="text-[48px] font-bold mt-auto">
                                2
                            </h1>
                        </div>
                    </div>

                    <div class="col-span-3">
                        <div class="flex flex-col p-[22px] rounded-[20px] h-[calc(100%-16px)] gap-4 mb-4 bg-mainWhite">
                            <div class="block">
                                <label for="patent" class="text-[15px] font-bold mb-[10px] block">
                                    Номер патента
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="patent" placeholder="Номер патента">
                            </div>
                            <div class="block">
                                <label for="register" class="text-[15px] font-bold mb-[10px] block">
                                    Номер регистрации
                                </label>
                                <div class="flex">
                                    <input
                                        class="block text-[15px] font-Gilroy w-[58px] mr-1 bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                        type="text" id="passportId" placeholder="AS">
                                    <input
                                        class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                        type="text" id="register" placeholder="Номер регистрации">
                                </div>
                            </div>
                            <div class="block">
                                <label for="getIssue" class="text-[15px] font-bold mb-[10px] block">
                                    Дата выдачи
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="getIssue" placeholder="Дата выдачи">
                            </div>
                            <div class="block">
                                <label for="workAddress" class="text-[15px] font-bold mb-[10px] block">
                                    Адрес места работы
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="workAddress" placeholder="Адрес места работы">
                            </div>

                            <h1 class="text-[48px] font-bold mt-auto">
                                3
                            </h1>
                        </div>
                    </div>

                    <div class="col-span-3">
                        <div class="flex flex-col p-[22px] rounded-[20px] gap-4 mb-4 bg-mainWhite h-[calc(100%-16px)]">

                            <!-- Two new dropdown instances -->
                            <div class="block mb-4">
                                <label class="text-[15px] font-bold mb-[10px] block">
                                    Город
                                </label>
                                <CustomDropdown :options="cityOptions" placeholder="Выберите город"
                                    @option-selected="handleOptionSelected" />
                            </div>

                            <div class="block mb-4">
                                <label class="text-[15px] font-bold mb-[10px] block">
                                    Банк
                                </label>
                                <CustomDropdown :options="bankOptions" placeholder="Выберите банк"
                                    @option-selected="handleOptionSelected" />
                            </div>

                            <button type="submit"
                                class="my-4 bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-full">
                                Оплатить
                            </button>

                            <h1 class="text-[48px] font-bold mt-auto">
                                4
                            </h1>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>