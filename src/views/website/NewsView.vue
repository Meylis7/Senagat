<script setup>
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import { ref, computed, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { RouterLink } from 'vue-router'
    import apiService from '@/services/apiService'

    const { t } = useI18n()

    const breadcrumbItems = computed(() => [
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('breadcrumb.news') },
    ])

    const news = ref([])
    const newsLoading = ref(false)
    const newsError = ref(null)

    const fetchNews = async () => {
        newsLoading.value = true
        newsError.value = null
        try {
            const response = await apiService.fetchNews()
            if (response?.success && Array.isArray(response?.data)) {
                news.value = response.data
            } else if (Array.isArray(response)) {
                news.value = response
            } else if (Array.isArray(response?.data)) {
                news.value = response.data
            } else {
                news.value = []
            }
        } catch (error) {
            newsError.value = error.message || 'Failed to load news'
            news.value = []
        } finally {
            newsLoading.value = false
        }
    }

    onMounted(() => {
        fetchNews()
    })

</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[145px] pb-[60px] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center gap-x-2 mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>


                <h1 class="m-auto max-w-[660px] mb-[10px] text-center text-5xl font-bold">
                    Новости
                </h1>

                <p class="text-[17px] font-Gilroy text-[#6F736D] text-center">
                    Только достоверная и актуальная информация от Сенагат
                </p>
            </div>
        </div>
    </section>

    <!-- <div class="block mt-[125px] mb-[90px] mx-auto w-[390px]">
        <img src="../../assets/images/megaphone.png" class="w-full block object-contain" alt="news-megaphone">
    </div> -->

    <!-- News ===================================================================================== -->
    <section class="pt-[50px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <!-- <div class="flex items-center mb-10 gap-1">
                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Кредит
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Карта
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Вклады
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        График работы
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Важно
                    </h6>

                    <h6 class="text-[17px] text-[#6F736D] font-Gilroy py-3 px-[14px] rounded-2xl bg-mainWhite">
                        Мобильная версия
                    </h6>
                </div> -->


                <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <!-- Loading state -->
                    <template v-if="newsLoading">
                        <article v-for="n in (news.length || 3)" :key="n"
                            class="bg-white rounded-[20px] overflow-hidden p-8 animate-pulse">
                            <div class="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                            <div class="h-6 bg-gray-200 rounded w-full mb-8"></div>
                            <div class="flex items-center gap-x-[10px]">
                                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                            </div>
                        </article>
                    </template>

                    <!-- Error state -->
                    <template v-else-if="newsError && news.length === 0">
                        <div class="col-span-2 bg-white rounded-[20px] p-8 text-center">
                            <p class="text-[#6F736D] text-[17px]">{{ newsError }}</p>
                        </div>
                    </template>

                    <!-- News articles -->
                    <template v-else class="col-span-8 grid sm:grid-cols-2 gap-4">
                        <article v-for="item in news" :key="item.id"
                            class="bg-white rounded-[20px] overflow-hidden p-8">
                            <p class="text-[17px] text-[#6F736D] leading-4 font-Gilroy">
                                {{ item.published_at }}
                            </p>
                            <RouterLink :to="`/news-detail?id=${item.id}`"
                                class="block mt-[20px] text-[#1D2417] text-[17px] font-bold leading-5 hover:text-[#2C702C] transition-colors overflow-hidden [text-overflow:ellipsis] [-webkit-line-clamp:3] [display:-webkit-box] [-webkit-box-orient:vertical] min-h-[60px]">
                                {{ item.title || t('news.news') }}
                            </RouterLink>
                        </article>

                        <!-- Fallback if no news -->
                        <template v-if="news.length === 0">
                            <div class="col-span-2 grid place-items-center bg-white rounded-[20px] p-8 text-center">
                                <p class="text-[#6F736D] font-bold leading-5 text-[17px]">
                                    {{ t('news.noNews') }}
                                </p>
                            </div>
                        </template>
                    </template>
                </div>

            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>