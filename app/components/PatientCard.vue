<template>
  <div
    class="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 space-x-4"
  >
    <!-- Фото слева -->
    <img :src="image" class="w-24 h-24 object-cover rounded-lg flex-shrink-0" />

    <!-- Текст посередине -->
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-900">{{ name }}</h2>
      <p class="text-sm text-gray-500">{{ breed }}</p>
    </div>

    <!-- Кнопка справа -->
    <NuxtLink to="/patient">
      <UButton
        type="button"
        class="md:w-auto bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
      >
        Przejdź
      </UButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";

defineProps<{
  name: string;
  breed: string;
  image: string;
}>();
</script>
