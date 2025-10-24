<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ title }}</h3>
    <div class="bg-gray-50 rounded-lg p-4 min-h-[80px]">
      <p class="text-gray-700 whitespace-pre-wrap">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  content: { type: String, default: "-----" },
});
</script>
