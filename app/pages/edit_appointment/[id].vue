<template>
  <Layout>
    <BackButton to="/patients_settings" />

    <h1 class="mb-5 text-2xl font-bold">Edytuj wizytę</h1>

    <div
      v-if="error"
      class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ error }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <!-- Patient -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Pacjent
          </label>
          <USelect
            v-model="form.patient_id"
            :items="patientItems"
            placeholder="Wybierz pacjenta"
            class="mt-1 w-full"
            :disabled="true"
          />
          <p v-if="errors.patient_id" class="text-red-500 text-sm mt-1">
            {{ errors.patient_id }}
          </p>
        </div>

        <!-- Date -->
        <div>
          <BaseInput
            label="Data"
            type="date"
            v-model="form.date"
            class="font-medium"
          />
          <p v-if="errors.date" class="text-red-500 text-sm mt-1">
            {{ errors.date }}
          </p>
        </div>

        <!-- Time -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Godzina
          </label>
          <USelect
            v-model="form.time"
            :items="timeSlotItems"
            placeholder="Wybierz godzinę"
            class="w-full h-8 mt-1"
          />
          <p v-if="errors.time" class="text-red-500 text-sm mt-1">
            {{ errors.time }}
          </p>
          <p
            v-if="filteredTimeSlots.length === 0 && form.date"
            class="text-gray-500 text-sm mt-1"
          >
            Brak dostępnych terminów w wybranym dniu
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Reason -->
        <div>
          <BaseInput
            label="Powód wizyty"
            v-model="form.reason"
            class="font-medium"
          />
          <p v-if="errors.reason" class="text-red-500 text-sm mt-1">
            {{ errors.reason }}
          </p>
        </div>

        <!-- Notes -->
        <div>
          <BaseInput label="Uwagi" v-model="form.notes" class="font-medium" />
        </div>

        <!-- Duration -->
        <div>
          <BaseInput
            label="Czas trwania (minuty)"
            v-model="form.duration"
            class="font-medium"
            type="number"
          />
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <BorderButton
            label="Anuluj"
            @click="$router.push('/patients_settings')"
          />
          <BaseButton
            label="Zapisz zmiany"
            @click="validateAndUpdateAppointment"
          />
        </div>
      </div>
    </div>

    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />
  </Layout>
</template>

<script setup lang="ts">
import type { Appointment } from "~/types/appointments";
import type { PatientData } from "~/types/patientData";
import type { SelectMenuItem } from "#ui/types";

interface AppointmentForm {
  patient_id: string;
  date: string;
  time: string;
  reason: string;
  duration: number;
  notes: string;
  status: string;
}

interface FormErrors {
  patient_id?: string;
  date?: string;
  time?: string;
  reason?: string;
}

interface TimeSlot {
  label: string;
  value: string;
  isBooked: boolean;
}

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

const patients = ref<PatientData[]>([]);
const existingAppointments = ref<Appointment[]>([]);
const form = ref<AppointmentForm>({
  patient_id: "",
  date: "",
  time: "",
  reason: "",
  duration: 30,
  notes: "",
  status: "scheduled",
});

const errors = ref<FormErrors>({});
const error = ref("");
const updating = ref(false);
const isLoadingAppointments = ref(false);

// Generate available time slots
const availableTimeSlots = computed(() => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push({
        label: timeString,
        value: timeString,
        isBooked: false,
      });
    }
  }
  return slots;
});

const filteredTimeSlots = computed(() => {
  if (!form.value.date) {
    return availableTimeSlots.value;
  }

  return availableTimeSlots.value.map((slot) => {
    const isBooked = existingAppointments.value.some(
      (appointment) =>
        appointment.time === slot.value && appointment._id !== appointmentId,
    );
    return {
      ...slot,
      isBooked,
    };
  });
});

// Patient items for USelect
const patientItems = computed<SelectMenuItem[]>(() => {
  return patients.value.map((patient) => ({
    label: `${patient.name} - ${patient.breed || patient.animal || "brak"}`,
    value: patient._id,
  }));
});

// Time slot items for USelect
const timeSlotItems = computed<SelectMenuItem[]>(() => {
  return filteredTimeSlots.value.map((slot) => ({
    label: slot.isBooked ? `${slot.label} (zajęte)` : slot.label,
    value: slot.value,
    disabled: slot.isBooked,
  }));
});

const loadExistingAppointments = async () => {
  if (!form.value.date) {
    existingAppointments.value = [];
    return;
  }

  try {
    isLoadingAppointments.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      showNotify("Błąd autoryzacji", "error");
      return;
    }

    const response = await $fetch<Appointment[]>(
      `http://localhost:3001/appointments?date=${form.value.date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    existingAppointments.value = response;

    // If the currently selected time is taken by another appointment, reset it
    if (
      form.value.time &&
      existingAppointments.value.some(
        (app) => app.time === form.value.time && app._id !== appointmentId,
      )
    ) {
      form.value.time = "";
    }
  } catch (err: any) {
    console.error("Error loading existing appointments:", err);
    existingAppointments.value = [];
    showNotify("Błąd podczas ładowania istniejących wizyt", "error");
  } finally {
    isLoadingAppointments.value = false;
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.patient_id) {
    errors.value.patient_id = "Proszę wybrać pacjenta";
  }

  if (!form.value.date) {
    errors.value.date = "Proszę wybrać datę";
  }

  if (!form.value.time) {
    errors.value.time = "Proszę wybrać godzinę";
  } else {
    // Additional check to ensure the selected time is not occupied by another appointment
    const selectedSlot = filteredTimeSlots.value.find(
      (slot) => slot.value === form.value.time,
    );
    if (selectedSlot?.isBooked) {
      errors.value.time = "Wybrana godzina jest już zajęta";
    }
  }

  if (!form.value.reason) {
    errors.value.reason = "Proszę podać powód wizyty";
  }

  return Object.keys(errors.value).length === 0;
};

const validateAndUpdateAppointment = () => {
  if (validateForm()) {
    updateAppointment();
  } else {
    const firstErrorElement = document.querySelector(".border-red-500");
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};

const loadPatients = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      showNotify("Błąd autoryzacji", "error");
      return;
    }

    const response = await $fetch<PatientData[]>(
      "http://localhost:3001/patients",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    patients.value = response;
  } catch (err: any) {
    console.error("Error loading patients:", err);
    error.value = "Błąd podczas ładowania pacjentów";
    showNotify("Błąd podczas ładowania listy pacjentów", "error");
  }
};

const loadAppointment = async () => {
  try {
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

    const patientId = typeof response.patient_id === 'string' 
      ? response.patient_id 
      : (response.patient_id as any)?._id || '';

    // Fill form with existing data
    form.value = {
      patient_id: patientId,
      date: response.date,
      time: response.time,
      reason: response.reason,
      duration: response.duration || 30,
      notes: response.notes || "",
      status: response.status || "scheduled",
    };

    // Load appointments for the selected date
    await loadExistingAppointments();
  } catch (err: any) {
    console.error("Error loading appointment:", err);
    error.value = "Błąd podczas ładowania wizyty";
    showNotify("Błąd podczas ładowania danych wizyty", "error");
  }
};

const updateAppointment = async () => {
  try {
    updating.value = true;
    error.value = "";

    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
      showNotify("Błąd autoryzacji", "error");
      return;
    }

    // Prepare data for submission
    const appointmentData = {
      patient_id: form.value.patient_id,
      date: form.value.date,
      time: form.value.time,
      reason: form.value.reason,
      duration: form.value.duration,
      notes: form.value.notes,
      status: form.value.status,
    };

    const response = await $fetch(
      `http://localhost:3001/appointments/${appointmentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      },
    );

    console.log("Appointment updated successfully:", response);

    showNotify("Wizyta została pomyślnie zaktualizowana", "success");
    setTimeout(async () => {
      await navigateTo("/patients_settings");
    }, 1500);
    
  } catch (err: any) {
    console.error("Error updating appointment:", err);
    error.value = err.data?.message || "Błąd podczas aktualizacji wizyty";

    if (err.data?.details) {
      error.value += `: ${err.data.details}`;
    }

    showNotify(error.value, "error");
  } finally {
    updating.value = false;
  }
};

// Watchers
watch(
  () => form.value.patient_id,
  () => {
    if (form.value.patient_id) errors.value.patient_id = undefined;
  },
);
watch(
  () => form.value.date,
  () => {
    if (form.value.date) {
      errors.value.date = undefined;
      loadExistingAppointments();
    }
  },
);
watch(
  () => form.value.time,
  () => {
    if (form.value.time) errors.value.time = undefined;
  },
);
watch(
  () => form.value.reason,
  () => {
    if (form.value.reason) errors.value.reason = undefined;
  },
);

onMounted(async () => {
  await loadPatients();
  await loadAppointment();
});
</script>
