<template>
  <UCheckbox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', !!$event)"
    class="[&_[data-state=checked]]:bg-violet-500"
    :label="label"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  label: string;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>