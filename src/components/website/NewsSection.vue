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
            <!-- {{ t('news.title') }} -->
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
            class="col-span-12 mm:col-span-4 rounded-[20px] sm:min-h-[200px] overflow-hidden bg-[#104910] p-8 text-white relative news-promo-glow">
            <h6 class="text-[20px] md:text-[24px] leading-tight text-mainWhite font-bold mb-[10px] z-[1]">
              <!-- {{ t('news.readUsSocial') }} -->
                        {{ t('news.title') }}
            </h6>
            <p class="text-mainWhite text-sm md:text-[17px] leading-tight opacity-60 z-[1]">
              {{ t('news.subscribeFirstNews') }}
            </p>

            <span class="hidden absolute bottom-[20px] right-[20px] mm:left-1/2 mm:-translate-x-1/2 sm:block w-[120px] mm:w-[150px] z-10">
              <!-- <img :src="megaphone" alt="news-icon" class="block w-full h-auto object-contain" /> -->
              <svg class="block w-full h-auto object-contain" width="91" height="90" viewBox="0 0 91 90" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M38.8563 10.0961C38.8876 10.1351 38.911 10.182 38.9344 10.225L65.2744 55.846C65.3135 55.9046 65.3487 55.9671 65.3799 56.0335C66.2315 57.4163 68.0283 57.8773 69.4385 57.0726L69.7823 56.8733C69.7979 56.8616 69.8135 56.8538 69.833 56.8421H69.8291C71.2393 56.0218 71.7393 54.2249 70.958 52.7952L70.9307 52.7522L44.4927 6.95922C44.4693 6.92407 44.4497 6.885 44.4302 6.84984C43.5943 5.48264 41.8404 5.00604 40.4302 5.76394C40.3833 5.79519 40.3325 5.82254 40.2817 5.84597L40.02 5.99441V5.99832C40.0044 6.00613 39.9888 6.01785 39.9732 6.02566C38.563 6.84988 38.063 8.64677 38.8482 10.0804L38.856 10.0921L38.8563 10.0961ZM17.6103 38.7801L6.13031 45.4051C0.294415 48.8035 -1.72519 56.264 1.60301 62.139C1.62255 62.1742 1.64598 62.2094 1.66551 62.2484C5.07961 68.0492 12.5175 70.0414 18.3725 66.7211L18.4194 66.6938L29.8994 60.0649L17.6103 38.7801ZM31.7393 59.3821L19.1183 37.5271L37.9543 12.4021L62.9153 55.6321L31.7353 59.3821H31.7393ZM37.1377 81.1011L38.0635 82.7027L38.0908 82.7456L38.0869 82.7417C38.833 84.1089 38.3604 85.8237 37.0127 86.6128L31.8838 89.5737H31.8877C31.8409 89.5972 31.7979 89.6206 31.7588 89.6479C30.4111 90.3706 28.7393 89.9136 27.9385 88.6127C27.919 88.5659 27.8917 88.5229 27.8643 88.4838L16.8953 69.5038C17.7391 69.2148 18.5555 68.8437 19.3289 68.4022L19.3875 68.371L27.1883 63.871L29.2781 67.496L24.9343 70.0077C24.7116 70.1327 24.5515 70.3475 24.4851 70.5936C24.4187 70.8436 24.4538 71.1053 24.5827 71.328L31.4733 83.258C31.6022 83.4806 31.8132 83.6408 32.0593 83.7072C32.3093 83.7736 32.5749 83.7385 32.7937 83.6096L37.1377 81.1011ZM30.2471 69.175L26.7432 71.1945L32.6612 81.4445L36.1651 79.4212L30.2471 69.175ZM55.5131 22.1751C59.1264 20.6517 63.31 22.0579 65.2748 25.4524L65.3022 25.4992C67.2241 28.8898 66.3413 33.1867 63.2358 35.5462L55.5131 22.1712L55.5131 22.1751ZM71.5751 22.9329C71.1103 23.1985 70.5204 23.0383 70.2548 22.5774C69.9892 22.1126 70.1494 21.5227 70.6103 21.2571L80.3955 15.6087C80.8603 15.3431 81.4502 15.4993 81.7158 15.9642C81.9814 16.4251 81.8213 17.015 81.3603 17.2806L71.5712 22.929L71.5751 22.9329ZM66.2548 11.2339C65.9892 11.6948 65.3993 11.855 64.9384 11.5893C64.4736 11.3237 64.3134 10.7339 64.579 10.269L70.2274 0.483832C70.4931 0.0228924 71.0868 -0.137258 71.5477 0.128362C72.0126 0.393992 72.1688 0.983832 71.9032 1.44866L66.2548 11.2339ZM78.0788 33.6479C77.8171 33.6596 77.5632 33.558 77.3757 33.3783C77.1843 33.1947 77.0788 32.9408 77.0788 32.6791C77.0788 32.4174 77.1843 32.1635 77.3757 31.9799C77.5632 31.8002 77.8171 31.6986 78.0788 31.7104H89.3798C89.9033 31.726 90.3212 32.1557 90.3212 32.6791C90.3212 33.2026 89.9033 33.6322 89.3798 33.6479H78.0788Z"
                  fill="#fff" />
              </svg>

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
