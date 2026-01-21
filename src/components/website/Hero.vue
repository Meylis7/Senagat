<script setup>
    import { RouterLink } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();
    import { ref } from 'vue';
    import { Swiper, SwiperSlide } from 'swiper/vue'
    import { Navigation, EffectFade } from 'swiper/modules'
    import 'swiper/css'
    import 'swiper/css/effect-fade'
    import 'swiper/css/navigation'

    import card from "@/assets/images/cards/hero-card.png";
    import hero1 from '@/assets/images/slider/slide (5).png'
    import hero2 from '@/assets/images/slider/slide (1).png'
    import hero3 from '@/assets/images/slider/slide (2).png'
    import hero4 from '@/assets/images/slider/slide (3).png'
    import hero5 from '@/assets/images/slider/slide (4).png'
    const heroImages = ref([hero1, hero2, hero3, hero4, hero5])

</script>

<template>
    <section class="pt-[110px] md:pt-[130px] pb-[40px]">
        <div class="auto_container">
            <div class="wrap relative">
                <Swiper :modules="[Navigation, EffectFade]" :loop="true" :slides-per-view="1" :space-between="0"
                    effect="fade" :fade-effect="{ crossFade: true }"
                    :navigation="{ nextEl: '.hero-next', prevEl: '.hero-prev' }">
                    <SwiperSlide v-for="img in heroImages" :key="img" class="relative overflow-hidden max-h-[1200px]">
                        <!-- <div class="item">
                                <h1
                                    class="text-center mx-auto  max-w-[900px] text-2xl lg:text-4xl font-bold leading-tight text-mainBlack">
                                    {{ t('hero.title') }}
                                </h1>
                                <RouterLink to="/cards"
                                    class="block mt-8 w-fit text-white text-[17px] font-normal bg-[#2C702C] rounded-[10px] py-3 px-[35px] mx-auto">
                                    {{ t('btn.learnMore') }}
                                </RouterLink>
                                <span
                                    class="block mt-[100px] lg:mt-[140px] max-w-[250px] lg:max-w-[400px] mx-auto relative z-10">
                                    <img :src="card" class="block w-full h-full object-contain" alt="card">
                                </span>
                            </div> -->

                        <img class="w-full h-full object-contain rounded-3xl" :src="img" alt="">
                    </SwiperSlide>
                </Swiper>

                <div class="flex items-center justify-center gap-3 absolute bottom-[30px] right-[40px] z-10">
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
