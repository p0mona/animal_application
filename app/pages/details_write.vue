<template>
  <FullWidthLayout>
    <BackButton to="/patient" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Podsumowanie wizyty</h1>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-gray-900 mb-4">Podstawowa informacja</h3>

      <BaseInput label="Imię" v-model="form.name" />

      <div class="w-full">
        <p class="text-sm">Rasa</p>
        <USelectMenu placeholder="-" :items="breeds" class="w-full" />
      </div>

      <div class="w-full mt-4 mb-4">
        <p class="text-sm">Płeć</p>
        <URadioGroup
          v-model="form.animal_sex"
          orientation="horizontal"
          variant="list"
          :items="animal_sex"
          :ui="{
            base: 'ui-radio',
            container: 'w-full',
            indicator: 'bg-violet-500',
            label: 'ui-label',
            description: 'ui-description',
          }"
          class="w-full mt-2"
        />
      </div>

      <BaseInput label="Wpisz wiek" v-model="form.age" type="number" />
      <BaseInput label="Właściciel" v-model="form.owner" />
      <BaseInput label="Kontakt" v-model="form.contact" />
    </div>

    <FormVisitSection title="Objawy" v-model="form.symptoms" />
    <FormVisitSection title="Badanie" v-model="form.tests" />
    <FormVisitSection title="Diagnoza" v-model="form.diagnosis" />
    <FormVisitSection title="Plan leczenia" v-model="form.treatment" />
    <FormVisitSection title="Polecenia" v-model="form.advice" />
    <FormVisitSection title="Dodatkowe uwagi" v-model="form.notes" />
  </FullWidthLayout>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";

const animal_sex = ref<RadioGroupItem[]>([
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
]);

const form = reactive({
  animal_sex: "K",
  name: "",
  breed: "",
  age: "",
  owner: "",
  contact: "",
  symptoms: "",
  tests: "",
  diagnosis: "",
  treatment: "",
  advice: "",
  notes: "",
});

const breeds = ref(["Akita Inu", "Beagle", "Szpic"]);
</script>
