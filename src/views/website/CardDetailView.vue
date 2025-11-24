<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useI18n } from 'vue-i18n'
    import { RouterLink, useRoute } from 'vue-router';
    import Breadcrumb from '@/components/website/Breadcrumb.vue'
    import apiService from '@/services/apiService'
    import diamond1 from '@/assets/images/dimond-1.png'
    import diamond2 from '@/assets/images/dimond-2.png'
    import '@/assets/css/text.scss'

    const { t } = useI18n()
    const route = useRoute()

    const cardId = computed(() => route.params?.id || route.query?.id)
    const card = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const breadcrumbItems = computed(() => {
        const currentTitle = card.value?.title || ''
        return [
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('breadcrumb.cards'), path: '/cards' },
            { label: currentTitle },
        ]
    })

    const fetchCardDetail = async () => {
        if (!cardId.value) return
        loading.value = true
        error.value = null
        try {
            const response = await apiService.get(`/v1/card/types/${cardId.value}`)
            const data = response?.data || response
            if (data && !Array.isArray(data)) {
                card.value = data
            } else {
                card.value = null
                error.value = 'cards not found'
            }
        } catch (e) {
            error.value = e.message || 'Failed to load card'
            card.value = null
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchCardDetail()
        fetchOtherCards()
    })

    watch(cardId, (val, oldVal) => {
        if (val && val !== oldVal) {
            fetchCardDetail()
            fetchOtherCards()
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    })

    const diamondImages = [diamond1, diamond2]

    const advColSpan = computed(() => {
        const n = (card.value?.advantages || []).length
        return n === 2 ? 'col-span-6' : 'col-span-4'
    })

    const otherCards = ref([])
    const otherLoading = ref(false)
    const otherError = ref(null)

    const fetchOtherCards = async () => {
        otherLoading.value = true
        otherError.value = null
        try {
            const response = await apiService.fetchCardTypes()
            const list = response?.data || response || []
            const arr = Array.isArray(list) ? list : []
            otherCards.value = arr.filter((it) => String(it.category) === 'individual' && String(it.id) !== String(cardId.value))
        } catch (e) {
            otherError.value = e.message || 'Failed to load cards'
            otherCards.value = []
        } finally {
            otherLoading.value = false
        }
    }
</script>

<template>
    <!-- Hero  ================================================= -->
    <section class="hero pt-[145px] pb-[60px] bg-[#173A16] relative overflow-hidden">
        <div class="auto_container">
            <div class="hero_wrap">
                <div class="flex items-center justify-center gap-x-2 mb-[60px]">
                    <Breadcrumb :items="breadcrumbItems"
                        linkClass="text-[17px] font-Gilroy text-mainWhite/60 whitespace-nowrap"
                        currentClass="text-[17px] font-Gilroy text-mainWhite" />
                </div>


                <h1 class="m-auto max-w-[660px] text-mainWhite mb-[10px] text-center text-5xl font-bold">
                    {{ card?.title }}
                </h1>

                <p class="text-[17px] font-Gilroy text-mainWhite/60 text-center">
                    {{ card?.sub_title || '' }}
                </p>

                <span class="block mt-[140px] max-w-[400px] mx-auto relative z-10">
                    <img :src="card?.image_url" class="block w-full h-full object-contain" alt="card">
                </span>
            </div>
        </div>

        <span class="card-bg-circle"></span>
    </section>

    <!-- Info  ================================================ -->
    <section class="pt-[60px] pb-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="grid grid-cols-12 gap-x-4">
                    <div v-for="(adv, idx) in (card?.advantages || [])" :key="idx"
                        :class="[advColSpan, 'bg-mainWhite rounded-[20px] p-8 pb-0 flex flex-col justify-center']">
                        <h3 class="text-[38px] font-bold mb-[10px] leading-9">
                            {{ adv?.name || '' }}
                        </h3>
                        <p class="text-[17px] font-Gilroy text-[#6F736D] ">
                            {{ adv?.description || '' }}
                        </p>
                        <span class="block w-[230px] mx-auto mt-auto relative ">
                            <img :src="diamondImages[Math.floor(Math.random() * diamondImages.length)]" alt="diamond"
                                class="block w-full h-full object-contain mix-blend-hard-light opacity-80">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Tariffs ============================================== -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">
                    {{ $t('pageTitle.tariffsAndDocuments') }}
                </h2>

                <div class="block p-8  rounded-[20px] bg-mainWhite">
                    <div class="text-[17px] description" v-html="card && card.description ? card.description : ''">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Docs  ================================================ -->
    <section class="py-[50px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">
                    {{ $t('pageTitle.docs') }}
                </h2>

                <div class="block">
                    <a href="../../assets/doc/register.doc" download class="flex items-center gap-x-[10px]">
                        <span class="block w-8">
                            <svg class="w-full h-full object-contain block" width="32" height="32" viewBox="0 0 32 32"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M28 19C28 19.2652 27.8946 19.5196 27.7071 19.7071C27.5196 19.8946 27.2652 20 27 20H24V22H26C26.2652 22 26.5196 22.1054 26.7071 22.2929C26.8946 22.4804 27 22.7348 27 23C27 23.2652 26.8946 23.5196 26.7071 23.7071C26.5196 23.8946 26.2652 24 26 24H24V26C24 26.2652 23.8946 26.5196 23.7071 26.7071C23.5196 26.8946 23.2652 27 23 27C22.7348 27 22.4804 26.8946 22.2929 26.7071C22.1054 26.5196 22 26.2652 22 26V19C22 18.7348 22.1054 18.4804 22.2929 18.2929C22.4804 18.1054 22.7348 18 23 18H27C27.2652 18 27.5196 18.1054 27.7071 18.2929C27.8946 18.4804 28 18.7348 28 19ZM11.5 21.5C11.5 22.4283 11.1313 23.3185 10.4749 23.9749C9.8185 24.6313 8.92826 25 8 25H7V26C7 26.2652 6.89464 26.5196 6.70711 26.7071C6.51957 26.8946 6.26522 27 6 27C5.73478 27 5.48043 26.8946 5.29289 26.7071C5.10536 26.5196 5 26.2652 5 26V19C5 18.7348 5.10536 18.4804 5.29289 18.2929C5.48043 18.1054 5.73478 18 6 18H8C8.92826 18 9.8185 18.3687 10.4749 19.0251C11.1313 19.6815 11.5 20.5717 11.5 21.5ZM9.5 21.5C9.5 21.1022 9.34196 20.7206 9.06066 20.4393C8.77936 20.158 8.39782 20 8 20H7V23H8C8.39782 23 8.77936 22.842 9.06066 22.5607C9.34196 22.2794 9.5 21.8978 9.5 21.5ZM20.5 22.5C20.5 23.6935 20.0259 24.8381 19.182 25.682C18.3381 26.5259 17.1935 27 16 27H14C13.7348 27 13.4804 26.8946 13.2929 26.7071C13.1054 26.5196 13 26.2652 13 26V19C13 18.7348 13.1054 18.4804 13.2929 18.2929C13.4804 18.1054 13.7348 18 14 18H16C17.1935 18 18.3381 18.4741 19.182 19.318C20.0259 20.1619 20.5 21.3065 20.5 22.5ZM18.5 22.5C18.5 21.837 18.2366 21.2011 17.7678 20.7322C17.2989 20.2634 16.663 20 16 20H15V25H16C16.663 25 17.2989 24.7366 17.7678 24.2678C18.2366 23.7989 18.5 23.163 18.5 22.5ZM5 14V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H19C19.1314 2.9999 19.2615 3.02568 19.3829 3.07586C19.5042 3.12605 19.6146 3.19967 19.7075 3.2925L26.7075 10.2925C26.8003 10.3854 26.8739 10.4958 26.9241 10.6172C26.9743 10.7385 27.0001 10.8686 27 11V14C27 14.2652 26.8946 14.5196 26.7071 14.7071C26.5196 14.8946 26.2652 15 26 15C25.7348 15 25.4804 14.8946 25.2929 14.7071C25.1054 14.5196 25 14.2652 25 14V12H19C18.7348 12 18.4804 11.8946 18.2929 11.7071C18.1054 11.5196 18 11.2652 18 11V5H7V14C7 14.2652 6.89464 14.5196 6.70711 14.7071C6.51957 14.8946 6.26522 15 6 15C5.73478 15 5.48043 14.8946 5.29289 14.7071C5.10536 14.5196 5 14.2652 5 14ZM20 10H23.5863L20 6.41375V10Z"
                                    fill="#CC1717" />
                            </svg>
                        </span>

                        <h6 class="text-[17px] font-bold underline">
                            {{ $t('btn.form') }}
                        </h6>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Other Cards ======================================= -->
    <section class="pt-[50px] pb-[60px]">
        <div class="auto_container">
            <div class="wrap">
                <h2 class="text-[38px] font-bold mb-10 leading-9">
                    {{ $t('pageTitle.otherCards') }}
                </h2>

                <div class="grid grid-cols-12 gap-x-4">
                    <div v-for="item in otherCards" :key="item.id" class="col-span-4 bg-mainWhite rounded-[20px] p-1">
                        <div
                            class="bg-[#EEF2ED] rounded-2xl pt-[15px] relative flex items-end justify-center overflow-hidden">
                            <span class="block h-[150px] relative -bottom-[25px]">
                                <img class="block w-full h-full object-contain"
                                    :src="item.image_url || '../../assets/images/card.png'" alt="card">
                            </span>
                            <span class="block absolute right-7 bottom-5 w-[100px]">
                                <img class="block w-full h-full object-contain mix-blend-hard-light"
                                    src="../../assets/images/oval.png" alt="oval-icon">
                            </span>
                        </div>

                        <div class="block p-4">
                            <h4 class="text-[17px] font-bold text-mainBlack mb-5 leading-7">
                                {{ item.title || '' }}
                            </h4>
                            <div class="flex items-center gap-x-[10px] mb-5">
                                <p v-for="(adv, idx) in (item.advantages || []).slice(0, 1)" :key="idx"
                                    class="text-sm font-Gilroy text-[#2C702C] p-3 rounded-2xl bg-[#EEF2ED] w-fit truncate max-w-[380px]">
                                    {{ [adv?.name, adv?.description].filter(Boolean).join(' ') }}
                                </p>
                            </div>

                            <RouterLink :to="`/cards-detail?id=${item.id}`"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px] w-fit">
                                {{ t('btn.learnMore') }}
                            </RouterLink>
                        </div>
                    </div>
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

    /* Accordion animations */
    .accordion-enter-active,
    .accordion-leave-active {
        transition: all 0.3s ease;
        overflow: hidden;
    }

    .accordion-enter-from {
        opacity: 0;
        max-height: 0;
    }

    .accordion-leave-to {
        opacity: 0;
        max-height: 0;
    }

    .accordion-enter-to,
    .accordion-leave-from {
        opacity: 1;
        max-height: 500px;
    }
</style>