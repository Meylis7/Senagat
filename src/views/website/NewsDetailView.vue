<script setup>
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import { ref, computed, onMounted, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { useRoute } from 'vue-router'
    import apiService from '@/services/apiService'
    import { Vue3Lottie } from 'vue3-lottie'
    import LoadAnimationJSON from '@/assets/loadings/loading-4.json'

    const { t } = useI18n()
    const route = useRoute()
    const newsId = computed(() => route.params?.id || route.query?.id)

    const newsItem = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const news = ref([])
    const newsLoading = ref(false)

    const breadcrumbItems = computed(() => {
        const currentTitle = newsItem.value?.title || t('news.news')
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.news'), path: '/news' },
            { label: currentTitle },
        ]
    })

    const fetchNewsDetail = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await apiService.fetchNewsDetail(newsId.value)
            const data = response?.data || response
            if (data && !Array.isArray(data)) {
                newsItem.value = data
            } else {
                await fetchFromList()
            }
        } catch (err) {
            await fetchFromList()
        } finally {
            loading.value = false
        }
    }

    const fetchFromList = async () => {
        try {
            const list = await apiService.fetchNews({ limit: 50 })
            const items = list?.data || list
            if (Array.isArray(items)) {
                const found = items.find((n) => String(n.id) === String(newsId.value))
                if (found) {
                    newsItem.value = found
                    error.value = null
                    return
                }
            }
            error.value = 'News not found'
        } catch (e) {
            error.value = e.message || 'Failed to load news'
        }
    }

    onMounted(() => {
        if (newsId.value) fetchNewsDetail()
        fetchLatestNews()
    })

    watch(newsId, (val, oldVal) => {
        if (val && val !== oldVal) {
            fetchNewsDetail()
        }
    })

    const fetchLatestNews = async () => {
        newsLoading.value = true
        try {
            const res = await apiService.fetchNews({ limit: 4 })
            const items = res?.data || res
            news.value = Array.isArray(items) ? items.slice(0, 4) : []
        } catch (e) {
            news.value = []
        } finally {
            newsLoading.value = false
        }
    }
</script>

<template>
    <!-- {{ t('offer.title') }} -->

    <!-- Breadcrumb ======================================================== -->
    <section class="crumb pt-[145px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex items-baseline gap-x-2">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>
            </div>
        </div>
    </section>

    <!-- News detail ========================================================== -->
    <section class="pt-[60px] pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex justify-between gap-4">
                    <div class="block w-7/12">
                        <div v-if="loading" class="flex items-center justify-center py-10">
                            <Vue3Lottie :animationData="LoadAnimationJSON" class="!w-full md:!w-[100px] !h-[100px]" />
                        </div>
                        <div v-else>
                            <h1 class="text-[38px] font-bold mb-2 leading-snug">
                                {{ newsItem?.title }}
                            </h1>
                            <p v-if="newsItem?.published_at" class="text-[#6F736D] text-[15px] mb-8">
                                {{ newsItem.published_at }}
                            </p>

                            <!-- <span class="block w-full h-full max-h-[300px] rounded-2xl overflow-hidden mb-5">
                            <img :src="newsItem?.image || newsItem?.thumbnail || '../../assets/images/news.png'" class="w-full h-full block object-contain"
                                :alt="newsItem?.title || 'news-image'">
                            </span> -->

                            <p v-if="!error" class="text-[17px] font-Gilroy leading-7"
                                v-html="newsItem?.description || ''"></p>
                        </div>
                    </div>

                    <div class="block w-4/12">
                        <h1 class="mb-8 text-[28px] leading-7 font-bold">
                            {{ t('btn.readMore') }}
                        </h1>

                        <!-- <article class="bg-white rounded-[20px] overflow-hidden">
                            <span class="block h-[200px] overflow-hidden rounded-2xl">
                                <img src="../../assets/images/news.png" class="block w-full h-full object-cover"
                                    alt="news" />
                            </span>
                            <div class="p-4">
                                <RouterLink to="/" class="block text-mainBlack text-[17px] font-bold leading-6">
                                    Газпромбанк расширил
                                    возможности РКО для
                                    предпринимателей
                                    сегмента МСБ
                                </RouterLink>
                            </div>
                        </article> -->

                        <!-- Loading state -->
                        <template v-if="newsLoading">
                            <article v-for="n in (news.length || 3)" :key="n"
                                class="bg-white rounded-[20px] overflow-hidden p-8 mb-4 animate-pulse">
                                <div class="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                                <div class="h-6 bg-gray-200 rounded w-full mb-8"></div>
                                <div class="flex items-center gap-x-[10px]">
                                    <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                                    <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                                </div>
                            </article>
                        </template>

                        <div v-else class="grid gap-4">
                            <article v-for="item in news" :key="item.id"
                                class="bg-white rounded-[20px] overflow-hidden p-8">
                                <p class="text-[17px] text-[#6F736D] leading-4 font-Gilroy">
                                    {{ item.published_at }}
                                </p>
                                <RouterLink :to="{ name: 'news-detail', query: { id: item.id } }"
                                    class="block mt-[20px] text-[#1D2417] text-[17px] font-bold leading-5 hover:text-[#2C702C] transition-colors overflow-hidden [text-overflow:ellipsis] [-webkit-line-clamp:3] [display:-webkit-box] [-webkit-box-orient:vertical] min-h-[60px]">
                                    {{ item.title || t('news.news') }}
                                </RouterLink>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>




</template>



<style lang="scss" scoped></style>