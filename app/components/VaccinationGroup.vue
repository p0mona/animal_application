<template>
  <div class="bg-white p-4 space-y-2">
    <h3 class="text-base font-semibold mb-2">{{ title }}</h3>
    <UCheckbox
      v-for="vaccine in vaccines"
      :key="vaccine.key"
      v-model="model[vaccine.key]"
      class="[&_[data-state=checked]]:bg-violet-500"
      :label="vaccine.label"
    />
  </div>
</template>

<script setup lang="ts">
interface Vaccine {
  key: string;
  label: string;
}

const props = defineProps<{
  title: string;
  vaccines: Vaccine[];
  model: Record<string, boolean>;
}>();
</script>
