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
  <section class="hero pt-[110px] md:pt-[130px] pb-[60px] bg-[#173A16] relative overflow-hidden">
    <div class="auto_container">
      <div class="hero_wrap">

        <div class="flex items-center justify-center flex-wrap gap-2 mb-10 md:mb-[60px] text-center md:text-lef">
          <Breadcrumb :items="breadcrumbItems" linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
            currentClass="text-sm md:text-[17px] font-Gilroy text-mainWhite" />
        </div>


        <h1
          class="m-auto max-w-[660px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
          {{ t('about.title') }}
        </h1>

        <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
          {{ t('about.subtitle') }}
        </p>

        <span class="block mt-[80px] md:mt-[125px] w-[210px] md:w-[300px] max-w-[390px] mx-auto relative z-10">
          <img src="../../assets/images/logo/logo.png" class="block w-full h-full object-contain" alt="card">
        </span>
      </div>
    </div>

    <span class="card-bg-circle"></span>
  </section>

  <!-- Facts ================================================= -->
  <section class="py-[60px]">
    <div class="auto_container">
      <div class="wrap">
        <h2 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold mb-10 leading-9">
          {{ t('facts.title') }}
        </h2>

        <div class="grid grid-cols-12 gap-4">
          <RouterLink :to="{ name: 'awards-detail', query: { id: item.id } }" v-for="item in awards" :key="item.id"
            class="award_glow relative overflow-hidden group col-span-12 sm:col-span-6 md:col-span-4 md:last:col-span-12 block bg-mainWhite rounded-[20px] p-8 hover:bg-[#1D2417] transition-all duration-300">
            <h4
              class="text-[18px] lg:text-[20px] leading-tight font-bold text-mainBlack mb-2 group-hover:text-white transition-all duration-300">
              {{ item.title || '' }}
            </h4>
            <p class="text-sm text-[#6F736D] mb-6 group-hover:text-white transition-all duration-300">
              {{ item.sub_title || '' }}
            </p>
            <span class="h-[180px] flex justify-end relative z-[1]">
              <img :src="item.image_url || '../../assets/images/fact.png'" class="block h-full object-contain"
                alt="card">
            </span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <!-- History =============================================== -->
  <section class="md:py-[60px] pb-[80px]">
    <div class="auto_container">
      <div class="wrap">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-9 bg-mainWhite rounded-[20px] overflow-hidden">
            <Swiper :modules="modules" :slides-per-view="1" :loop="true" :autoplay="{ delay: 7000 }"
              @swiper="onAboutSwiper">
              <SwiperSlide v-for="(s, idx) in aboutSlides" :key="idx" class="!h-fit">
                <div class="relative flex items-center justify-center bg-[#2C702C] gap-7 md:gap-[60px] py-5">
                  <button type="button" class="about-prev w-7 hidden sm:block md:w-10"
                    @click="aboutSwiper && aboutSwiper.slidePrev()">
                    <svg width="40" height="40" class="w-full h-full object-contain" viewBox="0 0 40 40" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" rx="20" fill="#EEF2ED" />
                      <path
                        d="M22.9427 25.8078C23.0007 25.8659 23.0468 25.9348 23.0782 26.0107C23.1097 26.0865 23.1258 26.1679 23.1258 26.25C23.1258 26.3321 23.1097 26.4134 23.0782 26.4893C23.0468 26.5652 23.0007 26.6341 22.9427 26.6922C22.8846 26.7502 22.8157 26.7963 22.7398 26.8277C22.6639 26.8592 22.5826 26.8753 22.5005 26.8753C22.4184 26.8753 22.3371 26.8592 22.2612 26.8277C22.1853 26.7963 22.1164 26.7502 22.0583 26.6922L15.8083 20.4422C15.7502 20.3841 15.7041 20.3152 15.6726 20.2393C15.6412 20.1634 15.625 20.0821 15.625 20C15.625 19.9178 15.6412 19.8365 15.6726 19.7606C15.7041 19.6848 15.7502 19.6158 15.8083 19.5578L22.0583 13.3078C22.1756 13.1905 22.3346 13.1246 22.5005 13.1246C22.6663 13.1246 22.8254 13.1905 22.9427 13.3078C23.06 13.4251 23.1258 13.5841 23.1258 13.75C23.1258 13.9158 23.06 14.0749 22.9427 14.1922L17.1341 20L22.9427 25.8078Z"
                        fill="#2C702C" />
                    </svg>
                  </button>
                  <h4 class="text-[22px] md:text-[28px] lg:text-[38px] font-bold text-[#EEF2ED]">
                    {{ s.title }}
                  </h4>
                  <button type="button" class="about-next w-7 hidden sm:block md:w-10"
                    @click="aboutSwiper && aboutSwiper.slideNext()">
                    <svg width="40" height="40" class="w-full h-full object-contain" viewBox="0 0 40 40" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" rx="20" fill="#EEF2ED" />
                      <path
                        d="M24.1925 20.4422L17.9425 26.6922C17.8845 26.7502 17.8155 26.7963 17.7397 26.8277C17.6638 26.8592 17.5825 26.8753 17.5003 26.8753C17.4182 26.8753 17.3369 26.8592 17.261 26.8277C17.1852 26.7963 17.1162 26.7502 17.0582 26.6922C17.0001 26.6341 16.954 26.5652 16.9226 26.4893C16.8912 26.4134 16.875 26.3321 16.875 26.25C16.875 26.1679 16.8912 26.0865 16.9226 26.0107C16.954 25.9348 17.0001 25.8659 17.0582 25.8078L22.8668 20L17.0582 14.1922C16.9409 14.0749 16.875 13.9158 16.875 13.75C16.875 13.5841 16.9409 13.4251 17.0582 13.3078C17.1754 13.1905 17.3345 13.1246 17.5003 13.1246C17.6662 13.1246 17.8253 13.1905 17.9425 13.3078L24.1925 19.5578C24.2506 19.6158 24.2967 19.6848 24.3282 19.7606C24.3597 19.8365 24.3758 19.9178 24.3758 20C24.3758 20.0821 24.3597 20.1634 24.3282 20.2393C24.2967 20.3152 24.2506 20.3841 24.1925 20.4422Z"
                        fill="#2C702C" />
                    </svg>
                  </button>
                </div>

                <p class="p-6 md:p-8 text-[15px] md:text-[17px] font-Gilroy leading-tight" v-html="s.description"></p>
              </SwiperSlide>
            </Swiper>
          </div>

          <div
            class="hidden lg:flex col-span-3 rounded-[20px] items-center justify-center glow relative overflow-hidden bg-[#1D2417]">
            <img src="../../assets/images/logo/logo.png" class="w-[calc(100%-40px)] block object-contain z-[1]"
              alt="emblem">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- App =================================================== -->
  <section class="pt-[180px] pb-[250px] hidden md:block">
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
            <div class="flex gap-4">
              <RouterLink to="/"
                class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-8 px-5 py-[14px] flex items-center gap-3 min-w-[150px]">
                <span class="w-6 block">
                  <svg class="w-full h-full object-contain" width="30" height="30" viewBox="0 0 30 30" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20.6816 18.0789C17.3184 14.76 16.9132 15.5025 20.7952 12.3711C24.9612 15.315 25.7452 14.4037 20.6816 18.0789Z"
                      fill="#2C702C" />
                    <path
                      d="M16.9587 14.3549C6.5359 4.48444 7.11158 4.02691 19.2538 11.3885C19.3637 11.501 19.803 11.5948 19.6023 11.786C18.716 12.6335 17.8563 13.4848 16.9587 14.3549Z"
                      fill="#2C702C" />
                    <path
                      d="M9.63763 23.2953C11.8911 20.8165 14.3832 18.5176 16.72 16.1025C16.9056 15.915 16.9775 15.9112 17.1555 16.0912C17.9811 16.92 18.8068 17.7526 19.6324 18.5851C17.1404 20.7602 13.3568 22.549 9.952 23.3666C9.81184 23.3328 9.72474 23.314 9.63763 23.2953Z"
                      fill="#2C702C" />
                    <path
                      d="M8.56587 22.9134C8.11898 23.2959 7.76298 21.8708 7.85767 21.6308C7.74026 20.5845 6.65326 4.5638 8.82343 7.83394C10.9784 9.99779 13.1486 12.1429 15.3111 14.2992C15.4778 14.6067 16.2731 14.933 15.9853 15.293C13.4553 17.7756 10.933 20.277 8.56587 22.9134Z"
                      fill="#2C702C" />
                    <path
                      d="M19.2538 11.3885C7.11155 4.02692 6.53588 4.48445 16.9587 14.3549C17.8562 13.4849 18.7122 12.6336 19.6022 11.786C19.8029 11.591 19.3636 11.4973 19.2538 11.3885ZM19.6325 18.5851C18.8069 17.7563 17.9812 16.92 17.1556 16.0912C16.9776 15.9112 16.9056 15.9187 16.72 16.1025C14.3832 18.5176 11.8912 20.8165 9.63772 23.2953C9.72482 23.314 9.81192 23.3328 9.95204 23.3628C13.3569 22.549 17.1404 20.7565 19.6325 18.5851ZM20.7952 12.3711C16.9132 15.5024 17.3184 14.7599 20.6816 18.0788C25.7453 14.4037 24.9613 15.315 20.7952 12.3711ZM8.82344 7.83337C6.65328 4.56323 7.74024 20.5802 7.85768 21.6302C7.76678 21.8702 8.12278 23.2953 8.56589 22.9128C10.933 20.2764 13.4516 17.7751 15.9853 15.2962C16.2731 14.9324 15.4778 14.6099 15.3112 14.3024C13.1486 12.146 10.9784 9.99722 8.82344 7.83337ZM19.2879 29.7569C4.92625 30.9232 -1.10697 28.298 0.165574 12.9523C0.211022 6.16828 1.9191 0.351775 9.86115 0.243019C26.1278 -0.867029 31.1422 1.27056 29.7902 18.4576C29.2864 25.3804 26.9118 29.7156 19.2879 29.7569Z"
                      fill="white" />
                  </svg>

                </span>
                Google store
              </RouterLink>
              <RouterLink to="/"
                class="w-fit text-sm font-bold text-white bg-[#2C702C] rounded-[10px] mt-8 px-5 py-[14px] flex items-center gap-3 min-w-[150px]">
                <span class="w-6 block">
                  <svg class="w-full h-full object-contain" width="30" height="30" viewBox="0 0 30 30" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M23.3022 21.8917C24.0322 23.1442 22.1767 24.1867 21.4428 23.0167C19.8497 20.5867 18.4504 18.0368 16.8876 15.5843C16.4086 14.4143 14.9979 13.173 15.6405 11.8531C17.3325 9.6443 18.7394 12.708 19.3858 14.1368C21.1044 17.6543 19.998 16.7055 23.8155 16.6793C25.4733 16.683 25.6444 19.188 23.9904 19.368C23.3592 19.4392 22.7394 19.4317 22.1007 19.4468C22.5379 20.253 22.8345 21.1005 23.3022 21.8917Z"
                      fill="#2C702C" />
                    <path
                      d="M14.8154 6.65866C15.2831 5.65368 16.4428 4.43492 17.515 5.42867C18.2413 6.08115 17.747 7.10118 17.2527 7.76865C15.3819 10.6412 13.899 13.7236 12.1994 16.6898C13.7165 16.8211 15.245 16.7273 16.7508 16.9898C18.2337 17.2524 18.036 19.4161 16.5264 19.4498C13.591 19.5623 10.6556 19.3411 7.71639 19.4986C6.66697 19.4198 5.32474 19.9748 4.51486 19.1011C2.89125 16.3749 7.25634 16.7873 8.8495 16.6786C9.84573 15.7336 10.3362 14.1399 11.1423 12.9699C11.8077 11.7999 12.4579 10.6186 13.1233 9.44863C13.2412 9.08116 12.7089 8.77741 12.5758 8.43991C10.0511 5.64617 13.591 3.47493 14.8154 6.65866Z"
                      fill="#2C702C" />
                    <path
                      d="M9.33238 21.134C9.29816 19.8515 7.59091 19.3565 6.86086 20.4927C6.53768 21.0252 6.12701 21.5577 5.98253 22.169C5.69734 23.3802 7.24869 24.2052 8.11564 23.3015C8.69359 22.6902 9.13845 21.9477 9.33238 21.134ZM17.515 5.42908C16.439 4.43158 15.2831 5.65035 14.8154 6.65907C13.591 3.47535 10.0472 5.64659 12.5758 8.44408C12.7089 8.78155 13.2374 9.08155 13.1233 9.45281C12.4579 10.6266 11.8077 11.8041 11.1423 12.974C10.3362 14.144 9.84569 15.734 8.84949 16.6828C7.2563 16.7878 2.89121 16.3752 4.51863 19.1053C5.32851 19.9827 6.67074 19.424 7.7202 19.5027C10.6594 19.3453 13.591 19.5665 16.5302 19.454C18.0397 19.4202 18.2375 17.2565 16.7545 16.994C15.2488 16.7315 13.7203 16.8215 12.2032 16.694C13.9028 13.7278 15.3857 10.6415 17.2565 7.77282C17.747 7.10532 18.2412 6.08533 17.515 5.42908ZM9.78866 0.239115C14.3971 0.164116 19.1386 -0.552132 23.6178 0.925366C28.3745 2.37286 30.0323 7.42781 29.9867 11.8941C30.0209 15.0553 30.0323 18.2427 29.4581 21.359C28.519 27.2052 25.1653 29.7627 19.2451 29.8227C12.8381 30.0364 3.32469 31.1127 0.735295 23.6802C-0.329349 19.4915 0.0584866 15.0478 0.115524 10.7578C0.526176 4.52158 2.97489 0.374114 9.78866 0.239115ZM23.9942 19.3677C25.6482 19.1877 25.4771 16.6827 23.8193 16.679C20.0017 16.7052 21.1082 17.654 19.3896 14.1365C18.7394 12.7078 17.3363 9.64779 15.6443 11.8528C15.0017 13.169 16.4161 14.4103 16.8914 15.584C18.4542 18.0327 19.8535 20.5827 21.4466 23.0165C22.1805 24.1864 24.036 23.144 23.306 21.8915C22.8383 21.1002 22.5417 20.2527 22.1044 19.4465C22.7394 19.4315 23.363 19.439 23.9942 19.3677Z"
                      fill="white" />
                    <path
                      d="M6.86459 20.4923C7.59464 19.3523 9.30189 19.851 9.33612 21.1335C9.14218 21.9473 8.69352 22.6897 8.12318 23.3048C7.25623 24.2047 5.70488 23.3835 5.99007 22.1722C6.13074 21.5573 6.5376 21.0247 6.86459 20.4923Z"
                      fill="#2C702C" />
                  </svg>
                </span>
                App store
              </RouterLink>
            </div>

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

  .award_glow::after {
    content: "";
    position: absolute;
    width: 321px;
    height: 321px;
    right: -180px;
    bottom: -97px;
    background: #b7771e;
    filter: blur(137.15px);
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  .award_glow:hover::after {
    opacity: 1;
  }

  .glow::after {
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
    transition: opacity 0.25s ease-in-out;
  }

</style>
