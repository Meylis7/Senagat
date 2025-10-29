<script setup>
import { RouterView } from 'vue-router'
// Dashboard header and sidebar live under components/dashboard
// Keep them simple; replace with your real implementations later
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
</script>

<template>
    <DashboardHeader />
    <div class="dashboard-container">
        <DashboardSidebar />
        <main class="dashboard-content">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.dashboard-container {
    display: flex;
    min-height: 100vh;
}

.dashboard-content {
    flex: 1;
    padding: 20px;
}
</style>
