<template>
  <FullWidthLayout>
    <!-- Заголовок и кнопка добавления -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Pacjenci</h1>
      <NuxtLink to="/new_patient" class="mr-4">
        <BorderButton label="Dodać" />
      </NuxtLink>
    </div>

    <!-- Список пациентов -->
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
  </FullWidthLayout>
</template>

<script setup lang="ts">
import PatientCard from "~/components/PatientCard.vue";

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