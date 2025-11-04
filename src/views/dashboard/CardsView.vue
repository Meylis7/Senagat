<script setup>
    import Date from '@/components/dashboard/Date.vue';

</script>

<template>
    <section class="pb-10">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-[38px] font-bold leading-9">
                        Платежи
                    </h2>

                    <Date />
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class=" col-span-9">
                        <div class="cards relative block bg-[#1D2417] rounded-[20px] p-[22px] mb-4">
                            <h6 class="text-[17px] font-bold mb-4 text-[#EEF2ED]">
                                Выберите что бы оплатить
                            </h6>

                            <div class="flex gap-[10px]">
                                <div
                                    class="block rounded-[12px] bg-[url('@/assets/images/card-bg.png')] bg-cover bg-center p-5 relative z-10">
                                    <h4 class=" text-sm text-[#EEF2ED] font-bold mb-5">
                                        Senagat Bank
                                    </h4>

                                    <div class="grid grid-cols-12 gap-x-[14px] mb-10 relative z-10">
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                2345
                                            </p>
                                        </div>
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                4321
                                            </p>
                                        </div>
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                1234
                                            </p>
                                        </div>
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                4211
                                            </p>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between relative z-10">
                                        <h4 class=" text-sm text-[#E6EAE3] font-bold">
                                            Mergen Jumayew
                                        </h4>
                                        <h4 class=" text-sm text-[#E6EAE3] font-bold">
                                            11/27
                                        </h4>
                                    </div>
                                </div>

                                <div
                                    class="block rounded-[12px] bg-[url('@/assets/images/card-bg.png')] bg-cover bg-center p-5 relative z-10">
                                    <h4 class=" text-sm text-[#EEF2ED] font-bold mb-5">
                                        Senagat Bank
                                    </h4>

                                    <div class="grid grid-cols-12 gap-x-[14px] mb-10 relative z-10">
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                2345
                                            </p>
                                        </div>
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                4321
                                            </p>
                                        </div>
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                1234
                                            </p>
                                        </div>
                                        <div class=" col-span-3">
                                            <p class="text-[#E6EAE3] text-[17px] font-bold">
                                                4211
                                            </p>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between relative z-10">
                                        <h4 class=" text-sm text-[#E6EAE3] font-bold">
                                            Mergen Jumayew
                                        </h4>
                                        <h4 class=" text-sm text-[#E6EAE3] font-bold">
                                            11/27
                                        </h4>
                                    </div>
                                </div>

                                <div class="w-[53px]">
                                    <button type="button"
                                        class="w-full h-full bg-[#2C702C] rounded-[10px] flex items-center justify-center">
                                        <svg class=" w-6 h-6 object-contain" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M24 12C24 12.2652 23.8946 12.5196 23.7071 12.7071C23.5196 12.8946 23.2652 13 23 13H13V23C13 23.2652 12.8946 23.5196 12.7071 23.7071C12.5196 23.8946 12.2652 24 12 24C11.7348 24 11.4804 23.8946 11.2929 23.7071C11.1054 23.5196 11 23.2652 11 23V13H1C0.734784 13 0.48043 12.8946 0.292893 12.7071C0.105357 12.5196 0 12.2652 0 12C0 11.7348 0.105357 11.4804 0.292893 11.2929C0.48043 11.1054 0.734784 11 1 11H11V1C11 0.734784 11.1054 0.48043 11.2929 0.292893C11.4804 0.105357 11.7348 0 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8946 0.48043 13 0.734784 13 1V11H23C23.2652 11 23.5196 11.1054 23.7071 11.2929C23.8946 11.4804 24 11.7348 24 12Z"
                                                fill="#EEF2ED" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-9 gap-4">
                            <div class="col-span-4">
                                <div class="grid grid-cols-2 gap-4 bg-[#F7F8F6] rounded-[20px] p-[22px]">
                                    <div class="flex flex-col">
                                        <h6 class="text-[17px] font-bold text-[#191B19] leading-6">
                                            Выберите что бы оплатить
                                        </h6>
                                        <p class="text-[15px] font-Gilroy text-[#6F736D] mt-[10px] leading-6">
                                            Оформите карту за пару секунд
                                        </p>

                                        <RouterLink :to="{ name: 'dashboard.allCards' }"
                                            class="mt-auto bg-[#2C702C] rounded-[10px] text-center text-[#EEF2ED] py-[14px] text-[15px] font-Gilroy w-full">
                                            Все карты
                                        </RouterLink>
                                    </div>

                                    <div class="block h-[259px]">
                                        <img class="w-full h-full object-contain" src="../../assets/images/p.png"
                                            alt="card-image">
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-5">
                                <div class="bg-[#F7F8F6] rounded-[20px] p-[22px] flex flex-col gap-4">
                                    <h6 class="text-[17px] font-bold text-[#191B19] leading-5">
                                        Выберите что бы оплатить
                                    </h6>

                                    <RouterLink to="/"
                                        class="block p-[22px] border-solid border-[1px] border-[#DDF0DD] rounded-[10px]">
                                        <h4 class="text-[15px] leading-4 font-bold mb-[10px]">
                                            Газпромбанк расширил возможности РКО для предпринимателей сегмента МСБ
                                        </h4>
                                        <p class="text-[#6F736D] text-[12px] leading-4 font-Gilroy">
                                            12 Октября 2025
                                        </p>
                                    </RouterLink>

                                    <RouterLink to="/"
                                        class="block p-[22px] border-solid border-[1px] border-[#DDF0DD] rounded-[10px]">
                                        <h4 class="text-[15px] leading-4 font-bold mb-[10px]">
                                            Газпромбанк расширил возможности РКО для предпринимателей сегмента МСБ
                                        </h4>
                                        <p class="text-[#6F736D] text-[12px] leading-4 font-Gilroy">
                                            12 Октября 2025
                                        </p>
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class=" col-span-3">
                        <div class="block p-[22px] rounded-[20px] bg-mainWhite">
                            <h6 class="text-[17px] font-bold mb-4">
                                История платежей
                            </h6>

                            <div
                                class="flex items-center justify-between py-3 border-solid border-0 border-b border-[#EEF2ED]">
                                <div class="block">
                                    <h6 class="text-[15px] leading-5 font-bold mb-1">
                                        Интернет и ТВ
                                    </h6>
                                    <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        10 Октября 2025
                                    </p>
                                </div>

                                <p class="text-[15px] font-bold">
                                    -200
                                </p>
                            </div>

                            <div
                                class="flex items-center justify-between py-3 border-solid border-0 border-b border-[#EEF2ED]">
                                <div class="block">
                                    <h6 class="text-[15px] leading-5 font-bold mb-1">
                                        Интернет и ТВ
                                    </h6>
                                    <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        10 Октября 2025
                                    </p>
                                </div>

                                <p class="text-[15px] font-bold">
                                    -200
                                </p>
                            </div>

                            <div
                                class="flex items-center justify-between py-3 border-solid border-0 border-b border-[#EEF2ED]">
                                <div class="block">
                                    <h6 class="text-[15px] leading-5 font-bold mb-1">
                                        Интернет и ТВ
                                    </h6>
                                    <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        10 Октября 2025
                                    </p>
                                </div>

                                <p class="text-[15px] font-bold">
                                    -200
                                </p>
                            </div>

                            <div
                                class="flex items-center justify-between py-3 border-solid border-0 border-b border-[#EEF2ED]">
                                <div class="block">
                                    <h6 class="text-[15px] leading-5 font-bold mb-1">
                                        Интернет и ТВ
                                    </h6>
                                    <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        10 Октября 2025
                                    </p>
                                </div>

                                <p class="text-[15px] font-bold">
                                    -200
                                </p>
                            </div>

                            <div
                                class="flex items-center justify-between py-3 border-solid border-0 border-b border-[#EEF2ED]">
                                <div class="block">
                                    <h6 class="text-[15px] leading-5 font-bold mb-1">
                                        Интернет и ТВ
                                    </h6>
                                    <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        10 Октября 2025
                                    </p>
                                </div>

                                <p class="text-[15px] font-bold">
                                    -200
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-3">
                                <div class="block">
                                    <h6 class="text-[15px] leading-5 font-bold mb-1">
                                        Интернет и ТВ
                                    </h6>
                                    <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        10 Октября 2025
                                    </p>
                                </div>

                                <p class="text-[15px] font-bold">
                                    -200
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-3">
                                <div class="block">
                                    <h6 class="text-[15px] leading-5 font-bold mb-1">
                                        Интернет и ТВ
                                    </h6>
                                    <p class="text-[15px] leading-5 text-[#6F736D] font-Gilroy">
                                        10 Октября 2025
                                    </p>
                                </div>

                                <p class="text-[15px] font-bold">
                                    -200
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>