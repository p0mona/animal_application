<template>
  <div
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <img
      :src="image"
      class="w-full h-48 object-cover"
      style="object-position: 30% 10%"
    />
    <div class="p-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Imię: {{ name }}</h2>
      <p class="text-sm text-gray-500 mb-2">Doświadczenie: {{ experience }} lat</p>
      <p class="text-gray-700 leading-relaxed">
        {{ contact }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  image: string;
  experience: string;
  contact: string;
}>();
</script>
