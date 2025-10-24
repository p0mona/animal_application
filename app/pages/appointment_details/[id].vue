<template>
  <FullWidthLayout>
    <BackButton to="/patients_settings" />

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Szczegóły wizyty</h1>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-500">Ładowanie danych wizyty...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
    </div>

    <div v-else-if="appointment">
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Informacje o wizycie
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Data</p>
            <p class="text-gray-900">{{ formatDate(appointment.date) }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Godzina</p>
            <p class="text-gray-900">{{ appointment.time || '-----' }}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-500">Powód wizyty</p>
          <p class="text-gray-900">{{ appointment.reason || '-----' }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6" v-if="appointment.patient_id && typeof appointment.patient_id === 'object'">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Informacje o pacjencie
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Imię</p>
            <p class="text-gray-900">{{ appointment.patient_id.name || '-----' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Rasa</p>
            <p class="text-gray-900">{{ getBreedDisplayName(appointment.patient_id) || '-----' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Gatunek</p>
            <p class="text-gray-900">{{ getAnimalTypeName(appointment.patient_id.animal) || '-----' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Wiek</p>
            <p class="text-gray-900">{{ appointment.patient_id.animal_age || '-----' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6" v-if="appointment.patient_id && typeof appointment.patient_id === 'object' && appointment.patient_id.owner">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Informacje o właścicielu
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Imię</p>
            <p class="text-gray-900">{{ appointment.patient_id.owner.name || '-----' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Kontakt</p>
            <p class="text-gray-900">{{ appointment.patient_id.owner.phone || '-----' }}</p>
          </div>
        </div>
      </div>

      <VisitSection 
        title="Objawy" 
        :content="appointment.symptoms || 'Brak informacji'" 
      />
      <VisitSection 
        title="Badanie" 
        :content="appointment.exam || 'Brak informacji'" 
      />
      <VisitSection 
        title="Diagnoza" 
        :content="appointment.diagnosis || 'Brak informacji'" 
      />
      <VisitSection 
        title="Plan leczenia" 
        :content="appointment.treatment || 'Brak informacji'" 
      />
      <VisitSection 
        title="Polecenia" 
        :content="appointment.advice || 'Brak informacji'" 
      />
      <VisitSection 
        title="Dodatkowe uwagi" 
        :content="appointment.notes || 'Brak informacji'" 
      />

      <div class="flex justify-end space-x-3 mt-8" v-if="canEdit">
        <BaseButton
          label="Edytuj szczegóły wizyty"
          @click="editAppointmentDetails"
        />
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-500">Nie znaleziono danych wizyty</p>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import type { Appointment } from '~/types/appointments';

const route = useRoute();
const appointmentId = route.params.id as string;

const appointment = ref<Appointment | null>(null);
const loading = ref(true);
const error = ref('');

const canEdit = computed(() => {
  if (!appointment.value?.date) return false;
  
  const appointmentDate = new Date(appointment.value.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return appointmentDate >= today && appointment.value.status === 'scheduled';
});

const loadAppointment = async () => {
  try {
    loading.value = true;
    error.value = '';
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      return;
    }

    console.log('Loading appointment with ID:', appointmentId);

    const response = await $fetch<Appointment>(`http://localhost:3001/appointments/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Appointment loaded:', response);
    appointment.value = response;
    
  } catch (err: any) {
    console.error("Error loading appointment:", err);
    error.value = "Błąd podczas ładowania danych wizyty";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-----';
  return new Date(dateString).toLocaleDateString('pl-PL');
};

const getBreedDisplayName = (patient: any) => {
  if (!patient?.breed) return '-----';
  return patient.breed;
};

const getAnimalTypeName = (animalType: string | undefined) => {
  if (!animalType) return '-----';
  const types: { [key: string]: string } = {
    dog: 'Pies',
    cat: 'Kot',
  };
  return types[animalType] || animalType;
};

const editAppointmentDetails = () => {
  navigateTo(`/edit_appointment_details/${appointmentId}`);
};

onMounted(() => {
  loadAppointment();
});
</script>