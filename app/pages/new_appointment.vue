<template>
  <Layout>
    <BackButton to="/patients_settings" />

    <h1 class="mb-5 text-2xl font-bold">Nowa wizyta</h1>
    
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <!-- Пациент -->
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
          <p v-if="errors.patient_id" class="text-red-500 text-sm mt-1">{{ errors.patient_id }}</p>
        </div>
        
        <!-- Дата -->
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
          />
          <p v-if="errors.date" class="text-red-500 text-sm mt-1">{{ errors.date }}</p>
        </div>
        
        <!-- Время -->
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
              v-for="timeSlot in availableTimeSlots" 
              :key="timeSlot.value" 
              :value="timeSlot.value"
            >
              {{ timeSlot.label }}
            </option>
          </select>
          <p v-if="errors.time" class="text-red-500 text-sm mt-1">{{ errors.time }}</p>
        </div>
      </div>
      
      <div class="space-y-4">
        <!-- Причина -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Powód wizyty
          </label>
          <input 
            type="text"
            v-model="form.reason"
            placeholder="Np. Szczepienie, badanie kontrolne..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.reason }"
          />
          <p v-if="errors.reason" class="text-red-500 text-sm mt-1">{{ errors.reason }}</p>
        </div>
        
        <!-- Заметки -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Uwagi
          </label>
          <textarea 
            v-model="form.notes"
            placeholder="Dodatkowe uwagi..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
        
        <!-- Длительность -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Czas trwania (minuty)
          </label>
          <input 
            type="number"
            v-model="form.duration"
            min="10"
            max="120"
            step="10"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <BorderButton label="Anuluj" @click="$router.push('/patients_settings')" />
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

const patients = ref<Patient[]>([]);
const form = ref<AppointmentForm>({
  patient_id: "",
  date: "",
  time: "",
  reason: "",
  duration: 30,
  notes: ""
});

const errors = ref<FormErrors>({});
const error = ref("");

const minDate = new Date().toISOString().split('T')[0];

// Генерация доступных временных слотов
const availableTimeSlots = computed(() => {
  const slots: { label: string; value: string }[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({ label: timeString, value: timeString });
    }
  }
  return slots;
});

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
  }

  if (!form.value.reason) {
    errors.value.reason = "Proszę podać powód wizyty";
  }

  console.log('Form validation errors:', errors.value);
  return Object.keys(errors.value).length === 0;
};

const validateAndCreateAppointment = () => {
  console.log('Form data before validation:', form.value);
  
  if (validateForm()) {
    createAppointment();
  } else {
    // Прокрутка к первой ошибке
    const firstErrorElement = document.querySelector('.border-red-500');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    // Явно указываем тип ответа
    const response = await $fetch<Patient[]>("http://localhost:3001/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    patients.value = response;

    // Автозаполнение patient_id из query параметра
    const route = useRoute();
    const patientId = route.query.patient_id as string;
    if (patientId && patients.value.some(p => p._id === patientId)) {
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

    // Подготовка данных для отправки
    const appointmentData = {
      patient_id: form.value.patient_id,
      date: form.value.date,
      time: form.value.time,
      reason: form.value.reason,
      duration: form.value.duration,
      notes: form.value.notes
    };

    console.log('Sending appointment data:', appointmentData);

    const response = await $fetch("http://localhost:3001/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    console.log('Appointment created successfully:', response);

    // Успешное создание - редирект
    await navigateTo('/patients_settings');
    
  } catch (err: any) {
    console.error("Error creating appointment:", err);
    error.value = err.data?.message || "Błąd podczas tworzenia wizyty";
    
    // Показать более детальную ошибку
    if (err.data?.details) {
      error.value += `: ${err.data.details}`;
    }
  }
};

// Watch для очистки ошибок при изменении полей
watch(() => form.value.patient_id, () => { 
  if (form.value.patient_id) errors.value.patient_id = undefined; 
});
watch(() => form.value.date, () => { 
  if (form.value.date) errors.value.date = undefined; 
});
watch(() => form.value.time, () => { 
  if (form.value.time) errors.value.time = undefined; 
});
watch(() => form.value.reason, () => { 
  if (form.value.reason) errors.value.reason = undefined; 
});

onMounted(() => {
  loadPatients();
});
</script>
