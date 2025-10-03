<template>
  <div
    class="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 space-x-4"
  >
    <!-- Фото слева -->
    <img 
      :src="getImageUrl(image)" 
      :alt="name"
      class="w-24 h-24 object-cover rounded-lg flex-shrink-0" 
      @error="handleImageError"
    />

    <!-- Текст посередине -->
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-900">{{ name }}</h2>
      <p class="text-sm text-gray-500">{{ breed }} - {{ getSexLabel(sex) }}</p>
    </div>

    <!-- Кнопка справа -->
    <NuxtLink to="/patient">
      <BaseButton label="Przejdź" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";

defineProps<{
  name: string;
  breed: string;
  image: string;
  sex: string;
}>();

const getImageUrl = (imagePath: string) => {
  if (!imagePath || imagePath === '/images/example-photo.jpg') {
    return '/images/example-photo.jpg';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:3001${imagePath}`;
  }
  
  if (!imagePath.startsWith('/')) {
    return `http://localhost:3001/uploads/${imagePath}`;
  }
  
  return imagePath;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/images/example-photo.jpg';
};

const getSexLabel = (sex: string) => {
  return sex === 'K' ? 'Samica' : 'Samiec';
};
</script>