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
        :key="patient._id || index"
        :name="patient.name"
        :breed="patient.breed"
        :image="patient.image || '/images/example-photo.jpg'"
        :sex="patient.sex"
      />
      
      <div v-if="patients.length === 0" class="text-center py-8 text-gray-500">
        <p>Brak pacjentów w bazie danych. Dodaj pierwszego pacjenta.</p>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import PatientCard from "~/components/PatientCard.vue";

interface Patient {
  _id: string;
  name: string;
  breed: string;
  image: string;
  sex: string;
  animal?: string;
  animal_age?: string;
  animal_height?: string;
  animal_weight?: string;
  chip?: string;
  owner?: {
    name: string;
    birthday: string;
    sex: string;
    phone: string;
    image?: string;
  };
}

const patients = ref<Patient[]>([]);
const error = ref("");

const loadPatients = async () => {
  try {
    error.value = "";
    
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      return;
    }

    const response = await $fetch('http://localhost:3001/patients', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as Patient[];
    
    patients.value = response;
    
  } catch (err: any) {
    console.error('Error loading patients:', err);
    error.value = 'Błąd podczas ładowania pacjentów';
  }
};

onMounted(() => {
  loadPatients();
});

onActivated(() => {
  loadPatients();
});
</script>