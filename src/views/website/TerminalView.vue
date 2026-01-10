<script setup>
    import { computed, ref, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n'
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import attachmentDoc from '@/assets/doc/attachment.docx'
    import contractDoc from '@/assets/doc/contract.docx'
    import applicationDoc from '@/assets/doc/terminal_letter.docx'

    import NewsSection from '@/components/website/NewsSection.vue';
    import greenBg from '@/assets/images/green_bg.png'



    const { t, tm } = useI18n()
    const route = useRoute()

    const breadcrumbItems = computed(() => {
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.services'), path: '/services' },
            { label: t('nav.informations.terminalDocs') },
        ]
    })

    const docs = computed(() => {
        const arr = tm('terminal.docs')
        return Array.isArray(arr) ? arr : []
    })

    const downloadItems = computed(() => {
        const arr = tm('terminal.downloadItems') || []
        return [
            {
                title: arr?.[0]?.title || "Agreement on the use of the bank's property",
                lang: arr?.[0]?.lang || '(in turkmen language)',
                url: contractDoc,
            },
            {
                title: arr?.[1]?.title || 'Contract attachment',
                lang: arr?.[1]?.lang || '(in turkmen language)',
                url: attachmentDoc,
            },
            {
                title: t('terminal.application'),
                lang: '(in turkmen language)',
                url: applicationDoc,
            },
        ]
    })

    const sizeMap = ref({})
    const ensureFileSize = async (url) => {
        if (!url || sizeMap.value[url] !== undefined) return
        try {
            const res = await fetch(url, { method: 'HEAD' })
            const len = res.headers.get('content-length')
            const n = len ? parseInt(len, 10) : null
            sizeMap.value[url] = Number.isFinite(n) ? n : null
        } catch (_) {
            sizeMap.value[url] = null
        }
    }
    const formatSize = (bytes) => {
        if (!bytes || bytes <= 0) return ''
        const kb = bytes / 1024
        if (kb < 1024) return `${kb.toFixed(2)} KB`
        const mb = kb / 1024
        return `${mb.toFixed(2)} MB`
    }

    onMounted(() => {
        downloadItems.value.forEach((it) => ensureFileSize(it.url))
    })
    watch(downloadItems, (arr) => {
        arr.forEach((it) => ensureFileSize(it.url))
    })
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[110px] md:pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden bg-cover bg-center"
        :style="{ backgroundImage: `url(${greenBg})` }">
        <div class="auto_container">
            <div class="hero_wrap">

                <div
                    class="flex items-center justify-center flex-wrap gap-2 mb-10 md:mb-[60px] text-center md:text-left">
                    <Breadcrumb :items="breadcrumbItems"
                        linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] font-Gilroy text-mainWhite" />
                </div>


                <h1
                    class="m-auto max-w-[600px] text-mainWhite mb-[10px] text-center text-[22px] md:text-[28px] lg:text-5xl font-bold">
                    {{ t('terminal.title') }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ t('terminal.subTitle') }}
                </p>


                <span class="block mt-[80px] md:mt-[125px] w-[210px] md:w-[300px] max-w-[390px] mx-auto relative z-10">
                    <img src="../../assets/images/services/services (1).png" class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <!-- <span class="card-bg-circle"></span> -->
    </section>

    <!-- Useful information ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[18px] sm:text-[24px] md:text-[28px] font-bold mb-10 leading-tight">
                    {{ t('terminal.text') }}
                </h2>

                <div v-for="(doc, idx) in docs" :key="idx" class="block p-5 md:p-8 rounded-[20px] mb-4 bg-mainWhite">
                    <h6 class="col-span-6 text-[17px] sm:text-[20px] md:text-[24px]  font-bold mb-6 leading-tight">
                        {{ doc.title }}
                    </h6>
                    <div>
                        <ul class="text-sm md:text-[17px] font-Gilroy list-disc space-y-2 pl-0">
                            <li v-for="(line, i) in (doc.list || [])" :key="i"
                                class="py-[10px] md:py-[20px] border-solid border-0 border-b border-[#6F736D]">{{ line
                                }}</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Download docs ============================================== -->
    <section class="md:py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[20px] sm:text-[24px] md:text-[28px] font-bold mb-10 leading-tight">
                    {{ t('pageTitle.docs') }}
                </h2>

                <div v-for="(item, idx) in downloadItems" :key="idx" class="block mb-4">
                    <div class="flex gap-2 mb-[14px]">
                        <div class="min-w-8 hidden sm:block">
                            <svg class="w-full  object-contain" width="23" height="24" viewBox="0 0 23 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M23 16C23 16.2652 22.8946 16.5196 22.7071 16.7071C22.5196 16.8946 22.2652 17 22 17H19V19H21C21.2652 19 21.5196 19.1054 21.7071 19.2929C21.8946 19.4804 22 19.7348 22 20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H19V23C19 23.2652 18.8946 23.5196 18.7071 23.7071C18.5196 23.8946 18.2652 24 18 24C17.7348 24 17.4804 23.8946 17.2929 23.7071C17.1054 23.5196 17 23.2652 17 23V16C17 15.7348 17.1054 15.4804 17.2929 15.2929C17.4804 15.1054 17.7348 15 18 15H22C22.2652 15 22.5196 15.1054 22.7071 15.2929C22.8946 15.4804 23 15.7348 23 16ZM6.5 18.5C6.5 19.4283 6.13125 20.3185 5.47487 20.9749C4.8185 21.6313 3.92826 22 3 22H2V23C2 23.2652 1.89464 23.5196 1.70711 23.7071C1.51957 23.8946 1.26522 24 1 24C0.734784 24 0.48043 23.8946 0.292893 23.7071C0.105357 23.5196 0 23.2652 0 23V16C0 15.7348 0.105357 15.4804 0.292893 15.2929C0.48043 15.1054 0.734784 15 1 15H3C3.92826 15 4.8185 15.3687 5.47487 16.0251C6.13125 16.6815 6.5 17.5717 6.5 18.5ZM4.5 18.5C4.5 18.1022 4.34196 17.7206 4.06066 17.4393C3.77936 17.158 3.39782 17 3 17H2V20H3C3.39782 20 3.77936 19.842 4.06066 19.5607C4.34196 19.2794 4.5 18.8978 4.5 18.5ZM15.5 19.5C15.5 20.6935 15.0259 21.8381 14.182 22.682C13.3381 23.5259 12.1935 24 11 24H9C8.73478 24 8.48043 23.8946 8.29289 23.7071C8.10536 23.5196 8 23.2652 8 23V16C8 15.7348 8.10536 15.4804 8.29289 15.2929C8.48043 15.1054 8.73478 15 9 15H11C12.1935 15 13.3381 15.4741 14.182 16.318C15.0259 17.1619 15.5 18.3065 15.5 19.5ZM13.5 19.5C13.5 18.837 13.2366 18.2011 12.7678 17.7322C12.2989 17.2634 11.663 17 11 17H10V22H11C11.663 22 12.2989 21.7366 12.7678 21.2678C13.2366 20.7989 13.5 20.163 13.5 19.5ZM0 11V2C0 1.46957 0.210714 0.960859 0.585786 0.585787C0.960859 0.210714 1.46957 3.09198e-07 2 3.09198e-07H14C14.1314 -0.000102986 14.2615 0.0256758 14.3829 0.0758639C14.5042 0.126052 14.6146 0.199666 14.7075 0.2925L21.7075 7.2925C21.8003 7.38544 21.8739 7.49576 21.9241 7.61715C21.9743 7.73855 22.0001 7.86864 22 8V11C22 11.2652 21.8946 11.5196 21.7071 11.7071C21.5196 11.8946 21.2652 12 21 12C20.7348 12 20.4804 11.8946 20.2929 11.7071C20.1054 11.5196 20 11.2652 20 11V9H14C13.7348 9 13.4804 8.89464 13.2929 8.70711C13.1054 8.51957 13 8.26522 13 8V2H2V11C2 11.2652 1.89464 11.5196 1.70711 11.7071C1.51957 11.8946 1.26522 12 1 12C0.734784 12 0.48043 11.8946 0.292893 11.7071C0.105357 11.5196 0 11.2652 0 11ZM15 7H18.5863L15 3.41375V7Z"
                                    fill="#CC1717" />
                            </svg>
                        </div>
                        <div class="block">
                            <h6 class="text-sm md:text-[17px] font-bold text-[#1D2417] underline mb-1 leading-tight">
                                {{ item.title }} <span class="text-sm inline-block ml-2 text-[#6F736D]">
                                    {{ item.lang }}
                                </span>
                            </h6>
                            <p class="text-[15px] font-Gilroy text-[#6F736D] leading-tight">
                                {{ formatSize(sizeMap[item.url]) || '-' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-[14px]">
                        <a :href="item.url" download target="_blank" rel="noopener" class="flex gap-1">
                            <p class="text-[15px] font-Gilroy font-bold text-[#6F736D] leading-tight">TM</p>
                            <span class="block w-[14px]">
                                <svg class="w-full h-full object-contain" width="9" height="10" viewBox="0 0 9 10"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.859688 4.39031C0.789322 4.31995 0.749792 4.22451 0.749792 4.125C0.749792 4.02549 0.789322 3.93005 0.859688 3.85969C0.930053 3.78932 1.02549 3.74979 1.125 3.74979C1.22451 3.74979 1.31995 3.78932 1.39031 3.85969L4.125 6.59484V0.375C4.125 0.275544 4.16451 0.180161 4.23484 0.109835C4.30516 0.0395089 4.40054 0 4.5 0C4.59946 0 4.69484 0.0395089 4.76517 0.109835C4.83549 0.180161 4.875 0.275544 4.875 0.375V6.59484L7.60969 3.85969C7.64453 3.82485 7.68589 3.79721 7.73141 3.77835C7.77694 3.7595 7.82573 3.74979 7.875 3.74979C7.92427 3.74979 7.97306 3.7595 8.01859 3.77835C8.06411 3.79721 8.10547 3.82485 8.14031 3.85969C8.17515 3.89453 8.20279 3.93589 8.22165 3.98141C8.2405 4.02694 8.25021 4.07573 8.25021 4.125C8.25021 4.17427 8.2405 4.22306 8.22165 4.26859C8.20279 4.31411 8.17515 4.35547 8.14031 4.39031L4.76531 7.76531C4.73049 7.80018 4.68913 7.82784 4.6436 7.84671C4.59808 7.86558 4.54928 7.87529 4.5 7.87529C4.45072 7.87529 4.40192 7.86558 4.3564 7.84671C4.31087 7.82784 4.26951 7.80018 4.23469 7.76531L0.859688 4.39031ZM8.625 8.625H0.375C0.275544 8.625 0.180161 8.66451 0.109835 8.73483C0.0395089 8.80516 0 8.90054 0 9C0 9.09946 0.0395089 9.19484 0.109835 9.26517C0.180161 9.33549 0.275544 9.375 0.375 9.375H8.625C8.72446 9.375 8.81984 9.33549 8.89017 9.26517C8.96049 9.19484 9 9.09946 9 9C9 8.90054 8.96049 8.80516 8.89017 8.73483C8.81984 8.66451 8.72446 8.625 8.625 8.625Z"
                                        fill="#6F736D" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- News ===================================================================================== -->
    <NewsSection class="pb-[80px] md:pb-[120px]" />


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
</style>
