<template>
  <div class="w-full">
    <label v-if="id" :for="id" class="text-sm mb-2 block">{{ label }}</label>
    <p v-else class="text-sm">{{ label }}</p>

    <UInput
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event)"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  modelValue: string | number;
  type?: string;
  id?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
