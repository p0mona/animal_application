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
                <BaseInput label="Nazwa szczepienia" v-model="form.vaccinationName" />
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

        <div class="space-y-2 mt-4 ml-4">
          <h5 class="font-semibold">Najbliższe szczepienie:</h5>
          <p>Termin: -----</p>
          <p>Nazwa szczepienia: -----</p>
          <p>Adres: -----</p>
          <h5 class="font-semibold">Najbliższa terapia przeciwpasożytnicza:</h5>
          <p>Termin: -----</p>
          <p>Nazwa leku: -----</p>
          <p>Adres: -----</p>
          <h5 class="font-semibold">Wizyta:</h5>
          <p>Termin: -----</p>
          <p>Lekarz: -----</p>
          <p>Adres: -----</p>
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
const isOpen = ref(false);
const isMounted = ref(false);

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
    case 'vaccination':
      return !!(form.value.vaccinationName);
    case 'therapy':
      return !!(form.value.medicineName);
    case 'visit':
      return !!(form.value.doctor);
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

const saveEvent = () => {
  console.log("Saved:", {
    date: selectedDate.value,
    ...form.value,
  });
  closeModal();
};

const types = ref<RadioGroupItem[]>([
  { label: "Szczepionka", value: "vaccination" },
  { label: "Pasożyty", value: "therapy" },
  { label: "Wizyta", value: "visit" },
]);
</script>