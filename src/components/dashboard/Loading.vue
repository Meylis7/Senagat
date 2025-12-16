<script setup>
    import { RouterLink } from "vue-router";
    import logo from "@/assets/images/logo.png";
    const props = defineProps({
        open: { type: Boolean, default: false },
        loading: { type: Boolean, default: true },
    })

</script>

<template>
    <section v-if="open"
        class="fixed top-0 left-0 z-[99] w-full h-full bg-[#1D241780] flex items-center justify-center">
        <div class="wrap w-full max-w-[600px] bg-[#F7F8F6] p-8 flex flex-col items-center gap-5 rounded-[20px]">
            <div class="block w-[135px] h-[135px]">
                <img class="w-full h-full object-contain" :src="logo" alt="profile-img">
            </div>

            <div v-if="loading" class="flex flex-col items-center gap-[10px]">
                <span class="w-6 h-6 block animate-spin">
                    <svg class="w-full h-full object-contain" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#E6EAE3" stroke-width="4" />
                        <mask id="path-2-inside-1_374_960" fill="white">
                            <path
                                d="M12 0C14.3734 2.83022e-08 16.6935 0.703788 18.6668 2.02236C20.6402 3.34094 22.1783 5.21509 23.0866 7.4078C23.9948 9.60051 24.2324 12.0133 23.7694 14.3411C23.3064 16.6689 22.1635 18.8071 20.4853 20.4853C18.8071 22.1635 16.6689 23.3064 14.3411 23.7694C12.0133 24.2324 9.60051 23.9948 7.4078 23.0866C5.21509 22.1783 3.34094 20.6402 2.02236 18.6668C0.703788 16.6935 -5.66044e-08 14.3734 0 12H3.98853C3.98853 13.5845 4.4584 15.1335 5.33871 16.4509C6.21902 17.7684 7.47024 18.7953 8.93414 19.4016C10.398 20.008 12.0089 20.1667 13.563 19.8575C15.117 19.5484 16.5445 18.7854 17.665 17.665C18.7854 16.5445 19.5484 15.117 19.8575 13.563C20.1667 12.0089 20.008 10.398 19.4016 8.93414C18.7953 7.47024 17.7684 6.21902 16.4509 5.33871C15.1335 4.4584 13.5845 3.98853 12 3.98853V0Z" />
                        </mask>
                        <path
                            d="M12 0C14.3734 2.83022e-08 16.6935 0.703788 18.6668 2.02236C20.6402 3.34094 22.1783 5.21509 23.0866 7.4078C23.9948 9.60051 24.2324 12.0133 23.7694 14.3411C23.3064 16.6689 22.1635 18.8071 20.4853 20.4853C18.8071 22.1635 16.6689 23.3064 14.3411 23.7694C12.0133 24.2324 9.60051 23.9948 7.4078 23.0866C5.21509 22.1783 3.34094 20.6402 2.02236 18.6668C0.703788 16.6935 -5.66044e-08 14.3734 0 12H3.98853C3.98853 13.5845 4.4584 15.1335 5.33871 16.4509C6.21902 17.7684 7.47024 18.7953 8.93414 19.4016C10.398 20.008 12.0089 20.1667 13.563 19.8575C15.117 19.5484 16.5445 18.7854 17.665 17.665C18.7854 16.5445 19.5484 15.117 19.8575 13.563C20.1667 12.0089 20.008 10.398 19.4016 8.93414C18.7953 7.47024 17.7684 6.21902 16.4509 5.33871C15.1335 4.4584 13.5845 3.98853 12 3.98853V0Z"
                            stroke="#2C702C" stroke-width="8" mask="url(#path-2-inside-1_374_960)" />
                    </svg>
                </span>
                <p class="text-[17px] font-bold text-[#191B19] leading-tight">
                    Проверка со стороны банка
                </p>
            </div>

            <div v-else class="flex flex-col items-center gap-[10px]">
                <span class="w-6 h-6 block">
                    <svg class="w-full h-full object-contain" width="22" height="17" viewBox="0 0 22 17" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21.311 4.39946L9.27352 16.437C8.99225 16.7181 8.61087 16.876 8.21321 16.876C7.81556 16.876 7.43418 16.7181 7.1529 16.437L0.438524 9.68696C0.157719 9.40573 0 9.02454 0 8.62712C0 8.2297 0.157719 7.84851 0.438524 7.56728L2.31352 5.69228C2.59465 5.41233 2.97522 5.25515 3.37196 5.25515C3.7687 5.25515 4.14928 5.41233 4.4304 5.69228L8.25071 9.39728L17.322 0.437589C17.6031 0.157356 17.9839 0 18.3809 0C18.7778 0 19.1586 0.157356 19.4398 0.437589L21.3101 2.26946C21.4507 2.40885 21.5624 2.5747 21.6386 2.75745C21.7149 2.94021 21.7542 3.13625 21.7543 3.33427C21.7543 3.53229 21.7152 3.72836 21.6391 3.91118C21.5631 4.09401 21.4516 4.25996 21.311 4.39946Z"
                            fill="#2C702C" />
                    </svg>
                </span>
                <p class="text-[17px] font-bold text-[#191B19] leading-tight">
                    Оплата прошла успешна
                </p>
                <RouterLink :to="{ name: 'dashboard.home' }"
                    class="text-[15px] text-[#EEF2ED] py-[10px] min-w-[160px] bg-[#2C702C] rounded-[10px] cursor-pointer text-center font-Gilroy leading-tight">
                    На главную
                </RouterLink>
            </div>
        </div>
    </section>
</template>



<style lang="scss" scoped></style>
