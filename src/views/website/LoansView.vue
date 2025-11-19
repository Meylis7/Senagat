<script setup>
    import { RouterLink } from 'vue-router';
    import { ref, computed, onMounted } from 'vue';

    import { useI18n } from 'vue-i18n';
    import apiService from '@/services/apiService';

    import Breadcrumb from '@/components/website/Breadcrumb.vue';


    const { t } = useI18n();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('tabs.credits') },
    ];

    const credits = ref([])
    const creditsLoading = ref(false)
    const creditsError = ref(null)

    const fetchCredits = async () => {
        creditsLoading.value = true
        creditsError.value = null
        try {
            const response = await apiService.fetchCreditTypes()
            if (response?.success && Array.isArray(response?.data)) {
                credits.value = response.data
            } else if (Array.isArray(response)) {
                credits.value = response
            } else if (Array.isArray(response?.data)) {
                credits.value = response.data
            } else {
                credits.value = []
            }
        } catch (error) {
            creditsError.value = error.message || 'Failed to load credits'
            credits.value = []
        } finally {
            creditsLoading.value = false
        }
    }

    onMounted(() => {
        fetchCredits();
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

    <!-- Loans =================================================== -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">
                    {{ t('tabs.credits') }}
                </h2>

                <div class="block space-y-4">
                    <div v-for="(credit, ci) in credits" :key="credit.id"
                        class="flex items-center justify-between bg-mainWhite rounded-[20px] p-8 relative overflow-hidden">
                        <div class="block">
                            <h4 class="text-[28px] font-bold text-mainBlack mb-5 leading-7">
                                {{ credit?.title || '' }}
                            </h4>
                            <div class="flex items-center gap-x-[10px]">
                                <p v-if="credit?.term_text"
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    {{ credit.term_text }}
                                </p>
                                <p v-if="credit?.amount_text" 
                                    class="text-[17px] font-Gilroy text-[#2C702C] p-3 mb-[60px] rounded-2xl bg-[#EEF2ED] w-fit leading-7">
                                    {{ credit.amount_text }}
                                </p>
                            </div>

                            <RouterLink :to="`/loans-detail?id=${credit.id}`"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                {{ t('btn.learnMore') }}
                            </RouterLink>
                        </div>

                        <span class="block w-[225px] relative z-10">
                            <img class="block w-full h-full object-contain" :src="credit?.image_url" alt="card-image">
                        </span>

                        <span class="loan-bg-circle" :class="credit?.background_class || 'loan-bg-yellow'"
                            :style="credit?.background_color ? { background: credit.background_color } : null"></span>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- Loans info ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">Как получить кредит</h2>

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
    <section class="pt-[50px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-[38px] font-bold">Новости, которыми хочется делиться</h2>
                    <RouterLink to="/"
                        class="text-[#2C702C] font-Gilroy hover:opacity-80 inline-flex items-center gap-2">
                        Показать все
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.35196 3.77314C6.29969 3.72088 6.25824 3.65884 6.22995 3.59055C6.20167 3.52227 6.18711 3.44908 6.18711 3.37517C6.18711 3.30127 6.20167 3.22808 6.22995 3.1598C6.25824 3.09151 6.29969 3.02947 6.35196 2.97721C6.40422 2.92494 6.46626 2.88349 6.53455 2.8552C6.60283 2.82692 6.67602 2.81236 6.74992 2.81236C6.82383 2.81236 6.89702 2.82692 6.9653 2.8552C7.03359 2.88349 7.09563 2.92494 7.14789 2.97721L12.7729 8.60221C12.8252 8.65445 12.8667 8.71649 12.895 8.78477C12.9233 8.85306 12.9379 8.92625 12.9379 9.00018C12.9379 9.0741 12.9233 9.14729 12.895 9.21558C12.8667 9.28387 12.8252 9.3459 12.7729 9.39814L7.14789 15.0231C7.04234 15.1287 6.89919 15.188 6.74992 15.188C6.60066 15.188 6.4575 15.1287 6.35195 15.0231C6.24641 14.9176 6.18711 14.7744 6.18711 14.6252C6.18711 14.4759 6.24641 14.3328 6.35195 14.2272L11.5797 9.00018L6.35196 3.77314Z"
                                fill="#6F736D" />
                        </svg>

                    </RouterLink>
                </div>

                <div class="flex gap-4">
                    <!-- Promo card left -->
                    <div
                        class="w-full max-w-[390px] flex-shrink-0 rounded-[20px] overflow-hidden bg-[#0E0F0E] p-8 text-white relative min-h-[500px] news-promo-glow">
                        <h6 class="text-[28px] leading-9 text-mainWhite font-bold mb-[10px]">
                            Скачай приложение
                        </h6>
                        <p class="text-mainWhite text-[17px] leading-7 opacity-60 font-Gilroy">
                            Курс действует на текущее время. <br> Точный курс будет определён на момент совершения
                            операции
                        </p>

                        <span class="block min-w-[232px] z-10 absolute -bottom-[113px] left-1/2 -translate-x-1/2">
                            <img src="../../assets/images/mobile-app.png" alt="app"
                                class="block w-full h-auto object-contain" />
                        </span>
                    </div>

                    <!-- News cards right -->
                    <div class="flex-1 grid sm:grid-cols-2 gap-4">
                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-mainBlack text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-mainBlack text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-mainBlack text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>

                        <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="text-mainBlack text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article>
                    </div>
                </div>

            </div>
        </div>
    </section>
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

    /* Loan background circles */
    .loan-bg-circle {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        filter: blur(137.15px);
        z-index: 1;
        right: -150px;
        top: -10px;
    }

    /* Yellow background for young families */
    .loan-bg-yellow {
        background: #EDC928;
    }

    /* Green background for consumer */
    .loan-bg-green {
        background: #28ED2E;
    }

    /* Blue background for wedding */
    .loan-bg-blue {
        background: #28B8ED;
    }

    /* Purple background for education */
    .loan-bg-purple {
        background: #BB28ED;
    }

    /* Orange background for overdraft */
    .loan-bg-orange {
        background: #ED6328;
    }

    /* Yellow background for agriculture (slightly different shade) */
    .loan-bg-yellow-2 {
        background: #EDED28;
    }
</style>