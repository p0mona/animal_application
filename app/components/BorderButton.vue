<template>
  <UButton
    type="button"
    class="md:w-auto border border-violet-500 bg-white text-violet-500 hover:border-violet-600 active:border-violet-700 hover:text-violet-600 active:text-violet-700 hover:bg-white active:bg-white cursor-pointer aria-disabled:bg-white aria-disabled:border-violet-600"
  >
    {{ label }}
  </UButton>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>
