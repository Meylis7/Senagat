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


</script>

<template>
    <section class="pb-[80px]">
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

                        <p
                            class="text-[15px] text-[#EEF2ED] bg-[#2C702C] py-1 px-[10px] rounded-[10px] leading-tight ml-4">
                            Заполнить
                        </p>
                    </div>

                    <Date />
                </div>

                <form class="grid grid-cols-12 gap-4">
                    <div class="col-span-4">
                        <div class="flex flex-col h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <h6 class="text-[17px] font-bold mb-4">
                                Выберите тип cправки
                            </h6>

                            <CustomDropdown :options="loanOptions" placeholder="Тип cправки"
                                @option-selected="handleOptionSelected" />
                        </div>
                    </div>

                    <div class="col-span-4">
                        <div class="flex flex-col gap-4 h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
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
                        </div>

                        <div class="flex flex-col gap-4 h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                            <div class="block">
                                <label for="issued_date" class="text-[15px] font-bold mb-[10px] block">
                                    Домашний адрес
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="issued_date" placeholder="Домашний адрес">
                            </div>

                            <div class="block">
                                <h6 class="text-[15px] font-bold mb-[10px] block">
                                    Филиал банка
                                </h6>
                                <CustomDropdown :options="loanOptions" placeholder="Филиал банка"
                                    @option-selected="handleOptionSelected" />
                            </div>

                            <div class="block">
                                <label for="passportNumber" class="text-[15px] font-bold mb-[10px] block">
                                    Номер телефона
                                </label>
                                <div class="flex">
                                    <input
                                        class="block text-[15px] font-Gilroy w-[58px] mr-1 bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19] min-w-[78px]"
                                        type="text" id="passportId" placeholder="+993" readonly>
                                    <input
                                        class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                        type="text" id="passportNumber" placeholder="Номер телефона">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-4">
                        <div class="flex flex-col h-fit gap-4 p-[22px] rounded-[20px] mb-4 bg-mainWhite">
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

                            <div class="block">
                                <label for="birthdate" class="text-[15px] font-bold mb-[10px] block">
                                    Дата рождения
                                </label>
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="birthdate" placeholder="Дата рождения">
                            </div>

                            <button type="submit"
                                class="my-4 bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-full mt-auto">
                                Продолжить
                            </button>
                        </div>
                    </div>
                </form>


                <div class="flex flex-col gap-4 h-fit p-[22px] rounded-[20px] mb-4 bg-mainWhite">
                    <h6 class="text-[17px] font-bold mb-4">
                        Детали платежа
                    </h6>

                    <div class="flex flex-col gap-y-4 bg-[#EEF2ED] p-[14px] rounded-[10px]">
                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Имя
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                Мерген
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Фамилия
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                Мергенов
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Отчество
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                Мергенович
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Дата рождения
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                31.01.1998
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Паспорт
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                AS 13459
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Дата выдачи паспорта
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                31.01.1998
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Место выдачи паспорта
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                Ашхабад
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between pb-1 border-solid border-0 border-b border-[#6F736D]/10">
                            <h6 class="text-[15px] text-[#6F736D] font-Gilroy">
                                Адрес
                            </h6>
                            <p class="text-[15px] text-[#1D2417] font-Gilroy">
                                Битараплык 12/45
                            </p>
                        </div>

                        <button type="submit"
                            class="my-4 bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-full">
                            Оплатить 23,00 TMT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>