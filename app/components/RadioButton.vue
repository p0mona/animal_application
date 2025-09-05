<template>
  <URadioGroup
    :model-value="localForm"
    orientation="horizontal"
    variant="list"
    :items="items"
    :ui="{
      base: 'ui-radio',
      container: 'w-full',
      indicator: 'bg-violet-500',
      label: 'ui-label',
      description: 'ui-description',
    }"
    class="w-full mt-2"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '#ui/types'

const props = defineProps<{
  modelValue: RadioGroupItem | null
  items?: RadioGroupItem[]
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: RadioGroupItem | null): void
}>()

const localForm = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    localForm.value = val
  }
)

function onUpdate(val: RadioGroupItem) {
  localForm.value = val
  emit("update:modelValue", val)
}
</script>
