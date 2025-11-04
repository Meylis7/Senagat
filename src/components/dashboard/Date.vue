<script setup>
    import { ref, onMounted } from 'vue';

    // Current date that will be updated
    const currentDate = ref(new Date());

    // Turkmen month and weekday names
    const turkmenMonths = [
        'Ýanwar', 'Fewral', 'Mart', 'Aprel', 'Maý', 'Iýun',
        'Iýul', 'Awgust', 'Sentýabr', 'Oktýabr', 'Noýabr', 'Dekabr'
    ];

    const turkmenWeekdays = [
        'Ýekşenbe', 'Duşenbe', 'Sişenbe', 'Çarşenbe', 'Penşenbe', 'Anna', 'Şenbe'
    ];

    // Russian month and weekday names
    const russianMonths = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const russianWeekdays = [
        'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
    ];

    // Current language (will be replaced with i18n in the future)
    const currentLang = ref('tm');

    // Formatted date string
    const formattedDate = ref('');

    // Function to format date based on language
    const formatDate = () => {
        const date = currentDate.value;
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const weekday = date.getDay();

        if (currentLang.value === 'tm') {
            formattedDate.value = `${turkmenWeekdays[weekday]}, ${day} ${turkmenMonths[month]} ${year}`;
        } else if (currentLang.value === 'ru') {
            formattedDate.value = `${russianWeekdays[weekday]}, ${day} ${russianMonths[month]} ${year}`;
        } else {
            // English format using native toLocaleDateString
            const options = {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };
            formattedDate.value = date.toLocaleDateString('en-US', options);
        }
    };

    // Update date on component mount
    onMounted(() => {
        formatDate();

        // Update date every day at midnight
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeUntilMidnight = tomorrow - now;

        setTimeout(() => {
            currentDate.value = new Date();
            formatDate();

            // Set up daily updates
            setInterval(() => {
                currentDate.value = new Date();
                formatDate();
            }, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);
    });

    // This will be used when vue-i18n is integrated
    const changeLanguage = (lang) => {
        if (['en', 'ru', 'tm'].includes(lang)) {
            currentLang.value = lang;
            formatDate();
        }
    };
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