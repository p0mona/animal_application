<template>
  <div class="min-h-screen bg-[#77e177]">
    <div class="flex justify-center p-4 bg-[#77e177]">
      <div
        class="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >
        <!-- Заголовок -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Konto</h1>
        </div>

        <!-- Mobile Navigation -->
        <div class="sm:hidden mb-6">
          <div class="flex justify-around bg-white rounded-lg p-2 shadow-sm">
            <UButton
              v-for="item in navItems"
              :key="item.key"
              :icon="item.icon"
              :color="activeTab === item.key ? undefined : 'neutral'"
              variant="ghost"
              size="lg"
              :class="[
                'rounded-full',
                activeTab === item.key
                  ? 'bg-violet-50 text-violet-500 hover:text-violet-600 hover:bg-violet-100'
                  : '',
              ]"
              @click="activeTab = item.key"
            />
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:block mb-6">
          <div class="flex space-x-2 bg-white rounded-lg p-2 shadow-sm">
            <UButton
              v-for="item in navItems"
              :key="item.key"
              :icon="item.icon"
              :label="item.label"
              :color="activeTab === item.key ? undefined : 'neutral'"
              variant="ghost"
              :class="[
                'flex items-center space-x-2 px-4 py-3',
                activeTab === item.key
                  ? 'bg-violet-50 text-violet-500 hover:text-violet-600 hover:bg-violet-100'
                  : 'hover:bg-gray-100',
              ]"
              @click="activeTab = item.key"
            />
          </div>
        </div>

        <!-- Контент вкладок -->
        <div>
          <template v-if="activeTab === 'account'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <p class="text-sm">Wpisz imię</p>
                  <UInput v-model="account.name" class="w-full" size="lg" />
                </div>

                <div>
                  <p class="text-sm">Wpisz miejsce pracy</p>
                  <UInput v-model="account.hospital" class="w-full" size="lg" />
                </div>

                <div>
                  <p class="text-sm">Płeć</p>
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
                </div>

                <div>
                  <label for="birthday" class="text-sm block"
                    >Data urodzenia</label
                  >
                  <UInput
                    id="birthday"
                    type="date"
                    v-model="account.birthday"
                    class="w-full"
                  />
                </div>
              </div>
              <div>
                <div class="w-full flex items-start">
                  <UFileUpload
                    v-model="account.image"
                    color="neutral"
                    highlight
                    label="Przeciągnij zdjęcie tutaj"
                    description="SVG, PNG, JPG or GIF (maks. 2MB)"
                    class="w-full min-h-[200px]"
                    :dropzone="true"
                  />
                </div>
              </div>
              <div>
                <UButton
                  type="button"
                  class="md:w-auto bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
                >
                  Potwierdź
                </UButton>
              </div>
            </div>
          </template>

          <!-- Пациенты -->
          <template v-if="activeTab === 'patients'">
            <div class="space-y-4">
              <PatientCard
                v-for="(patient, index) in patients"
                :key="index"
                :name="patient.name"
                :breed="patient.breed"
                :image="patient.image"
              />
            </div>
            <div class="flex justify-end">
              <UButton
                type="button"
                class="md:w-auto bg-violet-500 hover:bg-violet-600 active:bg-violet-700 mt-6 mr-4"
              >
                Dodać
              </UButton>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";
import PatientCard from "~/components/PatientCard.vue";

const activeTab = ref("account");

const navItems = [
  { key: "account", label: "Profil", icon: "i-heroicons-user" },
  { key: "patients", label: "Pacienci", icon: "heroicons:identification" },
];

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const account = reactive({
  name: "",
  birthday: "",
  sex: "K",
  hospital: "",
  image: null as File | null,
});

const patients = [
  {
    name: "Agata",
    breed: "Pudel",
    image: "/images/parrot-article3.jpg",
  },
  {
    name: "Burek",
    breed: "Labrador",
    image: "/images/dog-article1.jpg",
  },
  {
    name: "Mila",
    breed: "Kot Perski",
    image: "/images/cat-article2.jpg",
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
