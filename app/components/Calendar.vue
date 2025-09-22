<template>
  <div class="mt-4" v-if="isMounted">
    <UCalendar
      v-model="innerValue"
      :ui="calendarUI"
      class="[&_thead_th]:text-violet-600 [&_tr_th]:text-violet-600"
      @update:model-value="updateValue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const isMounted = ref(false);
const innerValue = ref(props.modelValue);

onMounted(() => {
  isMounted.value = true;
});

onUnmounted(() => {
  isMounted.value = false;
});

watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val;
  },
);

const updateValue = (val: any) => {
  emit("update:modelValue", val);
};

const calendarUI = {
  cellTrigger: `
    w-8 h-8 rounded-full
    bg-transparent
    [&:hover:not([data-selected])]:bg-violet-100 [&:hover:not([data-selected])]:text-violet-600
    [&[data-selected]]:bg-violet-500 [&[data-selected]]:text-white
    [&[data-today]:not([data-selected])]:text-violet-500 [&[data-today]:not([data-selected])]:font-bold
  `,
};
</script>
