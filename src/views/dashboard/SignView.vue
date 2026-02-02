<script setup>
    import { ref, nextTick, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { useUserStore } from '@/stores/userStore'
    import { toast } from 'vue3-toastify'
    import 'vue3-toastify/dist/index.css'
    import apiService from '@/services/apiService'
    import { useRouter } from 'vue-router'
    const { t } = useI18n()

    const router = useRouter()
    const formRef = ref(null)
    const signInPhoneRef = ref(null)
    const signUpPhoneRef = ref(null)
    const signUpPasswordRef = ref(null)
    const code = ref(['', '', '', '', ''])
    const inputRefs = ref([])
    const activeTab = ref('signup')
    const currentStep = ref('phone')
    const phone = ref('')
    const password = ref('')
    const isPhoneError = ref(false)
    const loading = ref(false)
    const sentPhone = ref('')
    const userStore = useUserStore()

    // Auto Focus on inputs by step/tab
    watch(
        [activeTab, currentStep],
        async ([tab, step]) => {
            await nextTick()
            if (step === 'phone') {
                if (tab === 'signin' && signInPhoneRef.value) {
                    signInPhoneRef.value.focus()
                }
                if (tab === 'signup' && signUpPhoneRef.value) {
                    signUpPhoneRef.value.focus()
                }
            }
            if (step === 'otp' && inputRefs.value[0]) {
                inputRefs.value[0].focus()
            }
            if (step === 'password' && tab === 'signup' && signUpPasswordRef.value) {
                signUpPasswordRef.value.focus()
            }
        },
        { immediate: true }
    )

    const onPhoneInput = (e) => {
        let val = String(e.target.value || '').replace(/\D/g, '')
        if (val.length > 8) val = val.slice(0, 8)
        phone.value = val
        e.target.value = val
        if (isPhoneError.value) isPhoneError.value = false
    }

    const onCodeInput = (idx, e) => {
        let v = String(e.target.value || '').replace(/\D/g, '')
        if (v.length > 1) v = v.slice(0, 1)
        code.value[idx] = v
        e.target.value = v
        if (v) {
            if (idx < inputRefs.value.length - 1) {
                inputRefs.value[idx + 1]?.focus()
            } else {
                checkOtp()
            }
        }
    }

    const onCodeKeydown = (idx, e) => {
        if (e.key === 'Backspace') {
            if (code.value[idx]) {
                code.value[idx] = ''
            } else if (idx > 0) {
                inputRefs.value[idx - 1]?.focus()
            }
        }
    }

    const onCodePaste = (e) => {
        const t = (e.clipboardData || window.clipboardData).getData('text')
        const digits = String(t || '').replace(/\D/g, '').slice(0, inputRefs.value.length)
        if (!digits) return
        e.preventDefault()
        const arr = digits.split('')
        for (let i = 0; i < inputRefs.value.length; i++) {
            const val = arr[i] !== undefined ? arr[i] : '_'
            code.value[i] = val
            if (inputRefs.value[i]) inputRefs.value[i].value = val
        }
        nextTick(() => {
            const last = Math.min(arr.length - 1, inputRefs.value.length - 1)
            inputRefs.value[last]?.focus()
            if (arr.length === inputRefs.value.length) checkOtp()
        })
    }

    const checkOtp = async () => {
        if (currentStep.value === 'otp') {
            const codeStr = code.value.join('').replace(/\D/g, '')
            if (codeStr.length !== inputRefs.value.length) return
            loading.value = true
            try {
                if (activeTab.value === 'signin') {
                    const payload = {
                        phone: String((sentPhone.value || userStore.phoneNumber || '').replace(/\D/g, '')),
                        otp: codeStr,
                    }
                    const response = await apiService.login(payload)
                    const token = response.token || response.data?.token

                    console.log('Sign In Data:', {
                        phone: payload.phone,
                        password: password.value,
                        token: token
                    })

                    if (token) {
                        userStore.setUser(response.user || response.data?.user || {}, token)
                        userStore.setPhone(payload.phone)
                        router.push('/dashboard')
                    } else {
                        toast('Ошибка: Токен не получен', { type: 'error' })
                    }
                } else {
                    const payload = {
                        phone: String((sentPhone.value || userStore.phoneNumber || '').replace(/\D/g, '')),
                        code: codeStr,
                        purpose: 'register',
                    }
                    const response = await apiService.verifyOtp(payload)
                    const sessionToken = response.otp_session_token || response.data?.otp_session_token

                    console.log('Sign Up Data:', {
                        phone: payload.phone,
                        code: payload.code,
                        otp_session_token: sessionToken
                    })

                    if (sessionToken) {
                        userStore.setOtpSessionToken(sessionToken)
                    }
                    currentStep.value = 'password'
                }
            } catch (e) {
                console.error(e)
                toast('Неверный OTP пароль.', { type: 'error' })
            } finally {
                loading.value = false
            }
        }
    }

    const onSigninSubmit = async () => {
        if (String(phone.value || '').length !== 8) {
            toast('Введите корректный номер (8 цифр)', { type: 'error' })
            return
        }
        if (!password.value) {
            toast('Введите пароль', { type: 'error' })
            return
        }

        loading.value = true
        try {
            const payload = {
                phone: String(phone.value || ''),
                password: password.value
            }
            const response = await apiService.preLogin(payload)
            if (response.success) {
                sentPhone.value = payload.phone
                userStore.setPhone(payload.phone)
                code.value = ['', '', '', '', '']
                currentStep.value = 'otp'
            } else {
                // Fallback if success is false but no error thrown
                toast('Неверные данные', { type: 'error' })
            }
        } catch (e) {
            const msg = String(e?.message || '').toLowerCase()
            if (msg.includes('401') || msg.includes('unauthorized')) {
                toast('Неверный телефон или пароль', { type: 'error' })
            } else {
                toast('Ошибка входа. Попробуйте позже.', { type: 'error' })
            }
        } finally {
            loading.value = false
        }
    }
    const onPasswordSubmit = async () => {
        if (!password.value) {
            toast('Введите пароль', { type: 'error' })
            return
        }

        loading.value = true
        try {
            const payload = {
                password: password.value,
                otp_session_token: userStore.otpSessionToken,
            }
            const response = await apiService.register(payload)
            const token = response.token || response.data?.token

            if (token) {
                userStore.setUser(response.user || response.data?.user || {}, token)
            }

            toast('Регистрация успешна', { type: 'success' })
            password.value = ''
            phone.value = ''
            code.value = ['', '', '', '', '']
            router.push('/dashboard')
        } catch (e) {
            toast('Ошибка регистрации. Попробуйте снова.', { type: 'error' })
        } finally {
            loading.value = false
        }
    }

    const onRequestOtp = async () => {
        if (String(phone.value || '').length !== 8) {
            isPhoneError.value = true
            toast('Введите корректный номер (8 цифр)', { type: 'error' })
            return
        }
        const payload = {
            phone: String(phone.value || ''),
            purpose: 'register',
        }
        console.log('OTP request payload:', payload)
        loading.value = true
        try {
            const data = await apiService.requestOtp(payload)

            sentPhone.value = payload.phone
            userStore.setPhone(payload.phone)
            currentStep.value = 'otp'
        } catch (e) {
            const msg = String(e?.message || '').toLowerCase()
            if (msg.includes('bad request') || msg.includes('phone_number')) {
                toast('Этот номер уже зарегистрирован.', { type: 'warning' })
                activeTab.value = 'signin'
            } else {
                toast('Не удалось отправить код. Попробуйте позже.', { type: 'error' })
            }
        }
        finally {
            loading.value = false
        }
    }

</script>

<template>
    <section class="h-screen flex items-center justify-center">
        <div class="wrap">
            <div class="grid grid-cols-2 bg-[#F7F8F6] p-1 gap-5 rounded-[20px] w-full mb-4">
                <h5 @click="activeTab = 'signup'; currentStep = 'phone'"
                    :class="['text-[17px] rounded-2xl py-3 text-center cursor-pointer', activeTab === 'signup' ? 'bg-[#2C702C] text-[#EEF2ED]' : 'text-[#6F736D]']">
                    {{ t('form.registration') }}
                </h5>
                <h5 @click="activeTab = 'signin'; currentStep = 'phone'"
                    :class="['text-[17px] rounded-2xl py-3 text-center cursor-pointer', activeTab === 'signin' ? 'bg-[#2C702C] text-[#EEF2ED]' : 'text-[#6F736D]']">
                    {{ t('form.signIn') }}
                </h5>
            </div>

            <form v-if="activeTab === 'signin' && currentStep === 'phone'" ref="formRef" class="block w-[390px] m-auto"
                @submit.prevent="onSigninSubmit">
                <div class="grid gap-4 bg-[#F7F8F6] p-[22px] rounded-[20px] w-full">
                    <div class="block">
                        <label for="phone_l" class="block text-[17px] font-bold text-[#191B19] mb-4">
                            {{ t('form.input.enterPhone') }}
                        </label>
                        <div class="flex">
                            <input type="number" value="+993" placeholder="+993" readonly
                                class="py-3 text-center rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] mr-1 w-[72px] block">

                            <input ref="signInPhoneRef" type="number" id="phone_l"
                                :placeholder="t('form.input.enterPhone')" v-model="phone" @input="onPhoneInput"
                                :class="['py-3 px-5 rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] w-[calc(100%-72px)]', { 'border-solid border border-red-500': isPhoneError }]">
                        </div>
                    </div>

                    <div class="block">
                        <label for="password_l" class="block text-[17px] font-bold text-[#191B19] mb-4">
                            {{ t('form.input.insertPassword') }}
                        </label>
                        <input type="password" id="password_l" :placeholder="t('form.input.password')"
                            v-model="password"
                            class="py-3 px-5 rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] w-[calc(100%-0px)]">
                    </div>

                    <button class="w-full flex items-center justify-center gap-2 py-2 rounded-[10px] bg-[#2C702C]">
                        <p class="text-[16px] text-[#EEF2ED] ">
                            {{ t('form.signIn') }}
                        </p>
                        <svg v-show="!loading" width="7" height="13" viewBox="0 0 7 13" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.164822 0.960766C0.11256 0.908503 0.071104 0.846459 0.04282 0.778176C0.014536 0.709892 -2.23984e-05 0.636706 -2.23919e-05 0.562796C-2.23855e-05 0.488887 0.014536 0.415701 0.04282 0.347417C0.071104 0.279134 0.11256 0.217089 0.164822 0.164827C0.217084 0.112565 0.279128 0.0711096 0.347412 0.0428256C0.415695 0.0145416 0.488881 -1.67599e-05 0.562791 -1.67534e-05C0.636701 -1.6747e-05 0.709887 0.0145417 0.77817 0.0428257C0.846454 0.0711096 0.908498 0.112566 0.96076 0.164828L6.58576 5.78983C6.63806 5.84207 6.67955 5.90411 6.70786 5.97239C6.73616 6.04068 6.75073 6.11388 6.75073 6.1878C6.75073 6.26172 6.73616 6.33492 6.70786 6.4032C6.67955 6.47149 6.63806 6.53353 6.58576 6.58577L0.960759 12.2108C0.855211 12.3163 0.712057 12.3756 0.56279 12.3756C0.413523 12.3756 0.270369 12.3163 0.164821 12.2108C0.059273 12.1052 -2.33855e-05 11.9621 -2.33754e-05 11.8128C-2.33653e-05 11.6635 0.0592731 11.5204 0.164821 11.4148L5.39256 6.1878L0.164822 0.960766Z"
                                fill="#EEF2ED" />
                        </svg>

                        <svg v-show="loading" :class="loading ? 'animate-spin' : ''" width="18" height="18"
                            viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-inside-1_442_1166" fill="white">
                                <path
                                    d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9H2.9914C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914V0Z" />
                            </mask>
                            <path
                                d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9H2.9914C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914V0Z"
                                stroke="#EEF2ED" stroke-width="8" mask="url(#path-1-inside-1_442_1166)" />
                        </svg>
                    </button>
                </div>
            </form>

            <form v-show="activeTab === 'signup' && currentStep === 'phone'" ref="formRef"
                class="block w-[390px] m-auto" @submit.prevent="onRequestOtp" novalidate>
                <div class="grid gap-4 bg-[#F7F8F6] p-[22px] rounded-[20px] w-full">
                    <div class="block">
                        <label for="phone_s" class="block text-[17px] font-bold text-[#191B19] mb-4">
                            {{ t('form.input.enterPhone') }}
                        </label>
                        <div class="flex">
                            <input type="number" value="+993" placeholder="+993" readonly
                                class="py-3 text-center rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] mr-1 w-[72px] block">

                            <input ref="signUpPhoneRef" type="number" id="phone_s"
                                :placeholder="t('form.input.enterPhone')" v-model="phone" @input="onPhoneInput"
                                :class="['py-3 px-5 rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] mr-[10px] w-[calc(100%-144px)]', { 'border-solid borde-1 border-red-500': isPhoneError }]">

                            <button class="w-[58px] flex items-center justify-center rounded-[10px] bg-[#2C702C]">
                                <svg v-show="!loading" width="7" height="13" viewBox="0 0 7 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.164822 0.960766C0.11256 0.908503 0.071104 0.846459 0.04282 0.778176C0.014536 0.709892 -2.23984e-05 0.636706 -2.23919e-05 0.562796C-2.23855e-05 0.488887 0.014536 0.415701 0.04282 0.347417C0.071104 0.279134 0.11256 0.217089 0.164822 0.164827C0.217084 0.112565 0.279128 0.0711096 0.347412 0.0428256C0.415695 0.0145416 0.488881 -1.67599e-05 0.562791 -1.67534e-05C0.636701 -1.6747e-05 0.709887 0.0145417 0.77817 0.0428257C0.846454 0.0711096 0.908498 0.112566 0.96076 0.164828L6.58576 5.78983C6.63806 5.84207 6.67955 5.90411 6.70786 5.97239C6.73616 6.04068 6.75073 6.11388 6.75073 6.1878C6.75073 6.26172 6.73616 6.33492 6.70786 6.4032C6.67955 6.47149 6.63806 6.53353 6.58576 6.58577L0.960759 12.2108C0.855211 12.3163 0.712057 12.3756 0.56279 12.3756C0.413523 12.3756 0.270369 12.3163 0.164821 12.2108C0.059273 12.1052 -2.33855e-05 11.9621 -2.33754e-05 11.8128C-2.33653e-05 11.6635 0.0592731 11.5204 0.164821 11.4148L5.39256 6.1878L0.164822 0.960766Z"
                                        fill="#EEF2ED" />
                                </svg>

                                <svg v-show="loading" :class="loading ? 'animate-spin' : ''" width="18" height="18"
                                    viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="path-1-inside-1_442_1166" fill="white">
                                        <path
                                            d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9H2.9914C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914V0Z" />
                                    </mask>
                                    <path
                                        d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9H2.9914C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914V0Z"
                                        stroke="#EEF2ED" stroke-width="8" mask="url(#path-1-inside-1_442_1166)" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <form v-show="currentStep === 'otp'" class="block w-[390px] m-auto" @submit.prevent="checkOtp">
                <button type="button" class="flex items-center gap-[10px] mb-4" @click="currentStep = 'phone'">
                    <span class="w-[18px] h-[18px] block">
                        <svg class="block w-full h-full object-contain" width="7" height="13" viewBox="0 0 7 13"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.58591 11.4148C6.63817 11.4671 6.67963 11.5292 6.70791 11.5974C6.7362 11.6657 6.75076 11.7389 6.75076 11.8128C6.75076 11.8867 6.7362 11.9599 6.70791 12.0282C6.67963 12.0965 6.63817 12.1585 6.58591 12.2108C6.53365 12.263 6.47161 12.3045 6.40332 12.3328C6.33504 12.3611 6.26185 12.3756 6.18794 12.3756C6.11403 12.3756 6.04085 12.3611 5.97256 12.3328C5.90428 12.3045 5.84224 12.263 5.78997 12.2108L0.164974 6.58578C0.112674 6.53354 0.0711852 6.4715 0.0428778 6.40322C0.0145704 6.33493 0 6.26173 0 6.18781C0 6.11389 0.0145704 6.0407 0.0428778 5.97241C0.0711852 5.90412 0.112674 5.84208 0.164974 5.78984L5.78997 0.164844C5.89552 0.0592961 6.03868 -2.94241e-09 6.18794 0C6.33721 2.94241e-09 6.48036 0.0592961 6.58591 0.164844C6.69146 0.270392 6.75076 0.413546 6.75076 0.562813C6.75076 0.71208 6.69146 0.855234 6.58591 0.960781L1.35818 6.18781L6.58591 11.4148Z"
                                fill="#191B19" />
                        </svg>
                    </span>

                    <h6 class="text-[17px] font-bold text-[#1D2417]">
                        {{ t('dashboard.btn.back') }}
                    </h6>
                </button>

                <div class="grid bg-[#F7F8F6] p-[22px] rounded-[20px] w-full relative">
                    <label for="phone" class="block text-[17px] font-bold text-[#191B19] mb-4">
                        {{ t('form.input.insertCode') }}
                    </label>
                    <p class="text-[15px] text-[#6F736D] mb-4">
                        {{ t('form.input.codeSentTo') }} +993{{ sentPhone || userStore.phoneNumber || '' }}
                    </p>
                    <div class="relative min-h-[48px] flex items-center justify-center">
                        <div class="grid grid-cols-5 gap-1"
                            :class="{ 'opacity-20 pointer-events-none absolute ': loading }">
                            <input v-for="(_, i) in 5" :key="i" :ref="el => inputRefs[i] = el" type="text"
                                inputmode="numeric" pattern="[0-9]*" maxlength="1"
                                class="py-3 rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] text-center border border-[#2C702C] focus:border-solid outline-none"
                                v-model="code[i]" placeholder="_" @input="onCodeInput(i, $event)"
                                @keydown="onCodeKeydown(i, $event)" @paste="onCodePaste">
                        </div>

                        <svg v-show="loading" class="animate-spin" width="18" height="18" viewBox="0 0 18 18"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-inside-1_432_2818" fill="white">
                                <path
                                    d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9L2.9914 9C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914L9 0Z" />
                            </mask>
                            <path
                                d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9L2.9914 9C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914L9 0Z"
                                stroke="#2C702C" stroke-width="8" mask="url(#path-1-inside-1_432_2818)" />
                        </svg>
                    </div>

                </div>
            </form>

            <form v-show="activeTab === 'signup' && currentStep === 'password'" class="block w-[390px] m-auto"
                @submit.prevent="onPasswordSubmit">
                <button type="button" class="flex items-center gap-[10px] mb-4" @click="currentStep = 'otp'">
                    <span class="w-[18px] h-[18px] block">
                        <svg class="block w-full h-full object-contain" width="7" height="13" viewBox="0 0 7 13"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.58591 11.4148C6.63817 11.4671 6.67963 11.5292 6.70791 11.5974C6.7362 11.6657 6.75076 11.7389 6.75076 11.8128C6.75076 11.8867 6.7362 11.9599 6.70791 12.0282C6.67963 12.0965 6.63817 12.1585 6.58591 12.2108C6.53365 12.263 6.47161 12.3045 6.40332 12.3328C6.33504 12.3611 6.26185 12.3756 6.18794 12.3756C6.11403 12.3756 6.04085 12.3611 5.97256 12.3328C5.90428 12.3045 5.84224 12.263 5.78997 12.2108L0.164974 6.58578C0.112674 6.53354 0.0711852 6.4715 0.0428778 6.40322C0.0145704 6.33493 0 6.26173 0 6.18781C0 6.11389 0.0145704 6.0407 0.0428778 5.97241C0.0711852 5.90412 0.112674 5.84208 0.164974 5.78984L5.78997 0.164844C5.89552 0.0592961 6.03868 -2.94241e-09 6.18794 0C6.33721 2.94241e-09 6.48036 0.0592961 6.58591 0.164844C6.69146 0.270392 6.75076 0.413546 6.75076 0.562813C6.75076 0.71208 6.69146 0.855234 6.58591 0.960781L1.35818 6.18781L6.58591 11.4148Z"
                                fill="#191B19" />
                        </svg>
                    </span>

                    <h6 class="text-[17px] font-bold text-[#1D2417]">
                        {{ t('dashboard.btn.back') }}
                    </h6>
                </button>
                <div class="relative grid bg-[#F7F8F6] p-[22px] rounded-[20px] w-full">
                    <label for="password_s" class="block text-[17px] font-bold text-[#191B19] mb-4">
                        {{ t('form.input.createPassword') }}
                    </label>
                    <p class="text-[15px] text-[#6F736D] mb-4">
                        {{ t('form.input.createStrongPassword') }}
                    </p>
                    <input ref="signUpPasswordRef" type="password" id="password_s"
                        :placeholder="t('form.input.password')" v-model="password"
                        class="py-3 px-5 rounded-[10px] bg-[#EEF2ED] text-[15px] text-[#191B19] placeholder:text-[#6F736D] w-[calc(100%-0px)]">

                    <button class="w-full flex items-center justify-center gap-2 py-2 mt-4 rounded-[10px] bg-[#2C702C]">
                        <p class="text-[16px] text-[#EEF2ED]">
                            {{ t('dashboard.btn.signUp') }}
                        </p>
                        <svg v-show="!loading" width="7" height="13" viewBox="0 0 7 13" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.164822 0.960766C0.11256 0.908503 0.071104 0.846459 0.04282 0.778176C0.014536 0.709892 -2.23984e-05 0.636706 -2.23919e-05 0.562796C-2.23855e-05 0.488887 0.014536 0.415701 0.04282 0.347417C0.071104 0.279134 0.11256 0.217089 0.164822 0.164827C0.217084 0.112565 0.279128 0.0711096 0.347412 0.0428256C0.415695 0.0145416 0.488881 -1.67599e-05 0.562791 -1.67534e-05C0.636701 -1.6747e-05 0.709887 0.0145417 0.77817 0.0428257C0.846454 0.0711096 0.908498 0.112566 0.96076 0.164828L6.58576 5.78983C6.63806 5.84207 6.67955 5.90411 6.70786 5.97239C6.73616 6.04068 6.75073 6.11388 6.75073 6.1878C6.75073 6.26172 6.73616 6.33492 6.70786 6.4032C6.67955 6.47149 6.63806 6.53353 6.58576 6.58577L0.960759 12.2108C0.855211 12.3163 0.712057 12.3756 0.56279 12.3756C0.413523 12.3756 0.270369 12.3163 0.164821 12.2108C0.059273 12.1052 -2.33855e-05 11.9621 -2.33754e-05 11.8128C-2.33653e-05 11.6635 0.0592731 11.5204 0.164821 11.4148L5.39256 6.1878L0.164822 0.960766Z"
                                fill="#EEF2ED" />
                        </svg>
                        <svg v-show="loading" class="animate-spin" width="18" height="18" viewBox="0 0 18 18"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask_spinner_password" fill="white">
                                <path
                                    d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9L2.9914 9C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914L9 0Z" />
                            </mask>
                            <path
                                d="M9 0C10.78 2.12267e-08 12.5201 0.527841 14.0001 1.51677C15.4802 2.50571 16.6337 3.91131 17.3149 5.55585C17.9961 7.20038 18.1743 9.00998 17.8271 10.7558C17.4798 12.5016 16.6226 14.1053 15.364 15.364C14.1053 16.6226 12.5016 17.4798 10.7558 17.8271C9.00998 18.1743 7.20038 17.9961 5.55585 17.3149C3.91131 16.6337 2.50571 15.4802 1.51677 14.0001C0.527841 12.5201 -4.24533e-08 10.78 0 9L2.9914 9C2.9914 10.1884 3.3438 11.3501 4.00403 12.3382C4.66427 13.3263 5.60268 14.0964 6.70061 14.5512C7.79854 15.006 9.00667 15.125 10.1722 14.8931C11.3378 14.6613 12.4084 14.089 13.2487 13.2487C14.089 12.4084 14.6613 11.3378 14.8931 10.1722C15.125 9.00667 15.006 7.79854 14.5512 6.70061C14.0964 5.60268 13.3263 4.66427 12.3382 4.00403C11.3501 3.3438 10.1884 2.9914 9 2.9914L9 0Z"
                                stroke="#EEF2ED" stroke-width="8" mask="url(#mask_spinner_password)" />
                        </svg>
                    </button>
                </div>

            </form>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>
