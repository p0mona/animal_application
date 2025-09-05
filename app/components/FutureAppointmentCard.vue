<template>
  <div
    class="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 space-x-4"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ date }} - {{ time }}
      </h2>
      <p class="text-sm text-gray-500">{{ reason }}</p>
    </div>

    <BaseButton text="Odwołać"/>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  date: string | Date;
  time: string;
  reason?: string;
}>();
</script>
