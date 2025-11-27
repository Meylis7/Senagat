<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import apiService from '@/services/apiService';
  import Breadcrumb from '@/components/website/Breadcrumb.vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Navigation } from 'swiper/modules'
  import 'swiper/css'

  const { t, tm } = useI18n()

  const breadcrumbItems = computed(() => ([
    { label: t('breadcrumb.home'), path: '/' },
    { label: t('breadcrumb.about') },
  ]))

  const modules = [Autoplay, Navigation]
  const aboutSlides = computed(() => {
    const arr = tm('about.slider')
    return Array.isArray(arr) ? arr : []
  })
  const aboutSwiper = ref(null)
  const onAboutSwiper = (s) => { aboutSwiper.value = s }


  // Awards Section ============================================================================
  const awards = ref([])
  const awardsLoading = ref(false)
  const awardsError = ref(null)

  const fetchAwards = async () => {
    awardsLoading.value = true
    awardsError.value = null
    try {
      const response = await apiService.fetchAwards()
      if (response?.success && Array.isArray(response?.data)) {
        awards.value = response.data
      } else if (Array.isArray(response)) {
        awards.value = response
      } else if (Array.isArray(response?.data)) {
        awards.value = response.data
      } else {
        awards.value = []
      }
    } catch (error) {
      awardsError.value = error.message || 'Failed to load awards'
      awards.value = []
    } finally {
      awardsLoading.value = false
    }
  }

  // Fetch news on component mount
  onMounted(() => {
    fetchAwards();
  });

</script>


<template>
  <!-- Hero  ================================================= -->
  <section class="hero pt-[130px] pb-[60px] bg-[#173A16] relative overflow-hidden">
    <div class="auto_container">
      <div class="hero_wrap">

        <div class="flex items-center justify-center gap-x-2 mb-[60px]">
          <Breadcrumb :items="breadcrumbItems" linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
            currentClass="text-[17px] font-Gilroy text-mainWhite" />
        </div>


        <h1 class="m-auto max-w-[660px] text-mainWhite mb-[10px] text-center text-5xl font-bold">
          {{ t('about.title') }}
        </h1>

        <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
          {{ t('about.subtitle') }}
        </p>

        <span class="block mt-[125px] w-full max-w-[390px] mx-auto relative z-10">
          <img src="../../assets/images/senagat-big.png" class="block w-full h-full object-contain" alt="card">
        </span>
      </div>
    </div>

    <span class="card-bg-circle"></span>
  </section>

  <!-- Facts ================================================= -->
  <section class="py-[60px]">
    <div class="auto_container">
      <div class="wrap">
        <h2 class="text-[38px] font-bold mb-10 leading-9">
          {{ t('facts.title') }}
        </h2>

        <div class="grid md:grid-cols-2 gap-4">
          <div v-for="item in awards" :key="item.id" class="block bg-mainWhite rounded-[20px] p-8">
            <RouterLink :to="{ name: 'awards-detail', query: { id: item.id } }" class="block">
              <h4 class=" text-[28px] font-bold text-mainBlack mb-2">
                {{ item.title || '' }}
              </h4>
            </RouterLink>
            <p class="text-[17px] text-[#6F736D] mb-6">
              {{ item.sub_title || '' }}
            </p>
            <span class="h-[220px] flex justify-end relative">
              <img :src="item.image_url" class="block h-full object-contain" alt="card">
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- History =============================================== -->
  <section class="py-[60px]">
    <div class="auto_container">
      <div class="wrap">
        <div class="flex gap-x-4">
          <div class="w-[calc(100%-306px)] bg-mainWhite rounded-[20px] overflow-hidden">
            <Swiper :modules="modules" :slides-per-view="1" :loop="true" :autoplay="{ delay: 7000 }"
              @swiper="onAboutSwiper">
              <SwiperSlide v-for="(s, idx) in aboutSlides" :key="idx">
                <div class="relative flex items-center justify-center bg-[#2C702C] gap-[60px] py-5">
                  <button type="button" class="about-prev" @click="aboutSwiper && aboutSwiper.slidePrev()">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" rx="20" fill="#EEF2ED" />
                      <path
                        d="M22.9427 25.8078C23.0007 25.8659 23.0468 25.9348 23.0782 26.0107C23.1097 26.0865 23.1258 26.1679 23.1258 26.25C23.1258 26.3321 23.1097 26.4134 23.0782 26.4893C23.0468 26.5652 23.0007 26.6341 22.9427 26.6922C22.8846 26.7502 22.8157 26.7963 22.7398 26.8277C22.6639 26.8592 22.5826 26.8753 22.5005 26.8753C22.4184 26.8753 22.3371 26.8592 22.2612 26.8277C22.1853 26.7963 22.1164 26.7502 22.0583 26.6922L15.8083 20.4422C15.7502 20.3841 15.7041 20.3152 15.6726 20.2393C15.6412 20.1634 15.625 20.0821 15.625 20C15.625 19.9178 15.6412 19.8365 15.6726 19.7606C15.7041 19.6848 15.7502 19.6158 15.8083 19.5578L22.0583 13.3078C22.1756 13.1905 22.3346 13.1246 22.5005 13.1246C22.6663 13.1246 22.8254 13.1905 22.9427 13.3078C23.06 13.4251 23.1258 13.5841 23.1258 13.75C23.1258 13.9158 23.06 14.0749 22.9427 14.1922L17.1341 20L22.9427 25.8078Z"
                        fill="#2C702C" />
                    </svg>
                  </button>
                  <h4 class="text-[38px] font-bold text-[#EEF2ED]">
                    {{ s.title }}
                  </h4>
                  <button type="button" class="about-next" @click="aboutSwiper && aboutSwiper.slideNext()">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" rx="20" fill="#EEF2ED" />
                      <path
                        d="M24.1925 20.4422L17.9425 26.6922C17.8845 26.7502 17.8155 26.7963 17.7397 26.8277C17.6638 26.8592 17.5825 26.8753 17.5003 26.8753C17.4182 26.8753 17.3369 26.8592 17.261 26.8277C17.1852 26.7963 17.1162 26.7502 17.0582 26.6922C17.0001 26.6341 16.954 26.5652 16.9226 26.4893C16.8912 26.4134 16.875 26.3321 16.875 26.25C16.875 26.1679 16.8912 26.0865 16.9226 26.0107C16.954 25.9348 17.0001 25.8659 17.0582 25.8078L22.8668 20L17.0582 14.1922C16.9409 14.0749 16.875 13.9158 16.875 13.75C16.875 13.5841 16.9409 13.4251 17.0582 13.3078C17.1754 13.1905 17.3345 13.1246 17.5003 13.1246C17.6662 13.1246 17.8253 13.1905 17.9425 13.3078L24.1925 19.5578C24.2506 19.6158 24.2967 19.6848 24.3282 19.7606C24.3597 19.8365 24.3758 19.9178 24.3758 20C24.3758 20.0821 24.3597 20.1634 24.3282 20.2393C24.2967 20.3152 24.2506 20.3841 24.1925 20.4422Z"
                        fill="#2C702C" />
                    </svg>
                  </button>
                </div>

                <p class="p-8 text-[17px] font-Gilroy leading-7" v-html="s.description"></p>
              </SwiperSlide>
            </Swiper>
          </div>

          <div class="w-[290px] bg-mainWhite rounded-[20px] flex items-center justify-center">
            <img src="../../assets/images/senagat-big.png" class="w-[200px] block object-contain" alt="emblem">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- App =================================================== -->
  <section class="pt-[180px] pb-[250px]">
    <div class="auto_container">
      <div class="wrap">

        <div class="block relative">
          <div class=" bg-mainBlack rounded-[20px] p-8 relative overflow-hidden ellipse">
            <h4 class="text-[28px] text-mainWhite font-bold mb-[10px] leading-8 z-10">
              {{ t('app.title') }}
            </h4>
            <p class="text-mainWhite/60 font-Gilroy text-[17px] leading-6 z-10 max-w-[330px]">
              {{ t('app.subTitle') }}
            </p>

            <div class="bg-circle"></div>

          </div>
          <span class="block w-[220px] absolute top-1/2 -translate-y-1/2 right-[20%] z-10">
            <img class="block w-full h-full object-contain" src="../../assets/images/mobile-app.png" alt="app-image">
          </span>
        </div>

      </div>
    </div>
  </section>

</template>

<style lang="scss" scoped>
  .card-bg-circle {
    display: block;
    position: absolute;
    width: 560px;
    height: 560px;
    left: 50%;
    transform: translateX(-50%);
    bottom: -362px;
    background: #2C702C;
    filter: blur(137.15px);
    border-radius: 50%;
    z-index: 1;
  }

  .bg-circle {
    position: absolute;
    width: 425px;
    height: 425px;
    background: #2C702C;
    border-radius: 50%;
    filter: blur(137.15px);
    z-index: 1;
    right: 15%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
