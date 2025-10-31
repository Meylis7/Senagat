<script setup>
import { ref } from 'vue';

const activeAccordion = ref('card-conditions'); // First accordion open by default
const accordionItems = ref([
    { id: 'card-conditions', title: 'Условия по карте' },
    { id: 'payment-methods', title: 'Способы пополнения' },
    { id: 'cashback', title: 'Все о Кэшбэке' }
]);

function toggleAccordion(id) {
    if (activeAccordion.value === id) {
        activeAccordion.value = null; // Close if already open
    } else {
        activeAccordion.value = id; // Open clicked accordion
    }
}
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[145px] pb-[60px] bg-mainBlack relative overflow-hidden">
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

                    <RouterLink to="/" class="text-[17px] font-Gilroy text-[#6F736D]">
                        Карты
                    </RouterLink>

                    <span class="block w-[18px]">
                        <svg class="block w-full object-contain" width="7" height="14" viewBox="0 0 7 14" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.77279 7.39792L1.14779 13.0229C1.09553 13.0752 1.03349 13.1166 0.965204 13.1449C0.89692 13.1732 0.823734 13.1878 0.749825 13.1878C0.675915 13.1878 0.602729 13.1732 0.534445 13.1449C0.466162 13.1166 0.404117 13.0752 0.351855 13.0229C0.299593 12.9707 0.258137 12.9086 0.229853 12.8403C0.201569 12.772 0.187012 12.6989 0.187012 12.6249C0.187012 12.551 0.201569 12.4779 0.229853 12.4096C0.258137 12.3413 0.299593 12.2792 0.351855 12.227L5.57959 6.99995L0.351855 1.77292C0.246308 1.66737 0.187012 1.52421 0.187012 1.37495C0.187012 1.22568 0.246308 1.08253 0.351855 0.976978C0.457403 0.87143 0.600557 0.812134 0.749825 0.812134C0.899092 0.812134 1.04225 0.87143 1.14779 0.976978L6.77279 6.60198C6.82509 6.65422 6.86658 6.71626 6.89489 6.78454C6.9232 6.85283 6.93777 6.92603 6.93777 6.99995C6.93777 7.07387 6.9232 7.14706 6.89489 7.21535C6.86658 7.28364 6.82509 7.34567 6.77279 7.39792Z"
                                fill="#6F736D" />
                        </svg>
                    </span>

                    <h6 class="text-[17px] font-Gilroy text-mainWhite">
                        Карта «Altyn Asyr»
                    </h6>
                </div>


                <h1 class="m-auto max-w-[660px] text-mainWhite mb-[10px] text-center text-5xl font-bold">
                    Карта «Altyn Asyr»
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    Обратитесь в удобный для вас офис
                </p>

                <RouterLink to="/"
                    class="block mt-5 w-fit text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[20px] py-3 px-[35px] mx-auto">
                    Подать заявку
                </RouterLink>

                <span class="block mt-[140px] max-w-[400px] mx-auto relative z-10">
                    <img src="../../assets/images/altyn-asyr-card.png" class="block w-full h-full object-contain"
                        alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"></span>
    </section>

    <!-- Info  ================================================ -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="grid grid-cols-12 gap-x-4">
                    <div class="col-span-6 block bg-mainWhite rounded-[20px] p-8">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            6% годовых
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D]">
                            Депозит на остаток денежных средств на карте
                        </p>

                        <span class="block w-[230px] mx-auto relative -bottom-8">
                            <img src="../../assets/images/dimond-1.png" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>

                    <div class="col-span-6 block bg-mainWhite rounded-[20px] p-8">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            6% годовых
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D]">
                            Депозит на остаток денежных средств на карте
                        </p>

                        <span class="block w-[230px] mx-auto relative -bottom-8">
                            <img src="../../assets/images/dimond-2.png" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Tariffs ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Тарифы и документы</h2>

                <div class="block p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <div class="flex items-center justify-between cursor-pointer"
                        @click="toggleAccordion('card-conditions')">
                        <h4 class="text-[28px] font-bold">
                            Условия по карте
                        </h4>

                        <button type="button" class="transition-transform duration-300 block w-[32px]">
                            <!-- Plus icon when closed -->
                            <svg v-if="activeAccordion !== 'card-conditions'" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9957 12.5535 27.6247 9.2494 25.1876 6.81236C22.7506 4.37532 19.4465 3.0043 16 3ZM21 17H17V21C17 21.2652 16.8946 21.5196 16.7071 21.7071C16.5196 21.8946 16.2652 22 16 22C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21V17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H15V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                            <!-- Minus icon when open -->
                            <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM21 17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                        </button>
                    </div>

                    <Transition name="accordion" mode="out-in">
                        <div v-if="activeAccordion === 'card-conditions'" class="block">
                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Стоимость оформления
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    30 манат
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Ориентировочная доходность
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    6,00 % годовых
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Снятие наличных
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    Наличные деньги не принимаются по любой другой карте, которая изначально была
                                    внесена на «Гоюм» банковскую карту, а затем снята наличными без подтверждения ее
                                    происхождения
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="block p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <div class="flex items-center justify-between cursor-pointer"
                        @click="toggleAccordion('payment-methods')">
                        <h4 class="text-[28px] font-bold">
                            Способы пополнения
                        </h4>

                        <button type="button" class="transition-transform duration-300 block w-[32px]">
                            <!-- Plus icon when closed -->
                            <svg v-if="activeAccordion !== 'payment-methods'" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9957 12.5535 27.6247 9.2494 25.1876 6.81236C22.7506 4.37532 19.4465 3.0043 16 3ZM21 17H17V21C17 21.2652 16.8946 21.5196 16.7071 21.7071C16.5196 21.8946 16.2652 22 16 22C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21V17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H15V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                            <!-- Minus icon when open -->
                            <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM21 17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                        </button>
                    </div>

                    <Transition name="accordion" mode="out-in">
                        <div v-if="activeAccordion === 'payment-methods'" class="block">
                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Стоимость оформления
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    30 манат
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Ориентировочная доходность
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    6,00 % годовых
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Снятие наличных
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    Наличные деньги не принимаются по любой другой карте, которая изначально была
                                    внесена на «Гоюм» банковскую карту, а затем снята наличными без подтверждения ее
                                    происхождения
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="block p-8 rounded-[20px] bg-mainWhite">
                    <div class="flex items-center justify-between cursor-pointer" @click="toggleAccordion('cashback')">
                        <h4 class="text-[28px] font-bold">
                            Все о Кэшбэке
                        </h4>

                        <button type="button" class="transition-transform duration-300 block w-[32px]">
                            <!-- Plus icon when closed -->
                            <svg v-if="activeAccordion !== 'cashback'" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9957 12.5535 27.6247 9.2494 25.1876 6.81236C22.7506 4.37532 19.4465 3.0043 16 3ZM21 17H17V21C17 21.2652 16.8946 21.5196 16.7071 21.7071C16.5196 21.8946 16.2652 22 16 22C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21V17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H15V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                            <!-- Minus icon when open -->
                            <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM21 17H11C10.7348 17 10.4804 16.8946 10.2929 16.7071C10.1054 16.5196 10 16.2652 10 16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                                    fill="#2C702C" />
                            </svg>
                        </button>
                    </div>

                    <Transition name="accordion" mode="out-in">
                        <div v-if="activeAccordion === 'cashback'" class="block">
                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Стоимость оформления
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    30 манат
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Ориентировочная доходность
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    6,00 % годовых
                                </p>
                            </div>

                            <div class="grid grid-cols-12 py-[20px] border-solid border-0 border-b border-[#6F736D]">
                                <h6 class="col-span-6 text-[17px] font-bold">
                                    Снятие наличных
                                </h6>
                                <p class="col-span-6 text-[17px] font-Gilroy">
                                    Наличные деньги не принимаются по любой другой карте, которая изначально была
                                    внесена на «Гоюм» банковскую карту, а затем снята наличными без подтверждения ее
                                    происхождения
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </section>

    <!-- Docs  ================================================ -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Документы</h2>

                <div class="block">
                    <a href="#" class="flex items-center gap-x-[10px] mb-5">
                        <span class="block w-8">
                            <svg class="w-full h-full object-contain block" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M28 19C28 19.2652 27.8946 19.5196 27.7071 19.7071C27.5196 19.8946 27.2652 20 27 20H24V22H26C26.2652 22 26.5196 22.1054 26.7071 22.2929C26.8946 22.4804 27 22.7348 27 23C27 23.2652 26.8946 23.5196 26.7071 23.7071C26.5196 23.8946 26.2652 24 26 24H24V26C24 26.2652 23.8946 26.5196 23.7071 26.7071C23.5196 26.8946 23.2652 27 23 27C22.7348 27 22.4804 26.8946 22.2929 26.7071C22.1054 26.5196 22 26.2652 22 26V19C22 18.7348 22.1054 18.4804 22.2929 18.2929C22.4804 18.1054 22.7348 18 23 18H27C27.2652 18 27.5196 18.1054 27.7071 18.2929C27.8946 18.4804 28 18.7348 28 19ZM11.5 21.5C11.5 22.4283 11.1313 23.3185 10.4749 23.9749C9.8185 24.6313 8.92826 25 8 25H7V26C7 26.2652 6.89464 26.5196 6.70711 26.7071C6.51957 26.8946 6.26522 27 6 27C5.73478 27 5.48043 26.8946 5.29289 26.7071C5.10536 26.5196 5 26.2652 5 26V19C5 18.7348 5.10536 18.4804 5.29289 18.2929C5.48043 18.1054 5.73478 18 6 18H8C8.92826 18 9.8185 18.3687 10.4749 19.0251C11.1313 19.6815 11.5 20.5717 11.5 21.5ZM9.5 21.5C9.5 21.1022 9.34196 20.7206 9.06066 20.4393C8.77936 20.158 8.39782 20 8 20H7V23H8C8.39782 23 8.77936 22.842 9.06066 22.5607C9.34196 22.2794 9.5 21.8978 9.5 21.5ZM20.5 22.5C20.5 23.6935 20.0259 24.8381 19.182 25.682C18.3381 26.5259 17.1935 27 16 27H14C13.7348 27 13.4804 26.8946 13.2929 26.7071C13.1054 26.5196 13 26.2652 13 26V19C13 18.7348 13.1054 18.4804 13.2929 18.2929C13.4804 18.1054 13.7348 18 14 18H16C17.1935 18 18.3381 18.4741 19.182 19.318C20.0259 20.1619 20.5 21.3065 20.5 22.5ZM18.5 22.5C18.5 21.837 18.2366 21.2011 17.7678 20.7322C17.2989 20.2634 16.663 20 16 20H15V25H16C16.663 25 17.2989 24.7366 17.7678 24.2678C18.2366 23.7989 18.5 23.163 18.5 22.5ZM5 14V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H19C19.1314 2.9999 19.2615 3.02568 19.3829 3.07586C19.5042 3.12605 19.6146 3.19967 19.7075 3.2925L26.7075 10.2925C26.8003 10.3854 26.8739 10.4958 26.9241 10.6172C26.9743 10.7385 27.0001 10.8686 27 11V14C27 14.2652 26.8946 14.5196 26.7071 14.7071C26.5196 14.8946 26.2652 15 26 15C25.7348 15 25.4804 14.8946 25.2929 14.7071C25.1054 14.5196 25 14.2652 25 14V12H19C18.7348 12 18.4804 11.8946 18.2929 11.7071C18.1054 11.5196 18 11.2652 18 11V5H7V14C7 14.2652 6.89464 14.5196 6.70711 14.7071C6.51957 14.8946 6.26522 15 6 15C5.73478 15 5.48043 14.8946 5.29289 14.7071C5.10536 14.5196 5 14.2652 5 14ZM20 10H23.5863L20 6.41375V10Z"
                                    fill="#CC1717" />
                            </svg>
                        </span>

                        <h6 class="text-[17px] font-bold underline">
                            Форма
                        </h6>
                    </a>

                    <a href="#" class="flex items-center gap-x-[10px]">
                        <span class="block w-8">
                            <svg class="w-full h-full object-contain block" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M28 19C28 19.2652 27.8946 19.5196 27.7071 19.7071C27.5196 19.8946 27.2652 20 27 20H24V22H26C26.2652 22 26.5196 22.1054 26.7071 22.2929C26.8946 22.4804 27 22.7348 27 23C27 23.2652 26.8946 23.5196 26.7071 23.7071C26.5196 23.8946 26.2652 24 26 24H24V26C24 26.2652 23.8946 26.5196 23.7071 26.7071C23.5196 26.8946 23.2652 27 23 27C22.7348 27 22.4804 26.8946 22.2929 26.7071C22.1054 26.5196 22 26.2652 22 26V19C22 18.7348 22.1054 18.4804 22.2929 18.2929C22.4804 18.1054 22.7348 18 23 18H27C27.2652 18 27.5196 18.1054 27.7071 18.2929C27.8946 18.4804 28 18.7348 28 19ZM11.5 21.5C11.5 22.4283 11.1313 23.3185 10.4749 23.9749C9.8185 24.6313 8.92826 25 8 25H7V26C7 26.2652 6.89464 26.5196 6.70711 26.7071C6.51957 26.8946 6.26522 27 6 27C5.73478 27 5.48043 26.8946 5.29289 26.7071C5.10536 26.5196 5 26.2652 5 26V19C5 18.7348 5.10536 18.4804 5.29289 18.2929C5.48043 18.1054 5.73478 18 6 18H8C8.92826 18 9.8185 18.3687 10.4749 19.0251C11.1313 19.6815 11.5 20.5717 11.5 21.5ZM9.5 21.5C9.5 21.1022 9.34196 20.7206 9.06066 20.4393C8.77936 20.158 8.39782 20 8 20H7V23H8C8.39782 23 8.77936 22.842 9.06066 22.5607C9.34196 22.2794 9.5 21.8978 9.5 21.5ZM20.5 22.5C20.5 23.6935 20.0259 24.8381 19.182 25.682C18.3381 26.5259 17.1935 27 16 27H14C13.7348 27 13.4804 26.8946 13.2929 26.7071C13.1054 26.5196 13 26.2652 13 26V19C13 18.7348 13.1054 18.4804 13.2929 18.2929C13.4804 18.1054 13.7348 18 14 18H16C17.1935 18 18.3381 18.4741 19.182 19.318C20.0259 20.1619 20.5 21.3065 20.5 22.5ZM18.5 22.5C18.5 21.837 18.2366 21.2011 17.7678 20.7322C17.2989 20.2634 16.663 20 16 20H15V25H16C16.663 25 17.2989 24.7366 17.7678 24.2678C18.2366 23.7989 18.5 23.163 18.5 22.5ZM5 14V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H19C19.1314 2.9999 19.2615 3.02568 19.3829 3.07586C19.5042 3.12605 19.6146 3.19967 19.7075 3.2925L26.7075 10.2925C26.8003 10.3854 26.8739 10.4958 26.9241 10.6172C26.9743 10.7385 27.0001 10.8686 27 11V14C27 14.2652 26.8946 14.5196 26.7071 14.7071C26.5196 14.8946 26.2652 15 26 15C25.7348 15 25.4804 14.8946 25.2929 14.7071C25.1054 14.5196 25 14.2652 25 14V12H19C18.7348 12 18.4804 11.8946 18.2929 11.7071C18.1054 11.5196 18 11.2652 18 11V5H7V14C7 14.2652 6.89464 14.5196 6.70711 14.7071C6.51957 14.8946 6.26522 15 6 15C5.73478 15 5.48043 14.8946 5.29289 14.7071C5.10536 14.5196 5 14.2652 5 14ZM20 10H23.5863L20 6.41375V10Z"
                                    fill="#CC1717" />
                            </svg>
                        </span>

                        <h6 class="text-[17px] font-bold underline">
                            Форма
                        </h6>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Other Cards ======================================= -->
    <section class="pt-[50px] pb-[60px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Другие карты</h2>

                <div class="grid grid-cols-12 gap-x-4">
                    <div class="col-span-4 bg-mainWhite rounded-[20px] p-1">
                        <div
                            class="bg-[#EEF2ED] rounded-2xl pt-[15px] relative flex items-end justify-center overflow-hidden">
                            <span class="block h-[150px] relative -bottom-[25px]">
                                <img class="block w-full h-full object-contain" src="../../assets/images/card.png"
                                    alt="card">
                            </span>
                            <span class="block absolute right-7 bottom-5 w-[100px]">
                                <img class="block w-full h-full object-contain mix-blend-hard-light"
                                    src="../../assets/images/oval.png" alt="oval-icon">
                            </span>
                        </div>

                        <div class="block p-4">
                            <h4 class="text-[17px] font-bold text-mainBlack mb-5 leading-7">
                                Карта «Altyn Asyr»
                            </h4>
                            <p class="text-sm font-Gilroy text-[#2C702C] p-3 mb-5 rounded-2xl bg-[#EEF2ED] w-fit">
                                6,00% Годовая процентная ставка
                            </p>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>
                    </div>

                    <div class="col-span-4 bg-mainWhite rounded-[20px] p-1">
                        <div
                            class="bg-[#EEF2ED] rounded-2xl pt-[15px] relative flex items-end justify-center overflow-hidden">
                            <span class="block h-[150px] relative -bottom-[25px]">
                                <img class="block w-full h-full object-contain" src="../../assets/images/card-2.png"
                                    alt="card">
                            </span>
                            <span class="block absolute right-7 bottom-5 w-[100px]">
                                <img class="block w-full h-full object-contain mix-blend-hard-light"
                                    src="../../assets/images/oval.png" alt="oval-icon">
                            </span>
                        </div>

                        <div class="block p-4">
                            <h4 class="text-[17px] font-bold text-mainBlack mb-5 leading-7">
                                Карта «Altyn Asyr»
                            </h4>
                            <p class="text-sm font-Gilroy text-[#2C702C] p-3 mb-5 rounded-2xl bg-[#EEF2ED] w-fit">
                                6,00% Годовая процентная ставка
                            </p>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>
                    </div>

                    <div class="col-span-4 bg-mainWhite rounded-[20px] p-1">
                        <div
                            class="bg-[#EEF2ED] rounded-2xl pt-[15px] relative flex items-end justify-center overflow-hidden">
                            <span class="block h-[150px] relative -bottom-[25px]">
                                <img class="block w-full h-full object-contain" src="../../assets/images/card.png"
                                    alt="card">
                            </span>
                            <span class="block absolute right-7 bottom-5 w-[100px]">
                                <img class="block w-full h-full object-contain mix-blend-hard-light"
                                    src="../../assets/images/oval.png" alt="oval-icon">
                            </span>
                        </div>

                        <div class="block p-4">
                            <h4 class="text-[17px] font-bold text-mainBlack mb-5 leading-7">
                                Карта «Altyn Asyr»
                            </h4>
                            <p class="text-sm font-Gilroy text-[#2C702C] p-3 mb-5 rounded-2xl bg-[#EEF2ED] w-fit">
                                6,00% Годовая процентная ставка
                            </p>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                Интернет банк
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</template>



<style lang="scss" scoped>
.card-bg-circle {
    display: block;
    position: absolute;
    width: 560px;
    height: 560px;
    left: 50%;
    transform: translateX(-50%);
    bottom: -362px;
    background: #2C702C;
    filter: blur(137.15px);
    border-radius: 50%;
    z-index: 1;
}

/* Accordion animations */
.accordion-enter-active,
.accordion-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.accordion-enter-from {
    opacity: 0;
    max-height: 0;
}

.accordion-leave-to {
    opacity: 0;
    max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    opacity: 1;
    max-height: 500px;
}
</style>