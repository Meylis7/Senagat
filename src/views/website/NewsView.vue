<script setup>
import { RouterLink } from 'vue-router';


</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[145px] pb-[60px] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center gap-x-2 mb-[60px]">
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


                    <h6 class="text-[17px] font-Gilroy">
                        О Банке
                    </h6>
                </div>


                <h1 class="m-auto max-w-[660px] mb-[10px] text-center text-5xl font-bold">
                    Новости
                </h1>

                <p class="text-[17px] font-Gilroy text-[#6F736D] text-center">
                    Только достоверная и актуальная информация от Сенагат
                </p>

            </div>
        </div>

        <span class="card-bg-circle"></span>
    </section>

    <div class="block mt-[125px] mb-[90px] mx-auto w-[390px]">
        <img src="../../assets/images/megaphone.png" class="w-full block object-contain" alt="news-megaphone">
    </div>

    <!-- News ===================================================================================== -->
    <section class="pt-[50px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center mb-10">
                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Кредит
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Карта
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Вклады
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        График работы
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Важно
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Мобильная версия
                    </h6>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <article class="col-span-4 bg-white rounded-[20px] overflow-hidden">
                        <span class="block h-[200px] overflow-hidden rounded-2xl">
                            <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                alt="news" />
                        </span>
                        <div class="p-4">
                            <RouterLink to="/" class="block text-mainBlack text-[17px] font-bold leading-6">
                                Газпромбанк расширил
                                возможности РКО для
                                предпринимателей
                                сегмента МСБ
                            </RouterLink>
                        </div>
                    </article>

                    <article class="col-span-4 bg-white rounded-[20px] overflow-hidden">
                        <span class="block h-[200px] overflow-hidden rounded-2xl">
                            <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                alt="news" />
                        </span>
                        <div class="p-4">
                            <RouterLink to="/" class="block text-mainBlack text-[17px] font-bold leading-6">
                                Газпромбанк расширил
                                возможности РКО для
                                предпринимателей
                                сегмента МСБ
                            </RouterLink>
                        </div>
                    </article>

                    <article class="col-span-4 bg-white rounded-[20px] overflow-hidden">
                        <span class="block h-[200px] overflow-hidden rounded-2xl">
                            <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                alt="news" />
                        </span>
                        <div class="p-4">
                            <RouterLink to="/" class="block text-mainBlack text-[17px] font-bold leading-6">
                                Газпромбанк расширил
                                возможности РКО для
                                предпринимателей
                                сегмента МСБ
                            </RouterLink>
                        </div>
                    </article>

                    <article class="col-span-4 bg-white rounded-[20px] overflow-hidden">
                        <span class="block h-[200px] overflow-hidden rounded-2xl">
                            <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                alt="news" />
                        </span>
                        <div class="p-4">
                            <RouterLink to="/" class="block text-mainBlack text-[17px] font-bold leading-6">
                                Газпромбанк расширил
                                возможности РКО для
                                предпринимателей
                                сегмента МСБ
                            </RouterLink>
                        </div>
                    </article>

                    <article class="col-span-4 bg-white rounded-[20px] overflow-hidden">
                        <span class="block h-[200px] overflow-hidden rounded-2xl">
                            <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                alt="news" />
                        </span>
                        <div class="p-4">
                            <RouterLink to="/" class="block text-mainBlack text-[17px] font-bold leading-6">
                                Газпромбанк расширил
                                возможности РКО для
                                предпринимателей
                                сегмента МСБ
                            </RouterLink>
                        </div>
                    </article>

                    <article class="col-span-4 bg-white rounded-[20px] overflow-hidden">
                        <span class="block h-[200px] overflow-hidden rounded-2xl">
                            <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                alt="news" />
                        </span>
                        <div class="p-4">
                            <RouterLink to="/" class="block text-mainBlack text-[17px] font-bold leading-6">
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
    </section>
</template>



<style lang="scss" scoped></style>