<template>
  <Layout>
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        class="rounded-full hover:bg-violet-100 active:bg-violet-200 text-violet-500"
        @click="goBack"
      />

      <!-- Заголовок -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Szczególy wizyty</h1>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900">
          Podstawowa informacja
        </h3>
        <p>Imie: -----</p>
        <p>Rasa: -----</p>
        <p>Płeć: -----</p>
        <p>Wiek: -----</p>
        <p>Właściciel: -----</p>
        <p>Kontakt: -----</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900">Objawy</h3>
        <p>-----</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900">Badanie</h3>
        <p>-----</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900">Diagnoza</h3>
        <p>-----</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900">Plan leczenia</h3>
        <p>-----</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900">Polecenia</h3>
        <p>-----</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900">Dodatkowe uwagi</h3>
        <p>-----</p>
      </div>

      <NuxtLink to="/details_write">
        <UButton>write</UButton>
      </NuxtLink>
    </div>
  </Layout>
</template>

<script setup>
import { NuxtLink, UButton } from "#components";

const goBack = () => {
  navigateTo("/patient");
};
</script>
