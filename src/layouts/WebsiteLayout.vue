<script setup>
    import { RouterView } from 'vue-router'
    import Header from '@/components/website/Header.vue'
    import Footer from '@/components/website/Footer.vue'
    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n()
</script>

<template>
    <Header />

    <main>
        <RouterView :key="locale" />
    </main>

    <div class="fixed bottom-[15px] md:bottom-[50px] right-[15px] md:right-[50px] z-50 flex flex-col gap-[10px]">
        <a href="tel:+99312444444" class="phone-link flex items-center bg-[#2C702C] rounded-full p-[20px] gap-[10px]">
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M23.2769 18.9068C26.1639 20.0651 28.3178 21.6094 29.9516 23.4256C30.3638 26.3666 28.065 28.5227 25.9643 29.8466C20.986 30.7265 13.915 27.7855 8.06473 21.9353C2.21447 16.085 -0.726527 9.01399 0.153402 4.03573C1.47727 1.93501 3.63342 -0.363816 6.57441 0.048364C8.39062 1.68222 9.93501 3.83624 11.0934 6.72338C11.2862 7.20405 11.1759 7.75242 10.8235 8.13196C10.2455 8.7545 9.20036 9.80354 7.58835 11.1563C7.18239 11.4969 7.08345 12.0792 7.34249 12.5415C8.46782 14.5501 9.93212 16.4938 11.7191 18.2809C13.5055 20.0672 15.4515 21.5341 17.4572 22.6627C17.92 22.9231 18.5038 22.8239 18.8448 22.4167C20.1969 20.8018 21.2454 19.7556 21.8678 19.1771C22.2474 18.8243 22.796 18.7138 23.2769 18.9068Z"
                    fill="#fff" />
            </svg>

            <p class="text-[#fff] text-sm">
                +993 (12) 44-44-44
            </p>
        </a>
    </div>

    <Footer />

</template>

<style scoped>
    .phone-link {
        position: relative;
        will-change: transform;
    }

    .phone-link:hover svg {
        animation: phone-wiggle 900ms ease-in-out infinite;
        transform-origin: 50% 20%;
    }

    .phone-link::before,
    .phone-link::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
    }

    .phone-link:hover::before {
        animation: ring-pulse 1200ms ease-out infinite;
    }

    .phone-link:hover::after {
        animation: ring-pulse 1200ms ease-out infinite;
        animation-delay: 200ms;
    }

    @keyframes phone-wiggle {
        0% {
            transform: rotate(0deg);
        }

        15% {
            transform: rotate(-15deg);
        }

        30% {
            transform: rotate(12deg);
        }

        45% {
            transform: rotate(-10deg);
        }

        60% {
            transform: rotate(8deg);
        }

        75% {
            transform: rotate(-4deg);
        }

        100% {
            transform: rotate(0deg);
        }
    }

    @keyframes ring-pulse {
        0% {
            opacity: 0.6;
            transform: scale(0.8);
        }

        100% {
            opacity: 0;
            transform: scale(1.5);
        }
    }
</style>
