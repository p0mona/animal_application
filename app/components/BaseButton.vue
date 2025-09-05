<template>
  <UButton
    type="button"
    class="md:w-auto bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
  >
    {{ label }}
  </UButton>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>