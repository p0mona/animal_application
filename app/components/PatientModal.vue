<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
      @click="closeModal"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-200"
        >
          <h2 class="text-2xl font-bold text-gray-900">Szczegóły pacjenta</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6" v-if="patient">
          <Navigation :items="navItems" v-model="activeTab" class="mb-6" />

          <!-- Profil -->
          <div
            v-if="activeTab === 'patient'"
            class="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div class="flex justify-center lg:justify-start">
              <img
                :src="patientImage"
                :alt="patient.name"
                class="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-cover rounded-2xl transition duration-300"
                @error="handleImageError"
              />
            </div>

            <div class="space-y-6">
              <div>
                <h5 class="font-semibold text-lg mb-3">Pupil</h5>
                <div class="space-y-2">
                  <p>
                    <span class="font-medium">Imię:</span>
                    {{ patient.name || "-----" }}
                  </p>
                  <p>
                    <span class="font-medium">Rasa:</span> {{ formattedBreed }}
                  </p>
                  <p>
                    <span class="font-medium">Nr chipu:</span>
                    {{ patient.chip || "-----" }}
                  </p>
                  <p><span class="font-medium">Płeć:</span> {{ patientSex }}</p>
                  <p>
                    <span class="font-medium">Gatunek:</span>
                    {{ patient.animal || "-----" }}
                  </p>
                  <p>
                    <span class="font-medium">Wiek:</span>
                    {{ patient.animal_age || "-----" }}
                  </p>
                  <p>
                    <span class="font-medium">Wzrost:</span>
                    {{
                      patient.animal_height
                        ? `${patient.animal_height} cm`
                        : "-----"
                    }}
                  </p>
                  <p>
                    <span class="font-medium">Waga:</span>
                    {{
                      patient.animal_weight
                        ? `${patient.animal_weight} kg`
                        : "-----"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h5 class="font-semibold text-lg mb-3">Właściciel</h5>
                <div class="space-y-2">
                  <p>
                    <span class="font-medium">Imię:</span>
                    {{ patient.owner?.name || "-----" }}
                  </p>
                  <p>
                    <span class="font-medium">Data urodzenia:</span>
                    {{ patient.owner?.birthday }}
                  </p>
                  <p>
                    <span class="font-medium">Płeć:</span>
                    {{ formatOwnerSex(patient.owner?.sex) }}
                  </p>
                  <p>
                    <span class="font-medium">Kontakt:</span>
                    {{ patient.owner?.phone || "-----" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Wizyty -->
          <div v-if="activeTab === 'appointment'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Future appointment Section -->
              <div>
                <h3 class="text-base font-semibold mb-4">Zaplanowane wizyty</h3>
                <div class="space-y-4">
                  <FutureAppointmentCard
                    v-for="(appointment, index) in future"
                    :key="index"
                    :date="appointment.date"
                    :time="appointment.time"
                    :reason="appointment.reason"
                  />
                </div>
                <div class="flex justify-end">
                  <NuxtLink to="/new_appointment">
                    <BaseButton label="Zaplanuj nową wizytę" class="mt-4" />
                  </NuxtLink>
                </div>
              </div>

              <!-- History Section -->
              <div>
                <h3 class="text-base font-semibold mb-4">Historia wizyt</h3>
                <div class="space-y-4">
                  <PastAppointmentCard
                    v-for="(appointment, index) in past"
                    :key="index"
                    :date="appointment.date"
                    :time="appointment.time"
                    :reason="appointment.reason"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Vaccination Section -->
          <div
            v-if="activeTab === 'vaccination'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <VaccinationGroup
              title="Obowiązkowe szczepionki"
              :vaccines="[
                { key: 'nasal', label: 'Nosówka' },
                { key: 'parvovirus', label: 'Parwowiroza' },
                { key: 'rubarths_disease', label: 'Choroba Rubartha' },
                { key: 'rabies', label: 'Wścieklizna' },
              ]"
              :model="vac"
            />

            <VaccinationGroup
              title="Nieobowiązkowe szczepionki"
              :vaccines="[
                { key: 'kennel_cough', label: 'Kaszel kenelow' },
                { key: 'leptospirosis', label: 'Leptospiroza' },
              ]"
              :model="vac"
            />
          </div>
        </div>

        <div v-else class="p-6 text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="mt-4 text-gray-500">Ładowanie danych pacjenta...</p>
        </div>
        <div
          class="flex justify-end space-x-3 p-6 border-t border-gray-200"
          v-if="activeTab === 'patient'"
        >
          <BorderButton label="Usuń pacjenta" @click="deletePatient" />
          <BaseButton label="Edytuj pacjenta" @click="editPatient" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

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

interface Props {
  isOpen: boolean;
  patient: Patient | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "patient-deleted": [patientId: string];
}>();

const activeTab = ref("patient");
const deleting = ref(false);
const appointmentsLoading = ref(false);

const dogBreeds = ref<any[]>([]);
const catBreeds = ref<any[]>([]);
const futureAppointments = ref<Appointment[]>([]);
const pastAppointments = ref<Appointment[]>([]);

const navItems = [
  { key: "patient", label: "Pacjent", icon: "i-heroicons-user" },
  { key: "appointment", label: "Wizyty", icon: "heroicons:folder-plus" },
  {
    key: "vaccination",
    label: "Szczepionki",
    icon: "heroicons:eye-dropper-solid",
  },
];

const patientImage = computed(() => {
  if (!props.patient) return "/images/example-photo.jpg";
  if (props.patient.image) {
    return getImageUrl(props.patient.image);
  }
  if (props.patient.owner?.image) {
    return getImageUrl(props.patient.owner.image);
  }
  return "/images/example-photo.jpg";
});

const patientSex = computed(() => {
  if (!props.patient) return "-----";
  const sex = props.patient.sex;
  return sex === "K" ? "Samica" : sex === "M" ? "Samiec" : "-----";
});

const formattedBreed = computed(() => {
  if (!props.patient?.breed) return "-----";
  const catBreed = catBreeds.value.find(
    (b) => b.value === props.patient!.breed,
  );
  if (catBreed) return catBreed.label;
  const dogBreed = dogBreeds.value.find(
    (b) => b.value === props.patient!.breed,
  );
  if (dogBreed) return dogBreed.label;
  return props.patient.breed;
});

// Methods
const closeModal = () => {
  emit("update:isOpen", false);
};

const getImageUrl = (imagePath: string) => {
  if (!imagePath || imagePath === "/images/example-photo.jpg") {
    return "/images/example-photo.jpg";
  }
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  if (imagePath.startsWith("/uploads")) {
    return `http://localhost:3001${imagePath}`;
  }
  if (!imagePath.startsWith("/")) {
    return `http://localhost:3001/uploads/${imagePath}`;
  }
  return imagePath;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/images/example-photo.jpg";
};

const formatOwnerSex = (sex?: string) => {
  if (!sex) return "-----";
  return sex === "K" ? "Kobieta" : sex === "M" ? "Mężczyzna" : sex;
};

const editPatient = () => {
  if (!props.patient) return;

  closeModal();

  setTimeout(() => {
    navigateTo(`/edit_patient/${props.patient!._id}`);
  }, 100);
};

const deletePatient = async () => {
  if (!props.patient || !confirm("Czy na pewno chcesz usunąć tego pacjenta?")) {
    return;
  }

  try {
    deleting.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nie jesteś zalogowany");
      return;
    }

    await $fetch(`http://localhost:3001/patients/${props.patient._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    emit("patient-deleted", props.patient._id);
    closeModal();
  } catch (error: any) {
    console.error("Error deleting patient:", error);
    alert(error.data?.message || "Błąd podczas usuwania pacjenta");
  } finally {
    deleting.value = false;
  }
};

const loadAppointments = async () => {
  if (!props.patient) return;
  
  try {
    appointmentsLoading.value = true;
    const token = localStorage.getItem("token");
    
    const response = await $fetch<AppointmentsResponse>(
      `http://localhost:3001/appointments/patient/${props.patient._id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    futureAppointments.value = response.future || [];
    pastAppointments.value = response.past || [];
  } catch (error) {
    console.error("Error loading appointments:", error);
    futureAppointments.value = [];
    pastAppointments.value = [];
  } finally {
    appointmentsLoading.value = false;
  }
};

const vac = ref({
  nasal: true,
  parvovirus: true,
  rubarths_disease: true,
  rabies: false,
  kennel_cough: false,
  leptospirosis: true,
});

onMounted(async () => {
  try {
    const dogData = await import("~/assets/data/dog_breeds.json");
    dogBreeds.value = dogData.default || dogData;

    const catData = await import("~/assets/data/cat_breeds.json");
    catBreeds.value = catData.default || catData;
  } catch (err) {
    console.error("Error loading breed data:", err);
  }
});
</script>
