<template>
  <div>
    <!-- Mobile Navigation -->
    <div class="sm:hidden mb-6">
      <div class="flex justify-around bg-white rounded-lg p-2 shadow-sm">
        <UButton
          v-for="item in items"
          :key="item.key"
          :icon="item.icon"
          :color="modelValue === item.key ? undefined : 'neutral'"
          variant="ghost"
          size="lg"
          :class="[
            'rounded-full',
            modelValue === item.key
              ? 'bg-violet-50 text-violet-500 hover:text-violet-600 hover:bg-violet-100 active:bg-violet-200'
              : '',
          ]"
          @click="$emit('update:modelValue', item.key)"
        />
      </div>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden sm:block mb-6">
      <div
        class="flex space-x-2 bg-white rounded-lg p-2 shadow-sm overflow-x-auto"
      >
        <UButton
          v-for="item in items"
          :key="item.key"
          :icon="item.icon"
          :label="item.label"
          :color="modelValue === item.key ? undefined : 'neutral'"
          variant="ghost"
          :class="[
            'flex items-center space-x-2 px-4 py-3',
            modelValue === item.key
              ? 'bg-violet-50 text-violet-500 hover:text-violet-600 hover:bg-violet-100 active:bg-violet-200'
              : 'hover:bg-gray-100',
          ]"
          @click="$emit('update:modelValue', item.key)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, required: true },
});

defineEmits(["update:modelValue"]);
</script>
