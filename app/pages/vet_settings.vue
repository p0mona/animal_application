<template>
  <FullWidthLayout>
    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Konto</h1>
    </div>

    <Navigation :items="navItems" v-model="activeTab" />

    <!-- Profil -->
    <div>
      <div v-if="activeTab === 'account'">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900">Profil</h2>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Левая колонка -->
            <div class="space-y-4">
              <UFormGroup label="Name" name="name">
                <p class="text-sm mb-2">Imię</p>
                <UInput v-model="account.name" type="text" class="w-full" />
              </UFormGroup>

              <UFormGroup label="hospital" name="hospital">
                <p class="text-sm mb-2 mt-2">Miejsce pracy</p>
                <UInput v-model="account.hospital" type="text" class="w-full" />
              </UFormGroup>

              <URadioGroup
                v-model="account.sex"
                orientation="horizontal"
                variant="list"
                :items="sex"
                :ui="{
                  base: 'ui-radio',
                  container: 'w-full',
                  indicator: 'bg-violet-500',
                  label: 'ui-label',
                  description: 'ui-description',
                }"
              />

              <UFormGroup label="Birthday" name="birthday">
                <p class="text-sm mb-2">Data urodzenia</p>
                <UInput
                  id="birthday"
                  type="date"
                  v-model="account.birthday"
                  class="w-full"
                />
              </UFormGroup>

              <div class="flex justify-start mt-4">
                <UButton
                  type="button"
                  class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
                >
                  Zapisz zmiany
                </UButton>
              </div>
            </div>

            <!-- Правая колонка: фото -->
            <div class="flex justify-center items-start">
              <div class="relative w-56 h-56 group cursor-pointer">
                <img
                  src="/images/vet.jpg"
                  class="w-full h-full object-cover rounded-2xl transition duration-300 group-hover:brightness-75"
                />

                <!-- Overlay текст -->
                <div
                  class="absolute inset-0 flex items-center justify-center text-sm text-white font-semibold text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  Zmień zdjęcie
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Пациенты -->
      <template v-if="activeTab === 'patients'">
        <div class="space-y-4">
          <PatientCard
            v-for="(patient, index) in patients"
            :key="index"
            :name="patient.name"
            :breed="patient.breed"
            :image="patient.image"
            :sex="patient.sex"
          />
        </div>
        <div class="flex justify-end">
          <NuxtLink to="/new_patient">
            <UButton
              type="button"
              class="md:w-auto bg-violet-500 hover:bg-violet-600 active:bg-violet-700 mt-6 mr-4"
            >
              Dodać
            </UButton>
          </NuxtLink>
        </div>
      </template>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";
import PatientCard from "~/components/PatientCard.vue";

const activeTab = ref("account");

const navItems = [
  { key: "account", label: "Profil", icon: "i-heroicons-user" },
  { key: "patients", label: "Pacjenci", icon: "heroicons:identification" },
];

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const account = ref({
  name: "Beata",
  sex: "K",
  birthday: "",
  hospital: "",
});

const patients = [
  {
    name: "Agata",
    breed: "Pudel",
    image: "/images/parrot-article3.jpg",
    sex: "Samica",
  },
  {
    name: "Burek",
    breed: "Labrador",
    image: "/images/dog-article1.jpg",
    sex: "Samiec",
  },
  {
    name: "Mila",
    breed: "Kot Perski",
    image: "/images/cat-article2.jpg",
    sex: "Samica",
  },
];
</script>

<style scoped>
:deep(.ui-button) {
  transition: all 0.2s ease-in-out;
}

:deep(.ui-button):hover {
  transform: translateY(-1px);
}
</style>
