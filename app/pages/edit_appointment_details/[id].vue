<template>
  <FullWidthLayout>
    <BackButton to="/patients_settings" />

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Edytuj szczegóły wizyty</h1>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
      ></div>
      <p class="mt-4 text-gray-500">Ładowanie danych wizyty...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      {{ error }}
    </div>

    <div v-else-if="appointment" class="space-y-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
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
              <p class="text-gray-900">{{ appointment.time || "-----" }}</p>
            </div>
          </div>
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-500">Powód wizyty</p>
            <p class="text-gray-900">{{ appointment.reason || "-----" }}</p>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-lg p-6"
        v-if="
          appointment.patient_id && typeof appointment.patient_id === 'object'
        "
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Informacje o pacjencie
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Imię</p>
            <p class="text-gray-900">
              {{ appointment.patient_id.name || "-----" }}
            </p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Rasa</p>
            <p class="text-gray-900">
              {{ getBreedDisplayName(appointment.patient_id) || "-----" }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Objawy</h3>
        <UTextarea
          v-model="form.symptoms"
          placeholder="Opisz objawy zaobserwowane u pacjenta..."
          :rows="4"
          class="w-full"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Badanie</h3>
        <UTextarea
          v-model="form.exam"
          placeholder="Opisz przeprowadzone badania..."
          :rows="4"
          class="w-full"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Diagnoza</h3>
        <UTextarea
          v-model="form.diagnosis"
          placeholder="Wprowadź diagnozę..."
          :rows="4"
          class="w-full"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Plan leczenia</h3>
        <UTextarea
          v-model="form.treatment"
          placeholder="Opisz plan leczenia..."
          :rows="4"
          class="w-full"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Polecenia</h3>
        <UTextarea
          v-model="form.advice"
          placeholder="Wprowadź polecenia dla właściciela..."
          :rows="4"
          class="w-full"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Dodatkowe uwagi
        </h3>
        <UTextarea
          v-model="form.notes"
          placeholder="Dodatkowe uwagi i komentarze..."
          :rows="4"
          class="w-full"
        />
      </div>

      <div class="flex justify-end space-x-3 pt-6">
        <BorderButton label="Anuluj" @click="goBack" />
        <BaseButton 
          label="Zapisz zmiany" 
          @click="saveChanges" 
        />
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-500">Nie znaleziono danych wizyty</p>
    </div>

    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />
  </FullWidthLayout>
</template>

<script setup lang="ts">
import type { Appointment } from "~/types/appointments";

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const route = useRoute();
const appointmentId = route.params.id as string;

const appointment = ref<Appointment | null>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");

const form = reactive({
  symptoms: "",
  exam: "",
  diagnosis: "",
  treatment: "",
  advice: "",
  notes: "",
});

const loadAppointment = async () => {
  try {
    loading.value = true;
    error.value = "";
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      showNotify("Błąd autoryzacji", "error");
      return;
    }

    const response = await $fetch<Appointment>(
      `http://localhost:3001/appointments/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    appointment.value = response;

    if (response) {
      form.symptoms = response.symptoms || "";
      form.exam = response.exam || "";
      form.diagnosis = response.diagnosis || "";
      form.treatment = response.treatment || "";
      form.advice = response.advice || "";
      form.notes = response.notes || "";
    }
  } catch (err: any) {
    console.error("Error loading appointment:", err);
    error.value = "Błąd podczas ładowania danych wizyty";
    showNotify("Błąd podczas ładowania danych wizyty", "error");
  } finally {
    loading.value = false;
  }
};

const saveChanges = async () => {
  try {
    saving.value = true;
    error.value = "";
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      showNotify("Błąd autoryzacji", "error");
      return;
    }

    const updateData = {
      symptoms: form.symptoms,
      exam: form.exam,
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      advice: form.advice,
      notes: form.notes,
    };

    const response = await $fetch(
      `http://localhost:3001/appointments/${appointmentId}/medical`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    showNotify("Szczegóły wizyty zostały pomyślnie zapisane", "success");
    
    setTimeout(async () => {
      await navigateTo(`/appointment_details/${appointmentId}`);
    }, 1500);
    
  } catch (err: any) {
    console.error("Error saving medical details:", err);
    error.value = err.data?.message || "Błąd podczas zapisywania zmian";
    showNotify(error.value, "error");
  } finally {
    saving.value = false;
  }
};

const goBack = () => {
  navigateTo(`/appointment_details/${appointmentId}`);
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-----";
  return new Date(dateString).toLocaleDateString("pl-PL");
};

const getBreedDisplayName = (patient: any) => {
  if (!patient?.breed) return "-----";
  return patient.breed;
};

onMounted(() => {
  loadAppointment();
});
</script>
