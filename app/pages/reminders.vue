<template>
  <FullWidthLayout>
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900">Przypomnienia</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="mt-4">
          <Calendar />
        </div>
        <div class="space-y-2 mt-4 ml-4">
          <h5 class="font-semibold">Najbliższe szczepienie:</h5>
          <p>Termin: -----</p>
          <p>Przychodnia: -----</p>
          <p>Nazwa szczepienia: -----</p>

          <h5 class="font-semibold">Najbliższa terapia przeciwpasożytnicza:</h5>
          <p>Termin: -----</p>
          <p>Lek: -----</p>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import Calendar from "~/components/Calendar.vue";
</script>
