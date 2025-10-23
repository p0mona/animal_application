<template>
  <USelectMenu
    v-bind="$attrs"
    :items="items"
    :placeholder="placeholder"
    :loading="loading"
    v-model="modelValue"
    class="w-full"
  />
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