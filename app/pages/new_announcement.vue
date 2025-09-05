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
          label="Wpisz doświadczenie"
          v-model="form.experience"
          type="number"
        />
        <BaseInput label="Wpisz kontakt" v-model="form.contact" />
        <BaseInput label="Dodaj opis" v-model="form.discription" />
      </div>

      <div>
        <div class="w-full">
          <UFileUpload
            v-model="form.image"
            color="neutral"
            highlight
            label="Przeciągnij zdięcie tutaj "
            description="SVG, PNG, JPG or GIF (maks. 2MB)"
            class="w-full min-h-54"
            :dropzone="true"
          />
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
