<template>
  <FullWidthLayout>
    <BackButton to="/trainer" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Ogłoszenie</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <BaseInput label="Wpisz imię" v-model="form.name" />
        <BaseInput
          label="Doświadczenie (w latach)"
          v-model="form.experience"
          type="number"
        />
        <BaseInput label="Wpisz kontakt" v-model="form.contact" />
        <BaseInput label="Dodaj opis" v-model="form.description" />
      </div>

      <div>
        <FileUpload v-model="form.image" class="mt-4" />
        <div class="flex justify-end mt-4">
          <BaseButton label="Dodaj"/>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
const form = reactive({
  name: "",
  experience: "",
  contact: "",
  image: null as File | null,
  discription: "",
});
</script>
