<template>
  <div class="w-full">
    <UFileUpload
      :modelValue="modelValue"
      @update:modelValue="onUpdate"
      color="neutral"
      highlight
      label="Przeciągnij zdjęcie tutaj"
      description="SVG, PNG, JPG or GIF (maks. 2MB)"
      class="w-full min-h-54"
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
  if (val instanceof File || val === null) {
    emit('update:modelValue', val);
  } else {
    console.warn('UFileUpload emitted a value that is not File or null:', val);
  }
};
</script>
