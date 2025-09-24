<template>
  <FullWidthLayout>
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900">Przypomnienia</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="mt-4">
          <Calendar v-model="selectedDate" />
          <div class="p-4 space-y-4">
            <h3 class="text-lg font-semibold">Dodać przypomnienie</h3>
            <p class="text-sm">Wybrana data: {{ formatDate(selectedDate) }}</p>

            <RadioButton :items="types" v-model="form.type" />

            <div v-if="form.type" class="space-y-4 mt-4">
              <div v-if="form.type === 'vaccination'" class="space-y-3">
                <BaseInput
                  label="Nazwa szczepienia"
                  v-model="form.vaccinationName"
                />
                <BaseInput label="Adres" v-model="form.address" />
              </div>

              <div v-else-if="form.type === 'therapy'" class="space-y-3">
                <BaseInput label="Nazwa leku" v-model="form.medicineName" />
                <BaseInput label="Adres" v-model="form.address" />
              </div>

              <div v-else-if="form.type === 'visit'" class="space-y-3">
                <BaseInput label="Lekarz" v-model="form.doctor" />
                <BaseInput label="Adres" v-model="form.address" />
              </div>
            </div>

            <div class="flex justify-end space-x-2">
              <BorderButton @click="closeModal" label="Anuluj" />

              <BaseButton
                label="Zapisz"
                @click="saveEvent"
                :disabled="!canSave"
                class="disabled:bg-violet-300"
              />
            </div>
          </div>
        </div>

        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-4 flex justify-center">Zapisane przypomnienia</h3>
          <div>
            <div 
              v-for="reminder in reminders" 
              :key="reminder._id || reminder.id"
              class="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="font-semibold capitalize">
                  {{ getTypeLabel(reminder.type) }}
                </span>
                <button 
                  @click="deleteReminder(reminder._id || reminder.id)"
                  class="text-red-500 hover:text-red-700 text-sm"
                >
                  Usuń
                </button>
              </div>
              <p class="text-sm text-gray-600">Data: {{ formatDate(reminder.date) }}</p>
              <p class="text-sm" v-if="reminder.vaccinationName">Szczepienie: {{ reminder.vaccinationName }}</p>
              <p class="text-sm" v-if="reminder.medicineName">Lek: {{ reminder.medicineName }}</p>
              <p class="text-sm" v-if="reminder.doctor">Lekarz: {{ reminder.doctor }}</p>
              <p class="text-sm" v-if="reminder.address">Adres: {{ reminder.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui/runtime/components/RadioGroup.vue.js";
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import Calendar from "~/components/Calendar.vue";
import RadioButton from "~/components/RadioButton.vue";

const selectedDate = ref<any>(null);
const reminders = ref<any[]>([]);

onMounted(() => {
  isMounted.value = true;
});

onUnmounted(() => {
  isMounted.value = false;
});

const form = ref({
  type: "",
  address: "",
  vaccinationName: "",
  medicineName: "",
  doctor: "",
});

const canSave = computed(() => {
  if (!form.value.type || !selectedDate.value) return false;

  switch (form.value.type) {
    case "vaccination":
      return !!form.value.vaccinationName;
    case "therapy":
      return !!form.value.medicineName;
    case "visit":
      return !!form.value.doctor;
    default:
      return false;
  }
});

watch(selectedDate, (newDate) => {
  if (newDate && isMounted.value) {
    isOpen.value = true;
  }
});

const formatDate = (date: any) => {
  if (!date) return "---";

  if (typeof date === "string") {
    try {
      return new Date(date).toLocaleDateString("pl-PL");
    } catch {
      return "---";
    }
  }

  if (date && typeof date === "object" && "year" in date) {
    return `${date.day.toString().padStart(2, "0")}.${date.month.toString().padStart(2, "0")}.${date.year}`;
  }

  return "---";
};

const closeModal = () => {
  if (isMounted.value) {
    isOpen.value = false;
    form.value = {
      type: "",
      vaccinationName: "",
      address: "",
      doctor: "",
      medicineName: "",
    };
  }
};

const saveEvent = async () => {
  if (!canSave.value) return;
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const formattedDate = formatDateForBackend(selectedDate.value);
    if (!formattedDate) return;

    const requestData = {
      date: formattedDate,
      type: form.value.type,
      address: form.value.address,
      ...(form.value.type === "vaccination" && { vaccinationName: form.value.vaccinationName }),
      ...(form.value.type === "therapy" && { medicineName: form.value.medicineName }),
      ...(form.value.type === "visit" && { doctor: form.value.doctor }),
    };

    const response = await fetch("http://localhost:3001/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      await response.json();
      closeModal();
      loadReminders();
    }
  } catch (err) {
    console.error("Błąd podczas zapisywania:", err);
  }
};

const loadReminders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await fetch("http://localhost:3001/reminders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      reminders.value = Array.isArray(data) ? data : (data.reminders || []);
    }
  } catch (err) {
    console.error("Błąd podczas ładowania:", err);
  }
};

const deleteReminder = async (id: string) => {
  if (!confirm("Czy na pewno chcesz usunąć to przypomnienie?")) return;
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await fetch(`http://localhost:3001/reminders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) loadReminders();
  } catch (err) {
    console.error("Błąd podczas usuwania:", err);
  }
};
</script>
