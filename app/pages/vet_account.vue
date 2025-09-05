<template>
  <FullWidthLayout>
    <h1 class="text-2xl font-bold text-gray-900">Konto</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div class="flex flex-col space-y-4 mt-4">
          <BaseInput label="Wpisz imię" v-model="form.name" />
          <BaseInput label="Wpisz miejsce pracy" v-model="form.hospital" />

          <div class="w-full">
            <p class="text-sm">Płeć</p>
            <RadioButton v-model="form.sex" :items="sex"/>
          </div>

          <BaseInput
            label="Data urodzenia"
            id="birthday"
            type="date"
            v-model="form.birthday"
          />
        </div>
      </div>
      <div>
        <FileUpload v-model="form.image" />
        <div>
          <div class="flex justify-end">
            <BaseButton label="Potwierdź" class="mt-4"/>
          </div>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

const form = reactive({
  name: "",
  birthday: "",
  sex: "K",
  hospital: "",
  image: null as File | null,
});

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);
</script>
