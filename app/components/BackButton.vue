<template>
  <UButton
    icon="i-heroicons-arrow-left"
    variant="ghost"
    color="neutral"
    class="rounded-full hover:bg-violet-100 active:bg-violet-200 text-violet-500"
    @click="goBack"
  />
</template>

<script setup>
import { UButton } from "#components";
import { defineProps } from "vue";

const props = defineProps({
  to: { type: String, required: true }
});

const goBack = () => {
  navigateTo(props.to);
};
</script>
