<template>
  <div class="min-h-screen bg-[#77e177]">
    <div class="flex justify-center p-4 bg-[#77e177]">
      <div
        class="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          class="rounded-full hover:bg-violet-100 active:bg-violet-200 text-violet-500"
          @click="goBack"
        />

        <!-- Заголовок -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Ogłoszenie</h1>
        </div>

        <div class="w-full">
          <p class="text-sm">Wpisz imię</p>
          <UInput v-model="form.name" class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const goBack = () => {
  navigateTo("/trainer");
};

const form = reactive({
  name: "",
});
</script>
