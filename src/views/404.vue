<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();

    import logo from "@/assets/images/logo.png";

</script>

<template>
    <section
        class="w-screen h-screen bg-[url('/src/assets/images/404.png')] bg-cover bg-center flex justify-end items-end">
        <div class="grid gap-[10px] print:[48px] pb-[60px] max-w-[760px]">
            <RouterLink to="/" class="w-[113px] block">
                <img :src="logo" class="block w-full h-auto object-contain" alt="logo">
            </RouterLink>
            <h1 class="text-[48px] text-[#EEF2ED] font-bold leading-tight">
                {{ t('404.title') }}
            </h1>
            <p class="text-[17px] text-mainWhite leading-tight">
                {{ t('404.text') }}
            </p>
            <RouterLink to="/"
                class="block mt-3 w-fit text-white text-[17px] font-normal bg-[#2C702C] rounded-[10px] py-3 px-[35px]">
                {{ t('404.btn') }}
            </RouterLink>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>