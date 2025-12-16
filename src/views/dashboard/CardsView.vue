<script setup>
    import { RouterLink } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import apiService from '@/services/apiService';
    import { ref, onMounted, watch } from 'vue';
    import Date from '@/components/dashboard/Date.vue';

    const { t, tm, locale } = useI18n()



    const cards = ref([])
    const cardsLoading = ref(false)
    const cardsError = ref(null)

    const fetchCards = async () => {
        cardsLoading.value = true
        cardsError.value = null
        try {
            const response = await apiService.fetchCardTypes()
            const list = response?.data || response || []
            const arr = Array.isArray(list) ? list : []
            cards.value = arr.filter((it) => String(it.category) === 'individual')
        } catch (error) {
            cardsError.value = error.message || 'Failed to load cards'
            cards.value = []
        } finally {
            cardsLoading.value = false
        }
    }

    // Fetch on component mount
    onMounted(() => {
        fetchCards();
    });

    // Refetch when locale changes (server returns localized fields)
    watch(locale, () => {
        fetchCards();
    });
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
                    <h2 class="text-[22px] sm:text-[28px] font-bold leading-9">
                        {{ t('dashboard.PageTitles.cards') }}
                    </h2>

                    <Date />
                </div>

                <div class="block space-y-4">
                    <div v-for="(card, idx) in cards" :key="card.id"
                        class="flex md:items-center justify-between flex-col-reverse md:flex-row bg-mainWhite rounded-[20px] p-2 md:p-8 sm:gap-3">
                        <div class="block p-5 px-4 md:p-0">
                            <h4 class="text-[20px] md:text-[28px] font-bold text-mainBlack mb-5 leading-7">
                                {{ card.title || '' }}
                            </h4>
                            <div class="flex items-center gap-x-[10px] flex-wrap mb-5 md:mb-[60px]">
                                <p v-for="(adv, i) in (card.advantages || []).slice(0, 1)" :key="i"
                                    class="text-sm md:text-[17px] font-Gilroy text-[#2C702C] p-3 rounded-2xl bg-[#EEF2ED] w-fit">
                                    {{ [adv?.name, adv?.description].filter(Boolean).join(' ') }}
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row items-center gap-[15px]">
                                <RouterLink
                                    :to="{ name: 'dashboard.card-application', query: { id: card.id, title: card.title } }"
                                    class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] text-center w-full sm:w-fit">
                                    {{ t('dashboard.btn.submitApplication') }}
                                </RouterLink>

                                <RouterLink :to="`/cards-detail?id=${card.id}`"
                                    class="block text-[15px] font-Gilroy text-[#6F736D] transition-all duration-300 hover:text-[#2C702C] hover:underline">
                                    {{ t('dashboard.btn.details') }}
                                </RouterLink>
                            </div>
                        </div>

                        <span
                            class="block w-full min-w-[190px] h-[165px] md:max-w-[225px] relative z-10 bg-[#EEF2ED] md:bg-transparent rounded-2xl md:rounded-none overflow-hidden">
                            <img class="block w-full h-full object-contain relative top-[23px] md:top-0"
                                :src="card.image_url || '../../assets/images/card-1.png'" alt="card-image">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>
