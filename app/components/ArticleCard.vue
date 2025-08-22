<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <img :src="image" class="w-full h-48 object-cover" />
    <div class="p-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {{ author }} • {{ date }}
      </p>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ excerpt }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
}>();
</script>
