<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/website/Header.vue'
import Footer from '@/components/website/Footer.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>

<template>
    <Header />

    <main>
        <RouterView :key="locale" />
    </main>

    <Footer />

</template>
