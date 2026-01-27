<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import apiService from '@/services/apiService'

    import greenBg from '@/assets/images/green_bg.png'



    const { t, tm } = useI18n()

    const breadcrumbItems = computed(() => {
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: t('bankService.title') },
        ]
    })

    const bankServiceItems = computed(() => {
        const items = tm('bankService.list')
        return Array.isArray(items) ? items : []
    })

</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden  bg-cover bg-center"
        :style="{ backgroundImage: `url(${greenBg})` }">
        <div class="auto_container">
            <div class="hero_wrap">

                <div class="flex items-center justify-center flex-wrap text-center gap-2 mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems" linkClass="text-[17px] text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] text-mainWhite" />
                </div>


                <h1
                    class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ t('bankService.title') }}
                </h1>

                <!-- <p class="text-[17px] text-mainWhite/60 text-center">
                    {{ t('yanardag.subTitle') }}
                </p> -->


                <span class="block mt-[80px] md:mt-[125px] w-[160px] sm:w-[210px] mx-auto relative z-10">
                    <!-- <img src="../../assets/images/GradientGlass.png" class="block w-full h-full object-contain"
                        alt="card"> -->

                    <svg class="block w-full h-full object-contain" width="160" height="175" viewBox="0 0 160 175" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M127.13 28.7898H32.1309V21.2905L79.6401 0L103.751 10.8198L127.131 21.2999L127.13 28.7898ZM119.703 79.6711V36.6575H103.385V79.6711H119.703ZM87.7889 79.6711V36.6575H71.4709V79.6711H87.7889ZM55.8848 79.6711V36.6575H39.5668V79.6711H55.8848ZM127.131 87.5289H32.1313V93.9906L127.131 94V87.5289Z"
                            fill="white" />
                        <path
                            d="M7.38703 172.733C7.46071 173.337 7.75309 173.894 8.20898 174.298C8.66487 174.701 9.25275 174.924 9.86167 174.924H43.022C43.4117 174.924 43.796 174.833 44.1441 174.658C44.4922 174.483 44.7944 174.228 45.0264 173.915C45.2584 173.602 45.4138 173.239 45.4801 172.855C45.5463 172.471 45.5216 172.077 45.4079 171.704L41.1438 157.727L54.4194 149.335C56.1362 148.389 58.1482 148.13 60.0485 148.611C60.1001 148.624 60.1521 148.635 60.2045 148.647L87.8033 153.728C95.3952 155.087 103.223 153.982 110.142 150.575C110.247 150.523 110.349 150.463 110.447 150.397L158.18 117.623C158.703 117.263 159.07 116.717 159.205 116.096C159.339 115.476 159.232 114.827 158.904 114.282C157.11 111.294 154.232 109.113 150.87 108.193C147.508 107.273 143.92 107.686 140.855 109.346L140.352 109.618C136.907 105.684 131.146 104.207 126.732 106.444L126.676 106.473L125.014 107.369C122.656 105.451 119.773 104.294 116.744 104.049C113.715 103.804 110.683 104.484 108.048 105.998L97.8077 111.567H84.1532C81.2386 111.563 78.3622 110.904 75.7368 109.638L73.8437 108.723C68.3815 106.065 62.2903 104.971 56.2446 105.561C50.1988 106.151 44.4344 108.404 39.5897 112.068C39.5349 112.109 39.4821 112.152 39.4313 112.198L34.8602 116.267C33.2903 117.664 31.4515 118.726 29.4565 119.388L26.9851 111.281C26.8292 110.77 26.5132 110.323 26.0836 110.005C25.654 109.687 25.1336 109.515 24.5991 109.515H2.49295C2.14012 109.515 1.7913 109.59 1.46956 109.735C1.14782 109.88 0.860496 110.091 0.626577 110.356C0.392659 110.62 0.21748 110.931 0.112624 111.267C0.00776736 111.604 -0.0243767 111.96 0.0183161 112.31L7.38703 172.733ZM129.01 110.876C131.172 109.796 133.854 110.551 135.741 112.101L118.19 121.57L117.566 121.899C117.049 120.564 116.357 119.303 115.507 118.151L129.01 110.876ZM110.457 110.362C110.477 110.352 110.496 110.341 110.516 110.329C111.955 109.497 113.578 109.036 115.24 108.987C116.901 108.939 118.549 109.303 120.034 110.049L111.772 114.501C110.331 113.486 108.733 112.716 107.042 112.219L110.457 110.362ZM38.1735 119.991L42.6658 115.991C46.777 112.904 51.6599 111.011 56.7774 110.521C61.8948 110.03 67.0485 110.96 71.6714 113.209L73.5645 114.125C76.8671 115.717 80.4854 116.546 84.1517 116.551H102.511C105.013 116.554 107.442 117.397 109.408 118.944C111.375 120.492 112.765 122.654 113.356 125.086L100.613 124.509C95.7497 124.29 90.8759 124.515 86.053 125.182C85.3981 125.272 84.8061 125.619 84.4071 126.146C84.0081 126.674 83.8348 127.338 83.9254 127.993C84.0161 128.648 84.3631 129.24 84.8903 129.639C85.4175 130.038 86.0815 130.211 86.7364 130.12C91.2583 129.495 95.8278 129.284 100.388 129.49L116.048 130.198C116.086 130.198 116.123 130.201 116.16 130.201C116.822 130.201 117.456 129.938 117.923 129.471C118.391 129.003 118.653 128.369 118.653 127.708C118.653 127.461 118.646 127.215 118.634 126.971L120.538 125.967L143.223 113.729C144.804 112.873 146.615 112.537 148.399 112.768C150.182 113 151.848 113.787 153.158 115.019L107.774 146.179C101.854 149.053 95.1764 149.977 88.699 148.819L61.182 143.753C58.0506 142.983 54.7437 143.433 51.9316 145.011C51.8928 145.033 51.8543 145.056 51.8166 145.08L39.6375 152.779L30.9105 124.154C33.5932 123.283 36.0662 121.866 38.1735 119.991ZM22.7537 114.501L39.6545 169.938H12.0689L5.30946 114.501H22.7537Z"
                            fill="white" />
                        <path
                            d="M23.9143 168.829C25.2818 168.829 26.6186 168.423 27.7557 167.663C28.8928 166.904 29.779 165.824 30.3023 164.56C30.8256 163.297 30.9626 161.907 30.6958 160.565C30.429 159.224 29.7705 157.992 28.8035 157.025C27.8365 156.058 26.6045 155.4 25.2632 155.133C23.922 154.866 22.5317 155.003 21.2683 155.526C20.0049 156.05 18.925 156.936 18.1653 158.073C17.4055 159.21 17 160.547 17 161.914C17.0021 163.747 17.7312 165.505 19.0274 166.801C20.3237 168.097 22.0812 168.827 23.9143 168.829ZM23.9143 159.986C24.2958 159.986 24.6687 160.099 24.9859 160.311C25.3031 160.523 25.5503 160.824 25.6962 161.177C25.8422 161.529 25.8804 161.917 25.8059 162.291C25.7315 162.665 25.5478 163.009 25.278 163.279C25.0082 163.548 24.6645 163.732 24.2904 163.806C23.9162 163.881 23.5284 163.843 23.176 163.696C22.8236 163.55 22.5224 163.303 22.3105 162.986C22.0986 162.669 21.9855 162.296 21.9856 161.914C21.9865 161.403 22.1901 160.913 22.5516 160.552C22.9132 160.191 23.4032 159.988 23.9143 159.987V159.986Z"
                            fill="white" />
                    </svg>
                </span>
            </div>
        </div>

        <!-- <span class="card-bg-circle"></span> -->
    </section>

    <!-- Useful information ============================================== -->
    <section class="py-[50px] pb-[80px] md:pb-[120px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="block">
                    <h2
                        class="text-[22px] md:text-[28px] lg:text-[38px] text-center sm:text-left font-bold mb-7 md:mb-10 leading-9">
                        {{
                            t('bankService.subTitle') }}</h2>

                    <h6 class="col-span-6 text-[18px] text-center sm:text-left md:text-[24px] font-bold mb-6">
                        {{ t('bankService.text') }}
                    </h6>

                    <div class="grid gap-4 grid-cols-12">
                        <div v-for="(item, idx) in bankServiceItems" :key="idx"
                            class="col-span-12 md:col-span-6 lg:col-span-4 rounded-[20px] bg-white p-8 shadow-sm hover:shadow-md transition">
                            <h6 class="text-[17px] md:text-[22px] text-mainBlack leading-7 font-bold mb-[10px]">
                                {{ item.title }}
                            </h6>
                            <p v-if="item.text"
                                class="text-sm md:text-[16px] text-[#6F736D] leading-tight mb-1 font-Gilroy">
                                {{ item.text }}
                            </p>
                            <div v-else-if="Array.isArray(item.list)"
                                class="text-sm md:text-[17px] text-[#6F736D] leading-tight font-Gilroy">
                                <span v-for="(sub, sidx) in item.list" :key="sidx"
                                    class="relative block mb-2 pl-3 after:content-[''] after:absolute after:top-[7px] after:left-[0px] after:w-[6px] after:h-[6px] after:rotate-45 after:bg-[#6F736D] after:rounded-[2px] after:block">{{
                                        sub }}</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </section>

</template>



<style lang="scss" scoped>
    .purple-glow::after {
        content: "";
        position: absolute;
        width: 298px;
        height: 298px;
        left: calc(50% - 298px/2 + 591px);
        bottom: -147px;
        background: #BB28ED;
        filter: blur(137.15px);
        border-radius: 9999px;
        pointer-events: none;
    }

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
</style>
