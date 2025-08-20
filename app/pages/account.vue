<template>
  <div class="flex justify-center">
    <div class="max-w-2xl mx-auto space-y-3 space-x-3">
      <h1>Konto</h1>
      <h4>Pupil</h4>

      <div class="flex flex-col gap-2">
        <UFileUpload
          v-model="form.image"
          color="neutral"
          highlight
          label="Drop your image here"
          description="SVG, PNG, JPG or GIF (max. 2MB)"
          class="w-48 min-h-24"
          :dropzone="true"
        />
        <p class="text-sm">Wybierz zwierzę</p>
        <USelectMenu
          placeholder="-"
          :items="animals"
          class="w-full"
        />
        
        <p class="text-sm">Wybierz rasę</p>
        <USelectMenu placeholder="-" :items="breeds" class="w-full" />

        <p class="text-sm">Wpisz imię pupila</p>
        <UInput v-model="form.animal_name"/>

        <p class="text-sm">Wpisz wiek</p>
        <UInput v-model="form.age"/>

        <p class="text-sm">Wpisz wzrost</p>
        <UInput v-model="form.height"/>

        <p class="text-sm">Wpisz wagę</p>
        <UInput v-model="form.weight"/>

        <p class="text-sm">Wprowadź nr czipu</p>
        <UInput v-model="form.chip"/>
      </div>

      <h4>Właściciel</h4>

      <div class="w-full">
        <p class="text-sm mb-2">Wpisz imię</p>
        <UInput v-model="form.name"/>
      </div>

      <p class="text-sm">Płeć</p>
      <URadioGroup
        v-model="form.sex"
        orientation="horizontal"
        variant="list"
        :items="sex"
      />

      <label for="birthday" class="text-sm">Data urodzenia</label>
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
