<script setup>
    import { RouterLink } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();
    import { ref } from 'vue';
    import { Swiper, SwiperSlide } from 'swiper/vue'
    import { Autoplay, EffectFade } from 'swiper/modules'
    import 'swiper/css'
    import 'swiper/css/effect-fade'

    import card from "@/assets/images/cards/hero-card.png";
    import hero1 from '@/assets/images/slider/slide (2).png'
    import hero2 from '@/assets/images/slider/slide (1).png'
    import hero3 from '@/assets/images/slider/slide (3).png'
    import hero4 from '@/assets/images/slider/slide (4).png'
    const heroImages = ref([hero1, hero2, hero3, hero4])

</script>

<template>
    <section>
        <Swiper :modules="[Autoplay, EffectFade]" :autoplay="{ delay: 4000, disableOnInteraction: false }" :loop="true"
            :slides-per-view="1" :space-between="0" effect="fade" :fade-effect="{ crossFade: true }">
            <SwiperSlide v-for="img in heroImages" :key="img" class="mb-[80px] relative overflow-hidden max-h-[1200px]">
                <!-- <div class="item">
                                <h1
                                    class="text-center mx-auto  max-w-[900px] text-2xl lg:text-4xl font-bold leading-tight text-mainBlack">
                                    {{ t('hero.title') }}
                                </h1>
                                <RouterLink to="/cards"
                                    class="block mt-8 w-fit text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[10px] py-3 px-[35px] mx-auto">
                                    {{ t('btn.learnMore') }}
                                </RouterLink>
                                <span
                                    class="block mt-[100px] lg:mt-[140px] max-w-[250px] lg:max-w-[400px] mx-auto relative z-10">
                                    <img :src="card" class="block w-full h-full object-contain" alt="card">
                                </span>
                            </div> -->

                <img class="w-full h-full object-contain" :src="img" alt="">
            </SwiperSlide>
        </Swiper>
    </section>
</template>



<style lang="scss" scoped></style>
