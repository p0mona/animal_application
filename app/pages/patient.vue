<template>
  <FullWidthLayout>
    <BackButton to="/vet_settings" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Pacjent</h1>
    </div>

    <Navigation :items="navItems" v-model="activeTab" />

    <!-- Profil -->
    <div
      v-if="activeTab === 'patient'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div class="grid grid-cols-2 gap-6">
        <div>
          <img
            src="/images/example-photo.jpg"
            class="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] object-cover rounded-2xl transition duration-300 mx-auto"
          />
        </div>

        <div>
          <div class="mb-4">
            <h5 class="font-semibold">Pupil</h5>
            <p>Imię: -----</p>
            <p>Rasa: -----</p>
            <p>Nr chipu: -----</p>
            <p>Płeć: -----</p>
          </div>

          <div>
            <h5 class="font-semibold">Właściciel</h5>
            <p>Imię: -----</p>
            <p>Kontakt: -----</p>
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
              <BaseButton label="Zaplanuj nową wizytę"/>
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
      <!-- Obowiązkowe szczepionki -->
      <div class="bg-white p-4 space-y-2">
        <h3 class="text-base font-semibold mb-2">Obowiązkowe szczepionki</h3>
        <UCheckbox
          v-model="vac.nasal"
          class="[&_[data-state=checked]]:bg-violet-500"
          label="Nosówka"
        />
        <UCheckbox
          v-model="vac.parvovirus"
          class="[&_[data-state=checked]]:bg-violet-500"
          label="Parwowiroza"
        />
        <UCheckbox
          v-model="vac.rubarths_disease"
          class="[&_[data-state=checked]]:bg-violet-500"
          label="Choroba Rubartha"
        />
        <UCheckbox
          v-model="vac.rabies"
          class="[&_[data-state=checked]]:bg-violet-500"
          label="Wścieklizna"
        />
      </div>

      <!-- Niobowiązkowe szczepionki -->
      <div class="bg-white p-4 space-y-2">
        <h3 class="text-base font-semibold mb-2">Nieobowiązkowe szczepionki</h3>
        <UCheckbox
          v-model="vac.kennel_cough"
          class="[&_[data-state=checked]]:bg-violet-500"
          label="Kaszel kenelow"
        />
        <UCheckbox
          v-model="vac.leptospirosis"
          class="[&_[data-state=checked]]:bg-violet-500"
          label="Leptospiroza"
        />
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FutureAppointmentCard from "~/components/FutureAppointmentCard.vue";

const activeTab = ref("patient");

const navItems = [
  { key: "patient", label: "Pacjent", icon: "i-heroicons-user" },
  { key: "appointment", label: "Wizyty", icon: "heroicons:folder-plus" },
  {
    key: "vaccination",
    label: "Szczepionki",
    icon: "heroicons:eye-dropper-solid",
  },
];

const future = [
  {
    date: "14.12.2025",
    time: "17:00",
    reason: "Szczepionka na wściekliznę",
  },
];

const past = [
  {
    date: "10.11.2024",
    time: "10:00",
    reason: "Odrobaczenie",
  },
  {
    date: "01.08.2025",
    time: "12:00",
    reason: "Szczepionka na wściekliznę",
  },
  {
    date: "27.08.2025",
    time: "09:00",
    reason: "Check Up",
  },
];

const vac = ref({
  nasal: true,
  parvovirus: true,
  rubarths_disease: true,
  rabies: false,
  kennel_cough: false,
  leptospirosis: true,
});
</script>
