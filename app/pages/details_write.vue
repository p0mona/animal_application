<template>
  <div class="min-h-screen bg-[#77e177]">
    <div class="flex justify-center p-4 bg-[#77e177]">
      <div
        class="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >
        <!-- Заголовок -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Podsumowanie wizyty</h1>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900">
            Podstawowa informacja
          </h3>

          <div class="w-full">
            <p class="text-sm">Imie</p>
            <UInput v-model="form.name" class="w-full" />
          </div>

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

          <div class="w-full">
            <p class="text-sm">Wpisz wiek</p>
            <UInput v-model="form.age" type="number" class="w-full" />
          </div>

          <div class="w-full">
            <p class="text-sm">Właściciel</p>
            <UInput v-model="form.owner" class="w-full" />
          </div>
          <div class="w-full">
            <p class="text-sm">Kontakt</p>
            <UInput v-model="form.contact" class="w-full" />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900">Objawy</h3>
          <div class="w-full">
            <UInput v-model="form.symptoms" class="w-full" />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900">Badanie</h3>
          <div class="w-full">
            <UInput v-model="form.tests" class="w-full" />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900">Diagnoza</h3>
          <div class="w-full">
            <UInput v-model="form.diagnosis" class="w-full" />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900">Plan leczenia</h3>
          <div class="w-full">
            <UInput v-model="form.treatment" class="w-full" />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900">Polecenia</h3>
          <div class="w-full">
            <UInput v-model="form.advice" class="w-full" />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900">Dodatkowe uwagi</h3>
          <div class="w-full">
            <UInput v-model="form.notes" class="w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
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
