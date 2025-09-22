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

            <!-- <BaseInput label="Wpisz tytuł przypomnienia" v-model="form.title"/> -->

            <div class="flex justify-end space-x-2">
              <UButton
                type="button"
                @click="closeModal"
                class="md:w-auto border border-violet-500 bg-white text-violet-500 hover:border-violet-600 active:border-violet-700 hover:text-violet-600 active:text-violet-700 hover:bg-white active:bg-white cursor-pointer"
              >
                Anuluj
              </UButton>

              <BaseButton label="Zapisz" @click="saveEvent"/>
            </div>
          </div>
        </div>

        <div class="space-y-2 mt-4 ml-4">
          <h5 class="font-semibold">Najbliższe szczepienie:</h5>
          <p>Termin: -----</p>
          <p>Adres: -----</p>
          <p>Nazwa szczepienia: -----</p>

          <h5 class="font-semibold">Najbliższa terapia przeciwpasożytnicza:</h5>
          <p>Termin: -----</p>
          <p>Lek: -----</p>

          <h5 class="font-semibold">Wizyta:</h5>
          <p>Termin: -----</p>
          <p>Adres: -----</p>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui/runtime/components/RadioGroup.vue.js";
import { ref, watch, onMounted, onUnmounted } from "vue";
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
  title: "",
  type: "",
  details: ""
});

watch(selectedDate, (newDate) => {
  if (newDate && isMounted.value) {
    isOpen.value = true;
  }
});

const formatDate = (date: any) => {
  if (!date) return '---';
  
  if (typeof date === 'string') {
    try {
      return new Date(date).toLocaleDateString('pl-PL');
    } catch {
      return '---';
    }
  }
  
  if (date && typeof date === 'object' && 'year' in date) {
    return `${date.day.toString().padStart(2, '0')}.${date.month.toString().padStart(2, '0')}.${date.year}`;
  }
  
  return '---';
};

const closeModal = () => {
  if (isMounted.value) {
    isOpen.value = false;
    form.value = { title: "", type: "", details: "" };
  }
};

const saveEvent = () => {
  console.log("Saved:", {
    date: selectedDate.value,
    ...form.value
  });
  closeModal();
};

const types = ref<RadioGroupItem[]>([
  { label: "Szczepionka", value: "vaccination" },
  { label: "Terapia przeciwpasożytnicza", value: "therapy" },
  { label: "Wizyta", value: "visit" },
]);
</script>