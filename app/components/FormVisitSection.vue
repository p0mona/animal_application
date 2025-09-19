<template>
  <div class="space-y-2">
    <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
    <div class="w-full">
      <UInput
        :value="modelValue"
        @input="$emit('update:modelValue', $event)"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  title: { type: String, required: true },
  modelValue: { type: [String, Number], default: "" },
});
</script>
