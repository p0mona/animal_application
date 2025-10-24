<template>
  <Layout>
    <BackButton to="/patients_settings" />

    <h1 class="mb-5 text-2xl font-bold">Nowa wizyta</h1>

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
          <select
            v-model="form.patient_id"
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
            :class="{ 'border-red-500': errors.patient_id }"
          >
            <option value="">Wybierz pacjenta</option>
            <option
              v-for="patient in patients"
              :key="patient._id"
              :value="patient._id"
            >
              {{ patient.name }} - {{ patient.breed }}
            </option>
          </select>
          <p v-if="errors.patient_id" class="text-red-500 text-sm mt-1">
            {{ errors.patient_id }}
          </p>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input
            type="date"
            v-model="form.date"
            :min="minDate"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.date }"
            @change="loadExistingAppointments"
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
          <select
            v-model="form.time"
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
            :class="{ 'border-red-500': errors.time }"
          >
            <option value="">Wybierz godzinę</option>
            <option
              v-for="timeSlot in filteredTimeSlots"
              :key="timeSlot.value"
              :value="timeSlot.value"
              :disabled="timeSlot.isBooked"
              :class="{ 'text-gray-400 bg-gray-100': timeSlot.isBooked }"
            >
              {{ timeSlot.label }}
              <span v-if="timeSlot.isBooked"> (zajęte)</span>
            </option>
          </select>
          <p v-if="errors.time" class="text-red-500 text-sm mt-1">
            {{ errors.time }}
          </p>
          <p v-if="filteredTimeSlots.length === 0 && form.date" class="text-gray-500 text-sm mt-1">
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
          <BaseInput 
            label="Uwagi" 
            v-model="form.notes" 
            class="font-medium"
          />
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
            label="Zapisz wizytę"
            @click="validateAndCreateAppointment"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import type { Appointment } from '~/types/appointments';

interface Patient {
  _id: string;
  name: string;
  breed: string;
}

interface AppointmentForm {
  patient_id: string;
  date: string;
  time: string;
  reason: string;
  duration: number;
  notes: string;
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

const patients = ref<Patient[]>([]);
const existingAppointments = ref<Appointment[]>([]);
const form = ref<AppointmentForm>({
  patient_id: "",
  date: "",
  time: "",
  reason: "",
  duration: 30,
  notes: "",
});

const errors = ref<FormErrors>({});
const error = ref("");
const isLoadingAppointments = ref(false);

const minDate = new Date().toISOString().split("T")[0];

// Generate available time slots
const availableTimeSlots = computed(() => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push({ 
        label: timeString, 
        value: timeString,
        isBooked: false
      });
    }
  }
  return slots;
});

const filteredTimeSlots = computed(() => {
  if (!form.value.date) {
    return availableTimeSlots.value;
  }

  return availableTimeSlots.value.map(slot => {
    const isBooked = existingAppointments.value.some(appointment => 
      appointment.time === slot.value
    );
    return {
      ...slot,
      isBooked
    };
  });
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
      return;
    }

    const response = await $fetch<Appointment[]>(`http://localhost:3001/appointments?date=${form.value.date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    existingAppointments.value = response;
    
    // If the currently selected time is taken, reset it
    if (form.value.time && existingAppointments.value.some(app => app.time === form.value.time)) {
      form.value.time = "";
    }
  } catch (err: any) {
    console.error("Error loading existing appointments:", err);
    existingAppointments.value = [];
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
    // Additional check to ensure the selected time is not occupied
    const selectedSlot = filteredTimeSlots.value.find(slot => slot.value === form.value.time);
    if (selectedSlot?.isBooked) {
      errors.value.time = "Wybrana godzina jest już zajęta";
    }
  }

  if (!form.value.reason) {
    errors.value.reason = "Proszę podać powód wizyty";
  }

  console.log("Form validation errors:", errors.value);
  return Object.keys(errors.value).length === 0;
};

const validateAndCreateAppointment = () => {
  console.log("Form data before validation:", form.value);

  if (validateForm()) {
    createAppointment();
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
      return;
    }

    const response = await $fetch<Patient[]>("http://localhost:3001/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    patients.value = response;

    const route = useRoute();
    const patientId = route.query.patient_id as string;
    if (patientId && patients.value.some((p) => p._id === patientId)) {
      form.value.patient_id = patientId;
    }
  } catch (err: any) {
    console.error("Error loading patients:", err);
    error.value = "Błąd podczas ładowania pacjentów";
  }
};

const createAppointment = async () => {
  try {
    error.value = "";

    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Nie jesteś zalogowany";
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
    };

    console.log("Sending appointment data:", appointmentData);

    const response = await $fetch("http://localhost:3001/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    console.log("Appointment created successfully:", response);

    await navigateTo("/patients_settings");
  } catch (err: any) {
    console.error("Error creating appointment:", err);
    error.value = err.data?.message || "Błąd podczas tworzenia wizyty";

    // Show a more detailed error
    if (err.data?.details) {
      error.value += `: ${err.data.details}`;
    }
  }
};

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

onMounted(() => {
  loadPatients();
});
</script>
