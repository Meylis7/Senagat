<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';
    import apiService from '@/services/apiService';

    const { t, locale } = useI18n();
    const router = useRouter();
    const loading = ref(false)
    const userStore = useUserStore();

    const hasProfile = ref(false)
    const isEditable = ref(true)

    // File input upload
    const fileName = ref('');
    const fileError = ref(false);

    const handleFileChange = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) {
            fileName.value = '';
            fileError.value = false;
            formData.scan_passport = null;
            return;
        }
        const name = String(file.name || '');
        const type = String(file.type || '').toLowerCase();
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const isPdf = type === 'application/pdf' || ext === 'pdf';
        if (isPdf) {
            fileName.value = name;
            fileError.value = false;
            formData.scan_passport = file;
        } else {
            fileName.value = '';
            fileError.value = true;
            formData.scan_passport = null;
            event.target.value = '';
        }
    };

    const fetchUserProfile = async () => {
        try {
            const token =
                userStore.authToken ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('access_token') ||
                localStorage.getItem('token') ||
                '';
            if (!token) return;
            const res = await apiService.fetchUserInfo(token);
            const profile = res?.data?.profile ?? res?.profile ?? null;
            if (profile) {
                hasProfile.value = true;
                isEditable.value = false;
                formData.first_name = profile.first_name || '';
                formData.last_name = profile.last_name || '';
                formData.middle_name = profile.middle_name || '';
                formData.birth_date = profile.birth_date || '';
                {
                    let series = String(profile.passport_series || '').trim();
                    let num = String(profile.passport_number || '').trim();
                    if (!series) {
                        const compact = num.replace(/\s+/g, '');
                        const m = compact.match(/^([A-Za-z]{2})(\d*)$/);
                        if (m) {
                            series = m[1];
                            num = m[2];
                        } else if (compact.length >= 2) {
                            series = compact.slice(0, 2);
                            num = compact.slice(2);
                        }
                    }
                    formData.passportId = series.toUpperCase();
                    formData.passport_number = num.replace(/\D/g, '');
                }
                formData.issued_date = profile.issued_date || '';
                formData.issued_by = profile.issued_by || '';
                formData.citizenship = profile.citizenship || '';
                formData.home_phone = profile.home_phone || '';
                formData.home_address = profile.home_address || '';
            } else {
                hasProfile.value = false;
                isEditable.value = true;
            }
        } catch { }
    };

    onMounted(fetchUserProfile)

    const formData = reactive({
        first_name: '',
        last_name: '',
        middle_name: '',
        birth_date: '',
        passportId: '',
        passport_number: '',
        issued_date: '',
        issued_by: '',
        scan_passport: null,
        citizenship: '',
        home_phone: '',
        home_address: ''
    });


    const submitForm = async () => {
        loading.value = true
        try {
            const f = formData;
            if (!String(f.first_name || '').trim()) { toast('Заполните поле: Имя', { type: 'error' }); loading.value = false; return; }
            if (!String(f.last_name || '').trim()) { toast('Заполните поле: Фамилия', { type: 'error' }); loading.value = false; return; }
            if (!String(f.birth_date || '').trim()) { toast('Заполните поле: Дата рождения', { type: 'error' }); loading.value = false; return; }
            if (!/^[A-Za-z]{2}$/.test(String(f.passportId || '').trim())) { toast('Неверная серия паспорта', { type: 'error' }); loading.value = false; return; }
            if (!/^\d{6}$/.test(String(f.passport_number || '').trim())) { toast('Неверный номер паспорта', { type: 'error' }); loading.value = false; return; }
            if (!String(f.issued_date || '').trim()) { toast('Заполните поле: Дата выдачи', { type: 'error' }); loading.value = false; return; }
            if (!String(f.issued_by || '').trim()) { toast('Заполните поле: Место выдачи', { type: 'error' }); loading.value = false; return; }
            if (fileError.value) { toast('Скан паспорта должен быть PDF', { type: 'error' }); loading.value = false; return; }
            if (!f.scan_passport) { toast('Загрузите скан паспорта (PDF)', { type: 'error' }); loading.value = false; return; }
            if (!String(f.citizenship || '').trim()) { toast('Заполните поле: Citizenship', { type: 'error' }); loading.value = false; return; }
            if (!String(f.home_phone || '').trim()) { toast('Заполните поле: Home Phone', { type: 'error' }); loading.value = false; return; }
            if (!String(f.home_address || '').trim()) { toast('Заполните поле: Home Address', { type: 'error' }); loading.value = false; return; }

            const payload = new FormData();
            payload.append('first_name', formData.first_name);
            payload.append('last_name', formData.last_name);
            payload.append('middle_name', formData.middle_name);
            payload.append('birth_date', formData.birth_date);
            payload.append('passport_number', formData.passportId + formData.passport_number);
            payload.append('issued_date', formData.issued_date);
            payload.append('issued_by', formData.issued_by);
            if (formData.scan_passport) {
                payload.append('scan_passport', formData.scan_passport);
            }
            payload.append('citizenship', formData.citizenship);
            payload.append('home_phone', formData.home_phone);
            payload.append('home_address', formData.home_address);

            const token = userStore.authToken;
            if (!token) {
                toast('You are not authenticated! Please log in.', { type: 'error' });
                loading.value = false;
                return;
            }
            console.log(token)


            await apiService.submitProfile(payload, token);
            await router.push({ name: 'dashboard.home' });
            toast('Данные успешно отправлены', { type: 'success' });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast('Ошибка отправки данных: ' + error.message, { type: 'error' });
        } finally {
            loading.value = false
        }
    };

</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="wrap">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <h2 class="text-[28px] font-bold leading-tight text-center">
                        {{ t('form.input.identityVerification') }}
                    </h2>

                    <RouterLink to="/dashboard" type="button" class="flex items-center gap-[10px]">
                        <h6 class="text-[17px] font-Gilroy font-bold text-[#1D2417]">
                            {{ t('dashboard.btn.homePage') }}
                        </h6>

                        <span class="w-[16px] h-[16px] block rotate-180">
                            <svg class="block w-full h-full object-contain" width="7" height="13" viewBox="0 0 7 13"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.58591 11.4148C6.63817 11.4671 6.67963 11.5292 6.70791 11.5974C6.7362 11.6657 6.75076 11.7389 6.75076 11.8128C6.75076 11.8867 6.7362 11.9599 6.70791 12.0282C6.67963 12.0965 6.63817 12.1585 6.58591 12.2108C6.53365 12.263 6.47161 12.3045 6.40332 12.3328C6.33504 12.3611 6.26185 12.3756 6.18794 12.3756C6.11403 12.3756 6.04085 12.3611 5.97256 12.3328C5.90428 12.3045 5.84224 12.263 5.78997 12.2108L0.164974 6.58578C0.112674 6.53354 0.0711852 6.4715 0.0428778 6.40322C0.0145704 6.33493 0 6.26173 0 6.18781C0 6.11389 0.0145704 6.0407 0.0428778 5.97241C0.0711852 5.90412 0.112674 5.84208 0.164974 5.78984L5.78997 0.164844C5.89552 0.0592961 6.03868 -2.94241e-09 6.18794 0C6.33721 2.94241e-09 6.48036 0.0592961 6.58591 0.164844C6.69146 0.270392 6.75076 0.413546 6.75076 0.562813C6.75076 0.71208 6.69146 0.855234 6.58591 0.960781L1.35818 6.18781L6.58591 11.4148Z"
                                    fill="#191B19" />
                            </svg>
                        </span>
                    </RouterLink>
                </div>

                <form class="block" @submit.prevent="submitForm">
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-[22px] rounded-[20px]  bg-mainWhite">
                        <div class="block">
                            <label for="name" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.firstName') }}
                            </label>
                            <input v-model="formData.first_name" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="name" :placeholder="t('form.input.firstName')">
                        </div>

                        <div class="block">
                            <label for="Surname" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.lastName') }}
                            </label>
                            <input v-model="formData.last_name" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="Surname" :placeholder="t('form.input.lastName')">
                        </div>

                        <div class="block">
                            <label for="patronymic" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.middleName') }}
                            </label>
                            <input v-model="formData.middle_name" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="patronymic" :placeholder="t('form.input.middleName')">
                        </div>

                        <div class="block">
                            <label for="birthdate" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.dateOfBirth') }}
                            </label>
                            <input v-model="formData.birth_date" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="birthdate" :placeholder="t('form.input.dateOfBirth')">
                        </div>

                        <div class="block">
                            <label for="passport_number" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.passportNumber') }}
                            </label>
                            <div class="flex">
                                <input v-model="formData.passportId" :disabled="hasProfile && !isEditable"
                                    class="block text-[15px] font-Gilroy w-[70px] mr-1 bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19] uppercase text-center"
                                    type="text" id="passportId" placeholder="AS" maxlength="2">
                                <input v-model="formData.passport_number" :disabled="hasProfile && !isEditable"
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="passport_number" :placeholder="t('form.input.passportNumber')"
                                    maxlength="6">
                            </div>
                        </div>

                        <div class="block">
                            <label for="issued_date" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.dateOfIssue') }}
                            </label>
                            <input v-model="formData.issued_date" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="issued_date" :placeholder="t('form.input.dateOfIssue')">
                        </div>

                        <div class="block">
                            <label for="issued_by" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.placeOfIssue') }}
                            </label>
                            <input v-model="formData.issued_by" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="issued_by" :placeholder="t('form.input.placeOfIssue')">
                        </div>

                        <div class="block relative">
                            <div class="block relative">
                                <p class="text-[15px] font-bold mb-[10px] block leading-normal">
                                    {{ t('form.input.passportScan') }}
                                </p>
                                <label for="scan"
                                    class="block w-full text-[15px] font-Gilroy leading-tight border-solid border-1 border-[#EEF2ED] rounded-[10px] py-3 px-5 pr-[45px] placeholder:text-[#6F736D] text-[#191B19] truncate">
                                    {{ fileName || t('form.input.passportScan') }}
                                </label>

                                <span class="absolute bottom-4 right-4 w-5 h-5">
                                    <svg class="w-full h-full object-contain" width="20" height="20" viewBox="0 0 20 20"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17.5 11.875C17.5 12.0408 17.4342 12.1997 17.3169 12.3169C17.1997 12.4342 17.0408 12.5 16.875 12.5H15V13.75H16.25C16.4158 13.75 16.5747 13.8158 16.6919 13.9331C16.8092 14.0503 16.875 14.2092 16.875 14.375C16.875 14.5408 16.8092 14.6997 16.6919 14.8169C16.5747 14.9342 16.4158 15 16.25 15H15V16.25C15 16.4158 14.9342 16.5747 14.8169 16.6919C14.6997 16.8092 14.5408 16.875 14.375 16.875C14.2092 16.875 14.0503 16.8092 13.9331 16.6919C13.8158 16.5747 13.75 16.4158 13.75 16.25V11.875C13.75 11.7092 13.8158 11.5503 13.9331 11.4331C14.0503 11.3158 14.2092 11.25 14.375 11.25H16.875C17.0408 11.25 17.1997 11.3158 17.3169 11.4331C17.4342 11.5503 17.5 11.7092 17.5 11.875ZM7.1875 13.4375C7.1875 14.0177 6.95703 14.5741 6.5468 14.9843C6.13656 15.3945 5.58016 15.625 5 15.625H4.375V16.25C4.375 16.4158 4.30915 16.5747 4.19194 16.6919C4.07473 16.8092 3.91576 16.875 3.75 16.875C3.58424 16.875 3.42527 16.8092 3.30806 16.6919C3.19085 16.5747 3.125 16.4158 3.125 16.25V11.875C3.125 11.7092 3.19085 11.5503 3.30806 11.4331C3.42527 11.3158 3.58424 11.25 3.75 11.25H5C5.58016 11.25 6.13656 11.4805 6.5468 11.8907C6.95703 12.3009 7.1875 12.8573 7.1875 13.4375ZM5.9375 13.4375C5.9375 13.1889 5.83873 12.9504 5.66291 12.7746C5.4871 12.5988 5.24864 12.5 5 12.5H4.375V14.375H5C5.24864 14.375 5.4871 14.2762 5.66291 14.1004C5.83873 13.9246 5.9375 13.6861 5.9375 13.4375ZM12.8125 14.0625C12.8125 14.8084 12.5162 15.5238 11.9887 16.0512C11.4613 16.5787 10.7459 16.875 10 16.875H8.75C8.58424 16.875 8.42527 16.8092 8.30806 16.6919C8.19085 16.5747 8.125 16.4158 8.125 16.25V11.875C8.125 11.7092 8.19085 11.5503 8.30806 11.4331C8.42527 11.3158 8.58424 11.25 8.75 11.25H10C10.7459 11.25 11.4613 11.5463 11.9887 12.0738C12.5162 12.6012 12.8125 13.3166 12.8125 14.0625ZM3.125 8.75V3.125C3.125 2.79348 3.2567 2.47554 3.49112 2.24112C3.72554 2.0067 4.04348 1.875 4.375 1.875H11.875C11.9571 1.87494 12.0384 1.89105 12.1143 1.92241C12.1902 1.95378 12.2591 1.99979 12.3172 2.05781L16.6922 6.43281C16.7502 6.4909 16.7962 6.55985 16.8276 6.63572C16.859 6.71159 16.8751 6.7929 16.875 6.875V8.75C16.875 8.91576 16.8092 9.07473 16.6919 9.19194C16.5747 9.30915 16.4158 9.375 16.25 9.375C16.0842 9.375 15.9253 9.30915 15.8081 9.19194C15.6908 9.07473 15.625 8.91576 15.625 8.75V7.5H11.875C11.7092 7.5 11.5503 7.43415 11.4331 7.31694C11.3158 7.19973 11.25 7.04076 11.25 6.875V3.125H4.375V8.75C4.375 8.91576 4.30915 9.07473 4.19194 9.19194C4.07473 9.30915 3.91576 9.375 3.75 9.375C3.58424 9.375 3.42527 9.30915 3.30806 9.19194C3.19085 9.07473 3.125 8.91576 3.125 8.75ZM12.5 6.25H14.7414L12.5 4.00859V6.25Z"
                                            fill="#191B19" />
                                    </svg>
                                </span>
                            </div>
                            <input class="hidden" type="file" id="scan" accept="application/pdf,.pdf"
                                @change="handleFileChange" :disabled="hasProfile && !isEditable">
                            <p v-if="fileError" class="text-red-500 text-sm mt-1">
                                {{ t('form.input.pdfOnlyWarning') }}
                            </p>
                        </div>

                        <div class="block">
                            <label for="citizenship" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.citizenship') }}
                            </label>
                            <input v-model="formData.citizenship" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="citizenship" :placeholder="t('form.input.citizenship')">
                        </div>

                        <div class="block">
                            <label for="home_phone" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.homePhone') }}
                            </label>
                            <input v-model="formData.home_phone" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="home_phone" :placeholder="t('form.input.homePhone')" maxlength="8">
                        </div>

                        <div class="block">
                            <label for="home_address" class="text-[15px] font-bold mb-[10px] block">
                                {{ t('form.input.homeAddress') }}
                            </label>
                            <input v-model="formData.home_address" :disabled="hasProfile && !isEditable"
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="home_address" :placeholder="t('form.input.homeAddress')">
                        </div>

                        <div class="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-[10x]">
                            <button v-if="hasProfile && !isEditable" type="button" @click="isEditable = true"
                                class="bg-[#2C702C] text-white px-10 py-3 rounded-[10px] text-sm font-bold cursor-pointer text-center flex items-center gap-4">
                                {{ t('dashboard.btn.edit') }}
                            </button>
                            <button v-else type="submit"
                                class="bg-[#2C702C] text-white px-10 py-3 rounded-[10px] text-sm font-bold cursor-pointer text-center flex items-center gap-4">
                                <p class="text-sm font-bold">
                                    {{ t('dashboard.btn.sendApplication') }}
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
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped></style>
