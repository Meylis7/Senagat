<script setup>
import { RouterLink } from 'vue-router';

import card from "@/assets/images/card-1.png";


</script>

<template>
    <section class="hero pt-[155px] pb-[80px] bg-[#1D2417] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">
                <h1 class="m-auto max-w-[660px] text-center text-5xl font-bold text-mainWhite">
                    Виртуальная карта за 0₽ с мгновенным кэшбэком
                </h1>

                <RouterLink to="/"
                    class="block mt-5 w-fit text-white text-[17px] font-normal font-Gilroy bg-[#2C702C] rounded-[20px] py-3 px-[35px] mx-auto">
                    Узнать больше</RouterLink>

                <span class="block mt-[140px] max-w-[400px] mx-auto relative z-10">
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