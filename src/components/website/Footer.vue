<script setup>
    import { RouterLink } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import mainLogo from '@/assets/images/main_logo.png';

    const { t, locale } = useI18n();

    // Function to change language
    const changeLanguage = (lang) => {
        locale.value = lang;
        localStorage.setItem("locale", lang);
    };
</script>

<template>
    <footer class="bg-mainWhite mt-auto ">
        <div class="auto_container">
            <div class="wrap py-[60px]">
                <div class="grid grid-cols-12 gap-x-16 gap-y-8 lg:gap-x-0">
                    <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.loans.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.loans.youngFamilies') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.loans.consumer') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.loans.weddingsAndBirthdays') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.loans.education') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.loans.overdraft') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.loans.agricultural') }}
                                </RouterLink>
                            </li>
                        </ul>

                        <h4 class="mt-10 mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.transfers.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.transfers.Yanardag') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.transfers.WesternUnion') }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>

                    <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.cards.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.cards.mashgalaCard') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.cards.goyumCard') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.cards.altynAsyrCard') }}
                                </RouterLink>
                            </li>
                        </ul>

                        <h4 class="mt-10 mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.informations.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.cashDesk') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.terminalDocs') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.documentList') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.informations.auditReports') }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>

                    <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('nav.deposits.title') }}
                        </h4>

                        <ul class="space-y-4">
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.deposits.profitable') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.deposits.demandDeposit') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.deposits.childrenTargetDeposit') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.deposits.parentCare') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('nav.deposits.healthOfNation') }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>

                    <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('header.aboutBank') }}
                        </h4>

                        <ul class="space-y-4  mb-5 pb-5  border-solid border-0 border-b border-[#EEF2ED]">
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.contacts') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.requisites') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.news') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.branches') }}
                                </RouterLink>
                            </li>
                        </ul>

                        <ul class="space-y-4 mb-5 pb-5  border-solid border-0 border-b border-[#EEF2ED]">
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.exchangeRates') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.branches') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.atmSearch') }}
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    {{ t('footer.links.branches') }}
                                </RouterLink>
                            </li>
                        </ul>

                        <h4 class="mb-4 font-bold text-[17px] leading-tight text-mainBlack">
                            {{ t('footer.languagesTitle') }}
                        </h4>

                        <ul class="space-y-4">
                            <li v-if="locale !== 'en'">
                                <button @click="changeLanguage('en')"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    English
                                </button>
                            </li>
                            <li v-if="locale !== 'ru'">
                                <button @click="changeLanguage('ru')"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    Русский
                                </button>
                            </li>
                            <li v-if="locale !== 'tk'">
                                <button @click="changeLanguage('tk')"
                                    class="text-[#6F736D] font-Gilroy hover:text-[#111] transition-colors duration-200">
                                    Türkmençe
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-[#1D2417] py-[60px] text-mainWhite">
            <div class="auto_container">
                <div class="wrap">
                    <div class="grid items-center md:grid-cols-12 gap-8">
                        <div class="col-span-3">
                            <RouterLink to="/" class="block w-full max-w-[178px]">
                                <img :src="mainLogo" alt="logo" class="w-full h-full object-contain" />
                            </RouterLink>
                        </div>

                        <div class="col-span-4 contact flex flex-col">
                            <a href="tel:+993 12 34 11 28"
                                class="font-bold tracking-[0.2px] text-mainWhite  text-[28px] leading-7">
                                +993 12 34 11 28
                            </a>
                            <p class="text-[17px] font-Gilroy text-mainWhite leading-5 mt-1">Главный офис</p>
                        </div>

                        <div class="col-span-5">
                            <RouterLink to="/" class="flex gap-[10px] w-fit">
                                <div class="block w-full max-w-[80px]">
                                    <img src="../../assets/images/white_logo.png" alt="logo"
                                        class="w-full h-full object-contain" />
                                </div>
                                <div class="block">
                                    <h6 class="text-[#EEF2ED] font-bold text-[17px] leading-tight mb-[17px]">
                                        Мобильное приложение
                                    </h6>
                                    <p class="text-[#EEF2ED] font-Gilroy text-[17px] leading-tight">
                                        Приложениедля <br> Android и iOS
                                    </p>
                                </div>
                            </RouterLink>
                        </div>
                    </div>

                    <div class="grid gap-6 mt-[60px] border-solid border-[#6F736D] border-0 border-t pt-8">
                        <h6 class="text-[#EEF2ED] text-sm leading-5">
                            © 1994-2025, Сенагат-Банк. Лицензия Банка Туркменистана № 2707 от 14.09.2015. <span
                                class="text-[#2C702C]">
                                Информация о
                                процентных ставках по договорам банковского вклада с физическими лицами. Раскрытие
                                информации и финансовая отчётность. Раскрытие информации профессионального участника
                                рынка
                                ценных бумаг. Депозитарная деятельность.
                            </span>
                        </h6>

                        <h6 class="text-[#EEF2ED] text-sm leading-5">
                            Сенагат-Банк является оператором по обработке персональных данных.
                            <RouterLink to="/" class="text-[#2C702C]">
                                Политика обработки
                                персональных данных
                            </RouterLink>
                        </h6>

                        <h6 class="text-[#EEF2ED] text-sm leading-5">
                            Для повышения удобства работы с сайтом Сенагат-Банка используются файлы cookie, подробнее
                            в
                            <RouterLink to="/" class="text-[#2C702C]">
                                Политика использования файлов cookie.
                            </RouterLink>
                            В cookie содержатся данные о прошлых посещениях
                            сайта. Если вы не хотите, чтобы эти данные обрабатывались, отключите cookie в настройках
                            браузера
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>