<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <!-- Select -->
    <USelectMenu
      v-bind="$attrs"
      :items="items"
      :placeholder="placeholder"
      :loading="loading"
      v-model="modelValue"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import type { SelectMenuItem } from '#ui/types'

const props = defineProps({
  modelValue: [String, Number, Object, Array] as PropType<any>,
  items: {
    type: Array as PropType<SelectMenuItem[]>,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '-'
  },
  loading: Boolean,
  type: {
    type: String as PropType<'select' | 'menu'>,
    default: 'select'
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: any) => emit('update:modelValue', value)
})
</script>