<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <aside class="dashboard-sidebar">
        <nav class="nav">
            <RouterLink to="/dashboard" class="link">Home</RouterLink>
            <!-- Add more links when pages are ready -->
        </nav>
    </aside>
</template>

<style scoped>
.dashboard-sidebar {
    width: 260px;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    padding: 16px;
}

.link {
    display: block;
    color: #191b19;
    margin-bottom: 10px;
}
</style>
