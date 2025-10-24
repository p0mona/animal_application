<template>
  <FullWidthLayout>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Pacjenci</h1>
      <NuxtLink to="/new_patient" class="mr-4">
        <BorderButton label="Dodać" />
      </NuxtLink>
    </div>

    <div class="space-y-4">
      <PatientCard
        v-for="(patient, index) in patients"
        :key="patient._id || index"
        :_id="patient._id"
        :name="patient.name"
        :breed="patient.breed"
        :image="patient.image"
        :sex="patient.sex"
        :animal="patient.animal"
        :animal_age="patient.animal_age"
        :animal_height="patient.animal_height"
        :animal_weight="patient.animal_weight"
        :chip="patient.chip"
        :owner="patient.owner"
        @view-details="openPatientModal"
      />

      <div v-if="patients.length === 0" class="text-center py-8 text-gray-500">
        <p>Brak pacjentów w bazie danych. Dodaj pierwszego pacjenta.</p>
      </div>
    </div>

    <PatientModal
      v-model:isOpen="showPatientModal"
      :patient="selectedPatient"
      @patient-deleted="handlePatientDeleted"
    />
  </FullWidthLayout>
</template>

<script setup lang="ts">
import PatientCard from "~/components/PatientCard.vue";
import PatientModal from "~/components/PatientModal.vue";
import type { PatientData } from "~/types/patientData";

const patients = ref<PatientData[]>([]);
const showPatientModal = ref(false);
const selectedPatient = ref<PatientData | null>(null);
const error = ref("");

const openPatientModal = (patient: PatientData) => {
  selectedPatient.value = patient;
  showPatientModal.value = true;
};

const handlePatientDeleted = (patientId: string) => {
  patients.value = patients.value.filter((p) => p._id !== patientId);
};

const loadPatients = async () => {
  try {
    error.value = "";

    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      return;
    }

    const response = (await $fetch("http://localhost:3001/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })) as PatientData[];

    patients.value = response;
  } catch (err: any) {
    console.error("Error loading patients:", err);
    error.value = "Błąd podczas ładowania pacjentów";
  }
};

onMounted(() => {
  loadPatients();
});

onActivated(() => {
  loadPatients();
});
</script>
