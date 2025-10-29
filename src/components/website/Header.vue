<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';

import logo from "@/assets/images/logo.png";

// Get current route
const route = useRoute();

// Check if current page is a detail page
const isDetailPage = computed(() => {
    const detailPages = ['cards-detail', 'loans-detail', 'deposits-detail', 'about'];
    return detailPages.includes(route.name);
});

const activeTab = ref(null);
const navRef = ref(null);
const contentRef = ref(null);
const headerRef = ref(null);
const isSticky = ref(false);
const spacerHeight = ref(0);

function setTab(tabKey) {
    activeTab.value = activeTab.value === tabKey ? null : tabKey;
}

function handleClickOutside(event) {
    const navEl = navRef.value;
    const contentEl = contentRef.value;
    const target = event.target;
    if (!navEl || !contentEl) return;
    const clickedInsideNav = navEl.contains(target);
    const clickedInsideContent = contentEl.contains(target);
    if (!clickedInsideNav && !clickedInsideContent) {
        activeTab.value = null;
    }
}

function updateHeights() {
    const el = headerRef.value;
    spacerHeight.value = el ? el.offsetHeight : 0;
}

function handleScroll() {
    isSticky.value = window.scrollY > 800;
    if (activeTab.value) {
        activeTab.value = null;
    }
}

onMounted(async () => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateHeights);
    await nextTick();
    updateHeights();
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateHeights);
});

// Close any open tab whenever the route changes
watch(
    () => route.fullPath,
    () => {
        activeTab.value = null;
    }
);
</script>

<template>
    <!-- <div :style="{ height: isSticky ? spacerHeight + 'px' : 'auto' }"></div> -->
    <header ref="headerRef" :class="[
        'top-0 left- w-full z-50 transition-all duration-700 ease-out',
        isSticky ? 'fixed -translate-y-3' : 'absolute translate-y-0'
    ]">
        <div class="auto_container">
            <div :class="[
                'header_inner flex items-center rounded-[20px] py-5 px-8 transition-all duration-500 ease-out',
                !isDetailPage ? 'bg-[#F7F8F6]' : '',
                isSticky ? 'mt-3 rounded-[14px] py-3 shadow-lg bg-[#F7F8F6]' : ''
            ]">
                <RouterLink to="/" class="block w-[46px] min-w-[46px] shrink-0 mr-10">
                    <img :src="logo" class="block w-full h-auto object-contain" alt="logo">
                </RouterLink>

                <nav ref="navRef" class="w-full">
                    <div class="flex items-center gap-[34px]">
                        <h4 :class="[
                            'nav-tab cursor-pointer select-none font-Gilroy text-[17px] font-normal',
                            isDetailPage && !isSticky ? 'text-[#F7F8F6]' : 'text-[#191B19]',
                            activeTab === 'one' ? 'after:contents' : ' !after:hidden'
                        ]" @click="setTab('one')">
                            Частным лицам</h4>

                        <h4 :class="[
                            'nav-tab cursor-pointer select-none font-Gilroy text-[17px] font-normal',
                            isDetailPage && !isSticky ? 'text-[#F7F8F6]' : 'text-[#191B19]',
                            activeTab === 'two' ? 'after:contents' : ' !after:hidden'
                        ]" @click="setTab('two')">
                            Бизнес и ИП</h4>

                        <RouterLink to="/about" :class="[
                            'font-Gilroy text-[17px] font-normal',
                            isDetailPage && !isSticky ? 'text-[#F7F8F6]' : 'text-[#191B19]'
                        ]">О банке
                        </RouterLink>

                        <div class="flex items-center ml-auto gap-x-2">
                            <RouterLink to="/" :class="[
                                'block text-sm font-bold border-solid border-[1px] rounded-[10px] px-5 py-[14px]',
                                isDetailPage && !isSticky ? 'text-[#F7F8F6] border-[#F7F8F6]' : 'text-[#1D2417] border-[#1D2417]'
                            ]">
                                Онлайн приёмная
                            </RouterLink>

                            <RouterLink to="/"
                                class="block text-sm font-bold text-white bg-[#2C702C] rounded-[10px] px-5 py-[14px]">
                                Интернет банк
                            </RouterLink>
                        </div>
                    </div>
                </nav>
            </div>
            <div ref="contentRef">
                <Transition v-if="activeTab" name="fade-slide" mode="out-in"
                    class="tab-content absolute w-[calc(100%-60px)] bg-[#F7F8F6] py-8 px-[118px] rounded-[20px]">
                    <section v-if="activeTab === 'one'" key="one" class="flex justify-between">
                        <div class="block w-[calc(25%-24px)]">
                            <RouterLink to="/loans" class="block text-[17px] font-bold mb-[22px]">Кредиты</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/loans-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Молодым семьям</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/loans-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Потребительский</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Свадьбы и день рожления</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        На образование</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Овердрафт</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Сельскохозяйственный</RouterLink>
                                </li>

                            </ul>
                        </div>

                        <div class="block w-[calc(25%-24px)]">
                            <RouterLink to="/cards" class="block text-[17px] font-bold mb-[22px]">Карты</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/cards-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Алтын асыр карта</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/cards-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Гоюм карта</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/cards-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Машгала карта</RouterLink>
                                </li>
                            </ul>
                        </div>

                        <div class="block w-[calc(25%-24px)]">
                            <RouterLink to="/deposits" class="block text-[17px] font-bold mb-[22px]">Вклады</RouterLink>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Целевой вклад на детей</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        забота о родителях</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Здоровье народа - Богатство страны</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/deposits-detail"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Дети наши будущее</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Выгодный</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Вклад до востребования</RouterLink>
                                </li>

                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Вклад по банковской карте «Алтын Асыр»</RouterLink>
                                </li>

                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Вклад по банковской карте «Гоюм»</RouterLink>
                                </li>

                            </ul>
                        </div>

                        <div class="block w-[calc(25%-24px)]">
                            <RouterLink to="/services" class="block text-[17px] font-bold mb-[22px]">Сервисы и услуги
                            </RouterLink>
                            <!-- <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Молодым семьям</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Потребительский</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Свадьбы и день рожления</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        На образование</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Овердрафт</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Сельскохозяйственный</RouterLink>
                                </li>

                            </ul> -->
                        </div>
                    </section>
                    <section v-else-if="activeTab === 'two'" key="two" class="flex gap-x-8">
                        <div class="block w-[calc33.33%-32px)]">
                            <h4 class="text-[17px] font-bold mb-[22px]">Кредиты</h4>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Государственные предприятия</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Финансирование общественных объектов</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Для производственных целей</RouterLink>
                                </li>
                            </ul>
                        </div>

                        <div class="block w-[calc33.33%-32px)]">
                            <h4 class="text-[17px] font-bold mb-[22px]">Вклады</h4>
                            <ul class="flex flex-col gap-y-[22px]">
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Целевой вклад на детей</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        забота о родителях</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/"
                                        class="text-[17px] font-normal text-[#6F736D] hover:text-[#2C702C] font-Gilroy transition-all">
                                        Здоровье народа - Богатство страны</RouterLink>
                                </li>
                            </ul>
                        </div>
                    </section>
                </Transition>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.nav-tab {
    position: relative;

    &::after {
        position: absolute;
        display: block;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #6F736D;
    }
}
</style>
