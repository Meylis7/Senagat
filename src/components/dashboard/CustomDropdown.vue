<script setup>
    import { ref, onMounted, onUnmounted, watch } from 'vue';

    const props = defineProps({
        options: {
            type: Array,
            required: true
        },
        defaultOption: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Select an option'
        },
        menuClass: {
            type: String,
            default: ''
        },
        titleClass: {
            type: String,
            default: ''
        }
    });

    const emit = defineEmits(['option-selected']);

    // Dropdown state
    const isDropdownOpen = ref(false);
    const selectedOption = ref(props.defaultOption || props.placeholder);
    const dropdownRef = ref(null);

    // Toggle dropdown
    const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value;
    };

    // Select option
    const selectOption = (option) => {
        selectedOption.value = typeof option === 'object'
            ? (option.title ?? option.name ?? option.label ?? String(option.id ?? ''))
            : option;
        isDropdownOpen.value = false;
        emit('option-selected', option);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
            isDropdownOpen.value = false;
        }
    };

    // Add and remove event listeners
    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    watch(() => props.defaultOption, (val) => {
        selectedOption.value = val || props.placeholder;
    });
    watch(() => props.options, () => {
        selectedOption.value = props.defaultOption || props.placeholder;
    });
</script>

<template>
    <div ref="dropdownRef" class="relative">
        <!-- Dropdown header -->
        <div @click="toggleDropdown"
            class="cursor-pointer py-3 px-5 rounded-[10px] bg-[#EEF2ED] flex items-center justify-between mb-1"
            :class="props.titleClass">
            <h4 class="text-[15px] text-mainBlack font-medium max-w-[80%] truncate">
                {{ selectedOption }}
            </h4>
            <span class="block w-[15px] transition-transform duration-300 ml-[5px]"
                :class="{ 'rotate-180': isDropdownOpen }">
                <svg class="w-full h-full object-contain" width="13" height="7" viewBox="0 0 13 7" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.4148 0.164088C11.4671 0.111826 11.5292 0.07037 11.5974 0.042086C11.6657 0.013802 11.7389 -0.00075636 11.8128 -0.000756363C11.8867 -0.000756366 11.9599 0.013802 12.0282 0.042086C12.0965 0.07037 12.1585 0.111826 12.2108 0.164088C12.263 0.21635 12.3045 0.278394 12.3328 0.346678C12.3611 0.414961 12.3756 0.488147 12.3756 0.562057C12.3756 0.635967 12.3611 0.709153 12.3328 0.777436C12.3045 0.84572 12.263 0.907764 12.2108 0.960026L6.58578 6.58503C6.53354 6.63733 6.4715 6.67881 6.40322 6.70712C6.33493 6.73543 6.26173 6.75 6.18781 6.75C6.11389 6.75 6.0407 6.73543 5.97241 6.70712C5.90412 6.67881 5.84208 6.63733 5.78984 6.58503L0.164844 0.960026C0.0592959 0.854479 -2.66901e-07 0.711325 -2.70484e-07 0.562057C-2.74066e-07 0.41279 0.0592958 0.269636 0.164844 0.164088C0.270392 0.0585405 0.413545 -0.000755862 0.562812 -0.000755871C0.71208 -0.000755881 0.855233 0.0585405 0.960781 0.164088L6.18781 5.39182L11.4148 0.164088Z"
                        fill="#191B19" />
                </svg>
            </span>
        </div>

        <!-- Dropdown options -->
        <!-- <div v-show="isDropdownOpen" class="py-3 px-3 rounded-[10px] bg-[#EEF2ED] flex flex-col gap-y-2 w-full z-10 
            transform origin-top transition-all duration-300 ease-in-out"
            :class="[props.menuClass, { 'opacity-100 scale-y-100': isDropdownOpen, 'opacity-0 scale-y-0': !isDropdownOpen }]">
            <h4 v-for="(option, index) in options" :key="option?.id ?? index" @click="selectOption(option)"
                class="text-[15px] text-[#6F736D] py-2 px-2 rounded border-solid border-0 border-b border-[#fff] cursor-pointer transition-all duration-300 hover:border-[#2C702C] hover:bg-[#2C702C]/5 hover:text-[#2C702C] last:border-none">
                {{ typeof option === 'object' ? (option.title ?? option.name ?? option.label ?? option.id) : option }}
            </h4>
        </div> -->


        <!-- Position absolute version -->
        <div v-show="isDropdownOpen"
            class="py-3 px-3 rounded-[10px] bg-[#EEF2ED] flex flex-col gap-y-2 w-full z-10 
            transform origin-top transition-all duration-300 ease-in-out max-h-[350px] overflow-auto shadow-md text-center"
            :class="[props.menuClass, { 'opacity-100 scale-y-100 absolute left-0 right-0 top-full mt-1': isDropdownOpen, 'opacity-0 scale-y-0': !isDropdownOpen }]">
            <h4 v-for="(option, index) in options" :key="option?.id ?? index" @click="selectOption(option)"
                class="text-[15px] text-[#6F736D] py-2 px-2 rounded border-solid border-0 border-b border-[#fff] cursor-pointer transition-all duration-300 hover:border-[#2C702C] hover:bg-[#2C702C]/5 hover:text-[#2C702C] last:border-none">
                {{ typeof option === 'object' ? (option.title ?? option.name ?? option.label ?? option.id) : option }}
            </h4>
        </div>
    </div>
</template>
