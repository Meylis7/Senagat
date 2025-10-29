<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
    <!-- Breadcrumb ============================================= -->
    <section class="crumb pt-[145px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center gap-x-2">
                    <RouterLink to="/" class="text-[17px] font-Gilroy text-[#6F736D]">
                        Главная
                    </RouterLink>

                    <span class="block w-[18px]">
                        <svg class="block w-full object-contain" width="7" height="14" viewBox="0 0 7 14" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.77279 7.39792L1.14779 13.0229C1.09553 13.0752 1.03349 13.1166 0.965204 13.1449C0.89692 13.1732 0.823734 13.1878 0.749825 13.1878C0.675915 13.1878 0.602729 13.1732 0.534445 13.1449C0.466162 13.1166 0.404117 13.0752 0.351855 13.0229C0.299593 12.9707 0.258137 12.9086 0.229853 12.8403C0.201569 12.772 0.187012 12.6989 0.187012 12.6249C0.187012 12.551 0.201569 12.4779 0.229853 12.4096C0.258137 12.3413 0.299593 12.2792 0.351855 12.227L5.57959 6.99995L0.351855 1.77292C0.246308 1.66737 0.187012 1.52421 0.187012 1.37495C0.187012 1.22568 0.246308 1.08253 0.351855 0.976978C0.457403 0.87143 0.600557 0.812134 0.749825 0.812134C0.899092 0.812134 1.04225 0.87143 1.14779 0.976978L6.77279 6.60198C6.82509 6.65422 6.86658 6.71626 6.89489 6.78454C6.9232 6.85283 6.93777 6.92603 6.93777 6.99995C6.93777 7.07387 6.9232 7.14706 6.89489 7.21535C6.86658 7.28364 6.82509 7.34567 6.77279 7.39792Z"
                                fill="#6F736D" />
                        </svg>
                    </span>

                    <h6 class="text-[17px] font-Gilroy text-[#191B19]">
                        Кредиты
                    </h6>
                </div>
            </div>
        </div>
    </section>

    <!-- Loans =================================================== -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Кредиты</h2>

                <div class="block space-y-4">
                    <div
                        class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8 relative overflow-hidden">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-[#191B19] mb-5 leading-7">
                                Молодым семьям
                            </h4>
                            <div class="flex items-center gap-x-[10px]">
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    1% фиксированная ставка
                                </p>
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    на 3 года
                                </p>
                            </div>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>

                        <span class="block w-[225px] relative z-10">
                            <img class="block w-full h-full object-contain" src="../../assets/images/loan-ring.png"
                                alt="card-image">
                        </span>

                        <!-- Background circle for young families -->
                        <div class="loan-bg-circle loan-bg-yellow"></div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8 relative overflow-hidden">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-[#191B19] mb-5 leading-7">
                                Потребительский
                            </h4>
                            <div class="flex items-center gap-x-[10px]">
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    1% фиксированная ставка
                                </p>
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    на 3 года
                                </p>
                            </div>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>

                        <span class="block w-[225px] relative z-10">
                            <img class="block w-full h-full object-contain" src="../../assets/images/loan-cart.png"
                                alt="card-image">
                        </span>

                        <!-- Background circle for consumer -->
                        <div class="loan-bg-circle loan-bg-green"></div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8 relative overflow-hidden">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-[#191B19] mb-5 leading-7">
                                Свадьба и день рождения
                            </h4>
                            <div class="flex items-center gap-x-[10px]">
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    1% фиксированная ставка
                                </p>
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    на 3 года
                                </p>
                            </div>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>

                        <span class="block w-[225px] relative z-10">
                            <img class="block w-full h-full object-contain" src="../../assets/images/loan-baloon.png"
                                alt="card-image">
                        </span>

                        <!-- Background circle for wedding -->
                        <div class="loan-bg-circle loan-bg-blue"></div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8 relative overflow-hidden">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-[#191B19] mb-5 leading-7">
                                На образование
                            </h4>
                            <div class="flex items-center gap-x-[10px]">
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    1% фиксированная ставка
                                </p>
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    на 3 года
                                </p>
                            </div>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>

                        <span class="block w-[225px] relative z-10">
                            <img class="block w-full h-full object-contain" src="../../assets/images/loan-note.png"
                                alt="card-image">
                        </span>

                        <!-- Background circle for education -->
                        <div class="loan-bg-circle loan-bg-purple"></div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8 relative overflow-hidden">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-[#191B19] mb-5 leading-7">
                                Овердрафт
                            </h4>
                            <div class="flex items-center gap-x-[10px]">
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    1% фиксированная ставка
                                </p>
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    на 3 года
                                </p>
                            </div>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>

                        <span class="block w-[225px] relative z-10">
                            <img class="block w-full h-full object-contain" src="../../assets/images/loan-speed.png"
                                alt="card-image">
                        </span>

                        <!-- Background circle for overdraft -->
                        <div class="loan-bg-circle loan-bg-orange"></div>
                    </div>

                    <div
                        class="flex items-center justify-between bg-[#F7F8F6] rounded-[20px] p-8 relative overflow-hidden">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-[#191B19] mb-5 leading-7">
                                Сельское хозяйство
                            </h4>
                            <div class="flex items-center gap-x-[10px]">
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    1% фиксированная ставка
                                </p>
                                <p
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    на 3 года
                                </p>
                            </div>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>

                        <span class="block w-[225px] relative z-10">
                            <img class="block w-full h-full object-contain" src="../../assets/images/loan-oat.png"
                                alt="card-image">
                        </span>

                        <!-- Background circle for agriculture -->
                        <div class="loan-bg-circle loan-bg-yellow-2"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Loans info ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Как получить кредит</h2>

                <div class="grid grid-cols-12 gap-x-4">
                    <div class="col-span-3 bg-[#F7F8F6] rounded-[20px] p-8">
                        <h6 class="text-[80px] font-bold leading-none mb-8">1</h6>
                        <h4 class="text-[28px] font-bold mb-[10px] leading-8">
                            Выберите отделение
                        </h4>
                        <p class="text-[#6F736D] font-Gilroy text-[17px] leading-6">
                            Обратитесь в удобный для вас офис
                        </p>
                    </div>

                    <div class="col-span-3 bg-[#F7F8F6] rounded-[20px] p-8">
                        <h6 class="text-[80px] font-bold leading-none mb-8">2</h6>
                        <h4 class="text-[28px] font-bold mb-[10px] leading-8">
                            Подайте заявку
                        </h4>
                        <p class="text-[#6F736D] font-Gilroy text-[17px] leading-6">
                            Специалист оформит заявку по вашему паспорту
                        </p>
                    </div>

                    <div class="col-span-6 bg-[#191B19] rounded-[20px] p-8 relative overflow-hidden ellipse">
                        <h6 class="text-[80px]  text-[#F7F8F6] font-bold leading-none mb-8">3</h6>
                        <h4 class="text-[28px] text-[#F7F8F6] font-bold mb-[10px] leading-8 z-10">
                            Пользуйтесь картой
                        </h4>
                        <p class="text-[#F7F8F6]/60 font-Gilroy text-[17px] leading-6 z-10">
                            Получите карту, выбирайте категории месяца и получайте кешбэк за покупки
                        </p>
                        <span class="block w-[220px] absolute top-0 right-[51px]">
                            <img class="block w-full h-full object-contain" src="../../assets/images/lense.png"
                                alt="card-image">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- News ==================================================== -->
    <section class="pt-[50px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-[38px] font-bold">Новости, которыми хочется делиться</h2>
                    <RouterLink to="/"
                        class="text-[#2C702C] font-Gilroy hover:opacity-80 inline-flex items-center gap-2">
                        Показать все
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.35196 3.77314C6.29969 3.72088 6.25824 3.65884 6.22995 3.59055C6.20167 3.52227 6.18711 3.44908 6.18711 3.37517C6.18711 3.30127 6.20167 3.22808 6.22995 3.1598C6.25824 3.09151 6.29969 3.02947 6.35196 2.97721C6.40422 2.92494 6.46626 2.88349 6.53455 2.8552C6.60283 2.82692 6.67602 2.81236 6.74992 2.81236C6.82383 2.81236 6.89702 2.82692 6.9653 2.8552C7.03359 2.88349 7.09563 2.92494 7.14789 2.97721L12.7729 8.60221C12.8252 8.65445 12.8667 8.71649 12.895 8.78477C12.9233 8.85306 12.9379 8.92625 12.9379 9.00018C12.9379 9.0741 12.9233 9.14729 12.895 9.21558C12.8667 9.28387 12.8252 9.3459 12.7729 9.39814L7.14789 15.0231C7.04234 15.1287 6.89919 15.188 6.74992 15.188C6.60066 15.188 6.4575 15.1287 6.35195 15.0231C6.24641 14.9176 6.18711 14.7744 6.18711 14.6252C6.18711 14.4759 6.24641 14.3328 6.35195 14.2272L11.5797 9.00018L6.35196 3.77314Z"
                                fill="#6F736D" />
                        </svg>

                    </RouterLink>
                </div>

                <div class="flex gap-4">
                    <!-- Promo card left -->
                    <div
                        class="w-full max-w-[390px] flex-shrink-0 rounded-[20px] overflow-hidden bg-[#0E0F0E] p-8 text-white relative min-h-[500px] news-promo-glow">
                        <h6 class="text-[28px] leading-9 text[#F7F8F6] font-bold mb-[10px]">
                            Скачай приложение
                        </h6>
                        <p class="text-[#F7F8F6] text-[17px] leading-7 opacity-60 font-Gilroy">
                            Курс действует на текущее время. <br> Точный курс будет определён на момент совершения
                            операции
                        </p>

                        <span class="block min-w-[232px] z-10 absolute -bottom-[113px] left-1/2 -translate-x-1/2">
                            <img src="../../assets/images/mobile-app.png" alt="app"
                                class="block w-full h-auto object-contain" />
                        </span>
                    </div>

                    <!-- News cards right -->
                    <div class="flex-1 grid sm:grid-cols-2 gap-4">
                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-[#191B19] text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped>
.ellipse::after {
    content: "";
    position: absolute;
    width: 250px;
    height: 250px;
    right: -125px;
    top: -125px;
    background: #2C702C;
    filter: blur(53.5px);
    border-radius: 9999px;
    z-index: 2;
}

/* Loan background circles */
.loan-bg-circle {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(137.15px);
    z-index: 1;
    right: -150px;
    top: -10px;
}

/* Yellow background for young families */
.loan-bg-yellow {
    background: #EDC928;
}

/* Green background for consumer */
.loan-bg-green {
    background: #28ED2E;
}

/* Blue background for wedding */
.loan-bg-blue {
    background: #28B8ED;
}

/* Purple background for education */
.loan-bg-purple {
    background: #BB28ED;
}

/* Orange background for overdraft */
.loan-bg-orange {
    background: #ED6328;
}

/* Yellow background for agriculture (slightly different shade) */
.loan-bg-yellow-2 {
    background: #EDED28;
}
</style>