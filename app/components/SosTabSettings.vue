<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">SOS</h2>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <BaseInput label="Wpisz numer komórkowy" v-model="localForm.phone" />
        <div class="flex justify-end mt-2">
          <BaseButton label="Zatwierdź" />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const localForm = reactive({
  phone: "",
});
</script>
