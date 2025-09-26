<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      :class="notificationClass"
      class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <p class="text-sm font-medium">{{ message }}</p>
        </div>
        <button
          @click="close"
          class="ml-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

interface Props {
  message: string;
  type: "success" | "error";
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);

const notificationClass = computed(() => {
  return {
    success: "bg-green-50 border border-green-200 text-green-800",
    error: "bg-red-50 border border-red-200 text-red-800",
  }[props.type];
});

let timeoutId: NodeJS.Timeout | null = null;

const show = () => {
  visible.value = true;

  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
};

const close = () => {
  visible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  emit("close");
};

watch(
  () => props.message,
  () => {
    if (props.message) {
      show();
    }
  },
);

onMounted(() => {
  if (props.message) {
    show();
  }
});

import { onUnmounted } from "vue";
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
