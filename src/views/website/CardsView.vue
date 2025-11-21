<script setup>
    import { RouterLink } from 'vue-router'
    import { useI18n } from 'vue-i18n';
    import apiService from '@/services/apiService';
    import { ref, computed, onMounted } from 'vue';

    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import NewsSection from '@/components/website/NewsSection.vue';


    const { t } = useI18n()

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('tabs.cards') },
    ]

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

    // Fetch news on component mount
    onMounted(() => {
        fetchCards();
    });

</script>

<template>
    <!-- Breadcrumb ============================================= -->
    <section class="crumb pt-[145px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center gap-x-2">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>
            </div>
        </div>
    </section>

    <!-- Cards =================================================== -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">
                    {{ t('tabs.cards') }}
                </h2>

                <div class="block space-y-4">
                    <div v-for="(card, idx) in cards" :key="card.id"
                        class="flex items-center justify-between bg-mainWhite rounded-[20px] p-8">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-mainBlack mb-5 leading-7">
                                {{ card.title || '' }}
                            </h4>
                            <div class="flex items-center gap-x-[10px] flex-wrap mb-[60px]">
                                <p v-for="(adv, i) in (card.advantages || []).slice(0, 1)" :key="i"
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 rounded-2xl bg-[#EEF2ED] w-fit">
                                    {{ [adv?.name, adv?.description].filter(Boolean).join(' ') }}
                                </p>
                            </div>
                            <RouterLink :to="`/cards-detail?id=${card.id}`"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                {{ t('btn.learnMore') }}
                            </RouterLink>
                        </div>

                        <span class="block w-[280px]">
                            <img class="block w-full h-full object-contain"
                                :src="card.image_url || '../../assets/images/card-1.png'" alt="card-image">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Cards info ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Как получить карту</h2>

                <div class="grid grid-cols-12 gap-x-4">
                    <div class="col-span-3 bg-mainWhite rounded-[20px] p-8">
                        <h6 class="text-[80px] font-bold leading-none mb-8">1</h6>
                        <h4 class="text-[28px] font-bold mb-[10px] leading-8">
                            Выберите отделение
                        </h4>
                        <p class="text-[#6F736D] font-Gilroy text-[17px] leading-6">
                            Обратитесь в удобный для вас офис
                        </p>
                    </div>

                    <div class="col-span-3 bg-mainWhite rounded-[20px] p-8">
                        <h6 class="text-[80px] font-bold leading-none mb-8">2</h6>
                        <h4 class="text-[28px] font-bold mb-[10px] leading-8">
                            Подайте заявку
                        </h4>
                        <p class="text-[#6F736D] font-Gilroy text-[17px] leading-6">
                            Специалист оформит заявку по вашему паспорту
                        </p>
                    </div>

                    <div class="col-span-6 bg-mainBlack rounded-[20px] p-8 relative overflow-hidden ellipse">
                        <h6 class="text-[80px]  text-mainWhite font-bold leading-none mb-8">3</h6>
                        <h4 class="text-[28px] text-mainWhite font-bold mb-[10px] leading-8 z-10">
                            Пользуйтесь картой
                        </h4>
                        <p class="text-mainWhite/60 font-Gilroy text-[17px] leading-6 z-10">
                            Получите карту, выбирайте категории месяца и получайте кешбэк за покупки
                        </p>
                        <span class="block w-[220px] absolute top-0 right-[51px]">
                            <img class="block w-full h-full object-contain" src="../../assets/images/lense.png"
                                alt="card-image">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- News ==================================================== -->
    <NewsSection class="pb-[120px]" />

</template>



<style lang="scss" scoped>
    .ellipse::after {
        content: "";
        position: absolute;
        width: 250px;
        height: 250px;
        right: -125px;
        top: -125px;
        background: #2C702C;
        filter: blur(53.5px);
        border-radius: 9999px;
        z-index: 2;
    }
</style>