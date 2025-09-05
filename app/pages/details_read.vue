<template>
  <FullWidthLayout>
    <BackButton to="/patient" />

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

    <VisitSection title="Objawy" :content="visit?.symptoms || '-----'" />
    <VisitSection title="Badanie" :content="visit?.exam || '-----'" />
    <VisitSection title="Badanie" :content="visit?.diagnosis || '-----'" />
    <VisitSection
      title="Plan leczenia"
      :content="visit?.treatment || '-----'"
    />
    <VisitSection title="Polecenia" :content="visit?.advice || '-----'" />
    <VisitSection title="Dodatkowe uwagi" :content="visit?.notes || '-----'" />

    <NuxtLink to="/details_write">
      <BaseButton label="Write version"/>
    </NuxtLink>
  </FullWidthLayout>
</template>

<script setup>
import { NuxtLink } from "#components";
</script>
