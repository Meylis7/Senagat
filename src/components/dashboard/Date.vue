<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useI18n } from 'vue-i18n';

    const { locale, t } = useI18n();

    // Current date that will be updated
    const currentDate = ref(new Date());

    // Formatted date string using i18n
    const formattedDate = computed(() => {
        const date = currentDate.value;
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const weekday = date.getDay();

        const monthName = t(`date.months.${month}`);
        const weekdayName = t(`date.weekdays.${weekday}`);

        return `${weekdayName}, ${day} ${monthName} ${year}`;
    });

    // Update date on component mount
    onMounted(() => {
        // Update date every day at midnight
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeUntilMidnight = tomorrow - now;

        setTimeout(() => {
            currentDate.value = new Date();

            // Set up daily updates
            setInterval(() => {
                currentDate.value = new Date();
            }, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);
    });
</script>

<template>
    <div class="text-[15px] font-bold capitalize">
        {{ formattedDate }}
    </div>
</template>

<style lang="scss" scoped>
    .date-display {
        color: #333;
        padding: 10px;
    }
</style>