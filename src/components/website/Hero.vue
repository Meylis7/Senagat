<script setup>
    import { RouterLink } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();

    import card from "@/assets/images/card-1.png";


</script>

<template>
    <section class="hero pt-[130px] md:pt-[155px] pb-[80px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">
                <h1
                    class="text-center mx-auto  max-w-[900px] text-2xl lg:text-4xl font-bold leading-tight text-mainWhite">
                    {{ t('hero.title') }}
                </h1>

                <RouterLink to="/cards"
                    class="block mt-8 w-fit text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[10px] py-3 px-[35px] mx-auto">
                    {{ t('btn.learnMore') }}
                </RouterLink>

                <span class="block mt-[100px] lg:mt-[140px] max-w-[250px] lg:max-w-[400px] mx-auto relative z-10">
                    <img :src="card" class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"></span>
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
</style>