<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">QR</h2>
    </template>
    <div class="w-full flex flex-col items-center">
      <img src="/images/qr.svg" class="mb-4" />
      <dev class="space-x-4">
        <BaseButton label="Generuj QR" />
        <UButton
          type="button"
          class="md:w-auto border border-violet-500 bg-white text-violet-500 hover:border-violet-600 active:border-violet-700 hover:text-violet-600 active:text-violet-700 hover:bg-white active:bg-white cursor-pointer"
        >
          Pobrać
        </UButton>
      </dev>
    </div>
  </UCard>
</template>
<script setup lang="ts"></script>
