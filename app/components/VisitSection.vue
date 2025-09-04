<template>
  <div>
    <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
    <p>{{ content }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  content: { type: String, default: "-----" },
});
</script>
