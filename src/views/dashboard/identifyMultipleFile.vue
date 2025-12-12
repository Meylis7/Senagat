<script setup>
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();

    const uploadedFiles = ref([]);
    const fileNames = ref([]);
    const fileError = ref(false);
    const limitError = ref(false);

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);

        // Reset errors
        fileError.value = false;
        limitError.value = false;

        if (uploadedFiles.value.length + newFiles.length > 3) {
            limitError.value = true;
            event.target.value = ''; // Reset input
            return;
        }

        const validNewFiles = [];
        let hasInvalidType = false;

        for (const file of newFiles) {
            if (file.type === 'application/pdf') {
                validNewFiles.push(file);
            } else {
                hasInvalidType = true;
            }
        }

        if (hasInvalidType) {
            fileError.value = true;
            event.target.value = ''; // Reset input
            return;
        }

        uploadedFiles.value = [...uploadedFiles.value, ...validNewFiles];
        fileNames.value = uploadedFiles.value.map(f => f.name);

        // Reset input to allow subsequent uploads
        event.target.value = '';
        console.log(uploadedFiles.value);
    };
</script>

<template>
    <section class="pb-[80px]">
        <div class="auto_container">
            <div class="wrap">
                <button type="button" class="flex items-center gap-[10px] mb-4">
                    <span class="w-[18px] h-[18px] block">
                        <svg class="block w-full h-full object-contain" width="7" height="13" viewBox="0 0 7 13"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.58591 11.4148C6.63817 11.4671 6.67963 11.5292 6.70791 11.5974C6.7362 11.6657 6.75076 11.7389 6.75076 11.8128C6.75076 11.8867 6.7362 11.9599 6.70791 12.0282C6.67963 12.0965 6.63817 12.1585 6.58591 12.2108C6.53365 12.263 6.47161 12.3045 6.40332 12.3328C6.33504 12.3611 6.26185 12.3756 6.18794 12.3756C6.11403 12.3756 6.04085 12.3611 5.97256 12.3328C5.90428 12.3045 5.84224 12.263 5.78997 12.2108L0.164974 6.58578C0.112674 6.53354 0.0711852 6.4715 0.0428778 6.40322C0.0145704 6.33493 0 6.26173 0 6.18781C0 6.11389 0.0145704 6.0407 0.0428778 5.97241C0.0711852 5.90412 0.112674 5.84208 0.164974 5.78984L5.78997 0.164844C5.89552 0.0592961 6.03868 -2.94241e-09 6.18794 0C6.33721 2.94241e-09 6.48036 0.0592961 6.58591 0.164844C6.69146 0.270392 6.75076 0.413546 6.75076 0.562813C6.75076 0.71208 6.69146 0.855234 6.58591 0.960781L1.35818 6.18781L6.58591 11.4148Z"
                                fill="#191B19" />
                        </svg>
                    </span>

                    <h6 class="text-[17px] font-Gilroy font-bold text-[#1D2417]">
                        Назад
                    </h6>
                </button>

                <h2 class="text-[28px] font-bold leading-tight mb-[22px]">
                    Проверка личности
                </h2>

                <form class="block">
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-[22px] rounded-[20px]  bg-mainWhite">
                        <div class="block">
                            <label for="name" class="text-[15px] font-bold mb-[10px] block">
                                Имя
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="name" placeholder="Имя">
                        </div>

                        <div class="block">
                            <label for="Surname" class="text-[15px] font-bold mb-[10px] block">
                                Фамилия
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="Surname" placeholder="Фамилия">
                        </div>

                        <div class="block">
                            <label for="patronymic" class="text-[15px] font-bold mb-[10px] block">
                                Отчество
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="patronymic" placeholder="Отчество">
                        </div>

                        <div class="block">
                            <label for="birthdate" class="text-[15px] font-bold mb-[10px] block">
                                Дата рождения
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="birthdate" placeholder="Дата рождения">
                        </div>

                        <div class="block">
                            <label for="passportNumber" class="text-[15px] font-bold mb-[10px] block">
                                Номер паспорта
                            </label>
                            <div class="flex">
                                <input
                                    class="block text-[15px] font-Gilroy w-[58px] mr-1 bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="passportId" placeholder="AS">
                                <input
                                    class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                    type="text" id="passportNumber" placeholder="Номер паспорта">
                            </div>
                        </div>

                        <div class="block">
                            <label for="issued_date" class="text-[15px] font-bold mb-[10px] block">
                                Дата выдачи
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="issued_date" placeholder="Дата выдачи">
                        </div>

                        <div class="block">
                            <label for="issued_by" class="text-[15px] font-bold mb-[10px] block">
                                Место выдачи
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="issued_by" placeholder="Место выдачи">
                        </div>

                        <div class="block relative">
                            <p class="text-[15px] font-bold mb-[10px] block leading-normal trun">
                                Скан паспорта
                            </p>

                            <div class="block relative">
                                <label for="scan"
                                    class="block w-full text-[15px] font-Gilroy leading-tight border-solid border-1 border-[#EEF2ED] rounded-[10px] py-3 px-5 pr-[45px] placeholder:text-[#6F736D] text-[#191B19] truncate">
                                    {{ fileNames.length > 0 ? fileNames.join(', ') : 'Скан паспорта' }}
                                </label>

                                <input class="hidden" type="file" id="scan" accept=".pdf" multiple
                                    @change="handleFileChange">

                                <span class="absolute bottom-[14px] right-4 w-5 h-5">
                                    <svg class="w-full h-full object-contain" width="20" height="20" viewBox="0 0 20 20"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17.5 11.875C17.5 12.0408 17.4342 12.1997 17.3169 12.3169C17.1997 12.4342 17.0408 12.5 16.875 12.5H15V13.75H16.25C16.4158 13.75 16.5747 13.8158 16.6919 13.9331C16.8092 14.0503 16.875 14.2092 16.875 14.375C16.875 14.5408 16.8092 14.6997 16.6919 14.8169C16.5747 14.9342 16.4158 15 16.25 15H15V16.25C15 16.4158 14.9342 16.5747 14.8169 16.6919C14.6997 16.8092 14.5408 16.875 14.375 16.875C14.2092 16.875 14.0503 16.8092 13.9331 16.6919C13.8158 16.5747 13.75 16.4158 13.75 16.25V11.875C13.75 11.7092 13.8158 11.5503 13.9331 11.4331C14.0503 11.3158 14.2092 11.25 14.375 11.25H16.875C17.0408 11.25 17.1997 11.3158 17.3169 11.4331C17.4342 11.5503 17.5 11.7092 17.5 11.875ZM7.1875 13.4375C7.1875 14.0177 6.95703 14.5741 6.5468 14.9843C6.13656 15.3945 5.58016 15.625 5 15.625H4.375V16.25C4.375 16.4158 4.30915 16.5747 4.19194 16.6919C4.07473 16.8092 3.91576 16.875 3.75 16.875C3.58424 16.875 3.42527 16.8092 3.30806 16.6919C3.19085 16.5747 3.125 16.4158 3.125 16.25V11.875C3.125 11.7092 3.19085 11.5503 3.30806 11.4331C3.42527 11.3158 3.58424 11.25 3.75 11.25H5C5.58016 11.25 6.13656 11.4805 6.5468 11.8907C6.95703 12.3009 7.1875 12.8573 7.1875 13.4375ZM5.9375 13.4375C5.9375 13.1889 5.83873 12.9504 5.66291 12.7746C5.4871 12.5988 5.24864 12.5 5 12.5H4.375V14.375H5C5.24864 14.375 5.4871 14.2762 5.66291 14.1004C5.83873 13.9246 5.9375 13.6861 5.9375 13.4375ZM12.8125 14.0625C12.8125 14.8084 12.5162 15.5238 11.9887 16.0512C11.4613 16.5787 10.7459 16.875 10 16.875H8.75C8.58424 16.875 8.42527 16.8092 8.30806 16.6919C8.19085 16.5747 8.125 16.4158 8.125 16.25V11.875C8.125 11.7092 8.19085 11.5503 8.30806 11.4331C8.42527 11.3158 8.58424 11.25 8.75 11.25H10C10.7459 11.25 11.4613 11.5463 11.9887 12.0738C12.5162 12.6012 12.8125 13.3166 12.8125 14.0625ZM11.5625 14.0625C11.5625 13.6481 11.3979 13.2507 11.1049 12.9576C10.8118 12.6646 10.4144 12.5 10 12.5H9.375V15.625H10C10.4144 15.625 10.8118 15.4604 11.1049 15.1674C11.3979 14.8743 11.5625 14.4769 11.5625 14.0625ZM3.125 8.75V3.125C3.125 2.79348 3.2567 2.47554 3.49112 2.24112C3.72554 2.0067 4.04348 1.875 4.375 1.875H11.875C11.9571 1.87494 12.0384 1.89105 12.1143 1.92241C12.1902 1.95378 12.2591 1.99979 12.3172 2.05781L16.6922 6.43281C16.7502 6.4909 16.7962 6.55985 16.8276 6.63572C16.859 6.71159 16.8751 6.7929 16.875 6.875V8.75C16.875 8.91576 16.8092 9.07473 16.6919 9.19194C16.5747 9.30915 16.4158 9.375 16.25 9.375C16.0842 9.375 15.9253 9.30915 15.8081 9.19194C15.6908 9.07473 15.625 8.91576 15.625 8.75V7.5H11.875C11.7092 7.5 11.5503 7.43415 11.4331 7.31694C11.3158 7.19973 11.25 7.04076 11.25 6.875V3.125H4.375V8.75C4.375 8.91576 4.30915 9.07473 4.19194 9.19194C4.07473 9.30915 3.91576 9.375 3.75 9.375C3.58424 9.375 3.42527 9.30915 3.30806 9.19194C3.19085 9.07473 3.125 8.91576 3.125 8.75ZM12.5 6.25H14.7414L12.5 4.00859V6.25Z"
                                            fill="#191B19" />
                                    </svg>
                                </span>
                            </div>

                            <p v-if="fileError" class="text-red-500 text-sm mt-1">
                                Пожалуйста, загрузите файл только в формате PDF.
                            </p>
                            <p v-if="limitError" class="text-red-500 text-sm mt-1">
                                Можно загрузить не более 3 файлов.
                            </p>
                        </div>

                        <div class="block">
                            <label for="citizenship" class="text-[15px] font-bold mb-[10px] block">
                                Citizenship
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="citizenship" placeholder="Turkmenistan">
                        </div>

                        <div class="block">
                            <label for="home_phone" class="text-[15px] font-bold mb-[10px] block">
                                Home Phone
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="home_phone" placeholder="12 122112" maxlength="8">
                        </div>

                        <div class="block">
                            <label for="home_address" class="text-[15px] font-bold mb-[10px] block">
                                Home Address
                            </label>
                            <input
                                class="block w-full text-[15px] font-Gilroy bg-[#EEF2ED] rounded-[10px] py-3 px-5 placeholder:text-[#6F736D] text-[#191B19]"
                                type="text" id="home_address" placeholder="Aşgabat ş. Büzmeýin etrap">
                        </div>

                        <div class="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center">
                            <button type="submit"
                                class="bg-[#2C702C] text-white px-10 py-3 rounded-[10px] text-sm font-bold cursor-pointer text-center opacity-40">
                                Отправить заявку
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>