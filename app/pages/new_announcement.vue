<template>
  <FullWidthLayout>
    <BackButton to="/trainer" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Ogłoszenie</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <div class="w-full">
          <p class="text-sm">Wpisz imię</p>
          <UInput v-model="form.name" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm">Wpisz doświadczenie</p>
          <UInput v-model="form.experience" class="w-full" type="number" />
        </div>

        <div class="w-full">
          <p class="text-sm">Wpisz kontakt</p>
          <UInput v-model="form.contact" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm">Dodaj opis</p>
          <UInput v-model="form.discription" class="w-full" />
        </div>
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
