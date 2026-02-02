<script setup>
    import { ref, nextTick } from 'vue'
    import { RouterLink } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    const { t, tm, locale } = useI18n();
    import { Swiper, SwiperSlide } from 'swiper/vue'
    import { Navigation, EffectFade } from 'swiper/modules'
    import 'swiper/css'
    import 'swiper/css/effect-fade'
    import 'swiper/css/navigation'

    import logo from "@/assets/images/main_logo.png";
    import bg1 from '@/assets/images/slider/bg-1.png'
    import bg2 from '@/assets/images/slider/bg-2.png'
    import bg3 from '@/assets/images/slider/bg-3.png'
    import bg4 from '@/assets/images/slider/bg-4.png'
    import bg5 from '@/assets/images/slider/bg-5.png'

    const heroSwiper = ref(null)

    const updateHeroHeight = async (swiper) => {
        if (!swiper) return
        await nextTick()
        const activeSlide = swiper.slides[swiper.activeIndex]
        if (!activeSlide) return
        const height = activeSlide.offsetHeight
        if (swiper.wrapperEl) {
            swiper.wrapperEl.style.height = `${height}px`
        }
        if (swiper.el) {
            swiper.el.style.height = `${height}px`
        }
    }

    const onHeroSwiper = (swiper) => {
        heroSwiper.value = swiper
        updateHeroHeight(swiper)
    }

    const onHeroSlideChange = (swiper) => {
        updateHeroHeight(swiper)
    }

</script>

<template>
    <section class="pt-[110px] md:pt-[130px] pb-[40px]">
        <div class="auto_container">
            <div class="wrap relative">
                <Swiper :modules="[Navigation, EffectFade]" :loop="true" :slides-per-view="1" :space-between="0"
                    effect="fade" :fade-effect="{ crossFade: true }" :autoHeight="true" @swiper="onHeroSwiper"
                    @slideChange="onHeroSlideChange" :navigation="{ nextEl: '.hero-next', prevEl: '.hero-prev' }">
                    <SwiperSlide
                        class="p-[30px] pb-[70px] md:p-[50px] !flex flex-col relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat min-h-[380px] md:min-h-[500px] lg:min-h-[650px] gap-4"
                        :style="{ backgroundImage: `url(${bg1})` }">
                        <div class="block w-[160px] mx-auto md:mx-0">
                            <img :src="logo" class="block w-full h-auto object-contain" alt="logo">
                        </div>

                        <div
                            class="flex flex-col md:flex-row items-center justify-between my-auto gap-6 md:gap-4 text-center md:text-left">
                            <div class="block max-w-[600px]">
                                <h4
                                    class="text-mainWhite text-[20px] lg:text-[26px] font-medium mb-[10px] leading-tight">
                                    {{ t('slider.slide_1.title') }}
                                </h4>
                                <p class="text-mainWhite text-[16px] lg:text-[20px] leading-tight">
                                    {{ t('slider.slide_1.text') }}
                                </p>
                            </div>

                            <div class="block w-[140px] md:w-[180px] lg:w-[250px]">
                                <img class="w-full h-full object-contain" src="../../assets/images/year-logo.png"
                                    alt="year-logo">
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide
                        class="p-[30px] pb-[70px] md:p-[50px] !flex flex-col justify-center relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat min-h-[380px] md:min-h-[500px] lg:min-h-[650px]"
                        :style="{ backgroundImage: `url(${bg2})` }">
                        <div class="flex flex-col md:flex-row items-center justify-between my-auto gap-8 md:gap-4">
                            <div class="block max-w-[600px] text-center md:text-left">
                                <h4
                                    class="text-mainWhite text-[20px] lg:text-[26px] font-medium mb-[10px] leading-tight">
                                    {{ t('slider.slide_2.title') }}
                                </h4>
                                <p class="text-mainWhite text-[16px] lg:text-[20px] leading-tight">
                                    {{ t('slider.slide_2.text') }}
                                </p>

                                <div
                                    class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8">
                                    <RouterLink to="/"
                                        class="w-[180px] sm:w-fit text-sm font-bold text-white bg-[#124D6A] rounded-[10px] px-5 py-[14px] flex justify-center items-center gap-3 min-w-[150px]">
                                        <span class="w-6 block">
                                            <svg class="w-full h-full object-contain" width="30" height="30"
                                                viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M20.6816 18.0789C17.3184 14.76 16.9132 15.5025 20.7952 12.3711C24.9612 15.315 25.7452 14.4037 20.6816 18.0789Z"
                                                    fill="#124D6A" />
                                                <path
                                                    d="M16.9587 14.3549C6.5359 4.48444 7.11158 4.02691 19.2538 11.3885C19.3637 11.501 19.803 11.5948 19.6023 11.786C18.716 12.6335 17.8563 13.4848 16.9587 14.3549Z"
                                                    fill="#124D6A" />
                                                <path
                                                    d="M9.63763 23.2953C11.8911 20.8165 14.3832 18.5176 16.72 16.1025C16.9056 15.915 16.9775 15.9112 17.1555 16.0912C17.9811 16.92 18.8068 17.7526 19.6324 18.5851C17.1404 20.7602 13.3568 22.549 9.952 23.3666C9.81184 23.3328 9.72474 23.314 9.63763 23.2953Z"
                                                    fill="#124D6A" />
                                                <path
                                                    d="M8.56587 22.9134C8.11898 23.2959 7.76298 21.8708 7.85767 21.6308C7.74026 20.5845 6.65326 4.5638 8.82343 7.83394C10.9784 9.99779 13.1486 12.1429 15.3111 14.2992C15.4778 14.6067 16.2731 14.933 15.9853 15.293C13.4553 17.7756 10.933 20.277 8.56587 22.9134Z"
                                                    fill="#124D6A" />
                                                <path
                                                    d="M19.2538 11.3885C7.11155 4.02692 6.53588 4.48445 16.9587 14.3549C17.8562 13.4849 18.7122 12.6336 19.6022 11.786C19.8029 11.591 19.3636 11.4973 19.2538 11.3885ZM19.6325 18.5851C18.8069 17.7563 17.9812 16.92 17.1556 16.0912C16.9776 15.9112 16.9056 15.9187 16.72 16.1025C14.3832 18.5176 11.8912 20.8165 9.63772 23.2953C9.72482 23.314 9.81192 23.3328 9.95204 23.3628C13.3569 22.549 17.1404 20.7565 19.6325 18.5851ZM20.7952 12.3711C16.9132 15.5024 17.3184 14.7599 20.6816 18.0788C25.7453 14.4037 24.9613 15.315 20.7952 12.3711ZM8.82344 7.83337C6.65328 4.56323 7.74024 20.5802 7.85768 21.6302C7.76678 21.8702 8.12278 23.2953 8.56589 22.9128C10.933 20.2764 13.4516 17.7751 15.9853 15.2962C16.2731 14.9324 15.4778 14.6099 15.3112 14.3024C13.1486 12.146 10.9784 9.99722 8.82344 7.83337ZM19.2879 29.7569C4.92625 30.9232 -1.10697 28.298 0.165574 12.9523C0.211022 6.16828 1.9191 0.351775 9.86115 0.243019C26.1278 -0.867029 31.1422 1.27056 29.7902 18.4576C29.2864 25.3804 26.9118 29.7156 19.2879 29.7569Z"
                                                    fill="white" />
                                            </svg>

                                        </span>
                                        Google store
                                    </RouterLink>
                                    <RouterLink to="/"
                                        class="w-[180px] sm:w-fit text-sm font-bold text-white bg-[#124D6A] rounded-[10px] px-5 py-[14px] flex justify-center items-center gap-3 min-w-[150px]">
                                        <span class="w-6 block">
                                            <svg class="w-full h-full object-contain" width="30" height="30"
                                                viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M23.3022 21.8917C24.0322 23.1442 22.1767 24.1867 21.4428 23.0167C19.8497 20.5867 18.4504 18.0368 16.8876 15.5843C16.4086 14.4143 14.9979 13.173 15.6405 11.8531C17.3325 9.6443 18.7394 12.708 19.3858 14.1368C21.1044 17.6543 19.998 16.7055 23.8155 16.6793C25.4733 16.683 25.6444 19.188 23.9904 19.368C23.3592 19.4392 22.7394 19.4317 22.1007 19.4468C22.5379 20.253 22.8345 21.1005 23.3022 21.8917Z"
                                                    fill="#124D6A" />
                                                <path
                                                    d="M14.8154 6.65866C15.2831 5.65368 16.4428 4.43492 17.515 5.42867C18.2413 6.08115 17.747 7.10118 17.2527 7.76865C15.3819 10.6412 13.899 13.7236 12.1994 16.6898C13.7165 16.8211 15.245 16.7273 16.7508 16.9898C18.2337 17.2524 18.036 19.4161 16.5264 19.4498C13.591 19.5623 10.6556 19.3411 7.71639 19.4986C6.66697 19.4198 5.32474 19.9748 4.51486 19.1011C2.89125 16.3749 7.25634 16.7873 8.8495 16.6786C9.84573 15.7336 10.3362 14.1399 11.1423 12.9699C11.8077 11.7999 12.4579 10.6186 13.1233 9.44863C13.2412 9.08116 12.7089 8.77741 12.5758 8.43991C10.0511 5.64617 13.591 3.47493 14.8154 6.65866Z"
                                                    fill="#124D6A" />
                                                <path
                                                    d="M9.33238 21.134C9.29816 19.8515 7.59091 19.3565 6.86086 20.4927C6.53768 21.0252 6.12701 21.5577 5.98253 22.169C5.69734 23.3802 7.24869 24.2052 8.11564 23.3015C8.69359 22.6902 9.13845 21.9477 9.33238 21.134ZM17.515 5.42908C16.439 4.43158 15.2831 5.65035 14.8154 6.65907C13.591 3.47535 10.0472 5.64659 12.5758 8.44408C12.7089 8.78155 13.2374 9.08155 13.1233 9.45281C12.4579 10.6266 11.8077 11.8041 11.1423 12.974C10.3362 14.144 9.84569 15.734 8.84949 16.6828C7.2563 16.7878 2.89121 16.3752 4.51863 19.1053C5.32851 19.9827 6.67074 19.424 7.7202 19.5027C10.6594 19.3453 13.591 19.5665 16.5302 19.454C18.0397 19.4202 18.2375 17.2565 16.7545 16.994C15.2488 16.7315 13.7203 16.8215 12.2032 16.694C13.9028 13.7278 15.3857 10.6415 17.2565 7.77282C17.747 7.10532 18.2412 6.08533 17.515 5.42908ZM9.78866 0.239115C14.3971 0.164116 19.1386 -0.552132 23.6178 0.925366C28.3745 2.37286 30.0323 7.42781 29.9867 11.8941C30.0209 15.0553 30.0323 18.2427 29.4581 21.359C28.519 27.2052 25.1653 29.7627 19.2451 29.8227C12.8381 30.0364 3.32469 31.1127 0.735295 23.6802C-0.329349 19.4915 0.0584866 15.0478 0.115524 10.7578C0.526176 4.52158 2.97489 0.374114 9.78866 0.239115ZM23.9942 19.3677C25.6482 19.1877 25.4771 16.6827 23.8193 16.679C20.0017 16.7052 21.1082 17.654 19.3896 14.1365C18.7394 12.7078 17.3363 9.64779 15.6443 11.8528C15.0017 13.169 16.4161 14.4103 16.8914 15.584C18.4542 18.0327 19.8535 20.5827 21.4466 23.0165C22.1805 24.1864 24.036 23.144 23.306 21.8915C22.8383 21.1002 22.5417 20.2527 22.1044 19.4465C22.7394 19.4315 23.363 19.439 23.9942 19.3677Z"
                                                    fill="white" />
                                                <path
                                                    d="M6.86459 20.4923C7.59464 19.3523 9.30189 19.851 9.33612 21.1335C9.14218 21.9473 8.69352 22.6897 8.12318 23.3048C7.25623 24.2047 5.70488 23.3835 5.99007 22.1722C6.13074 21.5573 6.5376 21.0247 6.86459 20.4923Z"
                                                    fill="#124D6A" />
                                            </svg>
                                        </span>
                                        App store
                                    </RouterLink>
                                </div>
                            </div>

                            <div class="block w-[260px] sm:w-[280px] md:w-[330px] ">
                                <img class="w-full h-full object-contain object-[50px] overflow-visible"
                                    src="../../assets/images/Iphone.png" alt="mobile-web">
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide
                        class="p-[30px] pb-[70px] md:p-[50px] !flex flex-col relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat min-h-[380px] md:min-h-[500px] lg:min-h-[650px]"
                        :style="{ backgroundImage: `url(${bg3})` }">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between my-auto gap-4">
                            <div class="block lg:max-w-[650px]">
                                <h4
                                    class="text-mainWhite tracking-[.5px] text-[20px] md:text-[24px] font-medium mb-[20px] leading-tight">
                                    {{ t('slider.slide_3.title') }}
                                </h4>


                                <ul class="flex flex-col gap-[10px]">
                                    <li v-for="(item, idx) in tm('slider.slide_3.list')" :key="idx">
                                        <p class="text-mainWhite tracking-[.5px] text-sm md:text-[18px] leading-tight">
                                            {{ item }}
                                        </p>
                                    </li>
                                </ul>

                                <RouterLink to="loans-detail?id=2"
                                    class="text-sm font-bold mx-auto sm:mx-0 text-white bg-[#2C702C] block rounded-[10px] mt-4 sm:mt-8 px-3 md:px-5 py-[12px] md:py-[14px] w-[130px] md:w-[150px] text-center">
                                    {{ t('btn.details') }}
                                </RouterLink>
                            </div>

                            <div
                                class="block max-w-[260px] sm:max-w-auto sm:w-[330px] lg:w-[450px] lg:min-w-[350px] mx-auto lg:mx-0">
                                <img class="w-full h-full sm:object-contain object-[20px] lg:object-[50px] overflow-visible"
                                    src="../../assets/images/laptop.png" alt="laptop-web">
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide
                        class="p-[30px] pb-[70px] md:p-[50px] !flex flex-col relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat min-h-[380px] md:min-h-[500px] lg:min-h-[650px]"
                        :style="{ backgroundImage: `url(${bg4})` }">
                        <div class="flex flex-col md:flex-row items-center justify-between my-auto gap-6 md:gap-4">
                            <div class="block max-w-[650px] text-center md:text-left">
                                <h4
                                    class="text-mainWhite text-[20px] lg:text-[26px] font-medium mb-[20px] leading-tight">
                                    Call center 24/7
                                </h4>
                                <p class="text-mainWhite text-[16px] lg:text-[20px] leading-tight mb-4">
                                    {{ t('slider.slide_4.text') }}
                                </p>

                                <ul class="flex flex-col items-center md:items-start gap-[10px]">
                                    <li class="flex items-center gap-[10px]">
                                        <div class="w-[20px]">
                                            <svg class="w-full h-full object-contain" width="40" height="40"
                                                viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M31.0359 25.209C34.8852 26.7535 37.7571 28.8126 39.9355 31.2341C40.4851 35.1554 37.42 38.0303 34.619 39.7955C27.9813 40.9687 18.5533 37.0474 10.753 29.247C2.95263 21.4467 -0.968703 12.0187 0.204536 5.38097C1.9697 2.58001 4.84456 -0.485088 8.76589 0.0644853C11.1875 2.24296 13.2467 5.11499 14.7912 8.96451C15.0483 9.60541 14.9012 10.3366 14.4314 10.8426C13.6607 11.6727 12.2671 13.0714 10.1178 14.875C9.57652 15.3293 9.4446 16.1056 9.78999 16.722C11.2904 19.4001 13.2428 21.9918 15.6255 24.3745C18.0073 26.7562 20.602 28.7121 23.2763 30.2169C23.8934 30.5642 24.6718 30.4319 25.1264 29.8889C26.9291 27.7357 28.3272 26.3407 29.1571 25.5694C29.6632 25.0991 30.3947 24.9517 31.0359 25.209Z"
                                                    fill="white" />
                                            </svg>
                                        </div>

                                        <a href="tel:444444"
                                            class="text-mainWhite text-[16px] lg:text-[20px] leading-tight">
                                            44-44-44
                                        </a>
                                    </li>

                                    <li class="flex items-center gap-[10px]">
                                        <div class="w-[20px]">
                                            <svg class="w-full h-full object-contain" width="40" height="32"
                                                viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M20 17.2637L0.0749257 6.52382C0.449925 2.86925 3.45705 0 7.14281 0H32.8571C36.5428 0 39.5501 2.86911 39.925 6.52382L20 17.2637ZM20.6678 20.1947C20.4589 20.3074 20.2303 20.3637 20 20.3637C19.7696 20.3637 19.541 20.3074 19.3321 20.1947L0 9.77451V24.7273C0 28.7364 3.20535 32 7.14286 32H32.8571C36.7947 32 40 28.7364 40 24.7273V9.77451L20.6678 20.1947Z"
                                                    fill="white" />
                                            </svg>

                                        </div>

                                        <a href="mailto:info@senagatbank.com.tm"
                                            class="text-mainWhite text-[16px] lg:text-[20px] leading-tight">
                                            info@senagatbank.com.tm
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div class="block w-[140px] sm:w-[180px] md:w-[230px] mx-auto md:mx-0">
                                <img class="w-full h-full object-contain" src="../../assets/images/callCenter.png"
                                    alt="laptop-web">
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide
                        class="p-[30px] pb-[70px] md:p-[50px] !flex flex-col relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat min-h-[380px] md:min-h-[500px] lg:min-h-[650px]"
                        :style="{ backgroundImage: `url(${bg5})` }">
                        <div class="flex flex-col md:flex-row items-center justify-between my-auto gap-8 md:gap-4">
                            <div class="block max-w-[650px] text-center md:text-left">
                                <h4
                                    class="text-mainWhite text-[20px] lg:text-[26px] font-medium mb-[20px] leading-tight">
                                    {{ t('slider.slide_5.title') }}
                                </h4>
                                <p class="text-mainWhite text-[16px] lg:text-[20px] leading-tight mb-4">
                                    {{ t('slider.slide_5.text') }}
                                </p>

                                <RouterLink to="/cards"
                                    class="text-sm font-bold mx-auto md:mx-0 text-white bg-[#2C702C] block rounded-[10px] mt-8 px-3 md:px-5 py-[12px] md:py-[14px] w-[130px] md:w-[150px] text-center">
                                    {{ t('btn.details') }}
                                </RouterLink>
                            </div>

                            <div class="block w-[200px] md:w-[300px]">
                                <img class="w-full h-full object-contain" src="../../assets/images/slider-cards.png"
                                    alt="laptop-web">
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

                <div class="flex items-center justify-center gap-3 absolute bottom-[30px] right-[40px] z-30">
                    <button class="hero-prev" aria-label="Prev">
                        <svg class="block pointer-events-none object-contain" width="28" height="28" viewBox="0 0 24 24"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.6602 7.70982C12.9005 7.95005 12.9005 8.3403 12.6602 8.55006L9.75048 11.4001H16.5299C16.8604 11.4001 17.1299 11.6696 17.1299 12.0001C17.1299 12.3305 16.8604 12.6001 16.5299 12.6001H9.77988L12.5701 15.4501C12.8104 15.6903 12.8104 16.0805 12.5701 16.2903C12.4506 16.4098 12.3006 16.4708 12.1506 16.4708C12.0006 16.4708 11.8506 16.411 11.7311 16.2903L7.47018 11.9403L11.8202 7.6806C12.0604 7.46966 12.42 7.46958 12.6602 7.70982Z"
                                fill="#eee" />
                            <path
                                d="M5.7 0H18.3C21.45 0 24 2.55 24 5.7V18.3C24 21.45 21.45 24 18.3 24H5.7C2.55 24 -9.53674e-07 21.45 -9.53674e-07 18.3V5.7C0.0292961 2.55 2.57931 0 5.7 0ZM1.2294 18.3C1.2294 20.7902 3.23916 22.8 5.7294 22.8H18.3294C20.8196 22.8 22.8294 20.7902 22.8294 18.3V5.7C22.8294 3.20976 20.8196 1.2 18.3294 1.2H5.7294C3.23916 1.2 1.2294 3.20976 1.2294 5.7V18.3Z"
                                fill="#eee" />
                        </svg>
                    </button>

                    <button class="hero-next" aria-label="Next">
                        <svg class="block pointer-events-none object-contain" width="28" height="28" viewBox="0 0 24 24"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.3398 7.70982C11.0995 7.95005 11.0995 8.3403 11.3398 8.55006L14.2495 11.4001H7.47012C7.13964 11.4001 6.87012 11.6696 6.87012 12.0001C6.87012 12.3305 7.13965 12.6001 7.47012 12.6001H14.2201L11.4299 15.4501C11.1896 15.6903 11.1896 16.0805 11.4299 16.2903C11.5494 16.4098 11.6994 16.4708 11.8494 16.4708C11.9994 16.4708 12.1494 16.411 12.2689 16.2903L16.5298 11.9403L12.1798 7.6806C11.9396 7.46966 11.58 7.46958 11.3398 7.70982Z"
                                fill="#eee" />
                            <path
                                d="M18.3 0H5.7C2.55 0 0 2.55 0 5.7V18.3C0 21.45 2.55 24 5.7 24H18.3C21.45 24 24 21.45 24 18.3V5.7C23.9707 2.55 21.4207 0 18.3 0ZM22.7706 18.3C22.7706 20.7902 20.7608 22.8 18.2706 22.8H5.6706C3.18036 22.8 1.1706 20.7902 1.1706 18.3V5.7C1.1706 3.20976 3.18036 1.2 5.6706 1.2H18.2706C20.7608 1.2 22.7706 3.20976 22.7706 5.7V18.3Z"
                                fill="#eee" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>
