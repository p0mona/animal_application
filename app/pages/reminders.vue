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
import Calendar from "~/components/Calendar.vue";
import RadioButton from "~/components/RadioButton.vue";

const selectedDate = ref<any>(null);
const form = ref({
  title: "",
  type: "",
  details: ""
});
const types = ref<RadioGroupItem[]>([
  { label: "Szczepionka", value: "vaccination" },
  { label: "Terapia przeciwpasożytnicza", value: "therapy" },
  { label: "Wizyta", value: "visit" },
]);
</script>
