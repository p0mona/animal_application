<template>
  <div class="flex justify-center">
    <div class="max-w-2xl mx-auto space-y-3 space-x-3">
      <h1>Konto</h1>
      <h4>Pupil</h4>

      <div class="flex flex-col gap-4">
        <UFileUpload
          v-model="form.image"
          color="neutral"
          highlight
          label="Drop your image here"
          description="SVG, PNG, JPG or GIF (max. 2MB)"
          class="w-48 min-h-24"
          :dropzone="true"
        />

        <USelectMenu
          placeholder="Wybierz zwierzę"
          :items="animals"
          class="w-48"
        />

        <USelectMenu placeholder="Wybierz rasę" :items="breeds" class="w-48" />

        <UInput v-model="form.animal_name" placeholder="Wpisz imię pupila" />

        <UInput v-model="form.age" placeholder="Wpisz wiek" />
        <UInput v-model="form.height" placeholder="Wpisz wzrost" />
        <UInput v-model="form.weight" placeholder="Wpisz wagę" />
        <UInput v-model="form.chip" placeholder="Wprowadź nr czipu" />
      </div>

      <h4>Właściciel</h4>

      <UInput v-model="form.name" placeholder="Wpisz imię" />

      <URadioGroup
        v-model="form.sex"
        orientation="horizontal"
        variant="list"
        :items="sex"
      />

      <label for="birthday">Data urodzenia</label>
      <UInput id="birthday" type="date" v-model="form.birthday" />

      <div>
        <UButton type="button">Potwierdź</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

const form = reactive({
  animal_type: "",
  breed: "",
  animal_name: "",
  age: "",
  height: "",
  weight: "",
  chip: "",
  name: "",
  birthday: "",
  sex: "K",
  image: null as File | null,
});

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const animals = ref(["Pies", "Kot", "Chomik"]);
const breeds = ref(["Akita Inu", "Beagle", "Szpic"]);
</script>
