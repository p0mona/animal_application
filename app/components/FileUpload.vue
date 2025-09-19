<template>
  <div class="w-full">
    <UFileUpload
      :modelValue="modelValue"
      @update:modelValue="onUpdate"
      color="neutral"
      highlight
      label="Przeciągnij zdjęcie tutaj"
      description="SVG, PNG, JPG or GIF (maks. 2MB)"
      class="w-full min-h-50"
      :dropzone="true"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: File | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: File | null): void;
}>();

const onUpdate = (val: unknown) => {
  emit("update:modelValue", val instanceof File ? val : null);
};
</script>
