<script setup>
import { RouterView } from 'vue-router'
// Dashboard header and sidebar live under components/dashboard
// Keep them simple; replace with your real implementations later
import Header from '@/components/dashboard/Header.vue'
</script>

<template>
    <Header />
    <main>
        <RouterView />
    </main>
</template>

<style scoped></style>
