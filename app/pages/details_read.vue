<template>
  <FullWidthLayout>
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
      <h3 class="text-sm font-semibold text-gray-900">Podstawowa informacja</h3>
      <p>Imie: -----</p>
      <p>Rasa: -----</p>
      <p>Płeć: -----</p>
      <p>Wiek: -----</p>
      <p>Właściciel: -----</p>
      <p>Kontakt: -----</p>
    </div>

    <InfoSection title="Objawy" :content="visit?.symptoms || '-----'" />
    <InfoSection title="Badanie" :content="visit?.exam || '-----'" />
    <InfoSection title="Badanie" :content="visit?.diagnosis || '-----'" />
    <InfoSection title="Plan leczenia" :content="visit?.treatment || '-----'" />
    <InfoSection title="Polecenia" :content="visit?.advice || '-----'" />
    <InfoSection title="Dodatkowe uwagi" :content="visit?.notes || '-----'" />

    <NuxtLink to="/details_write">
      <UButton>write</UButton>
    </NuxtLink>
  </FullWidthLayout>
</template>

<script setup>
import { NuxtLink, UButton } from "#components";

const goBack = () => {
  navigateTo("/patient");
};
</script>
