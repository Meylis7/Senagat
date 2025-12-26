<script setup>
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();
    import { ref, onMounted, watch } from 'vue';
    import CurrentDate from '@/components/dashboard/Date.vue'
    import { RouterLink, useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import apiService from '@/services/apiService';

    const router = useRouter()
    const userStore = useUserStore()

    const needsVerification = ref(false)
    const profileChecked = ref(false)
    const isVerifyModalOpen = ref(false)
    const selectedServiceTitle = ref('')
    const pendingRouteName = ref('')

    async function checkProfileStatus() {
        profileChecked.value = false
        try {
            const token =
                userStore.authToken ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('access_token') ||
                localStorage.getItem('token') ||
                ''
            if (!token) {
                needsVerification.value = true
                profileChecked.value = true
                return
            }
            const res = await apiService.fetchUserInfo(token)
            const profile = res?.data?.profile ?? res?.profile ?? null
            if (!profile) {
                needsVerification.value = true
            } else {
                const status = String(profile.status || '').toLowerCase()
                needsVerification.value = status !== 'approved'
            }
            profileChecked.value = true
        } catch (e) {
            needsVerification.value = true
            profileChecked.value = true
        }
    }

    onMounted(checkProfileStatus)
    watch(() => userStore.authToken, () => { checkProfileStatus() })

    async function onServiceClick(routeName, title) {
        selectedServiceTitle.value = title
        pendingRouteName.value = routeName
        if (!profileChecked.value) {
            await checkProfileStatus()
        }
        if (needsVerification.value) {
            isVerifyModalOpen.value = true
            return
        }
        router.push({ name: routeName })
    }

    function proceedToVerify() {
        isVerifyModalOpen.value = false
        router.push({ name: 'dashboard.identify' })
    }

    function closeVerifyModal() {
        isVerifyModalOpen.value = false
    }
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
                <h2 class="text-[22px] sm:text-[28px] font-bold leading-9">
                    {{ t('dashboard.PageTitles.services') }}
                </h2>

                <CurrentDate />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div class="block">
                    <button type="button"
                        @click="onServiceClick('dashboard.loan-application', t('dashboard.services.loanApplication'))"
                        class="flex justify-between flex-col sm:flex-row relative gap-2 bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden w-full text-left">
                        <div class="block">
                            <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                                {{ t('dashboard.services.loanApplication') }}
                            </h4>
                            <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                                {{ t('dashboard.services.online') }}
                            </p>
                        </div>

                        <span class="block h-[138px] ml-auto relative sm:-right-[30px] z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/loan-cart.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-1"></span>
                    </button>
                </div>

                <div class="block">
                    <button type="button"
                        @click="onServiceClick('dashboard.certificate-application', t('dashboard.services.getCertificate'))"
                        class="flex justify-between flex-col sm:flex-row relative gap-2 bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden w-full text-left">
                        <div class="block">
                            <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                                {{ t('dashboard.services.getCertificate') }}
                            </h4>
                            <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                                {{ t('dashboard.services.fastAndEasy') }}
                            </p>
                        </div>

                        <span class="block h-[138px] ml-auto relative sm:-right-[30px] z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/GradientGlass.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-2"></span>
                    </button>
                </div>

                <div class="block">
                    <button type="button"
                        @click="onServiceClick('dashboard.cards', t('dashboard.services.cardIssuance'))"
                        class="flex justify-between flex-col sm:flex-row relative gap-2 bg-[#1D2417] p-[22px] rounded-[20px] min-h-[180px] overflow-hidden w-full text-left">
                        <div class="block">
                            <h4 class="text-[17px] font-bold text-mainWhite mb-3 relative z-[2]">
                                {{ t('dashboard.services.cardIssuance') }}
                            </h4>
                            <p class="text-[15px] font-Gilroy text-mainWhite/60 relative z-[2]">
                                {{ t('dashboard.services.inFewSteps') }}
                            </p>
                        </div>

                        <span class="block h-[138px] ml-auto relative sm:-right-[30px] z-[2]">
                            <img class="w-full h-full object-contain" src="../../assets/images/card-1.png"
                                alt="service-icon">
                        </span>

                        <span class="bg-circle circle-1"></span>
                    </button>
                </div>
            </div>
            <div v-if="isVerifyModalOpen" class="fixed inset-0 z-[60]">
                <div class="absolute inset-0 bg-[#000]/50" @click="closeVerifyModal"></div>
                <div
                    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-mainWhite rounded-[20px] p-6 w-[90%] max-w-[420px] shadow-lg">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-[20px] font-bold text-[#1D2417]">
                            {{ t('dashboard.header.verifyAccount') }}
                        </h3>
                        <button type="button" class="w-6 h-6" @click="closeVerifyModal">
                            <svg class="w-full h-full object-contain" width="20" height="20" viewBox="0 0 20 20"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.4141 10.0001L16.7071 15.2931C16.8947 15.4806 17.0001 15.735 17.0001 16.0001C17.0001 16.2652 16.8947 16.5196 16.7071 16.7071C16.5196 16.8947 16.2652 17.0001 16.0001 17.0001C15.735 17.0001 15.4806 16.8947 15.2931 16.7071L10.0001 11.4141L4.70711 16.7071C4.51956 16.8947 4.26522 17.0001 4.00011 17.0001C3.735 17.0001 3.48066 16.8947 3.29311 16.7071C3.10556 16.5196 3.00012 16.2652 3.00012 16.0001C3.00012 15.735 3.10556 15.4806 3.29311 15.2931L8.58611 10.0001L3.29311 4.7071C3.10556 4.51955 3.00012 4.26521 3.00012 4.0001C3.00012 3.73499 3.10556 3.48065 3.29311 3.2931C3.48066 3.10555 3.735 3.00011 4.00011 3.00011C4.26522 3.00011 4.51956 3.10555 4.70711 3.2931L10.0001 8.58611L15.2931 3.2931C15.4806 3.10555 15.735 3.00011 16.0001 3.00011C16.2652 3.00011 16.5196 3.10555 16.7071 3.2931C16.8947 3.48065 17.0001 3.73499 17.0001 4.0001C17.0001 4.26521 16.8947 4.51955 16.7071 4.7071L11.4141 10.0001Z"
                                    fill="#191B19" />
                            </svg>
                        </button>
                    </div>

                    <p class="text-[15px] font-Gilroy text-[#6F736D] mb-5 text-center">
                        {{ t('dashboard.modal.requiredVerification', { service: selectedServiceTitle }) }}
                    </p>

                    <div class="flex items-center justify-center">
                        <button type="button"
                            class="text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[10px] text-center"
                            @click="proceedToVerify">
                            {{ t('dashboard.btn.verify') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>

    .bg-circle {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        filter: blur(137.15px);
        /* z-index: 1; */
        right: -190px;
        top: -38px;
    }

    .circle-1 {
        background: #28ED2E;
    }

    .circle-2 {
        background: #BB28ED;
    }

</style>
