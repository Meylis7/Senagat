<script setup>
import Breadcrumb from '@/components/website/Breadcrumb.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import apiService from '@/services/apiService'

const { t } = useI18n()
const route = useRoute()
const awardId = computed(() => route.params?.id || route.query?.id)

const award = ref(null)
const loading = ref(false)
const error = ref(null)

const breadcrumbItems = computed(() => {
  const currentTitle = award.value?.title || ''
  return [
    { label: t('breadcrumb.home'), path: '/' },
    { label: currentTitle },
  ]
})

const fetchAwardDetail = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.fetchAwardDetail(awardId.value)
    const data = response?.data || response
    if (data && !Array.isArray(data)) {
      award.value = data
    } else {
      award.value = null
      error.value = 'Award not found'
    }
  } catch (e) {
    error.value = e.message || 'Failed to load award'
    award.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (awardId.value) fetchAwardDetail()
})

watch(awardId, (val, oldVal) => {
  if (val && val !== oldVal) fetchAwardDetail()
})
</script>

<template>
  <!-- Breadcrumb ======================================================== -->
  <section class="crumb pt-[145px]">
    <div class="auto_container">
      <div class="wrap">
        <div class="flex items-center gap-x-2">
          <Breadcrumb :items="breadcrumbItems" />
        </div>
      </div>
    </div>
  </section>

  <!-- Award detail ======================================================= -->
  <section class="pt-[60px] pb-[120px]">
    <div class="auto_container">
      <div class="wrap">
        <div class="block w-full">
          <h1 class="text-[38px] font-bold mb-2 leading-snug">
            {{ award?.title || (loading ? '...' : '') }}
          </h1>
          <p v-if="award?.sub_title" class="text-[#6F736D] text-[15px] mb-8">
            {{ award.sub_title }}
          </p>

          <span v-if="award?.image_url" class="block w-full h-full h-[300px] rounded-2xl overflow-hidden mb-5">
            <img :src="award.image_url" class="w-full h-full block object-contain" :alt="award?.title || 'award-image'">
          </span>

          <div v-if="error" class="text-red-600 text-[15px] mb-4">{{ error }}</div>
          <div v-if="award?.description" class="text-[17px] font-Gilroy leading-7" v-html="award.description"></div>

          <div v-if="award?.description_images && award.description_images.length" class="grid grid-cols-12 gap-4 mt-6">
            <span v-for="(img, idx) in award.description_images" :key="idx" class="col-span-4 block">
              <img :src="img" class="block w-full h-auto object-cover rounded-2xl" alt="award-image">
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>