<script setup>
  import { ref, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import apiService from '@/services/apiService'
  import megaphone from '@/assets/images/services/services (17).png'

  const { t } = useI18n()

  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchNews = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiService.fetchNews({ limit: 4 })
      const list = response?.data || response || []
      const arr = Array.isArray(list) ? list : []
      items.value = arr.slice(0, 4)
    } catch (e) {
      error.value = e.message || 'Failed to load news'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchNews()
  })

</script>

<template>
  <section class="py-[30px] md:py-[50px]">
    <div class="auto_container">
      <div class="wrap">
        <div class="flex sm:items-center justify-between flex-col sm:flex-row mb-5 md:mb-6 gap-[10px]">
          <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold">
            {{ t('news.title') }}
          </h2>
          <RouterLink to="/news" class="text-[#2C702C] hover:opacity-80 inline-flex items-center gap-2">
            {{ t('btn.showAll') }}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.35196 3.77314C6.29969 3.72088 6.25824 3.65884 6.22995 3.59055C6.20167 3.52227 6.18711 3.44908 6.18711 3.37517C6.18711 3.30127 6.20167 3.22808 6.22995 3.1598C6.25824 3.09151 6.29969 3.02947 6.35196 2.97721C6.40422 2.92494 6.46626 2.88349 6.53455 2.8552C6.60283 2.82692 6.67602 2.81236 6.74992 2.81236C6.82383 2.81236 6.89702 2.82692 6.9653 2.8552C7.03359 2.88349 7.09563 2.92494 7.14789 2.97721L12.7729 8.60221C12.8252 8.65445 12.8667 8.71649 12.895 8.78477C12.9233 8.85306 12.9379 8.92625 12.9379 9.00018C12.9379 9.0741 12.9233 9.14729 12.895 9.21558C12.8667 9.28387 12.8252 9.3459 12.7729 9.39814L7.14789 15.0231C7.04234 15.1287 6.89919 15.188 6.74992 15.188C6.60066 15.188 6.4575 15.1287 6.35195 15.0231C6.24641 14.9176 6.18711 14.7744 6.18711 14.6252C6.18711 14.4759 6.24641 14.3328 6.35195 14.2272L11.5797 9.00018L6.35196 3.77314Z"
                fill="#6F736D" />
            </svg>
          </RouterLink>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div
            class="col-span-12 mm:col-span-4 rounded-[20px] sm:min-h-[200px] overflow-hidden bg-[#1D2417] p-8 text-white relative news-promo-glow">
            <h6 class="text-[20px] md:text-[24px] leading-tight text-mainWhite font-bold mb-[10px] z-[1]">
              {{ t('news.readUsSocial') }}
            </h6>
            <p class="text-mainWhite text-sm md:text-[17px] leading-tight opacity-60 font-Gilroy z-[1]">
              {{ t('news.subscribeFirstNews') }}
            </p>

            <span
              class="hidden absolute mm:relative -right-[15px] mm:right-0 -top-[70px] mm:top-0 sm:block ml-auto mt-[20px] sm:w-[300px] mm:w-[300px] z-10">
              <img :src="megaphone" alt="news-icon" class="block w-full h-auto object-contain" />
            </span>
          </div>

          <div class="col-span-12 mm:col-span-8 grid sm:grid-cols-2 gap-4">
            <template v-if="loading">
              <article v-for="n in 4" :key="n" class="bg-white rounded-[20px] overflow-hidden p-8 animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div class="h-6 bg-gray-200 rounded w-full mb-8"></div>
                <div class="flex items-center gap-x-[10px]">
                  <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </article>
            </template>

            <template v-else-if="error && items.length === 0">
              <div class="col-span-2 bg-white rounded-[20px] p-8 text-center">
                <p class="text-[#6F736D] text-[17px]">{{ error }}</p>
              </div>
            </template>

            <template v-else>
              <article v-for="item in items" :key="item.id" class="bg-white rounded-[20px] overflow-hidden p-8">
                <p class="text-[17px] text-[#6F736D] leading-4 font-Gilroy">
                  {{ item.published_at }}
                </p>
                <RouterLink :to="`/news-detail?id=${item.id}`"
                  class="block mt-[20px] text-[#1D2417] text-sm md:text-[17px] font-bold leading-5 hover:text-[#2C702C] transition-colors overflow-hidden [text-overflow:ellipsis] [-webkit-line-clamp:3] [display:-webkit-box] [-webkit-box-orient:vertical] md:min-h-[60px]">
                  {{ item.title || t('news.news') }}
                </RouterLink>
              </article>

              <template v-if="items.length === 0">
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
    </div>
  </section>
</template>

<style scoped>
  .news-promo-glow::after {
    content: "";
    position: absolute;
    width: 321px;
    height: 321px;
    right: -120px;
    bottom: -97px;
    background: #2C702C;
    filter: blur(137.15px);
    border-radius: 9999px;
    pointer-events: none;
  }
</style>
