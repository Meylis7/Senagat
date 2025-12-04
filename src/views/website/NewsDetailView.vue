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
            const list = Array.isArray(items) ? items : []
            const currentId = String(newsId.value || '')
            news.value = list.filter((n) => String(n.id) !== currentId).slice(0, 6)
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
    <section class="crumb pt-[110px] md:pt-[145px]">
        <div class="auto_container">
            <div class="wrap">
                <div
                    class="flex flex-wrap items-baseline gap-2 text-center md:text-left justify-center md:justify-start">
                    <Breadcrumb :items="breadcrumbItems" />
                </div>
            </div>
        </div>
    </section>

    <!-- News detail ========================================================== -->
    <section class="pt-[60px] pb-[80px] md:pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="grid grid-cols-12 gap-10 lg:gap-4">
                    <div class="block col-span-12 lg:col-span-7">
                        <div v-if="loading" class="flex items-center justify-center py-10">
                            <Vue3Lottie :animationData="LoadAnimationJSON" class="!w-full md:!w-[100px] !h-[100px]" />
                        </div>
                        <div v-else>
                            <h1 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-2 leading-tight">
                                {{ newsItem?.title }}
                            </h1>
                            <p v-if="newsItem?.published_at" class="text-[#6F736D] text-sm md:text-[15px] mb-8">
                                {{ newsItem.published_at }}
                            </p>

                            <!-- <span class="block w-full h-full max-h-[300px] rounded-2xl overflow-hidden mb-5">
                            <img :src="newsItem?.image || newsItem?.thumbnail || '../../assets/images/news.png'" class="w-full h-full block object-contain"
                                :alt="newsItem?.title || 'news-image'">
                            </span> -->

                            <p v-if="!error" class="text-sm md:text-[17px] font-Gilroy leading-7"
                                v-html="newsItem?.description || ''"></p>
                        </div>
                    </div>

                    <div class="block col-span-12 lg:col-span-4">
                        <h1 class="mb-8 text-[28px] leading-7 font-bold">
                            {{ t('news.otherNews') }}
                        </h1>

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

                        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <article v-for="item in news" :key="item.id"
                                class="bg-white rounded-[20px] overflow-hidden p-5 md:p-8">
                                <p class="text-[17px] text-[#6F736D] leading-tight font-Gilroy">
                                    {{ item.published_at }}
                                </p>
                                <RouterLink :to="{ name: 'news-detail', query: { id: item.id } }"
                                    class="block mt-[20px] text-[#1D2417] text-[17px] font-bold leading-tight hover:text-[#2C702C] transition-colors overflow-hidden [text-overflow:ellipsis] [-webkit-line-clamp:3] [display:-webkit-box] [-webkit-box-orient:vertical] min-h-[60px]">
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
